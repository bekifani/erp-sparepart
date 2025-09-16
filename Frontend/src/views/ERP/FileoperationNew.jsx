import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Button from "@/components/Base/Button";
import Lucide from "@/components/Base/Lucide";
import LoadingIcon from "@/components/Base/LoadingIcon";
import Notification from "@/components/Base/Notification";

function FileOperations() {
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
  
  const basicStickyNotification = useRef();
  const [toastMessage, setToastMessage] = useState("");

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
      }
    } catch (error) {
      console.error('Upload error:', error);
      setToastMessage(t("Error uploading file"));
      basicStickyNotification.current?.showToast();
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
        remove_duplicates: removeDuplicates
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
        loadImportHistory();
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

    return (
      <div className="mt-6">
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="primary"
            onClick={() => handleProcessImport(false)}
            disabled={loading || valid_rows.length === 0}
          >
            {loading ? <LoadingIcon icon="oval" className="w-4 h-4 mr-2" /> : null}
            {t("Import Valid Rows")} ({valid_rows.length})
          </Button>
          
          {duplicates.length > 0 && (
            <Button
              variant="warning"
              onClick={() => handleProcessImport(true)}
              disabled={loading}
            >
              {t("Import & Remove Duplicates")}
            </Button>
          )}
          
          {invalid_rows.length > 0 && (
            <Button
              variant="outline-secondary"
              onClick={handleExportInvalidRows}
            >
              <Lucide icon="Download" className="w-4 h-4 mr-2" />
              {t("Export Invalid Rows")}
            </Button>
          )}
          
          <Button
            variant="outline-secondary"
            onClick={() => {
              setShowPreview(false);
              setImportData(null);
              setValidationResult(null);
              setUploadedFile(null);
            }}
          >
            {t("Cancel")}
          </Button>
        </div>

        {/* Data preview table */}
        <div className="overflow-x-auto">
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="w-16">{t("Status")}</th>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>{t("Errors")}</th>
              </tr>
            </thead>
            <tbody>
              {/* Valid rows */}
              {valid_rows.slice(0, 50).map((row, index) => (
                <tr key={`valid-${index}`} className="bg-success/5">
                  <td>
                    <span className="badge badge-success">{t("Valid")}</span>
                  </td>
                  {row.data.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td></td>
                </tr>
              ))}
              
              {/* Invalid rows */}
              {invalid_rows.slice(0, 50).map((row, index) => (
                <tr key={`invalid-${index}`} className="bg-danger/5">
                  <td>
                    <span className="badge badge-danger">{t("Invalid")}</span>
                  </td>
                  {row.data.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <div className="text-xs text-danger">
                      {row.errors.join(', ')}
                    </div>
                  </td>
                </tr>
              ))}
              
              {/* Duplicate rows */}
              {duplicates.slice(0, 50).map((row, index) => (
                <tr key={`duplicate-${index}`} className="bg-warning/5">
                  <td>
                    <span className="badge badge-warning">{t("Duplicate")}</span>
                  </td>
                  {row.data.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    <div className="text-xs text-warning">
                      {row.error}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(valid_rows.length + invalid_rows.length + duplicates.length) > 50 && (
            <div className="text-center text-muted mt-4">
              {t("Showing first 50 rows of")} {valid_rows.length + invalid_rows.length + duplicates.length} {t("total rows")}
            </div>
          )}
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
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("added_files")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "added_files"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t("Added Files")}
            </button>
            {Object.entries(importTypes).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setCurrentImportType(key);
                }}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {config.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === "added_files" ? (
        /* History/Added Files Tab */
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">{t("Import History")}</h3>
              <div className="overflow-x-auto">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>{t("Date")}</th>
                      <th>{t("Section")}</th>
                      <th>{t("File name")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
                        <td>{importTypes[item.operation_type]?.name || item.operation_type}</td>
                        <td>{item.file_path.split('/').pop()}</td>
                        <td>
                          <span className={`badge ${
                            item.status === 'completed' ? 'badge-success' : 
                            item.status === 'failed' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline-primary">
                              <Lucide icon="Eye" className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline-danger">
                              <Lucide icon="Trash2" className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Import Tab Content */
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

export default FileOperations;
