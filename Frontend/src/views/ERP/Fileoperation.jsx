import "@/assets/css/vendors/tabulator.css";
import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Notification from "@/components/Base/Notification";
import Can from "@/helpers/PermissionChecker/index.js";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import FileoperationAddCrossCars from "./FileoperationAddCrossCars.jsx";
import FileoperationAddCarModels from "./FileoperationAddCarModels.jsx";
import FileoperationAddProductNames from "./FileoperationAddProductNames.jsx";
import { setGlobalUnsavedData } from "@/hooks/useNavigationBlocker";

function index_main() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  
  // State management
  const [activeTab, setActiveTab] = useState("added_files");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [importData, setImportData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentImportType, setCurrentImportType] = useState('cross_cars');
  const [refetch, setRefetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  // Toast notification
  const basicStickyNotification = useRef();

  // File download handler
  const handleFileDownload = async (fileId, fileName) => {
    const confirmed = window.confirm(`Do you want to download "${fileName}"?`);
    if (!confirmed) return;

    try {
      const response = await axios.get(`${app_url}/api/download-file/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setToastMessage(`File "${fileName}" downloaded successfully`);
      basicStickyNotification.current.showToast();
      
      // Auto-dismiss toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current.hideToast();
      }, 7000);
    } catch (error) {
      console.error('Download error:', error);
      setToastMessage(`Error downloading file: ${error.response?.data?.message || error.message}`);
      basicStickyNotification.current.showToast();
      
      // Auto-dismiss error toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current.hideToast();
      }, 7000);
    }
  };

  // Make handleFileDownload available globally for the formatter
  window.handleFileDownload = handleFileDownload;
  const [toastMessage, setToastMessage] = useState("");

  // Track if child components have unsaved data
  const [hasUnsavedData, setHasUnsavedData] = useState(false);
  
  // Update global unsaved data state whenever local state changes
  React.useEffect(() => {
    setGlobalUnsavedData(hasUnsavedData);
  }, [hasUnsavedData]);

  // Add beforeunload event listener to prevent leaving page with unsaved data
  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      console.log('beforeunload triggered, hasUnsavedData:', hasUnsavedData); // Debug log
      if (hasUnsavedData) {
        e.preventDefault();
        e.returnValue = "You have an uploaded file that hasn't been imported. If you leave this page, the upload will be lost.";
        return e.returnValue;
      }
    };

    // Also add popstate event for browser navigation
    const handlePopState = (e) => {
      console.log('popstate triggered, hasUnsavedData:', hasUnsavedData); // Debug log
      if (hasUnsavedData) {
        const confirmed = window.confirm("You have an uploaded file that hasn't been imported. If you leave this page, the upload will be lost. Do you want to continue?");
        if (!confirmed) {
          // Push current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedData]);

  // Debug: Log hasUnsavedData changes
  React.useEffect(() => {
    console.log('hasUnsavedData changed to:', hasUnsavedData);
  }, [hasUnsavedData]);

  // Handle tab switching with unsaved data confirmation
  const handleTabSwitch = (newTab, newImportType = null) => {
    console.log('Tab switch attempted, hasUnsavedData:', hasUnsavedData, 'activeTab:', activeTab, 'newTab:', newTab);
    
    // Check if there's unsaved data (file uploaded but not imported)
    if (hasUnsavedData) {
      const confirmed = window.confirm("You have an uploaded file that hasn't been imported. If you leave this tab, the upload will be lost. Do you want to continue?");
      if (!confirmed) {
        console.log('Tab switch cancelled by user');
        return;
      }
      console.log('Tab switch confirmed by user');
    }
    
    setActiveTab(newTab);
    if (newImportType) {
      setCurrentImportType(newImportType);
    }
    // Reset unsaved data flag when switching tabs
    console.log('Clearing unsaved data after tab switch');
    setHasUnsavedData(false);
  };

  // Table columns for Added Files section
  const historyTableColumns = [
    {
      title: t("Actions"),
      minWidth: 120,
      field: "actions",
      responsive: 1,
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      headerSort: false,
      formatter: () => {
        return `<div class="flex items-center justify-center">
          <button class="view-btn flex items-center mr-2 text-primary" title="${t('View')}">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
          <button class="edit-btn flex items-center mr-2 text-warning" title="${t('Edit')}">
            <i data-lucide="edit" class="w-4 h-4"></i>
          </button>
          <button class="delete-btn flex items-center text-danger" title="${t('Delete')}">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>`;
      }
    },
    {
      title: t("Date"),
      minWidth: 150,
      field: "created_at",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    },
    {
      title: t("Section"),
      minWidth: 200,
      field: "operation_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const operationType = cell.getValue();
        return importTypes[operationType]?.name || operationType;
      }
    },
    {
      title: t("File name"),
      minWidth: 250,
      field: "file_name",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell, formatterParams, onRendered) => {
        const row = cell.getRow().getData();
        const fileName = row.file_name || (row.file_path ? row.file_path.split('/').pop() : '');
        
        return `<div class="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline" 
                     onclick="handleFileDownload('${row.id}', '${fileName}')">${fileName}</div>`;
      }
    }
  ];

  const searchColumns = ['operation_type', 'file_name', 'file_path', 'status'];

  // Import type configurations
  const importTypes = {
    cross_cars: {
      name: 'Add Cross Cars',
      description: 'Import cross car compatibility data',
      requiredColumns: ['Brand', 'Code', 'Car model'],
      validation: 'Brand/Code vs. Products; Car Model vs. Car Models'
    },
    cross_code: {
      name: 'Add Cross Code',
      description: 'Import cross code reference data',
      requiredColumns: ['Brand', 'Code', 'Cross Brand', 'Cross Code'],
      validation: 'Brand/Code vs. Products'
    },
    products: {
      name: 'Add New Products',
      description: 'Import new product data',
      requiredColumns: ['Supplier', 'Brand', 'Description', 'Unit type'],
      validation: 'Supplier vs. Suppliers; Description vs. Product Names; Unit Type vs. Unit Types'
    },
    information: {
      name: 'Add New Information',
      description: 'Import product information data',
      requiredColumns: ['Brand', 'Code', 'Net weight', 'Gross weight'],
      validation: 'Brand/Code vs. Products'
    },
    specifications: {
      name: 'Add New Specifications',
      description: 'Import product specifications',
      requiredColumns: ['Brand', 'Code'],
      validation: 'Brand/Code vs. Products'
    },
    car_models: {
      name: 'Add New Car Models',
      description: 'Import new car models',
      requiredColumns: ['Car model'],
      validation: 'Car Model must NOT already exist'
    },
    product_names: {
      name: 'Add New Product Names',
      description: 'Import product names',
      requiredColumns: ['Description', 'Categories'],
      validation: 'Category vs. Categories; Name must NOT already exist'
    },
    supplier_prices: {
      name: 'Other Suppliers Prices',
      description: 'Import supplier pricing data',
      requiredColumns: ['Supplier', 'Brand', 'Code', 'Price'],
      validation: 'Supplier vs. Suppliers; Brand/Code vs. Products'
    },
    customer_prices: {
      name: 'Customers Special Price',
      description: 'Import customer special pricing',
      requiredColumns: ['Customer', 'Brand', 'Code', 'Price'],
      validation: 'Customer vs. Customers; Brand/Code vs. Products'
    }
  };

  const hasPermission = (permission) => {
    return user.permissions.includes(permission);
  };

  // File upload handlers
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    // Set unsaved data flag when file is uploaded
    console.log('Main Fileoperation: Setting unsaved data to true');
    setHasUnsavedData(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('import_type', currentImportType);

    try {
      const response = await axios.post(`${app_url}/api/upload-excel`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setUploadedFile(file);
        setImportData(response.data);
        setValidationResult(response.data.validation);
        setShowPreview(true);
        setToastMessage(t("File uploaded and validated successfully"));
        basicStickyNotification.current?.showToast();
      } else {
        setToastMessage(t("Error uploading file: ") + response.data.message);
        basicStickyNotification.current?.showToast();
        // Clear unsaved data flag on upload failure
        setHasUnsavedData(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setToastMessage(t("Error uploading file"));
      basicStickyNotification.current?.showToast();
      // Clear unsaved data flag on upload error
      setHasUnsavedData(false);
    } finally {
      setLoading(false);
    }
  }, [currentImportType, app_url, token, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  // Import processing
  const handleProcessImport = async (removeDuplicates = false) => {
    if (!importData || !validationResult) return;

    setLoading(true);
    try {
      const response = await axios.post(`${app_url}/api/process-import`, {
        file_id: importData.file_id,
        import_type: currentImportType,
        valid_rows: validationResult.valid_rows,
        remove_duplicates: removeDuplicates,
        file_name: uploadedFile?.name || `${currentImportType}_import.xlsx`
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setToastMessage(response.data.message);
        setShowPreview(false);
        setImportData(null);
        setValidationResult(null);
        setUploadedFile(null);
        setRefetch(!refetch); // Trigger refresh of Added Files section
        loadImportHistory();
        // Clear unsaved data flag on successful import
        console.log('Main Fileoperation: Clearing unsaved data after successful import');
        setHasUnsavedData(false);
      } else {
        setToastMessage(t("Error processing import: ") + response.data.message);
      }
      basicStickyNotification.current?.showToast();
    } catch (error) {
      console.error('Import error:', error);
      setToastMessage(t("Error processing import"));
      basicStickyNotification.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Export invalid rows
  const handleExportInvalidRows = async () => {
    if (!validationResult || !validationResult.invalid_rows.length) return;

    try {
      const response = await axios.post(`${app_url}/api/export-invalid-rows`, {
        invalid_rows: validationResult.invalid_rows,
        headers: importData.headers
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        window.open(response.data.download_url, '_blank');
        setToastMessage(t("Invalid rows exported successfully"));
      } else {
        setToastMessage(t("Error exporting invalid rows"));
      }
      basicStickyNotification.current?.showToast();
    } catch (error) {
      console.error('Export error:', error);
      setToastMessage(t("Error exporting invalid rows"));
      basicStickyNotification.current?.showToast();
    }
  };

  // Load import history
  const loadImportHistory = async () => {
    try {
      const response = await axios.get(`${app_url}/api/import-history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setImportHistory(response.data.data.data || []);
      }
    } catch (error) {
      console.error('History load error:', error);
    }
  };

  // Load history on component mount
  React.useEffect(() => {
    loadImportHistory();
  }, []);

  // Render data grid for preview
  const renderDataGrid = () => {
    if (!importData || !validationResult) return null;

    const { headers } = importData;
    const { valid_rows, invalid_rows, duplicates } = validationResult;
    const allRows = [...valid_rows, ...invalid_rows, ...duplicates];
    const hasErrors = invalid_rows.length > 0 || duplicates.length > 0;

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
        {/* Header with search and actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t("Search")}
                className="form-control w-64 pl-10"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
              <Lucide icon="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">
              {t("Showing")} {startIndex + 1}-{Math.min(endIndex, filteredRows.length)} {t("of")} {filteredRows.length} {t("rows")}
            </span>
          </div>
          
          <div className="flex gap-2">
            {hasErrors && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportInvalidRows}
              >
                {t("Export xls/xlsx")}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleProcessImport(false)}
              disabled={loading || valid_rows.length === 0}
            >
              {t("Import xls/xlsx")}
            </Button>
          </div>
        </div>

        {/* Column filter dropdowns */}
        <div className="flex gap-4 mb-4">
          <div className="relative">
            <select className="form-select w-32">
              <option value="">{t("Brand")}</option>
              <option value="Kanoya">Kanoya</option>
              <option value="Kanoliya">Kanoliya</option>
            </select>
            <Lucide icon="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="form-select w-32">
              <option value="">{t("Code")}</option>
              <option value="K10402">K10402</option>
              <option value="K1042202">K1042202</option>
            </select>
            <Lucide icon="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="form-select w-48">
              <option value="">{t("Car model")}</option>
              <option value="INFINITI G37">INFINITI G37</option>
              <option value="INFINITI M35/M45">INFINITI M35/M45</option>
              <option value="NISSAN ALMERA">NISSAN ALMERA</option>
              <option value="NISSAN ALTIMA">NISSAN ALTIMA</option>
            </select>
            <Lucide icon="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="ml-auto">
            <span className="text-lg font-semibold">{t("Actions")}</span>
          </div>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <tbody>
              {currentRows.map((row, index) => {
                const isInvalid = invalid_rows.includes(row);
                const isDuplicate = duplicates.includes(row);
                const hasRowErrors = isInvalid || isDuplicate;
                
                return (
                  <tr key={index} className={`border-b border-gray-100 hover:bg-gray-50 ${hasRowErrors ? 'bg-red-50' : ''}`}>
                    {/* Brand column */}
                    <td className="px-4 py-3 w-32">
                      <span className={hasRowErrors && row.data[0] ? 'text-red-600 font-medium' : ''}>
                        {row.data[0] || ''}
                      </span>
                    </td>
                    
                    {/* Code column */}
                    <td className="px-4 py-3 w-32">
                      <span className={hasRowErrors && row.data[1] ? 'text-red-600 font-medium' : ''}>
                        {row.data[1] || ''}
                      </span>
                    </td>
                    
                    {/* Car model column */}
                    <td className="px-4 py-3 flex-1">
                      <span className={hasRowErrors && row.data[2] ? 'text-red-600 font-medium' : ''}>
                        {row.data[2] || ''}
                      </span>
                    </td>
                    
                    {/* Actions column */}
                    <td className="px-4 py-3 w-32">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title={t("View")}>
                          <Lucide icon="Eye" className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title={t("Edit")}>
                          <Lucide icon="Edit" className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded" title={t("Delete")}>
                          <Lucide icon="Trash2" className="w-4 h-4 text-red-600" />
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
                          ? 'bg-primary text-white'
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
        )}

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
                      ? 'bg-primary text-white'
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

        {/* Summary stats - hidden but available for reference */}
        <div className="hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-success/10 p-4 rounded-lg">
              <div className="text-success font-semibold">{t("Valid Rows")}</div>
              <div className="text-2xl font-bold text-success">{valid_rows.length}</div>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg">
              <div className="text-warning font-semibold">{t("Invalid Rows")}</div>
              <div className="text-2xl font-bold text-warning">{invalid_rows.length}</div>
            </div>
            <div className="bg-danger/10 p-4 rounded-lg">
              <div className="text-danger font-semibold">{t("Duplicates")}</div>
              <div className="text-2xl font-bold text-danger">{duplicates.length}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t("File Operations")}</h2>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabSwitch("added_files")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === "added_files"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t("Added files")}
          </button>
          {Object.entries(importTypes).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleTabSwitch(key, key)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "added_files" ? (
        /* History/Added Files Tab */
        <Can permission="fileoperation-list">
          <TableComponent
            endpoint={app_url + "/api/import-history"}
            data={historyTableColumns}
            searchColumns={searchColumns}
            refetch={refetch}
            setRefetch={setRefetch}
            permission={"fileoperation"}
          />
        </Can>
      ) : currentImportType === 'cross_cars' ? (
        /* Add Cross Cars Component */
        <FileoperationAddCrossCars
          onSuccess={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
            setHasUnsavedData(false); // Clear unsaved data flag on successful import
          }}
          onError={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
          }}
          onRefresh={() => setRefetch(!refetch)}
          onDataChange={(hasData) => setHasUnsavedData(hasData)}
        />
      ) : currentImportType === 'car_models' ? (
        /* Add Car Models Component */
        <FileoperationAddCarModels
          onSuccess={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
            setHasUnsavedData(false); // Clear unsaved data flag on successful import
          }}
          onError={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
          }}
          onRefresh={() => setRefetch(!refetch)}
          onDataChange={(hasData) => setHasUnsavedData(hasData)}
        />
      ) : currentImportType === 'product_names' ? (
        /* Add Product Names Component */
        <FileoperationAddProductNames
          onSuccess={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
            setHasUnsavedData(false); // Clear unsaved data flag on successful import
          }}
          onError={(message) => {
            setToastMessage(message);
            basicStickyNotification.current.showToast();
          }}
          onRefresh={() => setRefetch(!refetch)}
          onDataChange={(hasData) => setHasUnsavedData(hasData)}
        />
      ) : (
        /* Other Import Types - Generic Component */
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{importTypes[currentImportType]?.name}</h3>
                <p className="text-gray-600 mb-4">{importTypes[currentImportType]?.description}</p>
                
                {/* Requirements */}
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">{t("Required Columns")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {importTypes[currentImportType]?.requiredColumns.map((col, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {col}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    <strong>{t("Validation")}:</strong> {importTypes[currentImportType]?.validation}
                  </p>
                </div>
              </div>

              {!showPreview ? (
                /* File Upload Area */
                <div>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? "border-primary bg-primary/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Lucide icon="Upload" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
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
                </div>
              ) : (
                /* Preview and Validation Results */
                renderDataGrid()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
    </div>
  );
}
export default index_main;
