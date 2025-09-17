import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Button from "@/components/Base/Button";
import LoadingIcon from "@/components/Base/LoadingIcon";
import { setGlobalUnsavedData } from "@/hooks/useNavigationBlocker";

function FileoperationAddCrossCars({ onSuccess, onError, onRefresh, onDataChange }) {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const token = useSelector((state) => state.auth.token);
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // File upload handling
  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError('');
    
    // Set global unsaved data flag
    console.log('Cross Cars: Setting unsaved data to true');
    setGlobalUnsavedData(true);
    if (onDataChange) {
      onDataChange(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation_type', 'cross_cars');

      const response = await axios.post(
        `${app_url}/api/fileoperation/validate-cross-cars`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setImportData(response.data.data);
        setValidationResult(response.data.validation);
        setShowPreview(true);
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDuplicates = () => {
    if (!validationResult) return;
    
    // Remove duplicates from validation result
    const updatedValidation = {
      ...validationResult,
      duplicates: [],
      summary: {
        ...validationResult.summary,
        duplicate_count: 0
      }
    };
    setValidationResult(updatedValidation);
  };

  const handleRemoveMismatchedRows = () => {
    if (!validationResult) return;
    
    // Remove invalid rows from validation result
    const updatedValidation = {
      ...validationResult,
      invalid_rows: [],
      summary: {
        ...validationResult.summary,
        invalid_count: 0
      }
    };
    setValidationResult(updatedValidation);
  };

  const handleDeleteRow = (rowIndex) => {
    if (!validationResult) return;
    
    // Remove specific row from all arrays
    const updatedValidation = {
      ...validationResult,
      valid_rows: validationResult.valid_rows.filter(row => row.row !== rowIndex),
      invalid_rows: validationResult.invalid_rows.filter(row => row.row !== rowIndex),
      duplicates: validationResult.duplicates.filter(row => row.row !== rowIndex)
    };
    
    // Update summary
    updatedValidation.summary = {
      valid_count: updatedValidation.valid_rows.length,
      invalid_count: updatedValidation.invalid_rows.length,
      duplicate_count: updatedValidation.duplicates.length
    };
    
    setValidationResult(updatedValidation);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  // Handle import processing
  const handleProcessImport = async (removeDuplicates = false) => {
    if (!validationResult) return;

    setLoading(true);
    try {
      const response = await axios.post(`${app_url}/api/fileoperation/import-cross-cars`, {
        valid_rows: validationResult.valid_rows,
        file_name: uploadedFile?.name || 'cross_cars_import.xlsx'
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (onSuccess) {
        onSuccess(response.data.message || `Import completed successfully. ${response.data.data?.imported_count || 0} records imported.`);
      }
      
      // Trigger refresh of Added Files section
      if (onRefresh) {
        onRefresh();
      }
      
      // Clear global unsaved data flag
      setGlobalUnsavedData(false);
      if (onDataChange) onDataChange(false);
      
      // Reset form
      setShowPreview(false);
      setImportData(null);
      setValidationResult(null);
      setUploadedFile(null);
    } catch (error) {
      console.error('Import error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'Import failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle export invalid rows
  const handleExportInvalidRows = () => {
    if (!validationResult || !validationResult.invalid_rows.length) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + validationResult.invalid_rows.map(row => row.data.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invalid_cross_cars.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle upload new file when no valid rows
  const handleUploadNewFile = () => {
    const confirmed = window.confirm("There are no matching rows in the current file. Do you want to upload another file?");
    if (confirmed) {
      // Reset all states to allow new file upload
      setShowPreview(false);
      setImportData(null);
      setValidationResult(null);
      setUploadedFile(null);
      setCurrentPage(1);
      setSearchTerm('');
      
      // Clear global unsaved data flag
      setGlobalUnsavedData(false);
      if (onDataChange) onDataChange(false);
    }
  };

  // Render data grid for preview
  const renderDataGrid = () => {
    if (!importData || !validationResult) return null;

    // Handle case when all rows are deleted
    if (validationResult.valid_rows.length === 0 && validationResult.invalid_rows.length === 0 && validationResult.duplicates.length === 0) {
      return (
        <div className="mt-6 text-center py-8">
          <div className="text-gray-500 mb-4">
            {t("All rows have been removed. No data to display.")}
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleUploadNewFile}
            disabled={loading}
          >
            {t("Upload New File")}
          </Button>
        </div>
      );
    }

    const { valid_rows = [], invalid_rows = [], duplicates = [], summary = {} } = validationResult;
    const allRows = [...valid_rows, ...invalid_rows, ...duplicates];
    const hasErrors = invalid_rows.length > 0 || duplicates.length > 0;
    const hasDuplicates = duplicates.length > 0;
    const hasNoValidRows = valid_rows.length === 0 && allRows.length > 0;

    // Filter rows based on search term
    const filteredRows = allRows.filter(row => {
      if (!searchTerm) return true;
      return row.data.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRows = filteredRows.slice(startIndex, endIndex);

    return (
      <div className="mt-6">
        {/* Dashboard with counts */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-700 font-semibold text-sm mb-1">Valid Rows</div>
            <div className="text-2xl font-bold text-green-600">{valid_rows.length}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700 font-semibold text-sm mb-1">Invalid Rows</div>
            <div className="text-2xl font-bold text-red-600">{invalid_rows.length}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-700 font-semibold text-sm mb-1">Duplicate Rows</div>
            <div className="text-2xl font-bold text-yellow-600">{duplicates.length}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-700 font-semibold text-sm mb-1">Total Rows</div>
            <div className="text-2xl font-bold text-blue-600">{allRows.length}</div>
          </div>
        </div>

        {/* Header with search and actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search in data..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRows.length)} of {filteredRows.length} entries
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleUploadNewFile}
              disabled={loading}
            >
              Upload New File
            </Button>
            
            {duplicates.length > 0 && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleRemoveDuplicates}
                disabled={loading}
              >
                Remove duplicate lines
              </Button>
            )}
            
            {invalid_rows.length > 0 && (
              <>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleRemoveMismatchedRows}
                  disabled={loading}
                >
                  Remove mismatched rows
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleExportInvalidRows}
                  disabled={loading}
                >
                  Export invalid rows
                </Button>
              </>
            )}
            
            {valid_rows.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleProcessImport(false)}
                disabled={loading || valid_rows.length === 0}
              >
                {loading ? 'Importing...' : 'Import xls/xlsx'}
              </Button>
            )}
          </div>
        </div>

        {/* Column headers with dropdowns */}
        <div className="flex items-center gap-0 mb-4 bg-gray-50 border border-gray-200 rounded-t-lg">
          <div className="relative flex-none w-32 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">{t("Brand")}</option>
            </select>
          </div>
          
          <div className="relative flex-none w-32 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">{t("Code")}</option>
            </select>
          </div>
          
          <div className="relative flex-1 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">{t("Car model")}</option>
            </select>
          </div>
          
          <div className="flex-none w-32 px-4 py-3 text-center">
            <span className="text-sm font-medium text-gray-700">{t("Actions")}</span>
          </div>
        </div>

        {/* Data table */}
        <div className="border border-gray-200 border-t-0 rounded-b-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {currentRows.map((row, index) => {
                  const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
                  const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
                  const hasRowErrors = isInvalid || isDuplicate;
                  
                  return (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${hasRowErrors ? 'bg-red-50' : ''}`}>
                      {/* Brand column */}
                      <td className="px-4 py-3 w-32 border-r border-gray-100">
                        <span className={hasRowErrors && row.data[0] ? 'text-red-600 font-medium' : ''}>
                          {row.data[0] || ''}
                        </span>
                      </td>
                      
                      {/* Code column */}
                      <td className="px-4 py-3 w-32 border-r border-gray-100">
                        <span className={hasRowErrors && row.data[1] ? 'text-red-600 font-medium' : ''}>
                          {row.data[1] || ''}
                        </span>
                      </td>
                      
                      {/* Car model column */}
                      <td className="px-4 py-3 flex-1 border-r border-gray-100">
                        <span className={hasRowErrors && row.data[2] ? 'text-red-600 font-medium' : ''}>
                          {row.data[2] || ''}
                        </span>
                      </td>
                      
                      {/* Actions column */}
                      <td className="px-4 py-3 w-32">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded" title={t("View")}>
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded" title={t("Edit")}>
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title={t("Delete")}
                            onClick={() => handleDeleteRow(row.row)}
                          >
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button 
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              {t("Previous")}
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              {t("Next")}
            </button>
          </div>
        )}

        {/* Error message and action buttons */}
        {hasErrors && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-red-600 text-sm">
              * The data in {invalid_rows.length + duplicates.length} lines does not match the system data. Please edit or delete these lines.
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportInvalidRows}
              >
                Export xls/xlsx
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRemoveMismatchedRows}
                disabled={loading}
                className="whitespace-nowrap"
              >
                Remove mismatched rows <br />
                and complete data import
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-1">{t("Add Cross Cars")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("Import cross car compatibility data")}</p>
          
          {/* Required Columns */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">{t("Required Columns")}</div>
            <div className="flex gap-4 mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Brand")}</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Code")}</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Car model")}</a>
            </div>
            <div className="text-sm text-blue-600">
              <strong>{t("Validation")}:</strong> {t("Brand/Code vs. Products; Car Model vs. Car Models")}
            </div>
          </div>
        </div>

        {!showPreview ? (
          /* File Upload Area */
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50">
            <div
              {...getRootProps()}
              className={`cursor-pointer transition-colors ${
                isDragActive ? "bg-blue-50" : ""
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-base font-medium text-gray-700 mb-1">
                  {isDragActive ? t("Drop the file here") : t("Drop Excel file here or click to browse")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("Supports .xlsx and .xls files up to 10MB")}
                </p>
              </div>
            </div>

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <LoadingIcon icon="oval" className="w-5 h-5 mr-2" />
                <span className="text-gray-600 text-sm">{t("Processing file...")}</span>
              </div>
            )}
          </div>
        ) : (
          /* Preview and Validation Results */
          renderDataGrid()
        )}
      </div>
    </div>
  );
}

export default FileoperationAddCrossCars;
