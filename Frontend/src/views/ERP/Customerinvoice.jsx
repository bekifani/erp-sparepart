
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
  useCreateCustomerinvoiceMutation,
  useDeleteCustomerinvoiceMutation,
  useEditCustomerinvoiceMutation,
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
    useState(t("Are you Sure Do You want to Delete Customerinvoice"));

  
 const [
    createCustomerinvoice,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCustomerinvoiceMutation();
  const [
    updateCustomerinvoice,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCustomerinvoiceMutation();
  const [
    deleteCustomerinvoice,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCustomerinvoiceMutation()


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
      title: t("Invoice No"),
      minWidth: 200,
      field: "invoice_no",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Id"),
      minWidth: 200,
      field: "customer_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Company Name"),
      minWidth: 200,
      field: "company_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Name"),
      minWidth: 200,
      field: "customer_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Country"),
      minWidth: 200,
      field: "country",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Address"),
      minWidth: 200,
      field: "address",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Tax Id"),
      minWidth: 200,
      field: "tax_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Phone Number"),
      minWidth: 200,
      field: "phone_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Email"),
      minWidth: 200,
      field: "email",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Shipping Mark"),
      minWidth: 200,
      field: "shipping_mark",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Shipped Date"),
      minWidth: 200,
      field: "shipped_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Language"),
      minWidth: 200,
      field: "language",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Qty"),
      minWidth: 200,
      field: "total_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Net Weight"),
      minWidth: 200,
      field: "total_net_weight",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Gross Weight"),
      minWidth: 200,
      field: "total_gross_weight",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Volume"),
      minWidth: 200,
      field: "total_volume",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Amount"),
      minWidth: 200,
      field: "total_amount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Discount"),
      minWidth: 200,
      field: "discount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Deposit"),
      minWidth: 200,
      field: "deposit",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Extra Expenses"),
      minWidth: 200,
      field: "extra_expenses",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Debt"),
      minWidth: 200,
      field: "customer_debt",
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
      title: t("Status"),
      minWidth: 200,
      field: "status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Attached File"),
      minWidth: 200,
      field: "attached_file",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Created By"),
      minWidth: 200,
      field: "created_by",
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
        let permission = "customerinvoice";
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
  const [searchColumns, setSearchColumns] = useState(['invoice_no', 'customer_id', 'company_name', 'customer_name', 'country', 'address', 'tax_id', 'phone_number', 'email', 'shipping_mark', 'shipped_date', 'language', 'total_qty', 'total_net_weight', 'total_gross_weight', 'total_volume', 'total_amount', 'discount', 'deposit', 'extra_expenses', 'customer_debt', 'balance', 'status', 'attached_file', 'created_by', ]);

  // schema
  const schema = yup
    .object({
     invoice_no : yup.string().required(t('The Invoice No field is required')), 
customer_id : yup.string().required(t('The Customer Id field is required')), 
company_name : yup.string().required(t('The Company Name field is required')), 
customer_name : yup.string().required(t('The Customer Name field is required')), 
country : yup.string().required(t('The Country field is required')), 
address : yup.string().required(t('The Address field is required')), 
tax_id : yup.string().required(t('The Tax Id field is required')), 
phone_number : yup.string().required(t('The Phone Number field is required')), 
shipping_mark : yup.string().required(t('The Shipping Mark field is required')), 
language : yup.string().required(t('The Language field is required')), 
status : yup.string().required(t('The Status field is required')), 
attached_file : yup.string().required(t('The Attached File field is required')), 
created_by : yup.string().required(t('The Created By field is required')), 

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
      const response = await createCustomerinvoice(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Customerinvoice created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating Customerinvoice");
        
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
      let errorMessage = t("Error creating Customerinvoice");
      
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
      console.log('🟡 Updating customerinvoice with data:', data);
      const response = await updateCustomerinvoice(data);
      console.log('🟡 Update customerinvoice response:', response);
        
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t('Customerinvoice updated successfully'));
        setRefetch(true);
        setShowUpdateModal(false);
      } else {
        // Handle validation errors with comprehensive error extraction
        let errorMessage = t("Error updating Customerinvoice");
        
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
      console.error('🔴 Update customerinvoice error:', error);
      let errorMessage = t("Error updating Customerinvoice");
      
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
      console.log('🔴 Deleting customerinvoice with id:', id);
      const response = await deleteCustomerinvoice(id);
      console.log('🔴 Delete customerinvoice response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Customerinvoice deleted successfully."));
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
          setToastMessage(`${t("Error deleting Customerinvoice")}: ${errorMsg}`);
        }
        console.error('🔴 Delete failed with response:', response);
      }
    } catch (error) {
      console.error('🔴 Delete customerinvoice error:', error);
      let errorMessage = t("Error deleting Customerinvoice");
      
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Customerinvoice")}</h2>
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
                        {t("Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_no"
                        className={clsx({
                          "border-danger": errors.invoice_no,
                        })}
                        placeholder={t("Enter invoice_no")}
                      />
                      {errors.invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_no.message === "string" &&
                            errors.invoice_no.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      {errors.customer_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_id.message === "string" &&
            errors.customer_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Name")}
                      </FormLabel>
                      <FormInput
                        {...register("company_name")}
                        id="validation-form-1"
                        type="text"
                        name="company_name"
                        className={clsx({
                          "border-danger": errors.company_name,
                        })}
                        placeholder={t("Enter company_name")}
                      />
                      {errors.company_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_name.message === "string" &&
                            errors.company_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Name")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_name")}
                        id="validation-form-1"
                        type="text"
                        name="customer_name"
                        className={clsx({
                          "border-danger": errors.customer_name,
                        })}
                        placeholder={t("Enter customer_name")}
                      />
                      {errors.customer_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_name.message === "string" &&
                            errors.customer_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Country")}
                      </FormLabel>
                      <FormInput
                        {...register("country")}
                        id="validation-form-1"
                        type="text"
                        name="country"
                        className={clsx({
                          "border-danger": errors.country,
                        })}
                        placeholder={t("Enter country")}
                      />
                      {errors.country && (
                        <div className="mt-2 text-danger">
                          {typeof errors.country.message === "string" &&
                            errors.country.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Address")}
                      </FormLabel>
                      <FormInput
                        {...register("address")}
                        id="validation-form-1"
                        type="text"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder={t("Enter address")}
                      />
                      {errors.address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.address.message === "string" &&
                            errors.address.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Id")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_id")}
                        id="validation-form-1"
                        type="text"
                        name="tax_id"
                        className={clsx({
                          "border-danger": errors.tax_id,
                        })}
                        placeholder={t("Enter tax_id")}
                      />
                      {errors.tax_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_id.message === "string" &&
                            errors.tax_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="validation-form-1"
                        type="text"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone_number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Email")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="validation-form-1"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Mark")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_mark")}
                        id="validation-form-1"
                        type="text"
                        name="shipping_mark"
                        className={clsx({
                          "border-danger": errors.shipping_mark,
                        })}
                        placeholder={t("Enter shipping_mark")}
                      />
                      {errors.shipping_mark && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_mark.message === "string" &&
                            errors.shipping_mark.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipped Date")}
                      </FormLabel>
                      <FormInput
                        {...register("shipped_date")}
                        id="validation-form-1"
                        type="date"
                        name="shipped_date"
                        className={clsx({
                          "border-danger": errors.shipped_date,
                        })}
                        placeholder={t("Enter shipped_date")}
                      />
                      {errors.shipped_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipped_date.message === "string" &&
                            errors.shipped_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Language")}
                      </FormLabel>
                      <FormInput
                        {...register("language")}
                        id="validation-form-1"
                        type="text"
                        name="language"
                        className={clsx({
                          "border-danger": errors.language,
                        })}
                        placeholder={t("Enter language")}
                      />
                      {errors.language && (
                        <div className="mt-2 text-danger">
                          {typeof errors.language.message === "string" &&
                            errors.language.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("total_qty")}
                        id="validation-form-1"
                        type="number"
                        name="total_qty"
                        className={clsx({
                          "border-danger": errors.total_qty,
                        })}
                        placeholder={t("Enter total_qty")}
                      />
                      {errors.total_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_qty.message === "string" &&
                            errors.total_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Net Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_net_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_net_weight"
                        className={clsx({
                          "border-danger": errors.total_net_weight,
                        })}
                        placeholder={t("Enter total_net_weight")}
                      />
                      {errors.total_net_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_net_weight.message === "string" &&
                            errors.total_net_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Gross Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_gross_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_gross_weight"
                        className={clsx({
                          "border-danger": errors.total_gross_weight,
                        })}
                        placeholder={t("Enter total_gross_weight")}
                      />
                      {errors.total_gross_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_gross_weight.message === "string" &&
                            errors.total_gross_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("total_volume")}
                        id="validation-form-1"
                        type="number"
                        name="total_volume"
                        className={clsx({
                          "border-danger": errors.total_volume,
                        })}
                        placeholder={t("Enter total_volume")}
                      />
                      {errors.total_volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_volume.message === "string" &&
                            errors.total_volume.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("total_amount")}
                        id="validation-form-1"
                        type="number"
                        name="total_amount"
                        className={clsx({
                          "border-danger": errors.total_amount,
                        })}
                        placeholder={t("Enter total_amount")}
                      />
                      {errors.total_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_amount.message === "string" &&
                            errors.total_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Discount")}
                      </FormLabel>
                      <FormInput
                        {...register("discount")}
                        id="validation-form-1"
                        type="number"
                        name="discount"
                        className={clsx({
                          "border-danger": errors.discount,
                        })}
                        placeholder={t("Enter discount")}
                      />
                      {errors.discount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.discount.message === "string" &&
                            errors.discount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Deposit")}
                      </FormLabel>
                      <FormInput
                        {...register("deposit")}
                        id="validation-form-1"
                        type="number"
                        name="deposit"
                        className={clsx({
                          "border-danger": errors.deposit,
                        })}
                        placeholder={t("Enter deposit")}
                      />
                      {errors.deposit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.deposit.message === "string" &&
                            errors.deposit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Expenses")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_expenses")}
                        id="validation-form-1"
                        type="number"
                        name="extra_expenses"
                        className={clsx({
                          "border-danger": errors.extra_expenses,
                        })}
                        placeholder={t("Enter extra_expenses")}
                      />
                      {errors.extra_expenses && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_expenses.message === "string" &&
                            errors.extra_expenses.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Debt")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_debt")}
                        id="validation-form-1"
                        type="number"
                        name="customer_debt"
                        className={clsx({
                          "border-danger": errors.customer_debt,
                        })}
                        placeholder={t("Enter customer_debt")}
                      />
                      {errors.customer_debt && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_debt.message === "string" &&
                            errors.customer_debt.message}
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


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status")}
                      </FormLabel>
                      <FormInput
                        {...register("status")}
                        id="validation-form-1"
                        type="text"
                        name="status"
                        className={clsx({
                          "border-danger": errors.status,
                        })}
                        placeholder={t("Enter status")}
                      />
                      {errors.status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status.message === "string" &&
                            errors.status.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Attached File")}
                      </FormLabel>
                      <FormInput
                        {...register("attached_file")}
                        id="validation-form-1"
                        type="text"
                        name="attached_file"
                        className={clsx({
                          "border-danger": errors.attached_file,
                        })}
                        placeholder={t("Enter attached_file")}
                      />
                      {errors.attached_file && (
                        <div className="mt-2 text-danger">
                          {typeof errors.attached_file.message === "string" &&
                            errors.attached_file.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Created By")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_created by`} setValue={setValue} variable="created_by"/>
      {errors.created_by && (
        <div className="mt-2 text-danger">
          {typeof errors.created_by.message === "string" &&
            errors.created_by.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Customerinvoice")}</h2>
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
                        {t("Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_no"
                        className={clsx({
                          "border-danger": errors.invoice_no,
                        })}
                        placeholder={t("Enter invoice_no")}
                      />
                      {errors.invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_no.message === "string" &&
                            errors.invoice_no.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      {errors.customer_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_id.message === "string" &&
            errors.customer_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Name")}
                      </FormLabel>
                      <FormInput
                        {...register("company_name")}
                        id="validation-form-1"
                        type="text"
                        name="company_name"
                        className={clsx({
                          "border-danger": errors.company_name,
                        })}
                        placeholder={t("Enter company_name")}
                      />
                      {errors.company_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_name.message === "string" &&
                            errors.company_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Name")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_name")}
                        id="validation-form-1"
                        type="text"
                        name="customer_name"
                        className={clsx({
                          "border-danger": errors.customer_name,
                        })}
                        placeholder={t("Enter customer_name")}
                      />
                      {errors.customer_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_name.message === "string" &&
                            errors.customer_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Country")}
                      </FormLabel>
                      <FormInput
                        {...register("country")}
                        id="validation-form-1"
                        type="text"
                        name="country"
                        className={clsx({
                          "border-danger": errors.country,
                        })}
                        placeholder={t("Enter country")}
                      />
                      {errors.country && (
                        <div className="mt-2 text-danger">
                          {typeof errors.country.message === "string" &&
                            errors.country.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Address")}
                      </FormLabel>
                      <FormInput
                        {...register("address")}
                        id="validation-form-1"
                        type="text"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder={t("Enter address")}
                      />
                      {errors.address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.address.message === "string" &&
                            errors.address.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Id")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_id")}
                        id="validation-form-1"
                        type="text"
                        name="tax_id"
                        className={clsx({
                          "border-danger": errors.tax_id,
                        })}
                        placeholder={t("Enter tax_id")}
                      />
                      {errors.tax_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_id.message === "string" &&
                            errors.tax_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="validation-form-1"
                        type="text"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone_number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Email")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="validation-form-1"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Mark")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_mark")}
                        id="validation-form-1"
                        type="text"
                        name="shipping_mark"
                        className={clsx({
                          "border-danger": errors.shipping_mark,
                        })}
                        placeholder={t("Enter shipping_mark")}
                      />
                      {errors.shipping_mark && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_mark.message === "string" &&
                            errors.shipping_mark.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipped Date")}
                      </FormLabel>
                      <FormInput
                        {...register("shipped_date")}
                        id="validation-form-1"
                        type="date"
                        name="shipped_date"
                        className={clsx({
                          "border-danger": errors.shipped_date,
                        })}
                        placeholder={t("Enter shipped_date")}
                      />
                      {errors.shipped_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipped_date.message === "string" &&
                            errors.shipped_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Language")}
                      </FormLabel>
                      <FormInput
                        {...register("language")}
                        id="validation-form-1"
                        type="text"
                        name="language"
                        className={clsx({
                          "border-danger": errors.language,
                        })}
                        placeholder={t("Enter language")}
                      />
                      {errors.language && (
                        <div className="mt-2 text-danger">
                          {typeof errors.language.message === "string" &&
                            errors.language.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("total_qty")}
                        id="validation-form-1"
                        type="number"
                        name="total_qty"
                        className={clsx({
                          "border-danger": errors.total_qty,
                        })}
                        placeholder={t("Enter total_qty")}
                      />
                      {errors.total_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_qty.message === "string" &&
                            errors.total_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Net Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_net_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_net_weight"
                        className={clsx({
                          "border-danger": errors.total_net_weight,
                        })}
                        placeholder={t("Enter total_net_weight")}
                      />
                      {errors.total_net_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_net_weight.message === "string" &&
                            errors.total_net_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Gross Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_gross_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_gross_weight"
                        className={clsx({
                          "border-danger": errors.total_gross_weight,
                        })}
                        placeholder={t("Enter total_gross_weight")}
                      />
                      {errors.total_gross_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_gross_weight.message === "string" &&
                            errors.total_gross_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("total_volume")}
                        id="validation-form-1"
                        type="number"
                        name="total_volume"
                        className={clsx({
                          "border-danger": errors.total_volume,
                        })}
                        placeholder={t("Enter total_volume")}
                      />
                      {errors.total_volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_volume.message === "string" &&
                            errors.total_volume.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("total_amount")}
                        id="validation-form-1"
                        type="number"
                        name="total_amount"
                        className={clsx({
                          "border-danger": errors.total_amount,
                        })}
                        placeholder={t("Enter total_amount")}
                      />
                      {errors.total_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_amount.message === "string" &&
                            errors.total_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Discount")}
                      </FormLabel>
                      <FormInput
                        {...register("discount")}
                        id="validation-form-1"
                        type="number"
                        name="discount"
                        className={clsx({
                          "border-danger": errors.discount,
                        })}
                        placeholder={t("Enter discount")}
                      />
                      {errors.discount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.discount.message === "string" &&
                            errors.discount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Deposit")}
                      </FormLabel>
                      <FormInput
                        {...register("deposit")}
                        id="validation-form-1"
                        type="number"
                        name="deposit"
                        className={clsx({
                          "border-danger": errors.deposit,
                        })}
                        placeholder={t("Enter deposit")}
                      />
                      {errors.deposit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.deposit.message === "string" &&
                            errors.deposit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Expenses")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_expenses")}
                        id="validation-form-1"
                        type="number"
                        name="extra_expenses"
                        className={clsx({
                          "border-danger": errors.extra_expenses,
                        })}
                        placeholder={t("Enter extra_expenses")}
                      />
                      {errors.extra_expenses && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_expenses.message === "string" &&
                            errors.extra_expenses.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Debt")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_debt")}
                        id="validation-form-1"
                        type="number"
                        name="customer_debt"
                        className={clsx({
                          "border-danger": errors.customer_debt,
                        })}
                        placeholder={t("Enter customer_debt")}
                      />
                      {errors.customer_debt && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_debt.message === "string" &&
                            errors.customer_debt.message}
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


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status")}
                      </FormLabel>
                      <FormInput
                        {...register("status")}
                        id="validation-form-1"
                        type="text"
                        name="status"
                        className={clsx({
                          "border-danger": errors.status,
                        })}
                        placeholder={t("Enter status")}
                      />
                      {errors.status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status.message === "string" &&
                            errors.status.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Attached File")}
                      </FormLabel>
                      <FormInput
                        {...register("attached_file")}
                        id="validation-form-1"
                        type="text"
                        name="attached_file"
                        className={clsx({
                          "border-danger": errors.attached_file,
                        })}
                        placeholder={t("Enter attached_file")}
                      />
                      {errors.attached_file && (
                        <div className="mt-2 text-danger">
                          {typeof errors.attached_file.message === "string" &&
                            errors.attached_file.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Created By")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_created by`} setValue={setValue} variable="created_by"/>
      {errors.created_by && (
        <div className="mt-2 text-danger">
          {typeof errors.created_by.message === "string" &&
            errors.created_by.message}
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
      <Can permission="customerinvoice-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/customerinvoice"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Customerinvoice"}
        />
      </Can>
    </div>
  );
}
export default index_main;
