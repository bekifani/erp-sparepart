
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
  useCreateCompanMutation,
  useDeleteCompanMutation,
  useEditCompanMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import { Dialog } from "@/components/Base/Headless";
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
    useState(t("Are you Sure Do You want to Delete Compan"));

  
 const [
    createCompan,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCompanMutation();
  const [
    updateCompan,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCompanMutation();
  const [
    deleteCompan,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCompanMutation()


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
      title: t("Logo"),
      minWidth: 100,
      field: "logo",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const logo = cell.getData().logo;
        return logo ? getMiniDisplay(logo) : 'No Logo';
      }
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
      title: t("Website"),
      minWidth: 150,
      field: "website",
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
      title: t("Email"),
      minWidth: 150,
      field: "email",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("Phone Number"),
      minWidth: 120,
      field: "phone_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("Our Ref"),
      minWidth: 120,
      field: "our_ref",
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
        let permission = "compan";
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
  const [searchColumns, setSearchColumns] = useState(['company_name', 'website', 'address', 'email', 'phone_number', 'our_ref', 'origin', 'tax_number', 'mobile_number']);

  // schema
  const schema = yup
    .object({
      logo: yup.string().nullable(),
      company_name: yup.string().required(t('Company Name is required')),
      website: yup.string().nullable(),
      address: yup.string().required(t('Company address is required')),
      email: yup.string().email(t('Invalid email format')).nullable(),
      phone_number: yup.string().nullable(),
      our_ref: yup.string().required(t('Our ref is required')),
      origin: yup.string().nullable(),
      payment_terms: yup.string().nullable(),
      shipping_terms: yup.string().nullable(),
      tax_number: yup.string().nullable(),
      mobile_number: yup.string().nullable(),
      bank_details: yup.string().nullable(),
      additional_note: yup.string().nullable(),
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

   

          const setUploadLogo  = (value) => {
              setValue('logo', value);
            } 

        

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
      const response = await createCompan(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Company created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating Company");
        
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
      let errorMessage = t("Error creating Company");
      
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
  };

  const onUpdate = async (data) => {
    console.log('🟡 onUpdate called with data:', data);
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
    
    setShowUpdateModal(false);
    
    try {
      const response = await updateCompan(data);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t('Company updated successfully'));
        setRefetch(true);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error updating Company");
        
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
        setShowUpdateModal(true);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      }
    } catch (error) {
      console.error('🔴 Exception in onUpdate:', error);
      let errorMessage = t("Error updating Company");
      
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
      basicStickyNotification.current?.showToast();
      // Auto-hide toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current?.hideToast();
      }, 7000);
    }
  };

  const onDelete = async () => {
    let id = getValues("id");
    console.log('🟡 onDelete called with id:', id);
    
    if (!id) {
      console.error('🔴 No ID provided for deletion');
      setToastMessage(t("No company selected for deletion"));
      basicStickyNotification.current?.showToast();
      return;
    }
    
    setShowDeleteModal(false);
    
    try {
      const response = await deleteCompan(id);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Company deleted successfully."));
        setRefetch(true);
        basicStickyNotification.current?.showToast();
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error deleting Company");
        
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
      console.error('🔴 Exception in onDelete:', error);
      let errorMessage = t("Error deleting Company");
      
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
  };    

return (
    <div>
      <Slideover
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
        size="xl"
      >
        <Slideover.Panel>
          <div className="p-5   text-center overflow-y-auto max-h-[110vh]">
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
       
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
        size="xl"
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Compan")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-1 gap-4 gap-y-3">
                    
                    {/* Company Name* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="company_name"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Name")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("company_name")}
                        id="company_name"
                        type="text"
                        name="company_name"
                        className={clsx({
                          "border-danger": errors.company_name,
                        })}
                        placeholder={t("Enter company name")}
                      />
                      {errors.company_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_name.message === "string" &&
                            errors.company_name.message}
                        </div>
                      )}
                    </div>

                    {/* Website */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="website"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Website")}
                      </FormLabel>
                      <FormInput
                        {...register("website")}
                        id="website"
                        type="url"
                        name="website"
                        className={clsx({
                          "border-danger": errors.website,
                        })}
                        placeholder={t("Enter website URL")}
                      />
                      {errors.website && (
                        <div className="mt-2 text-danger">
                          {typeof errors.website.message === "string" &&
                            errors.website.message}
                        </div>
                      )}
                    </div>

                    {/* Company address* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="address"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormTextarea
                        {...register("address")}
                        id="address"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder={t("Enter company address")}
                        rows={3}
                      />
                      {errors.address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.address.message === "string" &&
                            errors.address.message}
                        </div>
                      )}
                    </div>

                    {/* E-mail */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="email"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("E-mail")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="email"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email address")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>

                    {/* Add logo (button) */}
                    <div className="mt-3 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Add Logo")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadLogo}/>
                    </div>

                    {/* Phone number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="phone_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>

                    {/* Our ref.* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="our_ref"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Our Ref.")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("our_ref")}
                        id="our_ref"
                        type="text"
                        name="our_ref"
                        className={clsx({
                          "border-danger": errors.our_ref,
                        })}
                        placeholder={t("Enter our reference")}
                      />
                      {errors.our_ref && (
                        <div className="mt-2 text-danger">
                          {typeof errors.our_ref.message === "string" &&
                            errors.our_ref.message}
                        </div>
                      )}
                    </div>

                    {/* Origin */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="origin"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Origin")}
                      </FormLabel>
                      <FormInput
                        {...register("origin")}
                        id="origin"
                        type="text"
                        name="origin"
                        className={clsx({
                          "border-danger": errors.origin,
                        })}
                        placeholder={t("Enter origin")}
                      />
                      {errors.origin && (
                        <div className="mt-2 text-danger">
                          {typeof errors.origin.message === "string" &&
                            errors.origin.message}
                        </div>
                      )}
                    </div>

                    {/* Payment terms */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="payment_terms"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Terms")}
                      </FormLabel>
                      <FormTextarea
                        {...register("payment_terms")}
                        id="payment_terms"
                        name="payment_terms"
                        className={clsx({
                          "border-danger": errors.payment_terms,
                        })}
                        placeholder={t("Enter payment terms")}
                        rows={3}
                      />
                      {errors.payment_terms && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_terms.message === "string" &&
                            errors.payment_terms.message}
                        </div>
                      )}
                    </div>

                    {/* Shipping terms */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="shipping_terms"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Terms")}
                      </FormLabel>
                      <FormTextarea
                        {...register("shipping_terms")}
                        id="shipping_terms"
                        name="shipping_terms"
                        className={clsx({
                          "border-danger": errors.shipping_terms,
                        })}
                        placeholder={t("Enter shipping terms")}
                        rows={3}
                      />
                      {errors.shipping_terms && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_terms.message === "string" &&
                            errors.shipping_terms.message}
                        </div>
                      )}
                    </div>

                    {/* Tax number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="tax_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Number")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_number")}
                        id="tax_number"
                        type="text"
                        name="tax_number"
                        className={clsx({
                          "border-danger": errors.tax_number,
                        })}
                        placeholder={t("Enter tax number")}
                      />
                      {errors.tax_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_number.message === "string" &&
                            errors.tax_number.message}
                        </div>
                      )}
                    </div>

                    {/* Mobile number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="mobile_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Mobile Number")}
                      </FormLabel>
                      <FormInput
                        {...register("mobile_number")}
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        className={clsx({
                          "border-danger": errors.mobile_number,
                        })}
                        placeholder={t("Enter mobile number")}
                      />
                      {errors.mobile_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.mobile_number.message === "string" &&
                            errors.mobile_number.message}
                        </div>
                      )}
                    </div>

                    {/* Bank details */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="bank_details"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details")}
                      </FormLabel>
                      <FormTextarea
                        {...register("bank_details")}
                        id="bank_details"
                        name="bank_details"
                        className={clsx({
                          "border-danger": errors.bank_details,
                        })}
                        placeholder={t("Enter bank details")}
                        rows={4}
                      />
                      {errors.bank_details && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details.message === "string" &&
                            errors.bank_details.message}
                        </div>
                      )}
                    </div>

                    {/* Additional note */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="additional_note"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Additional Note")}
                      </FormLabel>
                      <FormTextarea
                        {...register("additional_note")}
                        id="additional_note"
                        name="additional_note"
                        className={clsx({
                          "border-danger": errors.additional_note,
                        })}
                        placeholder={t("Enter additional notes")}
                        rows={4}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" &&
                            errors.additional_note.message}
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
       
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
        size="xl"
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Compan")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-1  gap-4 gap-y-3">
                    
                    {/* Company Name* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="company_name"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Name")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("company_name")}
                        id="company_name"
                        type="text"
                        name="company_name"
                        className={clsx({
                          "border-danger": errors.company_name,
                        })}
                        placeholder={t("Enter company name")}
                      />
                      {errors.company_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_name.message === "string" &&
                            errors.company_name.message}
                        </div>
                      )}
                    </div>

                    {/* Website */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="website"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Website")}
                      </FormLabel>
                      <FormInput
                        {...register("website")}
                        id="website"
                        type="url"
                        name="website"
                        className={clsx({
                          "border-danger": errors.website,
                        })}
                        placeholder={t("Enter website URL")}
                      />
                      {errors.website && (
                        <div className="mt-2 text-danger">
                          {typeof errors.website.message === "string" &&
                            errors.website.message}
                        </div>
                      )}
                    </div>

                    {/* Company address* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="address"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormTextarea
                        {...register("address")}
                        id="address"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder={t("Enter company address")}
                        rows={3}
                      />
                      {errors.address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.address.message === "string" &&
                            errors.address.message}
                        </div>
                      )}
                    </div>

                    {/* E-mail */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="email"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("E-mail")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="email"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email address")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>

                    {/* Add logo (button) */}
                    <div className="mt-3 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Add Logo")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadLogo}/>
                    </div>

                    {/* Phone number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="phone_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>

                    {/* Our ref.* */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="our_ref"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Our Ref.")} <span className="text-danger">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("our_ref")}
                        id="our_ref"
                        type="text"
                        name="our_ref"
                        className={clsx({
                          "border-danger": errors.our_ref,
                        })}
                        placeholder={t("Enter our reference")}
                      />
                      {errors.our_ref && (
                        <div className="mt-2 text-danger">
                          {typeof errors.our_ref.message === "string" &&
                            errors.our_ref.message}
                        </div>
                      )}
                    </div>

                    {/* Origin */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="origin"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Origin")}
                      </FormLabel>
                      <FormInput
                        {...register("origin")}
                        id="origin"
                        type="text"
                        name="origin"
                        className={clsx({
                          "border-danger": errors.origin,
                        })}
                        placeholder={t("Enter origin")}
                      />
                      {errors.origin && (
                        <div className="mt-2 text-danger">
                          {typeof errors.origin.message === "string" &&
                            errors.origin.message}
                        </div>
                      )}
                    </div>

                    {/* Payment terms */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="payment_terms"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Terms")}
                      </FormLabel>
                      <FormTextarea
                        {...register("payment_terms")}
                        id="payment_terms"
                        name="payment_terms"
                        className={clsx({
                          "border-danger": errors.payment_terms,
                        })}
                        placeholder={t("Enter payment terms")}
                        rows={3}
                      />
                      {errors.payment_terms && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_terms.message === "string" &&
                            errors.payment_terms.message}
                        </div>
                      )}
                    </div>

                    {/* Shipping terms */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="shipping_terms"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Terms")}
                      </FormLabel>
                      <FormTextarea
                        {...register("shipping_terms")}
                        id="shipping_terms"
                        name="shipping_terms"
                        className={clsx({
                          "border-danger": errors.shipping_terms,
                        })}
                        placeholder={t("Enter shipping terms")}
                        rows={3}
                      />
                      {errors.shipping_terms && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_terms.message === "string" &&
                            errors.shipping_terms.message}
                        </div>
                      )}
                    </div>

                    {/* Tax number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="tax_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Number")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_number")}
                        id="tax_number"
                        type="text"
                        name="tax_number"
                        className={clsx({
                          "border-danger": errors.tax_number,
                        })}
                        placeholder={t("Enter tax number")}
                      />
                      {errors.tax_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_number.message === "string" &&
                            errors.tax_number.message}
                        </div>
                      )}
                    </div>

                    {/* Mobile number */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="mobile_number"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Mobile Number")}
                      </FormLabel>
                      <FormInput
                        {...register("mobile_number")}
                        id="mobile_number"
                        type="tel"
                        name="mobile_number"
                        className={clsx({
                          "border-danger": errors.mobile_number,
                        })}
                        placeholder={t("Enter mobile number")}
                      />
                      {errors.mobile_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.mobile_number.message === "string" &&
                            errors.mobile_number.message}
                        </div>
                      )}
                    </div>

                    {/* Bank details */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="bank_details"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details")}
                      </FormLabel>
                      <FormTextarea
                        {...register("bank_details")}
                        id="bank_details"
                        name="bank_details"
                        className={clsx({
                          "border-danger": errors.bank_details,
                        })}
                        placeholder={t("Enter bank details")}
                        rows={4}
                      />
                      {errors.bank_details && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details.message === "string" &&
                            errors.bank_details.message}
                        </div>
                      )}
                    </div>

                    {/* Additional note */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="additional_note"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Additional Note")}
                      </FormLabel>
                      <FormTextarea
                        {...register("additional_note")}
                        id="additional_note"
                        name="additional_note"
                        className={clsx({
                          "border-danger": errors.additional_note,
                        })}
                        placeholder={t("Enter additional notes")}
                        rows={4}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" &&
                            errors.additional_note.message}
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
      <Can permission="compan-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/compan"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Compan"}
        />
      </Can>
    </div>
  );
}
export default index_main;
