import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from '@/components/Base/Button';
import { Dialog } from '@headlessui/react';
import Lucide from "@/components/Base/Lucide";
import * as XLSX from 'xlsx';
import LoadingIcon from '@/components/Base/LoadingIcon';
import { setGlobalUnsavedData } from '@/hooks/useNavigationBlocker';
import Notification from "@/components/Base/Notification";

function FileoperationAddProducts({ onSuccess, onError, onRefresh, onDataChange }) {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const token = useSelector((state) => state.auth.token);
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [autoCodingEnabled, setAutoCodingEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingRow, setEditingRow] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [viewingRow, setViewingRow] = useState(null);
  const basicStickyNotification = useRef();

  // File upload handling
  const downloadTemplate = () => {
    // Define template columns based on backend validation requirements
    const templateData = [
      // Headers
      [
        'Supplier', 'Supplier Code', 'Brand', 'Brand Code', 'OE Code', 'Description',
        'Qty', 'Unit Type', 'Min Qty', 'Purchase Price', 'Extra Cost', 'Cost Basis',
        'Selling Price', 'Additional Note', 'Status'
      ],
      // Sample data row 1
      [
        'Sample Supplier', 'SUP001', 'Toyota', 'TOY001', 'OE12345', 'Brake Pad Front',
        '10', 'Piece', '5', '25.50', '2.00', '27.50', '35.00', 'High quality brake pad', 'Active'
      ],
      // Sample data row 2
      [
        'Auto Parts Co', 'APC002', 'Honda', 'HON002', 'OE67890', 'Oil Filter',
        '20', 'Piece', '10', '15.75', '1.25', '17.00', '22.00', 'Premium oil filter', 'Active'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products Template');
    
    // Set column widths for better readability
    ws['!cols'] = [
      { width: 15 }, // Supplier
      { width: 12 }, // Supplier Code
      { width: 10 }, // Brand
      { width: 12 }, // Brand Code
      { width: 10 }, // OE Code
      { width: 20 }, // Description
      { width: 8 },  // Qty
      { width: 10 }, // Unit Type
      { width: 8 },  // Min Qty
      { width: 12 }, // Purchase Price
      { width: 10 }, // Extra Cost
      { width: 10 }, // Cost Basis
      { width: 12 }, // Selling Price
      { width: 15 }, // Additional Note
      { width: 8 }   // Status
    ];
    
    XLSX.writeFile(wb, 'Products_Import_Template.xlsx');
  };

  const validateTemplate = (file) => {
    return new Promise((resolve, reject) => {
      console.log('=== FRONTEND TEMPLATE VALIDATION START ===');
      console.log('File name:', file.name);
      console.log('File size:', file.size);
      console.log('File type:', file.type);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          console.log('Raw JSON data from Excel:', jsonData);
          console.log('First row (headers):', jsonData[0]);
          
          if (jsonData.length === 0) {
            console.error('VALIDATION FAILED: File is empty');
            reject('File is empty');
            return;
          }
          
          const rawHeaders = jsonData[0];
          const normalizedHeaders = rawHeaders.map(header => 
            header.toString().replace(/[\n\r]/g, '').trim().toLowerCase().replace(/[_\s]+/g, ' ')
          );
          console.log('Raw headers:', rawHeaders);
          console.log('Normalized headers:', normalizedHeaders);
          
          // Required columns with variations
          const requiredColumns = [
            { variations: ['supplier'], display: 'Supplier' },
            { variations: ['supplier code', 'suppliercode', 'supplier_code'], display: 'Supplier Code' },
            { variations: ['brand'], display: 'Brand' },
            { variations: ['brand code', 'brandcode', 'brand_code'], display: 'Brand Code' },
            { variations: ['description'], display: 'Description' }
          ];
          
          console.log('Required columns:', requiredColumns);
          
          const missingColumns = [];
          
          for (const required of requiredColumns) {
            const found = required.variations.some(variation => {
              const isFound = normalizedHeaders.includes(variation);
              console.log(`Checking "${variation}" in headers:`, isFound);
              return isFound;
            });
            
            console.log(`Required column "${required.display}" found:`, found);
            
            if (!found) {
              missingColumns.push(required.display);
            }
          }
          
          console.log('Missing columns:', missingColumns);
          
          if (missingColumns.length > 0) {
            const errorMsg = `Invalid template format. Missing required columns: ${missingColumns.join(', ')}. Please download and use the provided template.`;
            console.error('VALIDATION FAILED:', errorMsg);
            reject(errorMsg);
            return;
          }
          
          console.log('FRONTEND VALIDATION PASSED');
          resolve(true);
        } catch (error) {
          console.error('VALIDATION ERROR:', error);
          reject('Error reading file: ' + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    console.log('=== FILE CHANGE EVENT ===');
    console.log('Selected file:', file);
    
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel', 
        'text/csv',
        'application/wps-office.xlsx',
        'application/wps-office.xls'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      console.log('File validation - Type check:', file.type, 'Allowed:', allowedTypes);
      console.log('File validation - Size check:', file.size, 'Max:', maxSize);
      
      if (!allowedTypes.includes(file.type)) {
        console.error('FILE TYPE VALIDATION FAILED:', file.type);
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file.');
        return;
      }
      
      if (file.size > maxSize) {
        console.error('FILE SIZE VALIDATION FAILED:', file.size);
        setError('File size must be less than 10MB.');
        return;
      }
      
      console.log('File type and size validation passed');
      
      try {
        console.log('Starting template validation...');
        await validateTemplate(file);
        
        console.log('Template validation passed, starting file validation');
        // Start validation process directly
        setUploadedFile(file);
        setGlobalUnsavedData(true);
        if (onDataChange) {
          onDataChange(true);
        }
        validateFile(file, autoCodingEnabled);
      } catch (error) {
        console.error('Template validation failed:', error);
        setError(error);
      }
    } else {
      console.log('No file selected');
    }
  };


  const validateFile = async (file, autoCoding = false) => {
    if (!file) return;
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('auto_coding', autoCoding ? '1' : '0');
      
      const response = await axios.post(`${app_url}/api/fileoperation/validate-products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setValidationResult(response.data.validation);
        setImportData(response.data.data);
        setShowPreview(true);
        setToastMessage(t('File validated successfully'));
        basicStickyNotification.current?.showToast();
      } else {
        setError(response.data.message || t('Validation failed'));
      }
    } catch (error) {
      console.error('Validation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Detailed errors:', error.response?.data?.errors);
      
      let errorMessage = 'Validation failed. Please check your file format and try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (acceptedFiles) => {
    console.log('=== DRAG & DROP FILE UPLOAD ===');
    console.log('Accepted files:', acceptedFiles);
    
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      console.log('Dropped file:', file);
      
      // Validate file type and size
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel', 
        'text/csv',
        'application/wps-office.xlsx',
        'application/wps-office.xls'
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      console.log('Drag & Drop - File validation - Type check:', file.type, 'Allowed:', allowedTypes);
      console.log('Drag & Drop - File validation - Size check:', file.size, 'Max:', maxSize);
      
      if (!allowedTypes.includes(file.type)) {
        console.error('DRAG & DROP FILE TYPE VALIDATION FAILED:', file.type);
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file.');
        return;
      }
      
      if (file.size > maxSize) {
        console.error('DRAG & DROP FILE SIZE VALIDATION FAILED:', file.size);
        setError('File size must be less than 10MB.');
        return;
      }
      
      console.log('Drag & Drop file type and size validation passed');
      
      try {
        console.log('Starting drag & drop template validation...');
        await validateTemplate(file);
        
        console.log('Drag & Drop template validation passed, starting file validation');
        // Start validation process directly
        setUploadedFile(file);
        setGlobalUnsavedData(true);
        if (onDataChange) {
          onDataChange(true);
        }
        validateFile(file, autoCodingEnabled);
      } catch (error) {
        console.error('Drag & Drop template validation failed:', error);
        setError(error);
      }
    } else {
      console.log('No files in drag & drop');
    }
  };

  // Handle import processing
  const handleProcessImport = async (removeDuplicates = false) => {
    if (!validationResult) return;

    console.log('=== IMPORT PROCESS STARTED ===');
    console.log('Valid rows to import:', validationResult.valid_rows);
    console.log('Valid rows count:', validationResult.valid_rows.length);
    console.log('File name:', uploadedFile?.name);

    setLoading(true);
    try {
      const importPayload = {
        valid_rows: validationResult.valid_rows,
        file_name: uploadedFile?.name || 'products_import.xlsx'
      };
      
      console.log('Import payload:', importPayload);

      const response = await axios.post(`${app_url}/api/fileoperation/import-products`, importPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('=== IMPORT RESPONSE ===');
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

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
      console.error('=== IMPORT ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error message:', error.message);
      
      if (onError) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Import failed';
        console.error('Final error message sent to user:', errorMessage);
        onError(errorMessage);
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

  // Handle inline editing
  const handleEditRow = (row) => {
    setEditingRow(row.row);
    setEditingData({ ...row.data });
  };

  const handleSaveEdit = (rowIndex) => {
    if (!validationResult) return;
    
    // Update the row data in validation result
    const updatedValidation = { ...validationResult };
    
    // Find and update the row in the appropriate array
    ['valid_rows', 'invalid_rows', 'duplicates'].forEach(arrayName => {
      const rowIndex = updatedValidation[arrayName].findIndex(row => row.row === editingRow);
      if (rowIndex !== -1) {
        updatedValidation[arrayName][rowIndex].data = Object.values(editingData);
      }
    });
    
    setValidationResult(updatedValidation);
    setEditingRow(null);
    setEditingData({});
    
    setToastMessage(t('Row updated successfully'));
    basicStickyNotification.current?.showToast();
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditingData({});
  };

  const handleViewRow = (row) => {
    setViewingRow(row);
  };

  const handleCloseView = () => {
    setViewingRow(null);
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
        {/* Dashboard with counts */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-blue-700 font-semibold text-sm mb-1">{t("Total Rows")}</div>
            <div className="text-2xl font-bold text-blue-600">{allRows.length}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-green-700 font-semibold text-sm mb-1">{t("Valid Rows")}</div>
            <div className="text-2xl font-bold text-green-600">{valid_rows.length}</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-700 font-semibold text-sm mb-1">{t("Invalid Rows")}</div>
            <div className="text-2xl font-bold text-yellow-600">{invalid_rows.length}</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-700 font-semibold text-sm mb-1">{t("Duplicates")}</div>
            <div className="text-2xl font-bold text-red-600">{duplicates.length}</div>
          </div>
        </div>

        {/* Search and pagination info */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-3 flex-1">
            <input
              type="text"
              placeholder={t("Search in data...")}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-gray-600 ml-4">
            <span>
              {t("Showing")} {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredRows.length)} {t("of")} {filteredRows.length} {t("rows")}
            </span>
          </div>
          
          <div className="flex gap-2 ml-4">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleUploadNewFile}
              disabled={loading}
            >
              {t("Upload New File")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleProcessImport(false)}
              disabled={loading || valid_rows.length === 0}
            >
              {t("Import")} {valid_rows.length} {t("Products")}
            </Button>
          </div>
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
                          {editingRow === row.row ? (
                            <input
                              type="text"
                              value={editingData[colIndex] || ''}
                              onChange={(e) => setEditingData({...editingData, [colIndex]: e.target.value})}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className={hasRowErrors && row.data[colIndex] ? 'text-red-600 font-medium' : ''}>
                              {row.data[colIndex] || ''}
                            </span>
                          )}
                        </td>
                      ))}
                      
                      {/* Actions column */}
                      <td className="px-4 py-3 w-32">
                        <div className="flex items-center justify-center gap-2">
                          {editingRow === row.row ? (
                            <>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded" 
                                title={t("Save")}
                                onClick={() => handleSaveEdit(row.row)}
                              >
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded" 
                                title={t("Cancel")}
                                onClick={handleCancelEdit}
                              >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded" 
                                title={t("View")}
                                onClick={() => handleViewRow(row)}
                              >
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded" 
                                title={t("Edit")}
                                onClick={() => handleEditRow(row)}
                              >
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
                            </>
                          )}
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
        {(invalid_rows.length > 0 || duplicates.length > 0) && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-red-600 text-sm">
              * {t("The data in")} {invalid_rows.length + duplicates.length} {t("lines does not match the system data. Please edit or delete these lines.")}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportInvalidRows}
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
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-medium">{t("File Upload")}</div>
              <button
                type="button"
                onClick={downloadTemplate}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Lucide icon="Download" className="w-4 h-4 mr-2" />
                {t("Download Template")}
              </button>
            </div>
            
            {/* Auto Coding Checkbox */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  id="autoCoding"
                  checked={autoCodingEnabled}
                  onChange={(e) => setAutoCodingEnabled(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                />
                <label htmlFor="autoCoding" className="text-sm font-medium text-gray-700">
                  <Lucide icon="Settings" className="w-4 h-4 inline mr-2" />
                  {t("Enable Brand Code Auto Coding")}
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {t("When enabled, missing brand codes will be automatically generated based on brand names")}
              </p>
            </div>
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
                {t("Supports .xlsx, .xls, and .csv files up to 10MB")}
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("Or select Excel/CSV file manually")}
              </label>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-2 text-xs text-gray-500">
                <p className="mb-1">{t("Supported formats: .xlsx, .xls, .csv (Max: 10MB)")}</p>
                <p className="text-amber-600">
                  <Lucide icon="AlertTriangle" className="w-3 h-3 inline mr-1" />
                  {t("Important: Please use the template above to ensure your file has the correct format and required columns.")}
                </p>
              </div>
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

      {/* Toast Notification */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">{toastMessage}</div>
        </div>
      </Notification>

      {/* View Row Modal */}
      {viewingRow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("View Row Details")} - {t("Row")} {viewingRow.row}
                </h3>
                <button
                  onClick={handleCloseView}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                {importData.headers.map((header, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {header}
                    </div>
                    <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {viewingRow.data[index] || t("Empty")}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Row Status */}
              <div className="mt-6 p-4 rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-gray-700 mb-2">{t("Row Status")}</div>
                <div className="flex gap-2">
                  {validationResult.valid_rows.some(r => r.row === viewingRow.row) && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                      {t("Valid")}
                    </span>
                  )}
                  {validationResult.invalid_rows.some(r => r.row === viewingRow.row) && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      {t("Invalid")}
                    </span>
                  )}
                  {validationResult.duplicates.some(r => r.row === viewingRow.row) && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                      {t("Duplicate")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline-secondary"
                onClick={handleCloseView}
              >
                {t("Close")}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleCloseView();
                  handleEditRow(viewingRow);
                }}
              >
                {t("Edit Row")}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default FileoperationAddProducts;
