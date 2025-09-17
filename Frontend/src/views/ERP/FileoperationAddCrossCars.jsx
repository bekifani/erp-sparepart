import "@/assets/css/vendors/tabulator.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from "@/components/Base/Button";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Notification from "@/components/Base/Notification";
import Lucide from "@/components/Base/Lucide";
import * as XLSX from 'xlsx';
import { setGlobalUnsavedData } from "@/hooks/useNavigationBlocker";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { createIcons, icons } from "lucide";

function FileoperationAddCrossCars({ onSuccess, onError, onRefresh, onDataChange }) {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const token = useSelector((state) => state.auth.token);
  const tenant_id = useSelector((state) => state.auth.tenant_id);
  
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [editingRow, setEditingRow] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Tabulator refs
  const tableRef = useRef();
  const tabulator = useRef();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState({
    brand: true,
    code: true,
    carModel: true,
    actions: true
  });
  const [filters, setFilters] = useState({
    brand: '',
    code: '',
    carModel: '',
    status: 'all'
  });

  // Initialize Tabulator
  const initTabulator = useCallback(() => {
    if (!tableRef.current || !validationResult) return;

    const { valid_rows = [], invalid_rows = [], duplicates = [] } = validationResult;
    const allRows = [...valid_rows, ...invalid_rows, ...duplicates];

    // Prepare data for Tabulator
    const tableData = allRows.map((row, index) => {
      const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
      const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
      const status = isDuplicate ? 'Duplicate' : isInvalid ? 'Invalid' : 'Valid';
      
      return {
        id: row.row,
        row: row.row,
        brand: row.data[0] || '',
        code: row.data[1] || '',
        carModel: row.data[2] || '',
        status: status,
        errors: row.errors ? row.errors.join(', ') : '',
        isInvalid: isInvalid,
        isDuplicate: isDuplicate,
        originalData: row
      };
    });

    // Define columns
    const columns = [
      {
        title: t("Row"),
        field: "row",
        width: 80,
        hozAlign: "center",
        headerSort: false
      },
      {
        title: t("Brand"),
        field: "brand",
        minWidth: 120,
        editor: "input",
        editable: function(cell) {
          const row = cell.getRow().getData();
          return editingRow === row.row;
        },
        formatter: function(cell) {
          const row = cell.getRow().getData();
          const value = cell.getValue();
          const isEditable = editingRow === row.row;
          
          if (isEditable) {
            return `<div style="background-color: #fef3c7; border: 2px dashed #f59e0b; padding: 4px; border-radius: 4px; cursor: text;" title="Click to edit">${value || ''}</div>`;
          }
          return value || '';
        },
        cellEdited: function(cell) {
          const row = cell.getRow().getData();
          const newValue = cell.getValue();
          setEditFormData(prev => ({ ...prev, brand: newValue }));
        }
      },
      {
        title: t("Code"),
        field: "code",
        minWidth: 120,
        editor: "input",
        editable: function(cell) {
          const row = cell.getRow().getData();
          return editingRow === row.row;
        },
        formatter: function(cell) {
          const row = cell.getRow().getData();
          const value = cell.getValue();
          const isEditable = editingRow === row.row;
          
          if (isEditable) {
            return `<div style="background-color: #fef3c7; border: 2px dashed #f59e0b; padding: 4px; border-radius: 4px; cursor: text;" title="Click to edit">${value || ''}</div>`;
          }
          return value || '';
        },
        cellEdited: function(cell) {
          const row = cell.getRow().getData();
          const newValue = cell.getValue();
          setEditFormData(prev => ({ ...prev, code: newValue }));
        }
      },
      {
        title: t("Car Model"),
        field: "carModel",
        minWidth: 150,
        editor: "input",
        editable: function(cell) {
          const row = cell.getRow().getData();
          return editingRow === row.row;
        },
        formatter: function(cell) {
          const row = cell.getRow().getData();
          const value = cell.getValue();
          const isEditable = editingRow === row.row;
          
          if (isEditable) {
            return `<div style="background-color: #fef3c7; border: 2px dashed #f59e0b; padding: 4px; border-radius: 4px; cursor: text;" title="Click to edit">${value || ''}</div>`;
          }
          return value || '';
        },
        cellEdited: function(cell) {
          const row = cell.getRow().getData();
          const newValue = cell.getValue();
          setEditFormData(prev => ({ ...prev, carModel: newValue }));
        }
      },
      {
        title: t("Status"),
        field: "status",
        width: 100,
        hozAlign: "center",
        formatter: function(cell) {
          const value = cell.getValue();
          const color = value === 'Valid' ? 'green' : value === 'Invalid' ? 'red' : 'orange';
          return `<span style="color: ${color}; font-weight: bold;">${value}</span>`;
        }
      },
      {
        title: t("Errors"),
        field: "errors",
        minWidth: 200,
        formatter: function(cell) {
          const value = cell.getValue();
          return value ? `<span style="color: red; font-size: 12px;">${value}</span>` : '';
        }
      },
      {
        title: t("Actions"),
        field: "actions",
        width: 150,
        hozAlign: "center",
        headerSort: false,
        formatter: function(cell) {
          const row = cell.getRow().getData();
          const isEditing = editingRow === row.row;
          
          if (isEditing) {
            return `<div class="flex items-center justify-center gap-1">
              <button class="save-btn text-green-600 hover:text-green-800 p-1" title="${t('Save')}" onclick="window.handleSaveEdit && window.handleSaveEdit()">
                <i data-lucide="check" class="w-4 h-4"></i>
              </button>
              <button class="cancel-btn text-red-600 hover:text-red-800 p-1" title="${t('Cancel')}" onclick="window.handleCancelEdit && window.handleCancelEdit()">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>`;
          } else {
            return `<div class="flex items-center justify-center gap-1">
              <button class="view-btn text-blue-600 hover:text-blue-800 p-1" title="${t('View')}" onclick="window.handleViewRow && window.handleViewRow(${JSON.stringify(row.originalData).replace(/"/g, '&quot;')})">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button class="edit-btn text-green-600 hover:text-green-800 p-1" title="${t('Edit')}" onclick="window.handleEditRow && window.handleEditRow(${JSON.stringify(row.originalData).replace(/"/g, '&quot;')})">
                <i data-lucide="edit" class="w-4 h-4"></i>
              </button>
              <button class="delete-btn text-red-600 hover:text-red-800 p-1" title="${t('Delete')}" onclick="window.handleDeleteRow && window.handleDeleteRow(${row.row})">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>`;
          }
        }
      }
    ];

    // Initialize Tabulator
    tabulator.current = new Tabulator(tableRef.current, {
      data: tableData,
      layout: "fitColumns",
      responsiveLayout: "hide",
      movableColumns: true, // Enable column swapping
      pagination: "local",
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 50, 100],
      columns: columns,
      rowFormatter: function(row) {
        const data = row.getData();
        if (data.isInvalid) {
          row.getElement().style.backgroundColor = "#fef2f2";
        } else if (data.isDuplicate) {
          row.getElement().style.backgroundColor = "#fef3c7";
        }
      }
    });

    // Handle row actions with better event delegation
    tabulator.current.on("cellClick", function(e, cell) {
      const row = cell.getRow().getData();
      const field = cell.getField();
      
      if (field === "actions") {
        e.stopPropagation();
        const target = e.target.closest('button') || e.target;
        
        if (target.classList.contains('view-btn') || target.closest('.view-btn')) {
          handleViewRow(row.originalData);
        } else if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
          handleEditRow(row.originalData);
        } else if (target.classList.contains('save-btn') || target.closest('.save-btn')) {
          handleSaveEdit();
        } else if (target.classList.contains('cancel-btn') || target.closest('.cancel-btn')) {
          handleCancelEdit();
        } else if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
          handleDeleteRow(row.row);
        }
      }
    });

    // Additional event listener for button clicks
    tabulator.current.on("renderComplete", function() {
      const tableElement = tabulator.current.element;
      
      // Remove any existing event listeners to avoid duplicates
      tableElement.removeEventListener('click', handleTableClick);
      
      // Add new event listener
      tableElement.addEventListener('click', handleTableClick);
    });

    // Render icons after table is built
    tabulator.current.on("renderComplete", () => {
      createIcons({
        icons,
        attrs: {
          "stroke-width": 1.5,
        },
        nameAttr: "data-lucide",
      });
    });

    // Expose handler functions to global scope for onclick handlers
    window.handleViewRow = handleViewRow;
    window.handleEditRow = handleEditRow;
    window.handleSaveEdit = handleSaveEdit;
    window.handleCancelEdit = handleCancelEdit;
    window.handleDeleteRow = handleDeleteRow;

  }, [validationResult, t, editingRow]);

  // Handle table click events for buttons
  const handleTableClick = useCallback((e) => {
    const target = e.target.closest('button');
    if (!target) return;

    // Find the row data
    const rowElement = target.closest('[tabulator-row]');
    if (!rowElement) return;

    const rowIndex = rowElement.getAttribute('tabulator-row');
    const rowData = tabulator.current?.getRow(rowIndex)?.getData();
    if (!rowData) return;

    e.preventDefault();
    e.stopPropagation();

    if (target.classList.contains('view-btn')) {
      handleViewRow(rowData.originalData);
    } else if (target.classList.contains('edit-btn')) {
      handleEditRow(rowData.originalData);
    } else if (target.classList.contains('save-btn')) {
      handleSaveEdit();
    } else if (target.classList.contains('cancel-btn')) {
      handleCancelEdit();
    } else if (target.classList.contains('delete-btn')) {
      handleDeleteRow(rowData.row);
    }
  }, []);

  // Handle cell editing
  const handleCellEdit = (rowId, field, newValue) => {
    if (!validationResult) return;
    
    // Update the validation result data
    const updateRowData = (rows) => {
      return rows.map(row => {
        if (row.row === rowId) {
          const newData = [...row.data];
          const fieldIndex = field === 'brand' ? 0 : field === 'code' ? 1 : 2;
          newData[fieldIndex] = newValue;
          return { ...row, data: newData };
        }
        return row;
      });
    };

    const updatedValidation = {
      ...validationResult,
      valid_rows: updateRowData(validationResult.valid_rows),
      invalid_rows: updateRowData(validationResult.invalid_rows),
      duplicates: updateRowData(validationResult.duplicates)
    };

    setValidationResult(updatedValidation);
  };

  // Initialize Tabulator when validation result or editing state changes
  useEffect(() => {
    if (validationResult && showPreview) {
      setTimeout(() => {
        initTabulator();
      }, 100);
    }
  }, [validationResult, showPreview, editingRow, initTabulator]);

  // Download Excel Template
  const handleDownloadTemplate = () => {
    // Create Excel template with required columns
    const templateData = [
      ['Brand', 'Code', 'Car Model'],
      ['NISSAN', 'ABC123', 'INFINITI G37'],
      ['TOYOTA', 'DEF456', 'CAMRY 2020']
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Set column widths
    ws['!cols'] = [
      { width: 15 }, // Brand
      { width: 15 }, // Code
      { width: 20 }  // CarModel
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Cross Cars Template');
    
    // Download the file
    XLSX.writeFile(wb, 'cross_cars_template.xlsx');
  };

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
            'X-Tenant-ID': tenant_id
          }
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
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to upload file. Please try again.');
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

  const handleEditRow = (row) => {
    setEditingRow(row.row);
    setEditFormData({
      brand: row.data[0] || '',
      code: row.data[1] || '',
      carModel: row.data[2] || ''
    });
  };

  const handleSaveEdit = () => {
    if (!validationResult || !editingRow) return;
    
    const updatedData = [editFormData.brand, editFormData.code, editFormData.carModel];
    
    // Update the row data in all arrays
    const updateRowData = (rows) => {
      return rows.map(row => {
        if (row.row === editingRow) {
          return { ...row, data: updatedData };
        }
        return row;
      });
    };
    
    const updatedValidation = {
      ...validationResult,
      valid_rows: updateRowData(validationResult.valid_rows),
      invalid_rows: updateRowData(validationResult.invalid_rows),
      duplicates: updateRowData(validationResult.duplicates)
    };
    
    setValidationResult(updatedValidation);
    setEditingRow(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditFormData({});
  };

  const handleImportData = async () => {
    if (!validationResult) return;
    
    try {
      setIsImporting(true);
      
      // Check if there are valid rows to import
      if (!validationResult.valid_rows || validationResult.valid_rows.length === 0) {
        onError?.(t('No valid data to import'));
        return;
      }
      
      const response = await axios.post(
        `${app_url}/api/fileoperation/import-cross-cars`,
        { 
          valid_rows: validationResult.valid_rows,
          file_name: importData?.name || 'cross_cars_import.xlsx'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        const { imported, skipped } = response.data.data;
        const successMessage = `${t('Cross cars imported successfully!')} ${t('Imported')}: ${imported}${skipped > 0 ? `, ${t('Skipped')}: ${skipped}` : ''}`;
        onSuccess?.(successMessage);
        
        // Clear the validation result after successful import
        setValidationResult(null);
        setShowPreview(false);
        setImportData(null);
        onRefresh?.();
      } else {
        onError?.(response.data.message || t('Import failed'));
      }
    } catch (error) {
      console.error('Import error:', error);
      onError?.(error.response?.data?.message || error.message || t('Import failed'));
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportInvalidRows = () => {
    if (!validationResult || !validationResult.invalid_rows.length) return;
    
    const invalidData = [
      ['Row', 'Brand', 'Code', 'CarModel', 'Errors'],
      ...validationResult.invalid_rows.map(row => [
        row.row,
        row.data[0] || '',
        row.data[1] || '',
        row.data[2] || '',
        row.errors.join(', ')
      ])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(invalidData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invalid Rows');
    XLSX.writeFile(wb, 'cross_cars_invalid_rows.xlsx');
  };

  const handleViewRow = (row) => {
    setSelectedRowData(row);
    setShowViewModal(true);
  };

  const handleResetFilters = () => {
    setFilters({
      brand: '',
      code: '',
      carModel: '',
      status: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportData = (format) => {
    if (!validationResult) return;
    
    const { valid_rows = [], invalid_rows = [], duplicates = [] } = validationResult;
    const allRows = [...valid_rows, ...invalid_rows, ...duplicates];
    
    const exportData = [
      ['Row', 'Brand', 'Code', 'Car Model', 'Status', 'Errors'],
      ...allRows.map(row => {
        const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
        const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
        const status = isDuplicate ? 'Duplicate' : isInvalid ? 'Invalid' : 'Valid';
        const errors = isInvalid ? invalid_rows.find(ir => ir.row === row.row)?.errors?.join(', ') || '' :
                     isDuplicate ? 'Duplicate entry' : '';
        
        return [
          row.row,
          row.data[0] || '',
          row.data[1] || '',
          row.data[2] || '',
          status,
          errors
        ];
      })
    ];
    
    if (format === 'xlsx') {
      const ws = XLSX.utils.aoa_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cross Cars Data');
      XLSX.writeFile(wb, 'cross_cars_data.xlsx');
    } else if (format === 'csv') {
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cross_cars_data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
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

    // Filter rows based on search term and filters
    const filteredRows = allRows.filter(row => {
      // Search term filter
      if (searchTerm && !row.data.some(cell => 
        String(cell).toLowerCase().includes(searchTerm.toLowerCase())
      )) {
        return false;
      }
      
      // Brand filter
      if (filters.brand && !String(row.data[0] || '').toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }
      
      // Code filter
      if (filters.code && !String(row.data[1] || '').toLowerCase().includes(filters.code.toLowerCase())) {
        return false;
      }
      
      // Car Model filter
      if (filters.carModel && !String(row.data[2] || '').toLowerCase().includes(filters.carModel.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all') {
        const isInvalid = invalid_rows.some(invalidRow => invalidRow.row === row.row);
        const isDuplicate = duplicates.some(dupRow => dupRow.row === row.row);
        const isValid = !isInvalid && !isDuplicate;
        
        if (filters.status === 'valid' && !isValid) return false;
        if (filters.status === 'invalid' && !isInvalid) return false;
        if (filters.status === 'duplicate' && !isDuplicate) return false;
      }
      
      return true;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
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
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredRows.length)} of {filteredRows.length} entries
            </span>
          </div>
          
          {/* Action buttons - matching Added Files tab */}
          <div className="flex items-center gap-2">
            {/* Import button */}
            <button
              onClick={handleImportData}
              disabled={isImporting}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm ${
                isImporting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isImporting ? (
                <>
                  <LoadingIcon icon="oval" className="w-4 h-4" />
                  <span>{t('Importing...')}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  <span>{t('Import')}</span>
                </>
              )}
            </button>
            
            {/* Filter button */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
            
            {/* Columns button */}
            <button
              onClick={() => setShowColumnsModal(true)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
              <span className="text-sm">Columns</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Reset button */}
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 4v6h6m16 10v-6h-6M7.05 3.05A9 9 0 0119 12h-2a7 7 0 00-10.95-5.95L7.05 3.05z" />
              </svg>
              <span className="text-sm">Reset</span>
            </button>
            
            {/* Print button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="text-sm">Print</span>
            </button>
            
            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportModal(!showExportModal)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm">Export</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              </button>
              
              {showExportModal && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleExportData('xlsx');
                        setShowExportModal(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Export as Excel (.xlsx)
                    </button>
                    <button
                      onClick={() => {
                        handleExportData('csv');
                        setShowExportModal(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Export as CSV (.csv)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabulator Table */}
        <div ref={tableRef} className="border border-gray-200 rounded-lg"></div>

        {/* Action buttons for errors */}
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
                Remove mismatched rows and complete data import
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

          {/* Download Template Button */}
          <div className="mb-4">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
            >
              <Lucide icon="Download" className="w-4 h-4" />
              {t("Download Excel Template")}
            </Button>
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

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t("Filter Data")}</h3>
                <button onClick={() => setShowFilterModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Brand")}</label>
                  <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t("Filter by brand...")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Code")}</label>
                  <input
                    type="text"
                    value={filters.code}
                    onChange={(e) => setFilters({...filters, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t("Filter by code...")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Car Model")}</label>
                  <input
                    type="text"
                    value={filters.carModel}
                    onChange={(e) => setFilters({...filters, carModel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder={t("Filter by car model...")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">{t("Status")}</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">{t("All")}</option>
                    <option value="valid">{t("Valid")}</option>
                    <option value="invalid">{t("Invalid")}</option>
                    <option value="duplicate">{t("Duplicate")}</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline-secondary" onClick={() => setShowFilterModal(false)}>
                  {t("Cancel")}
                </Button>
                <Button variant="primary" onClick={() => setShowFilterModal(false)}>
                  {t("Apply Filters")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Columns Modal */}
        {showColumnsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t("Show/Hide Columns")}</h3>
                <button onClick={() => setShowColumnsModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={columnVisibility.brand}
                    onChange={(e) => setColumnVisibility({...columnVisibility, brand: e.target.checked})}
                    className="mr-2"
                  />
                  {t("Brand")}
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={columnVisibility.code}
                    onChange={(e) => setColumnVisibility({...columnVisibility, code: e.target.checked})}
                    className="mr-2"
                  />
                  {t("Code")}
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={columnVisibility.carModel}
                    onChange={(e) => setColumnVisibility({...columnVisibility, carModel: e.target.checked})}
                    className="mr-2"
                  />
                  {t("Car Model")}
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={columnVisibility.actions}
                    onChange={(e) => setColumnVisibility({...columnVisibility, actions: e.target.checked})}
                    className="mr-2"
                  />
                  {t("Actions")}
                </label>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline-secondary" onClick={() => setShowColumnsModal(false)}>
                  {t("Close")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* View Row Modal */}
        {showViewModal && selectedRowData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{t("Row Details")}</h3>
                <button onClick={() => setShowViewModal(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("Row Number")}</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {selectedRowData.row}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("Brand")}</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {selectedRowData.data[0] || t("Empty")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("Code")}</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {selectedRowData.data[1] || t("Empty")}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("Car Model")}</label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                    {selectedRowData.data[2] || t("Empty")}
                  </div>
                </div>
                
                {selectedRowData.errors && selectedRowData.errors.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-1">{t("Errors")}</label>
                    <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-700">
                      {selectedRowData.errors.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline-secondary" onClick={() => setShowViewModal(false)}>
                  {t("Close")}
                </Button>
                <Button variant="primary" onClick={() => {
                  setShowViewModal(false);
                  handleEditRow(selectedRowData);
                }}>
                  {t("Edit")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileoperationAddCrossCars;
