import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from '@/components/Base/Button';
import LoadingIcon from '@/components/Base/LoadingIcon';
import { setGlobalUnsavedData } from '@/hooks/useNavigationBlocker';

function FileoperationAddProducts({ onSuccess, onError, onRefresh, onDataChange }) {
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
    console.log('Products: Setting unsaved data to true');
    setGlobalUnsavedData(true);
    if (onDataChange) {
      onDataChange(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation_type', 'products');

      const response = await axios.post(
        `${app_url}/api/fileoperation/validate-products`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setUploadedFile(file);
        setImportData(response.data.data);
        setValidationResult(response.data.validation);
        setShowPreview(true);
      } else {
        setError(response.data.message || 'Validation failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = 'Failed to upload file. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Final error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle import processing
  const handleProcessImport = async (removeDuplicates = false) => {
    if (!validationResult) return;

    setLoading(true);
    try {
      const response = await axios.post(`${app_url}/api/fileoperation/import-products`, {
        valid_rows: validationResult.valid_rows,
        file_name: uploadedFile?.name || 'products_import.xlsx'
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
    
    // Remove ALL invalid rows and duplicates, keep only valid rows
    const updatedValidation = {
      ...validationResult,
      invalid_rows: [],
      duplicates: [],
      summary: {
        valid_count: validationResult.valid_rows.length,
        invalid_count: 0,
        duplicate_count: 0
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

  // Handle export invalid rows
  const handleExportInvalidRows = () => {
    if (!validationResult || !validationResult.invalid_rows.length) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + validationResult.invalid_rows.map(row => row.data.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invalid_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: loading
  });

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

    const { valid_rows, invalid_rows, duplicates } = validationResult;
    const allRows = [...valid_rows, ...invalid_rows, ...duplicates];

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
    const paginatedRows = filteredRows.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="mt-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-700 font-semibold">{t("Valid Rows")}</div>
            <div className="text-2xl font-bold text-green-600">{valid_rows.length}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-700 font-semibold">{t("Invalid Rows")}</div>
            <div className="text-2xl font-bold text-yellow-600">{invalid_rows.length}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-red-700 font-semibold">{t("Duplicates")}</div>
            <div className="text-2xl font-bold text-red-600">{duplicates.length}</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder={t("Search in data...")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {importData.headers.map((header, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRows.map((row, index) => {
                  const hasRowErrors = invalid_rows.some(invalidRow => invalidRow.row === row.row) || 
                                     duplicates.some(duplicateRow => duplicateRow.row === row.row);
                  
                  return (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${hasRowErrors ? 'bg-red-50' : ''}`}>
                      {/* Dynamic columns based on Excel headers */}
                      {importData.headers.map((header, colIndex) => (
                        <td key={colIndex} className="px-4 py-3 border-r border-gray-100">
                          <span className={hasRowErrors && row.data[colIndex] ? 'text-red-600 font-medium' : ''}>
                            {row.data[colIndex] || ''}
                          </span>
                        </td>
                      ))}
                      
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

        {/* Action Buttons */}
        {(invalid_rows.length > 0 || duplicates.length > 0) && (
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="text-sm text-red-600 mb-2 w-full">
              * {t("The data in")} {invalid_rows.length + duplicates.length} {t("lines does not match the system data. Please edit or delete these lines.")}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleExportInvalidRows}
                disabled={loading}
                className="whitespace-nowrap"
              >
                {t("Export xls/xlsx")}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRemoveMismatchedRows}
                disabled={loading}
                className="whitespace-nowrap"
              >
                {t("Remove mismatched rows")} <br />
                {t("and complete data import")}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        )}

        {/* Import Button */}
        {valid_rows.length > 0 && (
          <div className="mt-6">
            <Button
              variant="primary"
              onClick={() => handleProcessImport()}
              disabled={loading}
              className="w-full"
            >
              {loading && <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />}
              {t("Import")} {valid_rows.length} {t("Products")}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-1">{t("Add New Products")}</h3>
          <p className="text-sm text-gray-600 mb-4">{t("Import product data")}</p>
          
          {/* Required Columns */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">{t("Required Columns")}</div>
            <div className="flex gap-4 mb-2">
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Supplier")}</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Brand")}</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Description")}</a>
              <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">{t("Unit Type")}</a>
            </div>
            <div className="text-sm text-blue-600">
              <strong>{t("Validation")}:</strong> {t("Supplier vs. Suppliers; Description vs. Product Names; Unit Type vs. Unit Types")}
            </div>
          </div>
        </div>

        {!showPreview ? (
          /* File Upload Area */
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center bg-gray-50">
            <div
              {...getRootProps()}
              className={`cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? t("Drop the file here") : t("Drop Excel file here or click to browse")}
              </p>
              <p className="text-sm text-gray-500">
                {t("Supports .xlsx and .xls files up to 10MB")}
              </p>
            </div>

            {loading && (
              <div className="mt-4 flex items-center justify-center">
                <LoadingIcon icon="oval" className="w-6 h-6 mr-2" />
                <span>{t("Processing file...")}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
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

export default FileoperationAddProducts;
