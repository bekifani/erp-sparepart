import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Button from "@/components/Base/Button";
import LoadingIcon from "@/components/Base/LoadingIcon";
import * as XLSX from 'xlsx';
import { setGlobalUnsavedData } from "@/hooks/useNavigationBlocker";

function FileoperationAddCrossCode({ onSuccess, onError, onRefresh, onDataChange }) {
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

  // Download Excel Template
  const handleDownloadTemplate = () => {
    // Create Excel template with required columns
    const templateData = [
      ['Brand', 'Code', 'Cross Brand', 'Cross Code', 'Hide'],
      ['NISSAN', 'ABC123', 'TOYOTA', 'DEF456', 'No'],
      ['TOYOTA', 'XYZ789', 'HONDA', 'GHI012', 'Yes']
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { width: 15 }, // Brand
      { width: 15 }, // Code
      { width: 20 }, // Cross Brand
      { width: 20 }, // Cross Code
      { width: 10 }  // Hide
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Cross Code Template');
    
    // Download the file
    XLSX.writeFile(wb, 'cross_code_template.xlsx');
  };

  // File upload handling with strict template validation
  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError('');
    
    try {
      // Read and validate Excel file structure first
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        setError('The uploaded file is empty. Please use the template and upload a valid file.');
        return;
      }
      
      // Get headers and normalize them for comparison
      const headers = jsonData[0] || [];
      const normalizedHeaders = headers.map(h => String(h).toLowerCase().trim().replace(/\s+/g, ' '));
      
      // Define expected headers with variations (case insensitive)
      const expectedHeaders = [
        { variations: ['brand'], display: 'Brand' },
        { variations: ['code'], display: 'Code' },
        { variations: ['cross brand', 'crossbrand', 'cross_brand'], display: 'Cross Brand' },
        { variations: ['cross code', 'crosscode', 'cross_code'], display: 'Cross Code' },
        { variations: ['hide'], display: 'Hide' }
      ];
      
      // Check if all required columns are present
      const missingColumns = [];
      const foundColumns = [];
      
      expectedHeaders.forEach(expected => {
        const found = expected.variations.some(variation => 
          normalizedHeaders.includes(variation)
        );
        if (found) {
          foundColumns.push(expected.display);
        } else {
          missingColumns.push(expected.display);
        }
      });
      
      if (missingColumns.length > 0) {
        setError(`Invalid template format. Missing columns: ${missingColumns.join(', ')}. Please use the template and upload a valid file with the correct column structure.`);
        return;
      }
      
      console.log('Template validation passed. Found columns:', foundColumns);
    } catch (templateError) {
      console.error('Template validation error:', templateError);
      setError('Invalid file format. Please use the template and upload a valid Excel file.');
      return;
    }
    
    // Set global unsaved data flag
    console.log('Cross Code: Setting unsaved data to true');
    setGlobalUnsavedData(true);
    if (onDataChange) {
      onDataChange(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation_type', 'cross_code');

      const response = await axios.post(
        `${app_url}/api/fileoperation/validate-cross-code`,
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

  const handleExportInvalidRows = () => {
    if (!validationResult || !validationResult.invalid_rows.length) return;

    const csvContent = "data:text/csv;charset=utf-8," 
      + validationResult.invalid_rows.map(row => row.data.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "invalid_cross_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (!validationResult || !validationResult.valid_rows.length) {
      setError('No valid rows to import');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${app_url}/api/fileoperation/import-cross-code`,
        {
          valid_rows: validationResult.valid_rows,
          file_name: importData?.file_name || 'cross_code_import.xlsx'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Clear unsaved data flag
        console.log('Cross Code: Setting unsaved data to false after successful import');
        setGlobalUnsavedData(false);
        if (onDataChange) {
          onDataChange(false);
        }

        // Reset state
        setUploadedFile(null);
        setImportData(null);
        setValidationResult(null);
        setShowPreview(false);
        
        if (onSuccess) {
          onSuccess(`Successfully imported ${response.data.imported} cross code records`);
        }
        if (onRefresh) {
          onRefresh();
        }
      } else {
        setError(response.data.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      setError('Failed to import data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNewFile = () => {
    // Clear unsaved data flag when uploading new file
    console.log('Cross Code: Setting unsaved data to false when uploading new file');
    setGlobalUnsavedData(false);
    if (onDataChange) {
      onDataChange(false);
    }

    setUploadedFile(null);
    setImportData(null);
    setValidationResult(null);
    setShowPreview(false);
    setError('');
  };

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  // Filter and paginate data
  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      Object.values(item.data).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Render data grid for preview (matching AddCrossCars structure)
  const renderDataGrid = () => {
    if (!importData || !validationResult) return null;

    // Handle case when all rows are deleted
    if (validationResult.valid_rows.length === 0 && validationResult.invalid_rows.length === 0 && validationResult.duplicates.length === 0) {
      return (
        <div className="mt-6 text-center py-8">
          <div className="text-gray-500 mb-4">
            All rows have been removed. No data to display.
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleUploadNewFile}
            disabled={loading}
          >
            Upload New File
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-700 font-semibold text-sm mb-1">Invalid Rows</div>
            <div className="text-2xl font-bold text-yellow-600">{invalid_rows.length}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700 font-semibold text-sm mb-1">Duplicates</div>
            <div className="text-2xl font-bold text-red-600">{duplicates.length}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-700 font-semibold text-sm mb-1">Total Rows</div>
            <div className="text-2xl font-bold text-blue-600">{allRows.length}</div>
          </div>
        </div>

        {/* Header with search and actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="form-control w-64 pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredRows.length)} of {filteredRows.length} rows
            </span>
          </div>
          
          <div className="flex gap-2">
            {hasNoValidRows ? (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleUploadNewFile}
                disabled={loading}
              >
                Upload New File
              </Button>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleUploadNewFile}
                  disabled={loading}
                >
                  Upload New File
                </Button>
                {hasDuplicates && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleRemoveDuplicates}
                    disabled={loading}
                  >
                    Remove duplicate lines
                  </Button>
                )}
                {hasErrors && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveMismatchedRows}
                    disabled={loading}
                  >
                    Remove mismatched rows
                  </Button>
                )}
                {invalid_rows.length > 0 && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={handleExportInvalidRows}
                    disabled={loading}
                  >
                    Export invalid rows
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleImport}
                  disabled={loading || valid_rows.length === 0}
                >
                  {loading ? 'Importing...' : 'Import xls/xlsx'}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-0 mb-4 bg-gray-50 border border-gray-200 rounded-t-lg">
          <div className="relative w-32 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">Brand</option>
            </select>
          </div>
          
          <div className="relative w-32 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">Code</option>
            </select>
          </div>
          
          <div className="relative w-40 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">Cross Brand</option>
            </select>
          </div>
          
          <div className="relative flex-1 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">Cross Code</option>
            </select>
          </div>
          
          <div className="relative w-24 px-4 py-3 border-r border-gray-200">
            <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
              <option value="">Hide</option>
            </select>
          </div>
          
          <div className="w-32 px-4 py-3 text-center">
            <span className="text-sm font-medium text-gray-700">Actions</span>
          </div>
        </div>

        {/* Data table */}
        <div className="border border-gray-200 border-t-0 rounded-b-lg">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <tbody>
                {currentRows.map((row, index) => {
                  const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
                  const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
                  const hasRowErrors = isInvalid || isDuplicate;
                  
                  return (
                    <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${hasRowErrors ? 'bg-red-50' : ''}`}>
                      {/* Brand column */}
                      <td className="px-4 py-3 w-32 border-r border-gray-100">
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[0] || ''}
                        </span>
                      </td>
                      
                      {/* Code column */}
                      <td className="px-4 py-3 w-32 border-r border-gray-100">
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[1] || ''}
                        </span>
                      </td>
                      
                      {/* Cross Brand column */}
                      <td className="px-4 py-3 w-40 border-r border-gray-100">
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[2] || ''}
                        </span>
                      </td>
                      
                      {/* Cross Code column */}
                      <td className="px-4 py-3 border-r border-gray-100" style={{width: 'calc(100% - 32rem)'}}>
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[3] || ''}
                        </span>
                      </td>
                      
                      {/* Hide column */}
                      <td className="px-4 py-3 w-24 border-r border-gray-100">
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[4] || ''}
                        </span>
                      </td>
                      
                      {/* Actions column */}
                      <td className="px-4 py-3 w-32">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded" title="View">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="Delete"
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
              Previous
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
              Next
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

  if (!showPreview) {
    return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Import Cross Code Data</h2>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Excel Template
            </Button>
          </div>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                </svg>
              </div>
              <div>
                <p className="text-lg text-gray-600">
                  {isDragActive ? 'Drop the Excel file here' : 'Drag & drop an Excel file here, or click to select'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports .xlsx, .xls, and .csv files (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <LoadingIcon icon="oval" className="w-6 h-6 mr-2" />
              <span className="text-gray-600">Processing file...</span>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Template Requirements:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>⚠️ Important:</strong> Use the "Download Excel Template" button above to get the correct format</p>
            <p><strong>Brand:</strong> Must match existing brand in Products table</p>
            <p><strong>Code:</strong> Must match existing product code in Products table</p>
            <p><strong>Cross Brand:</strong> Name of competitor/alternate brand</p>
            <p><strong>Cross Code:</strong> Competitor's product code (will be normalized)</p>
            <p><strong>Hide:</strong> Yes/No - Controls visibility on website</p>
            <p className="text-red-600 font-medium">📋 Column names are case-insensitive and support variations (e.g., "Cross Code", "CrossCode", "cross_code")</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}


      {/* Data Grid */}
      {renderDataGrid()}
    </div>
  );
}

export default FileoperationAddCrossCode;
