import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from '@/components/Base/Button';
import LoadingIcon from '@/components/Base/LoadingIcon';

const FileoperationAddSpecifications = ({ 
  onSuccess, 
  onError, 
  onRefresh, 
  onDataChange,
  setGlobalUnsavedData 
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { token } = useSelector((state) => state.auth);
  const app_url = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleFileUpload = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation_type', 'specifications');

      const response = await axios.post(
        `${app_url}/api/fileoperation/validate-specifications`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setImportData({
          file_name: file.name,
          headers: response.data.data.headers,
          specification_columns: response.data.data.specification_columns,
          total_rows: response.data.data.summary.total_rows
        });
        setValidationResult(response.data.data);
        setShowPreview(true);
        
        // Set global unsaved data flag
        console.log('Specifications: Setting unsaved data to true after file upload');
        setGlobalUnsavedData(true);
        if (onDataChange) {
          onDataChange(true);
        }
      } else {
        setError(response.data.message || 'Validation failed');
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
    link.setAttribute("download", "invalid_specifications.csv");
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
        `${app_url}/api/fileoperation/import-specifications`,
        {
          valid_rows: validationResult.valid_rows,
          file_name: importData?.file_name || 'specifications_import.xlsx'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Clear unsaved data flag
        console.log('Specifications: Setting unsaved data to false after successful import');
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
          const message = `Successfully imported ${response.data.imported} specification records`;
          if (response.data.created_headnames && response.data.created_headnames.length > 0) {
            message += `. Created new headnames: ${response.data.created_headnames.join(', ')}`;
          }
          onSuccess(message);
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
    setUploadedFile(null);
    setImportData(null);
    setValidationResult(null);
    setShowPreview(false);
    setError('');
    setCurrentPage(1);
    setSearchTerm('');
    
    // Clear global unsaved data flag
    console.log('Specifications: Setting unsaved data to false after upload new file');
    setGlobalUnsavedData(false);
    if (onDataChange) {
      onDataChange(false);
    }
  };

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
  const getFilteredData = () => {
    if (!validationResult) return [];
    
    const allRows = [
      ...validationResult.valid_rows,
      ...validationResult.invalid_rows,
      ...validationResult.duplicates
    ];

    if (!searchTerm) return allRows;

    return allRows.filter(row => 
      row.data.some(cell => 
        cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const renderDataGrid = () => {
    if (!importData || !validationResult) return null;

    const { valid_rows, invalid_rows, duplicates } = validationResult;
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const currentRows = filteredData.slice(startIndex, startIndex + rowsPerPage);
    const hasErrors = invalid_rows.length > 0 || duplicates.length > 0;

    return (
      <div className="mt-6">
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
            <div className="text-2xl font-bold text-blue-600">{importData.total_rows}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search in data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} entries
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
                onClick={handleImport}
                disabled={loading || valid_rows.length === 0}
              >
                {loading ? 'Importing...' : 'Import xls/xlsx'}
              </Button>
            )}
          </div>
        </div>

        {/* Column headers with dropdowns */}
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-t-lg overflow-x-auto">
          <div className="flex items-center gap-0 min-w-max">
            <div className="relative flex-none w-32 px-4 py-3 border-r border-gray-200">
              <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
                <option value="">Brand</option>
              </select>
            </div>
            
            <div className="relative flex-none w-32 px-4 py-3 border-r border-gray-200">
              <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
                <option value="">Code</option>
              </select>
            </div>
            
            {/* Dynamic specification columns */}
            {importData.specification_columns && importData.specification_columns.map((columnName, index) => (
              <div key={index} className="relative flex-none w-40 px-4 py-3 border-r border-gray-200">
                <select className="form-select w-full text-sm border-0 bg-transparent p-0 focus:ring-0">
                  <option value="">{columnName}</option>
                </select>
              </div>
            ))}
            
            <div className="flex-none w-32 px-4 py-3 text-center">
              <span className="text-sm font-medium text-gray-700">Actions</span>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-x-auto">
          <table className="min-w-max w-full">
            <tbody>
              {currentRows.map((row, index) => {
                const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
                const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
                const hasRowErrors = isInvalid || isDuplicate;
                
                return (
                  <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${hasRowErrors ? 'bg-red-50' : ''}`}>
                    {/* Brand column */}
                    <td className="px-4 py-3 w-32 border-r border-gray-100 truncate">
                      <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                        {row.data[0] || ''}
                      </span>
                    </td>
                    
                    {/* Code column */}
                    <td className="px-4 py-3 w-32 border-r border-gray-100 truncate">
                      <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                        {row.data[1] || ''}
                      </span>
                    </td>
                    
                    {/* Dynamic specification columns */}
                    {importData.specification_columns && importData.specification_columns.map((columnName, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 w-40 border-r border-gray-100 truncate">
                        <span className={hasRowErrors ? 'text-red-600 font-medium' : ''}>
                          {row.data[colIndex + 2] || ''}
                        </span>
                      </td>
                    ))}
                    
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Specifications Data</h2>
          
          {/* Required Columns Info */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Required Columns</div>
            <div className="flex gap-4 mb-2">
              <span className="text-blue-600 text-sm font-medium">Brand</span>
              <span className="text-blue-600 text-sm font-medium">Code</span>
              <span className="text-blue-600 text-sm font-medium">[Specification Headers...]</span>
            </div>
            <div className="text-sm text-blue-600">
              <strong>Validation:</strong> Brand/Code vs. Products; Column headers become Specification Headnames
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <strong>Flexible Schema:</strong> Any columns after Brand and Code will become specification headnames. 
              New headnames will be created automatically if they don't exist.
            </div>
          </div>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragActive ? 'Drop the file here' : 'Drop Excel file here or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx, .xls, and .csv files up to 10MB
              </p>
            </div>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center">
              <LoadingIcon icon="oval" className="w-5 h-5 mr-2" />
              <span className="text-gray-600 text-sm">Processing file...</span>
            </div>
          )}
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

export default FileoperationAddSpecifications;
