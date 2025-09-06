
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
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import { Dialog } from "@/components/Base/Headless";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import CameraCapture from "@/helpers/ui/CameraCapture.jsx";
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
  const [capturedImage, setCapturedImage] = useState(null);
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Customer"));

  
 const [
    createCustomer,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCustomerMutation();
  const [
    updateCustomer,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCustomerMutation();
  const [
    deleteCustomer,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCustomerMutation()


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
      title: t("Name & Surname"),
      minWidth: 200,
      field: "name_surname",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Image"),
      minWidth: 100,
      field: "image",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().image)
      }
    },
    {
      title: t("Shipping Mark"),
      minWidth: 150,
      field: "shipping_mark",
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
      title: t("Phone"),
      minWidth: 150,
      field: "phone_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Position"),
      minWidth: 150,
      field: "position",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Birth Date"),
      minWidth: 120,
      field: "birth_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const birthDate = cell.getData().birth_date;
        if (birthDate) {
          // Extract just the date part (YYYY-MM-DD) from ISO timestamp
          return birthDate.split('T')[0];
        }
        return '';
      }
    },
    {
      title: t("WhatsApp"),
      minWidth: 150,
      field: "whatsapp",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("WeChat"),
      minWidth: 150,
      field: "wechat_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Country"),
      minWidth: 150,
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
          console.log("Edit button clicked - Customer data:", data);
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          
          // Handle image field (unified for both upload and camera)
          if (data.image) {
            console.log('🟢 Edit form - Loading existing image:', data.image);
            console.log('🟢 Edit form - media_url:', media_url);
            const imageUrl = media_url + data.image;
            console.log('🟢 Edit form - Final imageUrl:', imageUrl);
            setUploadedImage(imageUrl);
            setCapturedImage({ url: imageUrl, blob: null });
            setImageSource('upload'); // Default to upload for existing images
          } else {
            console.log('🟢 Edit form - No image found in data');
            setUploadedImage(null);
            setCapturedImage(null);
            setImageSource(null);
          }
          
          setShowUpdateModal(true);
        });
        b.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowDeleteModal(true);
        });
        let permission = "customer";
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
  const [searchColumns, setSearchColumns] = useState(['name_surname', 'shipping_mark', 'email', 'phone_number', 'position', 'birth_date', 'whatsapp', 'wechat_id', 'country', 'address', 'additional_note']);

  // schema
  const schema = yup
    .object({
     name_surname : yup.string().required(t('The Name & Surname field is required')), 
shipping_mark : yup.string().nullable(), 
email : yup.string().email(t('Please enter a valid email')).required(t('The Email field is required')), 
phone_number : yup.string().nullable(), 
position : yup.string().nullable(), 
birth_date : yup.date().nullable(), 
whatsapp : yup.string().nullable(), 
wechat_id : yup.string().nullable(), 
country : yup.string().nullable(), 
address : yup.string().nullable(), 
image : yup.string().nullable(), 
 
additional_note : yup.string().nullable(), 

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

   

          const [uploadedImage, setUploadedImage] = useState(null);
          const [imageSource, setImageSource] = useState(null); // 'upload' or 'camera'
          
          const setUploadImage  = (value) => {
              console.log('🔵 setUploadImage called with:', value);
              console.log('🔵 media_url:', media_url);
              setValue('image', value);
              trigger('image'); // Trigger validation for image field
              // Check if value is already a full URL or just a filename
              const imageUrl = value.startsWith('http') ? value : media_url + value;
              console.log('🔵 Final imageUrl constructed:', imageUrl);
              setUploadedImage(imageUrl);
              setImageSource('upload');
              // Clear camera image when uploading
              setCapturedImage(null);
            }
            
          const handleImageCapture = (blob, imageUrl) => {
            console.log('🟡 handleImageCapture called with:', { blob, imageUrl });
            if (blob && imageUrl) {
              // Convert blob to base64 string for form validation
              const base64String = blob.data || blob;
              setValue('image', base64String);
              trigger('image'); // Trigger validation for image field
              
              // Set captured image with the actual blob data for preview
              setCapturedImage({
                blob: base64String, // Use the base64 string for preview
                url: imageUrl
              });
              setImageSource('camera');
              // Clear uploaded image when capturing
              setUploadedImage(null);
              console.log('🟡 Image captured and set in form as string:', typeof base64String);
              console.log('🟡 CapturedImage preview data:', base64String.substring(0, 50) + '...');
            } else {
              console.error('🔴 Invalid capture data:', { blob, imageUrl });
            }
          }
          
          const clearImage = () => {
            setCapturedImage(null);
            setUploadedImage(null);
            setImageSource(null);
            setValue('image', null);
            trigger('image'); // Trigger validation for image field
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
      // Add image source information to the data
      const submitData = { ...data };
      if (imageSource) {
        submitData.image_source = imageSource; // 'upload' or 'camera'
      }
      
      const response = await createCustomer(submitData);
      console.log('🟡 API response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Customer created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
        basicStickyNotification.current?.showToast();
      } else {
        console.error('🔴 API returned error:', response);
        let errorMessage = t("Error creating Customer");
        
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
          // Fallback to general error messages
          const generalErrorSources = [
            response?.error?.data?.message,
            response?.data?.message,
            response?.message,
            response?.error
          ];
          
          for (const errorSource of generalErrorSources) {
            if (errorSource && typeof errorSource === 'string') {
              errorMessage = errorSource;
              break;
            }
          }
        }
        
        setToastMessage(errorMessage);
        basicStickyNotification.current?.showToast();
      }
    } catch (error) {
      console.error('🔴 Exception in onCreate:', error);
      let errorMessage = t("Error creating Customer");
      
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
      
      setToastMessage(errorMessage);
      basicStickyNotification.current?.showToast();
    }
  };

const onUpdate = async (data) => {
  try {
    console.log('🟡 Updating customer with data:', data);
    // Add image source information to the data
    const submitData = { ...data };
    if (imageSource) {
      submitData.image_source = imageSource; // 'upload' or 'camera'
    }
    
    const response = await updateCustomer(submitData);
    console.log('🟡 Update customer response:', response);
      
    if (response && (response.success === true || response.data?.success === true)) {
      setToastMessage(t('Customer updated successfully'));
      setRefetch(true);
      setShowUpdateModal(false);
    } else {
      // Handle validation errors with comprehensive error extraction
      let errorMessage = t("Error updating Customer");
      
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
        // Fallback to general error messages
        const generalErrorSources = [
          response?.error?.data?.message,
          response?.data?.message,
          response?.message,
          response?.error
        ];
        
        for (const errorSource of generalErrorSources) {
          if (errorSource && typeof errorSource === 'string') {
            errorMessage = errorSource;
            break;
          }
        }
      }
      
      setToastMessage(errorMessage);
      console.error('🔴 Update failed with response:', response);
      setShowUpdateModal(true);
    }
  } catch (error) {
    console.error('🔴 Update customer error:', error);
    let errorMessage = t("Error updating Customer");
    
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
    
    setToastMessage(errorMessage);
    setShowUpdateModal(true);
  }
    
  basicStickyNotification.current?.showToast();
  // Auto-hide toast after 7 seconds
  setTimeout(() => {
    basicStickyNotification.current?.hideToast();
  }, 7000);
};

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false);
    
    try {
      console.log('🔴 Deleting customer with id:', id);
      const response = await deleteCustomer(id);
      console.log('🔴 Delete customer response:', response);
      
      if (response && (response.success === true || response.data?.success === true)) {
        setToastMessage(t("Customer deleted successfully."));
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
          setToastMessage(`${t("Error deleting Customer")}: ${errorMsg}`);
        }
        console.error('🔴 Delete failed with response:', response);
      }
    } catch (error) {
      console.error('🔴 Delete customer error:', error);
      let errorMessage = t("Error deleting Customer");
      
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
          <div className="p-5 text-center   text-center overflow-y-auto max-h-[110vh]">
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
        <Slideover.Panel className="text-center   text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Customer")}</h2>
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
                    {/* Row 1: Name & Surname */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Name & Surname")}
                        </FormLabel>
                        <FormInput
                          {...register("name_surname")}
                          type="text"
                          name="name_surname"
                          className={clsx({"border-danger": errors.name_surname})}
                          placeholder={t("Enter name & surname")}
                        />
                        {errors.name_surname && (
                          <div className="mt-2 text-danger">
                            {typeof errors.name_surname.message === "string" && errors.name_surname.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Image */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Image")}
                      </FormLabel>
                      <div className="space-y-4 mb-3">
                        <div className={imageSource === 'camera' ? 'opacity-50 pointer-events-none' : ''}>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Upload Image")}</label>
                          <FileUpload 
                            endpoint={upload_url} 
                            type="image/*" 
                            className="w-full" 
                            setUploadedURL={setUploadImage}
                            disabled={imageSource === 'camera'}
                          />
                        </div>
                        
                        <div className="flex items-center justify-center py-2">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="px-4 text-sm text-gray-500 bg-white">{t("Or")}</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <div className={imageSource === 'upload' ? 'opacity-50 pointer-events-none' : ''}>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Take Picture")}</label>
                          <CameraCapture 
                            onCapture={handleImageCapture}
                            capturedImage={capturedImage}
                            className="w-full"
                            disabled={imageSource === 'upload'}
                          />
                        </div>
                      </div>
                      
                      {(uploadedImage || capturedImage) && (
                        <div className="mt-2 flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <img 
                              src={uploadedImage || capturedImage?.url || capturedImage?.blob} 
                              alt="Customer Image" 
                              className="w-32 h-32 object-cover rounded border shadow-sm"
                              onError={(e) => {
                                console.error('🔴 Image failed to load:', e.target.src);
                                console.error('🔴 uploadedImage state:', uploadedImage);
                                console.error('🔴 capturedImage state:', capturedImage);
                                console.error('🔴 imageSource state:', imageSource);
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                console.log('✅ CREATE Image loaded successfully:', e.target.src);
                                console.log('✅ uploadedImage state:', uploadedImage);
                                console.log('✅ capturedImage state:', capturedImage);
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={clearImage}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            {t("Clear Image")}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Row 3: Shipping Mark & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Shipping Mark")}
                        </FormLabel>
                        <FormInput
                          {...register("shipping_mark")}
                          type="text"
                          name="shipping_mark"
                          className={clsx({"border-danger": errors.shipping_mark})}
                          placeholder={t("Enter shipping mark")}
                        />
                        {errors.shipping_mark && (
                          <div className="mt-2 text-danger">
                            {typeof errors.shipping_mark.message === "string" && errors.shipping_mark.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Email")}
                        </FormLabel>
                        <FormInput
                          {...register("email")}
                          type="email"
                          name="email"
                          className={clsx({"border-danger": errors.email})}
                          placeholder={t("Enter email")}
                        />
                        {errors.email && (
                          <div className="mt-2 text-danger">
                            {typeof errors.email.message === "string" && errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Phone & Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Phone")}
                        </FormLabel>
                        <FormInput
                          {...register("phone_number")}
                          type="text"
                          name="phone_number"
                          className={clsx({"border-danger": errors.phone_number})}
                          placeholder={t("Enter phone number")}
                        />
                        {errors.phone_number && (
                          <div className="mt-2 text-danger">
                            {typeof errors.phone_number.message === "string" && errors.phone_number.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Position")}
                        </FormLabel>
                        <FormInput
                          {...register("position")}
                          type="text"
                          name="position"
                          className={clsx({"border-danger": errors.position})}
                          placeholder={t("Enter position")}
                        />
                        {errors.position && (
                          <div className="mt-2 text-danger">
                            {typeof errors.position.message === "string" && errors.position.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 5: Birth Date */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Birth Date")}
                      </FormLabel>
                      <FormInput
                        {...register("birth_date")}
                        type="date"
                        name="birth_date"
                        className={clsx({"border-danger": errors.birth_date})}
                      />
                      {errors.birth_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.birth_date.message === "string" && errors.birth_date.message}
                        </div>
                      )}
                    </div>

                    {/* Row 6: WhatsApp & WeChat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("WhatsApp")}
                        </FormLabel>
                        <FormInput
                          {...register("whatsapp")}
                          type="text"
                          name="whatsapp"
                          className={clsx({"border-danger": errors.whatsapp})}
                          placeholder={t("Enter WhatsApp number")}
                        />
                        {errors.whatsapp && (
                          <div className="mt-2 text-danger">
                            {typeof errors.whatsapp.message === "string" && errors.whatsapp.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("WeChat")}
                        </FormLabel>
                        <FormInput
                          {...register("wechat_id")}
                          type="text"
                          name="wechat_id"
                          className={clsx({"border-danger": errors.wechat_id})}
                          placeholder={t("Enter WeChat ID")}
                        />
                        {errors.wechat_id && (
                          <div className="mt-2 text-danger">
                            {typeof errors.wechat_id.message === "string" && errors.wechat_id.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 7: Country & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Country")}
                        </FormLabel>
                        <FormInput
                          {...register("country")}
                          type="text"
                          name="country"
                          className={clsx({"border-danger": errors.country})}
                          placeholder={t("Enter country")}
                        />
                        {errors.country && (
                          <div className="mt-2 text-danger">
                            {typeof errors.country.message === "string" && errors.country.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Address")}
                        </FormLabel>
                        <FormInput
                          {...register("address")}
                          type="text"
                          name="address"
                          className={clsx({"border-danger": errors.address})}
                          placeholder={t("Enter address")}
                        />
                        {errors.address && (
                          <div className="mt-2 text-danger">
                            {typeof errors.address.message === "string" && errors.address.message}
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Row 9: Additional Note */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Additional Note")}
                      </FormLabel>
                      <FormTextarea
                        {...register("additional_note")}
                        name="additional_note"
                        className={clsx({"border-danger": errors.additional_note})}
                        placeholder={t("Enter additional notes")}
                        rows={3}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" && errors.additional_note.message}
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
              <Button 
                variant="primary" 
                type="submit" 
                className="w-20"
                onClick={() => {
                  console.log('🟡 Save button clicked');
                  console.log('🟡 Form errors at click:', errors);
                  console.log('🟡 Form values at click:', getValues());
                }}
              >
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
        <Slideover.Panel className="text-center   text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Customer")}</h2>
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
                    {/* Row 1: Name & Surname */}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Name & Surname")}
                        </FormLabel>
                        <FormInput
                          {...register("name_surname")}
                          type="text"
                          name="name_surname"
                          className={clsx({"border-danger": errors.name_surname})}
                          placeholder={t("Enter name & surname")}
                        />
                        {errors.name_surname && (
                          <div className="mt-2 text-danger">
                            {typeof errors.name_surname.message === "string" && errors.name_surname.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Image */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Image")}
                      </FormLabel>
                      <div className="space-y-4 mb-3">
                        <div className={imageSource === 'camera' ? 'opacity-50 pointer-events-none' : ''}>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Upload Image")}</label>
                          <FileUpload 
                            endpoint={upload_url} 
                            type="image/*" 
                            className="w-full" 
                            setUploadedURL={setUploadImage}
                            disabled={imageSource === 'camera'}
                          />
                        </div>
                        
                        <div className="flex items-center justify-center py-2">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="px-4 text-sm text-gray-500 bg-white">{t("Or")}</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <div className={imageSource === 'upload' ? 'opacity-50 pointer-events-none' : ''}>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Take Picture")}</label>
                          <CameraCapture 
                            onCapture={handleImageCapture}
                            capturedImage={capturedImage}
                            className="w-full"
                            disabled={imageSource === 'upload'}
                          />
                        </div>
                      </div>
                      
                      {(uploadedImage || capturedImage) && (
                        <div className="mt-2 flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <img 
                              src={uploadedImage || capturedImage?.url || capturedImage?.blob} 
                              alt="Customer Image" 
                              className="w-32 h-32 object-cover rounded border shadow-sm"
                              onError={(e) => {
                                console.error('🔴 Image failed to load:', e.target.src);
                                console.error('🔴 uploadedImage state:', uploadedImage);
                                console.error('🔴 capturedImage state:', capturedImage);
                                console.error('🔴 imageSource state:', imageSource);
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                console.log('✅ CREATE Image loaded successfully:', e.target.src);
                                console.log('✅ uploadedImage state:', uploadedImage);
                                console.log('✅ capturedImage state:', capturedImage);
                              }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={clearImage}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            {t("Clear Image")}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Row 3: Shipping Mark & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Shipping Mark")}
                        </FormLabel>
                        <FormInput
                          {...register("shipping_mark")}
                          type="text"
                          name="shipping_mark"
                          className={clsx({"border-danger": errors.shipping_mark})}
                          placeholder={t("Enter shipping mark")}
                        />
                        {errors.shipping_mark && (
                          <div className="mt-2 text-danger">
                            {typeof errors.shipping_mark.message === "string" && errors.shipping_mark.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Email")}
                        </FormLabel>
                        <FormInput
                          {...register("email")}
                          type="email"
                          name="email"
                          className={clsx({"border-danger": errors.email})}
                          placeholder={t("Enter email")}
                        />
                        {errors.email && (
                          <div className="mt-2 text-danger">
                            {typeof errors.email.message === "string" && errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Phone & Position */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Phone")}
                        </FormLabel>
                        <FormInput
                          {...register("phone_number")}
                          type="text"
                          name="phone_number"
                          className={clsx({"border-danger": errors.phone_number})}
                          placeholder={t("Enter phone number")}
                        />
                        {errors.phone_number && (
                          <div className="mt-2 text-danger">
                            {typeof errors.phone_number.message === "string" && errors.phone_number.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Position")}
                        </FormLabel>
                        <FormInput
                          {...register("position")}
                          type="text"
                          name="position"
                          className={clsx({"border-danger": errors.position})}
                          placeholder={t("Enter position")}
                        />
                        {errors.position && (
                          <div className="mt-2 text-danger">
                            {typeof errors.position.message === "string" && errors.position.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 5: Birth Date */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Birth Date")}
                      </FormLabel>
                      <FormInput
                        {...register("birth_date")}
                        type="date"
                        name="birth_date"
                        className={clsx({"border-danger": errors.birth_date})}
                      />
                      {errors.birth_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.birth_date.message === "string" && errors.birth_date.message}
                        </div>
                      )}
                    </div>

                    {/* Row 6: WhatsApp & WeChat */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("WhatsApp")}
                        </FormLabel>
                        <FormInput
                          {...register("whatsapp")}
                          type="text"
                          name="whatsapp"
                          className={clsx({"border-danger": errors.whatsapp})}
                          placeholder={t("Enter WhatsApp number")}
                        />
                        {errors.whatsapp && (
                          <div className="mt-2 text-danger">
                            {typeof errors.whatsapp.message === "string" && errors.whatsapp.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("WeChat")}
                        </FormLabel>
                        <FormInput
                          {...register("wechat_id")}
                          type="text"
                          name="wechat_id"
                          className={clsx({"border-danger": errors.wechat_id})}
                          placeholder={t("Enter WeChat ID")}
                        />
                        {errors.wechat_id && (
                          <div className="mt-2 text-danger">
                            {typeof errors.wechat_id.message === "string" && errors.wechat_id.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 7: Country & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Country")}
                        </FormLabel>
                        <FormInput
                          {...register("country")}
                          type="text"
                          name="country"
                          className={clsx({"border-danger": errors.country})}
                          placeholder={t("Enter country")}
                        />
                        {errors.country && (
                          <div className="mt-2 text-danger">
                            {typeof errors.country.message === "string" && errors.country.message}
                          </div>
                        )}
                      </div>
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Address")}
                        </FormLabel>
                        <FormInput
                          {...register("address")}
                          type="text"
                          name="address"
                          className={clsx({"border-danger": errors.address})}
                          placeholder={t("Enter address")}
                        />
                        {errors.address && (
                          <div className="mt-2 text-danger">
                            {typeof errors.address.message === "string" && errors.address.message}
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Row 9: Additional Note */}
                    <div className="input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Additional Note")}
                      </FormLabel>
                      <FormTextarea
                        {...register("additional_note")}
                        name="additional_note"
                        className={clsx({"border-danger": errors.additional_note})}
                        placeholder={t("Enter additional notes")}
                        rows={3}
                      />
                      {errors.additional_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.additional_note.message === "string" && errors.additional_note.message}
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
      <Can permission="customer-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/customer"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Customer"}
        />
      </Can>
    </div>
  );
}
export default index_main;