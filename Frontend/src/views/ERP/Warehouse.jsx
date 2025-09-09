
import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormTextarea , FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateWarehouseMutation,
  useDeleteWarehouseMutation,
  useEditWarehouseMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import { useSelector } from "react-redux";
import { ClassicEditor } from "@/components/Base/Ckeditor";


function index_main() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url)
  const upload_url = useSelector((state)=> state.auth.upload_url)
  const media_url = useSelector((state)=>state.auth.media_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Warehouse"));

  
 const [
    createWarehouse,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateWarehouseMutation();
  const [
    updateWarehouse,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditWarehouseMutation();
  const [
    deleteWarehouse,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteWarehouseMutation()


  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = (permission) => {
    return user.permissions.includes(permission)
  }
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
      title: t("Warehouse Name"),
      minWidth: 200,
      field: "warehouse_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Location"),
      minWidth: 200,
      field: "location",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Capacity"),
      minWidth: 200,
      field: "capacity",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Remark"),
      minWidth: 200,
      field: "remark",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Is Active"),
      minWidth: 200,
      field: "is_active",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
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
        const a =
          stringToHTML(`<div class="flex items-center lg:justify-center">
              <a class="delete-btn flex items-center mr-3" href="javascript:;">
                <i data-lucide="check-square" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Edit
              </a>`);
        const b = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Delete
              </a>
            </div>`);
        a.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowUpdateModal(true);
        });
        b.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowDeleteModal(true);
        });
        let permission = "warehouse";
        if(hasPermission(permission+'-edit')){
          element.append(a)
        }
        if(hasPermission(permission+'-delete')){
          element.append(b)
        }
        return element;
      },
    },
]);
  const [searchColumns, setSearchColumns] = useState(['warehouse_name', 'location', 'capacity', 'remark', 'is_active', ]);

  // schema
  const schema = yup
    .object({
     warehouse_name : yup.string().required(t('The Warehouse Name field is required')), 
location : yup.string().required(t('The Location field is required')), 
remark : yup.string().required(t('The Remark field is required')), 
is_active : yup.string().required(t('The Is Active field is required')), 

    })
    .required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

   


  const [refetch, setRefetch] = useState(false);
  const getMiniDisplay = (url) => {
    let data = app_url +'/api/file/' + url;
    
    const fileExtension = data.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    let element;
    
    if (imageExtensions.includes(fileExtension)) {
      element = (
        // <DynamicImage imagePath={url} token={token}/>
        <img data-action="zoom" src={media_url + url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-md"/>
      );
    } else if (videoExtensions.includes(fileExtension)) {
      element = <Lucide icon="Film" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="block mx-auto" />;
    } else {
      element = (
        <a href={data} target="_blank" rel="noopener noreferrer">
          <Lucide icon="File" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="block mx-auto" />
        </a>
      );
    }

    return ReactDOMServer.renderToString(element); // Convert JSX to HTML string
  };

    const onCreate = async (data) => {
    console.log('🟡 onCreate called with data:', data);
    console.log('🟡 Form errors:', errors);
    console.log('🟡 Current form values:', getValues());
    console.log('🟡 Form is valid:', Object.keys(errors).length === 0);
    
    // Check if form has validation errors
    if (Object.keys(errors).length > 0) {
      console.error('🔴 Form has validation errors:', errors);
      setToastMessage(t("Please fix the form errors before submitting"));
      basicStickyNotification.current?.showToast();
      return;
    }
    
    try {
      const response = await createWarehouse(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Warehouse created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating Warehouse");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,  // RTK Query error structure
          response?.data?.data?.errors,         // Direct API response
          response?.error?.data?.errors,        // Alternative error structure
          response?.data?.errors                // Simple error structure
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {
          if (errorSource && typeof errorSource === 'object') {
            validationErrors = errorSource;
            break;
          }
        }
        
        if (validationErrors) {
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {
            // Get the first validation error message
            const firstFieldErrors = validationErrors[errorFields[0]];
            if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
              errorMessage = firstFieldErrors[0];
            } else if (typeof firstFieldErrors === 'string') {
              errorMessage = firstFieldErrors;
            }
          }
        } else {
          // Handle parsing errors (when server returns HTML instead of JSON)
          if (response?.error?.status === "PARSING_ERROR") {
            errorMessage = t("Server error occurred. Please try again later or contact support.");
          } else {
            // Fallback to general error messages
            const generalErrorSources = [
              response?.error?.data?.message,
              response?.data?.message,
              response?.message,
              response?.error?.error
            ];
            
            for (const errorSource of generalErrorSources) {
              if (errorSource && typeof errorSource === 'string') {
                errorMessage = errorSource;
                break;
              }
            }
          }
        }
        
        setToastMessage(errorMessage);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      }
    } catch (error) {
      console.error('🔴 Exception in onCreate:', error);
      let errorMessage = t("Error creating Warehouse");
      
      // Check multiple possible error structures in catch block
      const errorSources = [
        error?.error?.data?.data?.errors,
        error?.error?.data?.errors,
        error?.response?.data?.data?.errors,
        error?.response?.data?.errors,
        error?.data?.data?.errors,
        error?.data?.errors
      ];
      
      let validationErrors = null;
      for (const errorSource of errorSources) {
        if (errorSource && typeof errorSource === 'object') {
          validationErrors = errorSource;
          break;
        }
      }
      
      if (validationErrors) {
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {
          const firstFieldErrors = validationErrors[errorFields[0]];
          if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
            errorMessage = firstFieldErrors[0];
          } else if (typeof firstFieldErrors === 'string') {
            errorMessage = firstFieldErrors;
          }
        }
      } else {
        // Handle parsing errors in catch block
        if (error?.error?.status === "PARSING_ERROR") {
          errorMessage = t("Server error occurred. Please try again later or contact support.");
        } else {
          // Fallback to general error messages
          const generalErrorSources = [
            error?.error?.data?.message,
            error?.response?.data?.message,
            error?.data?.message,
            error?.message
          ];
          
          for (const errorSource of generalErrorSources) {
            if (errorSource && typeof errorSource === 'string') {
              errorMessage = errorSource;
              break;
            }
          }
        }
      }
      
      setToastMessage(errorMessage);
      basicStickyNotification.current?.showToast();
      // Auto-hide toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current?.hideToast();
      }, 7000);
    }
  };;

    const onUpdate = async (data) => {
    try {
      console.log('🟡 Updating warehouse with data:', data);
      const response = await updateWarehouse(data);
      console.log('🟡 Update warehouse response:', response);
        
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t('Warehouse updated successfully'));
        setRefetch(true);
        setShowUpdateModal(false);
      } else {
        // Handle validation errors with comprehensive error extraction
        let errorMessage = t("Error updating Warehouse");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,  // RTK Query error structure
          response?.data?.data?.errors,         // Direct API response
          response?.error?.data?.errors,        // Alternative error structure
          response?.data?.errors                // Simple error structure
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {
          if (errorSource && typeof errorSource === 'object') {
            validationErrors = errorSource;
            break;
          }
        }
        
        if (validationErrors) {
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {
            // Get the first validation error message
            const firstFieldErrors = validationErrors[errorFields[0]];
            if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
              errorMessage = firstFieldErrors[0];
            } else if (typeof firstFieldErrors === 'string') {
              errorMessage = firstFieldErrors;
            }
          }
        } else {
          // Handle parsing errors (when server returns HTML instead of JSON)
          if (response?.error?.status === "PARSING_ERROR") {
            errorMessage = t("Server error occurred. Please try again later or contact support.");
          } else {
            // Fallback to general error messages
            const generalErrorSources = [
              response?.error?.data?.message,
              response?.data?.message,
              response?.message,
              response?.error?.error
            ];
            
            for (const errorSource of generalErrorSources) {
              if (errorSource && typeof errorSource === 'string') {
                errorMessage = errorSource;
                break;
              }
            }
          }
        }
        
        setToastMessage(errorMessage);
        console.error('🔴 Update failed with response:', response);
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error('🔴 Update warehouse error:', error);
      let errorMessage = t("Error updating Warehouse");
      
      // Check multiple possible error structures in catch block
      const errorSources = [
        error?.error?.data?.data?.errors,
        error?.error?.data?.errors,
        error?.response?.data?.data?.errors,
        error?.response?.data?.errors,
        error?.data?.data?.errors,
        error?.data?.errors
      ];
      
      let validationErrors = null;
      for (const errorSource of errorSources) {
        if (errorSource && typeof errorSource === 'object') {
          validationErrors = errorSource;
          break;
        }
      }
      
      if (validationErrors) {
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {
          const firstFieldErrors = validationErrors[errorFields[0]];
          if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
            errorMessage = firstFieldErrors[0];
          } else if (typeof firstFieldErrors === 'string') {
            errorMessage = firstFieldErrors;
          }
        }
      } else {
        // Handle parsing errors in catch block
        if (error?.error?.status === "PARSING_ERROR") {
          errorMessage = t("Server error occurred. Please try again later or contact support.");
        } else {
          // Fallback to general error messages
          const generalErrorSources = [
            error?.error?.data?.message,
            error?.response?.data?.message,
            error?.data?.message,
            error?.message
          ];
          
          for (const errorSource of generalErrorSources) {
            if (errorSource && typeof errorSource === 'string') {
              errorMessage = errorSource;
              break;
            }
          }
        }
      }
      
      setToastMessage(errorMessage);
      setShowUpdateModal(true);
    }
      
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  };;

    const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false);
    
    try {
      console.log('🔴 Deleting warehouse with id:', id);
      const response = await deleteWarehouse(id);
      console.log('🔴 Delete warehouse response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Warehouse deleted successfully."));
        setRefetch(true);
      } else {
        // Handle validation errors specifically
        if (response?.error?.data?.data?.errors) {
          const validationErrors = response.error.data.data.errors;
          const errorFields = Object.keys(validationErrors);
          if (errorFields.length > 0) {
            const firstError = validationErrors[errorFields[0]][0];
            setToastMessage(firstError);
          }
        } else {
          const errorMsg = response?.error?.data?.message || response?.message || response?.error || 'Unknown error occurred';
          setToastMessage(`${t("Error deleting Warehouse")}: ${errorMsg}`);
        }
        console.error('🔴 Delete failed with response:', response);
      }
    } catch (error) {
      console.error('🔴 Delete warehouse error:', error);
      let errorMessage = t("Error deleting Warehouse");
      
      if (error?.error?.data?.data?.errors) {
        // Handle validation errors from error.error.data.data.errors structure
        const validationErrors = error.error.data.data.errors;
        const errorFields = Object.keys(validationErrors);
        if (errorFields.length > 0) {
          const firstError = validationErrors[errorFields[0]][0];
          errorMessage = firstError;
        }
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = `${t("Error")}: ${error.message}`;
      }
      
      setToastMessage(errorMessage);
    }
    
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  };;    

return (
    <div>
      <Slideover
        size="xl"
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <Slideover.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">{t("Are you sure?")}</div>
            <div className="mt-2 text-slate-500">{confirmationMessage}</div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setShowDeleteModal(false);
              }}
              className="w-24 mr-1"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-24"
              onClick={() => onDelete()}
            >
              {t("Delete")}
            </Button>
          </div>
        </Slideover.Panel>
      </Slideover>


      <Slideover
        size="xl"
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
      >
        <Slideover.Panel className="text-center">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Warehouse")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-2 gap-4 gap-y-3">
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Warehouse Name")}
                      </FormLabel>
                      <FormInput
                        {...register("warehouse_name")}
                        id="validation-form-1"
                        type="text"
                        name="warehouse_name"
                        className={clsx({
                          "border-danger": errors.warehouse_name,
                        })}
                        placeholder={t("Enter warehouse_name")}
                      />
                      {errors.warehouse_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.warehouse_name.message === "string" &&
                            errors.warehouse_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Location")}
                      </FormLabel>
                      <FormInput
                        {...register("location")}
                        id="validation-form-1"
                        type="text"
                        name="location"
                        className={clsx({
                          "border-danger": errors.location,
                        })}
                        placeholder={t("Enter location")}
                      />
                      {errors.location && (
                        <div className="mt-2 text-danger">
                          {typeof errors.location.message === "string" &&
                            errors.location.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Capacity")}
                      </FormLabel>
                      <FormInput
                        {...register("capacity")}
                        id="validation-form-1"
                        type="number"
                        name="capacity"
                        className={clsx({
                          "border-danger": errors.capacity,
                        })}
                        placeholder={t("Enter capacity")}
                      />
                      {errors.capacity && (
                        <div className="mt-2 text-danger">
                          {typeof errors.capacity.message === "string" &&
                            errors.capacity.message}
                        </div>
                      )}
                    </div>


  <div className="mt-3 input-form">
        <FormLabel
          htmlFor="validation-form-6"
          className="flex flex-col w-full sm:flex-row"
        >
          {t("Remark")}
        </FormLabel>
        <FormTextarea
          {...register("remark")}
          id="validation-form-6"
          name="remark"
          className={clsx({
            "border-danger": errors.remark,
          })}
          placeholder={t("remark")}
        ></FormTextarea>
        {errors.remark && (
          <div className="mt-2 text-danger">
            {typeof errors.remark.message ===
              "string" && errors.remark.message}
          </div>
        )}
      </div>

 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Active")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            /> Active
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> Inactive
      </div>
          </div>
      {errors.is_active && (
        <div className="mt-2 text-danger">
          {typeof errors.is_active.message === "string" &&
            errors.is_active.message}
        </div>
      )}
    </div>
    

                  </div>
                      )}
              </div>
            </Slideover.Description>
            <Slideover.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                }}
                className="w-20 mx-2"
              >
                {t("Cancel")}
              </Button>
              <Button variant="primary" type="submit" className="w-20">
                {t("Save")}
              </Button>
            </Slideover.Footer>
          </form>
        </Slideover.Panel>
      </Slideover>
      <Slideover
        size="xl"
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
      >
        <Slideover.Panel className="text-center">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Warehouse")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-1  gap-4 gap-y-3">
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Warehouse Name")}
                      </FormLabel>
                      <FormInput
                        {...register("warehouse_name")}
                        id="validation-form-1"
                        type="text"
                        name="warehouse_name"
                        className={clsx({
                          "border-danger": errors.warehouse_name,
                        })}
                        placeholder={t("Enter warehouse_name")}
                      />
                      {errors.warehouse_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.warehouse_name.message === "string" &&
                            errors.warehouse_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Location")}
                      </FormLabel>
                      <FormInput
                        {...register("location")}
                        id="validation-form-1"
                        type="text"
                        name="location"
                        className={clsx({
                          "border-danger": errors.location,
                        })}
                        placeholder={t("Enter location")}
                      />
                      {errors.location && (
                        <div className="mt-2 text-danger">
                          {typeof errors.location.message === "string" &&
                            errors.location.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Capacity")}
                      </FormLabel>
                      <FormInput
                        {...register("capacity")}
                        id="validation-form-1"
                        type="number"
                        name="capacity"
                        className={clsx({
                          "border-danger": errors.capacity,
                        })}
                        placeholder={t("Enter capacity")}
                      />
                      {errors.capacity && (
                        <div className="mt-2 text-danger">
                          {typeof errors.capacity.message === "string" &&
                            errors.capacity.message}
                        </div>
                      )}
                    </div>


  <div className="mt-3 input-form">
        <FormLabel
          htmlFor="validation-form-6"
          className="flex flex-col w-full sm:flex-row"
        >
          {t("Remark")}
        </FormLabel>
        <FormTextarea
          {...register("remark")}
          id="validation-form-6"
          name="remark"
          className={clsx({
            "border-danger": errors.remark,
          })}
          placeholder={t("remark")}
        ></FormTextarea>
        {errors.remark && (
          <div className="mt-2 text-danger">
            {typeof errors.remark.message ===
              "string" && errors.remark.message}
          </div>
        )}
      </div>

 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Active")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            /> Active
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> Inactive
      </div>
          </div>
      {errors.is_active && (
        <div className="mt-2 text-danger">
          {typeof errors.is_active.message === "string" &&
            errors.is_active.message}
        </div>
      )}
    </div>
    

                  </div>
                )}
              </div>
            </Slideover.Description>
            <Slideover.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setShowUpdateModal(false);
                }}
                className="w-20 mx-2"
              >
                {t("Cancel")}
              </Button>
              <Button variant="primary" type="submit" className="w-20">
                {t("Update")}
              </Button>
            </Slideover.Footer>
          </form>
        </Slideover.Panel>
      </Slideover>
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
      <Can permission="warehouse-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/warehouse"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Warehouse"}
        />
      </Can>
    </div>
  );
}
export default index_main;
