
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
  useCreateWarehouseaccountMutation,
  useDeleteWarehouseaccountMutation,
  useEditWarehouseaccountMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import { useSelector } from "react-redux";
import { ClassicEditor } from "@/components/Base/Ckeditor";
import AddPaymentModal from "@/components/AddPaymentModal";


function index_main() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url)
  const upload_url = useSelector((state)=> state.auth.upload_url)
  const media_url = useSelector((state)=>state.auth.media_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Warehouseaccount"));

  
 const [
    createWarehouseaccount,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateWarehouseaccountMutation();
  const [
    updateWarehouseaccount,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditWarehouseaccountMutation();
  const [
    deleteWarehouseaccount,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteWarehouseaccountMutation()


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
      title: t("Trans Number"),
      minWidth: 200,
      field: "trans_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("User Id"),
      minWidth: 200,
      field: "user_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Warehouse Id"),
      minWidth: 200,
      field: "warehouse_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Supplier Id"),
      minWidth: 200,
      field: "supplier_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Amount"),
      minWidth: 200,
      field: "amount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Invoice Number"),
      minWidth: 200,
      field: "invoice_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Payment Status"),
      minWidth: 200,
      field: "payment_status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Account Type Id"),
      minWidth: 200,
      field: "account_type_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Payment Note Id"),
      minWidth: 200,
      field: "payment_note_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Picture Url"),
      minWidth: 200,
      field: "picture_url",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Additional Note"),
      minWidth: 200,
      field: "additional_note",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Balance"),
      minWidth: 200,
      field: "balance",
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
              <a class="edit-btn flex items-center mr-3" href="javascript:;">
                <i data-lucide="check-square" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Edit
              </a>`);
        const addPayment = stringToHTML(`
              <a class="add-payment-btn flex items-center mr-3 text-success" href="javascript:;">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Add Payment
              </a>`);
        const b = stringToHTML(`
              <a class="delete-btn flex items-center text-danger" href="javascript:;">
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
        addPayment.addEventListener("click", function () {
          const data = cell.getData();
          setSelectedEntity({
            customer_id: data.customer_id,
            supplier_id: data.supplier_id,
            name: data.customer_name || data.supplier_name || 'Warehouse Transaction'
          });
          setShowAddPaymentModal(true);
        });
        b.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowDeleteModal(true);
        });
        let permission = "warehouseaccount";
        if(hasPermission(permission+'-edit')){
          element.append(a)
        }
        if(hasPermission(permission+'-create')){
          element.append(addPayment)
        }
        if(hasPermission(permission+'-delete')){
          element.append(b)
        }
        return element;
      },
    },
]);
  const [searchColumns, setSearchColumns] = useState(['trans_number', 'user_id', 'warehouse_id', 'supplier_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance', ]);

  // schema
  const schema = yup
    .object({
     trans_number : yup.string().required(t('The Trans Number field is required')), 
user_id : yup.string().required(t('The User Id field is required')), 
warehouse_id : yup.string().required(t('The Warehouse Id field is required')), 
supplier_id : yup.string().required(t('The Supplier Id field is required')), 
invoice_number : yup.string().required(t('The Invoice Number field is required')), 
payment_status : yup.string().required(t('The Payment Status field is required')), 
account_type_id : yup.string().required(t('The Account Type Id field is required')), 
payment_note_id : yup.string().required(t('The Payment Note Id field is required')), 
picture_url : yup.string().required(t('The Picture Url field is required')), 
additional_note : yup.string().required(t('The Additional Note field is required')), 

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
      const response = await createWarehouseaccount(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Warehouseaccount created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating Warehouseaccount");
        
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
      let errorMessage = t("Error creating Warehouseaccount");
      
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
      console.log('🟡 Updating warehouseaccount with data:', data);
      const response = await updateWarehouseaccount(data);
      console.log('🟡 Update warehouseaccount response:', response);
        
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t('Warehouseaccount updated successfully'));
        setRefetch(true);
        setShowUpdateModal(false);
      } else {
        // Handle validation errors with comprehensive error extraction
        let errorMessage = t("Error updating Warehouseaccount");
        
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
      console.error('🔴 Update warehouseaccount error:', error);
      let errorMessage = t("Error updating Warehouseaccount");
      
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
      console.log('🔴 Deleting warehouseaccount with id:', id);
      const response = await deleteWarehouseaccount(id);
      console.log('🔴 Delete warehouseaccount response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Warehouseaccount deleted successfully."));
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
          setToastMessage(`${t("Error deleting Warehouseaccount")}: ${errorMsg}`);
        }
        console.error('🔴 Delete failed with response:', response);
      }
    } catch (error) {
      console.error('🔴 Delete warehouseaccount error:', error);
      let errorMessage = t("Error deleting Warehouseaccount");
      
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Warehouseaccount")}</h2>
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
                        {t("Trans Number")}
                      </FormLabel>
                      <FormInput
                        {...register("trans_number")}
                        id="validation-form-1"
                        type="text"
                        name="trans_number"
                        className={clsx({
                          "border-danger": errors.trans_number,
                        })}
                        placeholder={t("Enter trans_number")}
                      />
                      {errors.trans_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.trans_number.message === "string" &&
                            errors.trans_number.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("User Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="user_id"/>
      {errors.user_id && (
        <div className="mt-2 text-danger">
          {typeof errors.user_id.message === "string" &&
            errors.user_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Warehouse Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_warehouse`} 
        setValue={setValue} 
        variable="warehouse_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.name || item.warehouse_name || item.location || String(item.id)
        })}
      />
      {errors.warehouse_id && (
        <div className="mt-2 text-danger">
          {typeof errors.warehouse_id.message === "string" &&
            errors.warehouse_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_supplier`} 
        setValue={setValue} 
        variable="supplier_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.company_name || item.name || item.email || String(item.id)
        })}
      />
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("amount")}
                        id="validation-form-1"
                        type="number"
                        name="amount"
                        className={clsx({
                          "border-danger": errors.amount,
                        })}
                        placeholder={t("Enter amount")}
                      />
                      {errors.amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.amount.message === "string" &&
                            errors.amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Invoice Number")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_number")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_number"
                        className={clsx({
                          "border-danger": errors.invoice_number,
                        })}
                        placeholder={t("Enter invoice_number")}
                      />
                      {errors.invoice_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_number.message === "string" &&
                            errors.invoice_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Status")}
                      </FormLabel>
                      <FormInput
                        {...register("payment_status")}
                        id="validation-form-1"
                        type="text"
                        name="payment_status"
                        className={clsx({
                          "border-danger": errors.payment_status,
                        })}
                        placeholder={t("Enter payment_status")}
                      />
                      {errors.payment_status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_status.message === "string" &&
                            errors.payment_status.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Account Type Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_accounttype`} 
        setValue={setValue} 
        variable="account_type_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.name || item.name_ch || item.name_az || String(item.id)
        })}
      />
      {errors.account_type_id && (
        <div className="mt-2 text-danger">
          {typeof errors.account_type_id.message === "string" &&
            errors.account_type_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Payment Note Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_paymentnote`} 
        setValue={setValue} 
        variable="payment_note_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.note || item.note_ch || item.note_az || String(item.id)
        })}
      />
      {errors.payment_note_id && (
        <div className="mt-2 text-danger">
          {typeof errors.payment_note_id.message === "string" &&
            errors.payment_note_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Picture Url")}
                      </FormLabel>
                      <FormInput
                        {...register("picture_url")}
                        id="validation-form-1"
                        type="text"
                        name="picture_url"
                        className={clsx({
                          "border-danger": errors.picture_url,
                        })}
                        placeholder={t("Enter picture_url")}
                      />
                      {errors.picture_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.picture_url.message === "string" &&
                            errors.picture_url.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Additional Note")}
                      </FormLabel>
                      <FormInput
                        {...register("additional_note")}
                        id="validation-form-1"
                        type="text"
                        name="additional_note"
                        className={clsx({
                          "border-danger": errors.additional_note,
                        })}
                        placeholder={t("Enter additional_note")}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" &&
                            errors.additional_note.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Balance")}
                      </FormLabel>
                      <FormInput
                        {...register("balance")}
                        id="validation-form-1"
                        type="number"
                        name="balance"
                        className={clsx({
                          "border-danger": errors.balance,
                        })}
                        placeholder={t("Enter balance")}
                      />
                      {errors.balance && (
                        <div className="mt-2 text-danger">
                          {typeof errors.balance.message === "string" &&
                            errors.balance.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Warehouseaccount")}</h2>
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
                        {t("Trans Number")}
                      </FormLabel>
                      <FormInput
                        {...register("trans_number")}
                        id="validation-form-1"
                        type="text"
                        name="trans_number"
                        className={clsx({
                          "border-danger": errors.trans_number,
                        })}
                        placeholder={t("Enter trans_number")}
                      />
                      {errors.trans_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.trans_number.message === "string" &&
                            errors.trans_number.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("User Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="user_id"/>
      {errors.user_id && (
        <div className="mt-2 text-danger">
          {typeof errors.user_id.message === "string" &&
            errors.user_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Warehouse Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_warehouse`} 
        setValue={setValue} 
        variable="warehouse_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.name || item.warehouse_name || item.location || String(item.id)
        })}
      />
      {errors.warehouse_id && (
        <div className="mt-2 text-danger">
          {typeof errors.warehouse_id.message === "string" &&
            errors.warehouse_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_supplier`} 
        setValue={setValue} 
        variable="supplier_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.company_name || item.name || item.email || String(item.id)
        })}
      />
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("amount")}
                        id="validation-form-1"
                        type="number"
                        name="amount"
                        className={clsx({
                          "border-danger": errors.amount,
                        })}
                        placeholder={t("Enter amount")}
                      />
                      {errors.amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.amount.message === "string" &&
                            errors.amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Invoice Number")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_number")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_number"
                        className={clsx({
                          "border-danger": errors.invoice_number,
                        })}
                        placeholder={t("Enter invoice_number")}
                      />
                      {errors.invoice_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_number.message === "string" &&
                            errors.invoice_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Status")}
                      </FormLabel>
                      <FormInput
                        {...register("payment_status")}
                        id="validation-form-1"
                        type="text"
                        name="payment_status"
                        className={clsx({
                          "border-danger": errors.payment_status,
                        })}
                        placeholder={t("Enter payment_status")}
                      />
                      {errors.payment_status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_status.message === "string" &&
                            errors.payment_status.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Account Type Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_accounttype`} 
        setValue={setValue} 
        variable="account_type_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.name || item.name_ch || item.name_az || String(item.id)
        })}
      />
      {errors.account_type_id && (
        <div className="mt-2 text-danger">
          {typeof errors.account_type_id.message === "string" &&
            errors.account_type_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Payment Note Id")}
      </FormLabel>
      <TomSelectSearch 
        apiUrl={`${app_url}/api/search_paymentnote`} 
        setValue={setValue} 
        variable="payment_note_id"
        customDataMapping={(item) => ({
          value: item.id,
          text: item.note || item.note_ch || item.note_az || String(item.id)
        })}
      />
      {errors.payment_note_id && (
        <div className="mt-2 text-danger">
          {typeof errors.payment_note_id.message === "string" &&
            errors.payment_note_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Picture Url")}
                      </FormLabel>
                      <FormInput
                        {...register("picture_url")}
                        id="validation-form-1"
                        type="text"
                        name="picture_url"
                        className={clsx({
                          "border-danger": errors.picture_url,
                        })}
                        placeholder={t("Enter picture_url")}
                      />
                      {errors.picture_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.picture_url.message === "string" &&
                            errors.picture_url.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Additional Note")}
                      </FormLabel>
                      <FormInput
                        {...register("additional_note")}
                        id="validation-form-1"
                        type="text"
                        name="additional_note"
                        className={clsx({
                          "border-danger": errors.additional_note,
                        })}
                        placeholder={t("Enter additional_note")}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" &&
                            errors.additional_note.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Balance")}
                      </FormLabel>
                      <FormInput
                        {...register("balance")}
                        id="validation-form-1"
                        type="number"
                        name="balance"
                        className={clsx({
                          "border-danger": errors.balance,
                        })}
                        placeholder={t("Enter balance")}
                      />
                      {errors.balance && (
                        <div className="mt-2 text-danger">
                          {typeof errors.balance.message === "string" &&
                            errors.balance.message}
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
      <Can permission="warehouseaccount-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/warehouseaccount"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Warehouseaccount"}
        />
      </Can>
      
      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={showAddPaymentModal}
        onClose={() => {
          setShowAddPaymentModal(false);
          setSelectedEntity(null);
        }}
        accountType="warehouse"
        entityId={selectedEntity?.customer_id || selectedEntity?.supplier_id}
        entityName={selectedEntity?.name}
        onPaymentAdded={(newPayment) => {
          setRefetch(!refetch);
          setShowAddPaymentModal(false);
          setSelectedEntity(null);
        }}
      />
    </div>
  );
}
export default index_main;
