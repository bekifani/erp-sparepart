import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { Slideover, Dialog } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormTextarea, FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateProductstatusMutation,
  useDeleteProductstatusMutation,
  useEditProductstatusMutation,
  useGetProductstatussQuery,
} from "@/stores/apiSlice";
import clsx from "clsx";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import { useSelector } from "react-redux";

function ProductStatusIndex() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubStatusModal, setShowSubStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedParentStatus, setSelectedParentStatus] = useState(null);
  const [statusType, setStatusType] = useState('all'); // 'all', 'core', 'custom'
  const [confirmationMessage, setConfirmationMessage] = useState(t("Are you sure you want to delete this status?"));
  const [refetch, setRefetch] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const [
    createProductstatus,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductstatusMutation();
  const [
    updateProductstatus,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductstatusMutation();
  const [
    deleteProductstatus,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductstatusMutation();

  // Get core statuses for parent selection
  const { data: statusesResponse } = useGetProductstatussQuery({ type: 'core' });
  
  // Debug the response structure
  console.log('statusesResponse:', statusesResponse);
  
  // Handle different possible data structures
  let coreStatuses = [];
  if (statusesResponse) {
    if (Array.isArray(statusesResponse)) {
      coreStatuses = statusesResponse;
    } else if (statusesResponse.data) {
      if (Array.isArray(statusesResponse.data)) {
        coreStatuses = statusesResponse.data;
      } else if (statusesResponse.data.data && Array.isArray(statusesResponse.data.data)) {
        coreStatuses = statusesResponse.data.data;
      }
    }
  }
  
  // Filter for core statuses if not already filtered
  coreStatuses = coreStatuses.filter(status => status?.is_core_status === true);
  
  console.log('Processed coreStatuses:', coreStatuses);
  
  const basicStickyNotification = useRef();
  const user = useSelector((state) => state.auth.user);

  const hasPermission = (permission) => {
    return user.permissions.includes(permission);
  };

  // Table configuration for existing TableComponent
  const [data, setData] = useState([
    {
      title: t("Id"),
      minWidth: 50,
      responsive: 0,
      field: "id",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Status Key"),
      minWidth: 150,
      field: "status_key",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function (cell) {
        const value = cell.getValue();
        return `<span class="font-medium">${value || 'N/A'}</span>`;
      }
    },
    {
      title: t("Status Name"),
      minWidth: 200,
      field: "status_name_en",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        const isCoreStatus = rowData.is_core_status;
        const badge = isCoreStatus 
          ? '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">Core</span>'
          : '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2">Custom</span>';
        
        return `<div class="flex items-center">
          <span>${cell.getValue()}</span>
          ${badge}
        </div>`;
      }
    },
    {
      title: t("Description"),
      minWidth: 200,
      field: "description_en",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function (cell) {
        const value = cell.getValue();
        return value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'N/A';
      }
    },
    {
      title: t("Sub-Statuses"),
      minWidth: 120,
      field: "sub_statuses",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        const subStatusCount = rowData.sub_statuses ? rowData.sub_statuses.length : 0;
        return `<div class="flex items-center justify-center">
          <span class="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">${subStatusCount}</span>
        </div>`;
      }
    },
    {
      title: t("Status"),
      minWidth: 100,
      field: "is_active",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function (cell) {
        const isActive = cell.getValue();
        return isActive 
          ? '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>'
          : '<span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Inactive</span>';
      }
    },
    {
      title: t("Actions"),
      minWidth: 200,
      field: "actions",
      responsive: 1,
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: false,
      download: false,
      headerSort: false,
      formatter(cell) {
        const element = stringToHTML(
          `<div class="flex items-center lg:justify-center"></div>`
        );
        const rowData = cell.getRow().getData();
        const isCoreStatus = rowData.is_core_status;

        const editBtn = stringToHTML(`<a class="edit-btn flex items-center mr-3" href="javascript:;">
              <i data-lucide="edit" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Edit
            </a>`);

        const viewSubBtn = stringToHTML(`<a class="view-sub-btn flex items-center mr-3 text-primary" href="javascript:;">
              <i data-lucide="list" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Sub-Statuses
            </a>`);

        const deleteBtn = stringToHTML(`<a class="delete-btn flex items-center text-danger" href="javascript:;">
              <i data-lucide="trash-2" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Delete
            </a>`);

        editBtn.addEventListener("click", function () {
          handleEdit(rowData);
        });

        viewSubBtn.addEventListener("click", function () {
          handleViewSubStatuses(rowData);
        });

        if (!isCoreStatus) {
          deleteBtn.addEventListener("click", function () {
            handleDelete(rowData);
          });
        }

        if (hasPermission('product-edit')) {
          element.append(editBtn);
        }
        
        // Show sub-statuses button for core statuses (no permission check)
        if (isCoreStatus) {
          element.append(viewSubBtn);
        }
        
        if (hasPermission('product-delete') && !isCoreStatus) {
          element.append(deleteBtn);
        }
        
        return element;
      },
    },
  ]);

  const [searchColumns, setSearchColumns] = useState([
    'status_key', 
    'status_name_en', 
    'status_name_ch', 
    'status_name_az', 
    'description_en'
  ]);

  // Form validation schemas
  const statusSchema = yup.object({
    status_name_en: yup.string().required(t("English name is required")),
    status_name_ch: yup.string().nullable(),
    status_name_az: yup.string().nullable(),
    description_en: yup.string().nullable(),
    description_ch: yup.string().nullable(),
    description_az: yup.string().nullable(),
    color_code: yup.string().matches(/^#[0-9A-Fa-f]{6}$/, t("Invalid color code")).nullable(),
  });

  const {
    register: registerStatus,
    handleSubmit: handleSubmitStatus,
    formState: { errors: statusErrors },
    reset: resetStatus,
    setValue: setStatusValue,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(statusSchema),
  });

  // Event handlers
  const handleEdit = (status) => {
    setSelectedStatus(status);
    Object.keys(status).forEach((key) => {
      setStatusValue(key, status[key]);
    });
    setShowUpdateModal(true);
  };

  const handleDelete = (status) => {
    setSelectedStatus(status);
    Object.keys(status).forEach((key) => {
      setStatusValue(key, status[key]);
    });
    setConfirmationMessage(
      t("Are you sure you want to delete the status") + ` "${status.status_name_en}"?`
    );
    setShowDeleteModal(true);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleStatusTypeChange = (value) => {
    setStatusType(value);
    setRefetch(true); // Trigger table refresh
  };

  const handleViewSubStatuses = (status) => {
    setSelectedStatus(status);
    setShowSubStatusModal(true);
  };

  // Form submission handlers
  const onSubmitStatus = async (data) => {
    try {
      if (selectedStatus) {
        await updateProductstatus({ id: selectedStatus.id, ...data }).unwrap();
        setShowUpdateModal(false);
        resetStatus();
        setSelectedStatus(null);
        setRefetch(true);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const onCreateStatus = async (data) => {
    try {
      // Prepare data based on whether it's a sub-status or regular status
      let submitData = { ...data };
      
      if (selectedParentStatus) {
        // Creating a sub-status
        submitData = {
          ...data,
          parent_status_id: selectedParentStatus.id,
          sub_status_key: data.status_name_en.toLowerCase().replace(/\s+/g, '_'), // Auto-generate sub_status_key
        };
      }
      
      await createProductstatus(submitData).unwrap();
      setShowCreateModal(false);
      resetStatus();
      setSelectedParentStatus(null);
      setRefetch(true);
    } catch (error) {
      console.error("Error creating status:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      const statusToDelete = selectedStatus;
      
      // Debug logging to see what we have
      console.log('=== DELETE DEBUG ===');
      console.log('selectedStatus:', statusToDelete);
      console.log('selectedStatus.id:', statusToDelete?.id);
      console.log('getValues("id"):', getValues("id"));
      console.log('Form values:', getValues());
      
      // Try multiple ways to get the ID
      let id = statusToDelete?.id;
      if (!id) {
        id = getValues("id");
      }
      if (!id && statusToDelete) {
        // Sometimes the ID might be in a different field
        id = statusToDelete.sub_status_id || statusToDelete.status_id;
      }
      
      console.log('Final ID to use:', id);
      
      if (!id) {
        console.error('No ID found anywhere!');
        throw new Error('No ID found for status to delete');
      }
      
      // Check if this is a sub-status (has parent_status_id)
      if (statusToDelete?.parent_status_id) {
        // Use sub-status delete endpoint
        console.log('Deleting sub-status with endpoint:', `${app_url}/api/sub-status/${id}`);
        const response = await fetch(`${app_url}/api/sub-status/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } else {
        // Use regular status delete endpoint
        console.log('Deleting regular status with ID:', id);
        await deleteProductstatus(id).unwrap();
      }
      
      setShowDeleteModal(false);
      setSelectedStatus(null);
      setRefetch(prev => !prev);
    } catch (error) {
      console.error("Error deleting status:", error);
    }
  };

  // Effects for notifications
  useEffect(() => {
    if (success || updated) {
      basicStickyNotification.current?.showToast();
    }
  }, [success, updated]);

  useEffect(() => {
    if (deleted) {
      basicStickyNotification.current?.showToast();
    }
  }, [deleted]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("Product Statuses")}</h1>
          <p className="text-gray-600 mt-1">
            {t("Manage product workflow statuses and sub-statuses")}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Status Type Filter */}
          <FormSelect
            value={statusType}
            onChange={(e) => handleStatusTypeChange(e.target.value)}
            className="w-40"
          >
            <option value="all">{t("All Statuses")}</option>
            <option value="core">{t("Core Statuses")}</option>
            <option value="custom">{t("Custom Statuses")}</option>
          </FormSelect>
          {/* Add New Button */}
          <Button
            type="button"
            variant="primary"
            onClick={handleCreateNew}
          >
            <Lucide icon="Plus" className="w-4 h-4 mr-2" />
            {t("Add New")}
          </Button>
        </div>
      </div>

      {/* Core Status Information */}
      {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Lucide icon="Info" className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              {t("Core System Statuses")}
            </h3>
            <p className="text-sm text-blue-700">
              {t("The 12 core statuses form the backbone of the workflow and cannot be deleted. You can only edit their translations and descriptions. The 'Loading Goods' status locks editing of invoices and packing lists.")}
            </p>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <Can permission="product-list">
          <TableComponent
            key={`table-${statusType}`} // Force re-render when filter or key changes
            endpoint={`${app_url}/api/productstatus?type=${statusType}`}
            data={data}
            searchColumns={searchColumns}
            refetch={refetch}
            setRefetch={setRefetch}
            permission={"product"}
            hideCreateButton={true}
          />
        </Can>
      </div>

      {/* Create Status Modal */}
      <Slideover
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetStatus();
          setSelectedParentStatus(null);
        }}
      >
        <Slideover.Panel>
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("Create New Status")}</h2>
          </Slideover.Title>
          <Slideover.Description>
            <form onSubmit={handleSubmitStatus(onCreateStatus)} className="space-y-4">
              {/* Parent Status Selection */}
              <div>
                <FormLabel htmlFor="parent_status">{t("Status Type")}</FormLabel>
                <FormSelect
                  value={selectedParentStatus?.id || ''}
                  onChange={(e) => {
                    const parentId = e.target.value;
                    if (parentId) {
                      const parent = coreStatuses.find(s => s.id == parentId);
                      setSelectedParentStatus(parent);
                    } else {
                      setSelectedParentStatus(null);
                    }
                  }}
                  className="w-full"
                >
                  <option value="">{t("Custom Status (No Parent)")}</option>
                  {Array.isArray(coreStatuses) && coreStatuses.length > 0 && coreStatuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {t("Sub-status of")}: {status.status_name_en}
                    </option>
                  ))}
                </FormSelect>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedParentStatus 
                    ? t("Creating a sub-status under") + ` "${selectedParentStatus.status_name_en}"`
                    : t("Creating a custom status (not recommended - use sub-statuses instead)")
                  }
                </p>
              </div>

              {/* English Name */}
              <div>
                <FormLabel htmlFor="status_name_en">{t("English Name")} *</FormLabel>
                <FormInput
                  {...registerStatus("status_name_en")}
                  id="status_name_en"
                  type="text"
                  className={clsx({ "border-danger": statusErrors.status_name_en })}
                />
                {statusErrors.status_name_en && (
                  <div className="text-danger mt-2">{statusErrors.status_name_en.message}</div>
                )}
              </div>

              {/* Chinese Name */}
              <div>
                <FormLabel htmlFor="status_name_ch">{t("Chinese Name")}</FormLabel>
                <FormInput
                  {...registerStatus("status_name_ch")}
                  id="status_name_ch"
                  type="text"
                />
              </div>

              {/* Azerbaijani Name */}
              <div>
                <FormLabel htmlFor="status_name_az">{t("Azerbaijani Name")}</FormLabel>
                <FormInput
                  {...registerStatus("status_name_az")}
                  id="status_name_az"
                  type="text"
                />
              </div>

              {/* English Description */}
              {/* <div>
                <FormLabel htmlFor="description_en">{t("English Description")}</FormLabel>
                <FormTextarea
                  {...registerStatus("description_en")}
                  id="description_en"
                  rows={3}
                />
              </div> */}

              {/* Chinese Description */}
              {/* <div>
                <FormLabel htmlFor="description_ch">{t("Chinese Description")}</FormLabel>
                <FormTextarea
                  {...registerStatus("description_ch")}
                  id="description_ch"
                  rows={3}
                />
              </div> */}

              {/* Azerbaijani Description */}
              {/* <div>
                <FormLabel htmlFor="description_az">{t("Azerbaijani Description")}</FormLabel>
                <FormTextarea
                  {...registerStatus("description_az")}
                  id="description_az"
                  rows={3}
                />
              </div> */}

              {/* Color Code */}
              {/* <div>
                <FormLabel htmlFor="color_code">{t("Color Code")}</FormLabel>
                <FormInput
                  {...registerStatus("color_code")}
                  id="color_code"
                  type="color"
                  className="h-10"
                />
                {statusErrors.color_code && (
                  <div className="text-danger mt-2">{statusErrors.color_code.message}</div>
                )}
              </div> */}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetStatus();
                    setSelectedParentStatus(null);
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading && <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />}
                  {selectedParentStatus ? t("Create Sub-Status") : t("Create Status")}
                </Button>
              </div>
            </form>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>

      {/* Update Status Modal */}
      <Slideover
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          resetStatus();
          setSelectedStatus(null);
        }}
      >
        <Slideover.Panel>
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("Update Status")}: {selectedStatus?.status_name_en}</h2>
          </Slideover.Title>
          <Slideover.Description>
            <form onSubmit={handleSubmitStatus(onSubmitStatus)} className="space-y-4">
              {/* Core Status Warning */}
              {selectedStatus?.is_core_status && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start">
                    <Lucide icon="AlertTriangle" className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                    <p className="text-sm text-yellow-700">
                      {t("This is a core status. Only translations and descriptions can be modified.")}
                    </p>
                  </div>
                </div>
              )}

              {/* English Name */}
              <div>
                <FormLabel htmlFor="status_name_en">{t("English Name")} *</FormLabel>
                <FormInput
                  {...registerStatus("status_name_en")}
                  id="status_name_en"
                  type="text"
                  className={clsx({ "border-danger": statusErrors.status_name_en })}
                />
                {statusErrors.status_name_en && (
                  <div className="text-danger mt-2">{statusErrors.status_name_en.message}</div>
                )}
              </div>

              {/* Chinese Name */}
              <div>
                <FormLabel htmlFor="status_name_ch">{t("Chinese Name")}</FormLabel>
                <FormInput
                  {...registerStatus("status_name_ch")}
                  id="status_name_ch"
                  type="text"
                />
              </div>

              {/* Azerbaijani Name */}
              <div>
                <FormLabel htmlFor="status_name_az">{t("Azerbaijani Name")}</FormLabel>
                <FormInput
                  {...registerStatus("status_name_az")}
                  id="status_name_az"
                  type="text"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => {
                    setShowUpdateModal(false);
                    resetStatus();
                    setSelectedStatus(null);
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating && <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />}
                  {t("Update Status")}
                </Button>
              </div>
            </form>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>

      {/* Sub-Statuses Modal */}
      <Slideover
        open={showSubStatusModal}
        onClose={() => {
          setShowSubStatusModal(false);
          setSelectedStatus(null);
        }}
      >
        <Slideover.Panel>
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">
              {t("Sub-Statuses of")}: {selectedStatus?.status_name_en}
            </h2>
          </Slideover.Title>
          <Slideover.Description>
            <div className="space-y-4">
              {/* Add New Sub-Status Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{t("Sub-Statuses")}</h3>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedParentStatus(selectedStatus);
                    setShowSubStatusModal(false);
                    setShowCreateModal(true);
                  }}
                >
                  <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                  {t("Add Sub-Status")}
                </Button>
              </div>

              {/* Sub-Statuses List */}
              <div className="space-y-3">
                {selectedStatus?.sub_statuses && selectedStatus.sub_statuses.length > 0 ? (
                  selectedStatus.sub_statuses.map((subStatus) => (
                    <div key={subStatus.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{subStatus.status_name_en}</h4>
                          {subStatus.status_name_ch && (
                            <p className="text-sm text-gray-600">{t("Chinese")}: {subStatus.status_name_ch}</p>
                          )}
                          {subStatus.status_name_az && (
                            <p className="text-sm text-gray-600">{t("Azerbaijani")}: {subStatus.status_name_az}</p>
                          )}
                          {subStatus.description_en && (
                            <p className="text-sm text-gray-700 mt-2">{subStatus.description_en}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {t("Key")}: {subStatus.sub_status_key || subStatus.status_key}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => {
                              setShowSubStatusModal(false);
                              handleEdit(subStatus);
                            }}
                          >
                            <Lucide icon="edit" className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setSelectedStatus(subStatus);
                              setShowSubStatusModal(false);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Lucide icon="trash-2" className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Lucide icon="list" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>{t("No sub-statuses found for this status")}</p>
                    <p className="text-sm">{t("Click 'Add Sub-Status' to create one")}</p>
                  </div>
                )}
              </div>
            </div>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedStatus(null);
        }}
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">{t("Confirm Deletion")}</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-12">
              <p>{confirmationMessage}</p>
            </div>
          </Dialog.Description>
          <Dialog.Footer>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedStatus(null);
              }}
              className="w-20 mr-1"
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-20"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting && <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />}
              {t("Delete")}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Notifications */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        options={{ duration: 3000 }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">
          {success && t("Status created successfully")}
          {updated && t("Status updated successfully")}
          {deleted && t("Status deleted successfully")}
        </div>
      </Notification>
    </div>
  );
}

export default ProductStatusIndex;
