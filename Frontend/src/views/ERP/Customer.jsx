import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { createPortal } from 'react-dom';
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
  useCreateCustomerproductvisibilitMutation,
  useEditCustomerproductvisibilitMutation,
  useDeleteCustomerproductvisibilitMutation,
  useCreateCustomerbrandvisibilitMutation,
  useEditCustomerbrandvisibilitMutation,
  useDeleteCustomerbrandvisibilitMutation,
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
import { X } from 'lucide-react';

function index_main() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url)
  const upload_url = useSelector((state)=> state.auth.upload_url)
  const media_url = useSelector((state)=>state.auth.media_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
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
        const viewBtn =
          stringToHTML(`<div class="flex items-center lg:justify-center">
              <a class="view-btn flex items-center mr-3" href="javascript:;">
                <i data-lucide="eye" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> View
              </a>`);
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
        viewBtn.addEventListener("click", function () {
          const data = cell.getData();
          setViewData(data);
          setShowViewModal(true);
        });
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
            console.log('🟢 Edit form - Final imageUrl constructed:', imageUrl);
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
        // Always show view button
        element.append(viewBtn);
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
price_adjustment_type: yup.string().nullable().oneOf(['increase','decrease']),
price_adjustment_percent: yup
  .number()
  .nullable()
  .min(0, t('Percent cannot be negative'))
  .max(100, t('Percent cannot exceed 100')),

    })
    .required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    handleSubmit,
    watch,
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
  const [rulesTableRefetch, setRulesTableRefetch] = useState(false);
  // Customer Rules state
  const [activeCustomerRuleTab, setActiveCustomerRuleTab] = useState('product'); // 'product' | 'brand' | 'pricing'
  const [showCustomerRuleModal, setShowCustomerRuleModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  // Mutations for visibility rules
  const [createCustomerproductvisibilit] = useCreateCustomerproductvisibilitMutation();
  const [updateCustomerproductvisibilit] = useEditCustomerproductvisibilitMutation();
  const [deleteCustomerproductvisibilit] = useDeleteCustomerproductvisibilitMutation();
  const [createCustomerbrandvisibilit] = useCreateCustomerbrandvisibilitMutation();
  const [updateCustomerbrandvisibilit] = useEditCustomerbrandvisibilitMutation();
  const [deleteCustomerbrandvisibilit] = useDeleteCustomerbrandvisibilitMutation();

  const handleAddProductVisibility = async () => {
    const cid = selectedCustomerId;
    const pid = getValues('rule_product_id');
    const vis = getValues('rule_product_visibility') || 'show';
    if (!cid || !pid) {
      setToastMessage(t('Select a product to add visibility rule'));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      await createCustomerproductvisibilit({ customer_id: cid, product_id: pid, visibility: vis });
      setToastMessage(t('Product visibility rule added'));
      basicStickyNotification.current?.showToast();
      setRulesTableRefetch((v)=>!v);
    } catch (e) {
      setToastMessage(t('Failed to add product visibility rule'));
      basicStickyNotification.current?.showToast();
    }
  };

  const handleAddBrandVisibility = async () => {
    const cid = selectedCustomerId;
    const bid = getValues('rule_brand_id');
    const vis = getValues('rule_brand_visibility') || 'allow';
    if (!cid || !bid) {
      setToastMessage(t('Select a brand to add visibility rule'));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      await createCustomerbrandvisibilit({ customer_id: cid, brand_id: bid, visibility: vis });
      setToastMessage(t('Brand visibility rule added'));
      basicStickyNotification.current?.showToast();
      setRulesTableRefetch((v)=>!v);
    } catch (e) {
      setToastMessage(t('Failed to add brand visibility rule'));
      basicStickyNotification.current?.showToast();
    }
  };

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
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
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
        // Auto-hide toast after 7 seconds
        setTimeout(() => {
          basicStickyNotification.current?.hideToast();
        }, 7000);
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
          const firstError = validationErrors[errorFields[0]][0];
          errorMessage = firstError;
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
      // Auto-hide toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current?.hideToast();
      }, 7000);
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
      basicStickyNotification.current?.showToast();
      // Auto-hide toast after 7 seconds
      setTimeout(() => {
        basicStickyNotification.current?.hideToast();
      }, 7000);
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

      {/* View Customer Details Slideover */}
      <Slideover
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewData(null);
        }}
        size="xl"
      >
        <Slideover.Panel className="text-left overflow-y-auto max-h-[110vh]">
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("Customer Details")}</h2>
          </Slideover.Title>
          <Slideover.Description className="p-6">
            {viewData && (
              <div className="space-y-6">
                {/* Customer Image */}
                {viewData.image && (
                  <div className="flex justify-center mb-6">
                    <img 
                      src={media_url + viewData.image} 
                      alt="Customer Image" 
                      className="w-64 h-64 rounded-lg object-cover border-4 border-gray-200 shadow-lg"
                    />
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Name & Surname")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.name_surname || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Shipping Mark")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.shipping_mark || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Email")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.email || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Phone")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.phone_number || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Position")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.position || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Birth Date")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      {viewData.birth_date ? viewData.birth_date.split('T')[0] : '-'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("WhatsApp")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.whatsapp || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("WeChat")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.wechat_id || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Country")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.country || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Address")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.address || '-'}</div>
                  </div>
                </div>

                {/* Pictures */}
                {viewData.pictures && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Additional Pictures")}</label>
                    <div className="flex justify-center">
                      <img 
                        src={media_url + viewData.pictures} 
                        alt="Customer Picture" 
                        className="w-full max-w-md h-64 object-cover rounded-lg border shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Additional Note */}
                {viewData.additional_note && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Additional Note")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border min-h-[80px]">{viewData.additional_note}</div>
                  </div>
                )}
              </div>
            )}
          </Slideover.Description>
          <div className="px-6 pb-6">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setShowViewModal(false);
                setViewData(null);
              }}
              className="w-full"
            >
              {t("Close")}
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
        <Slideover.Panel className="text-left overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Customer")}</h2>
              <div className="mt-2 text-left">
                <Button type="button" variant="outline-secondary" onClick={() => {
                  setSelectedCustomerId(getValues('id'));
                  setShowCustomerRuleModal(true);
                }}>
                  {t("Open Customer Rules")}
                </Button>
              </div>
            </Slideover.Title>
            <Slideover.Description className="p-6 space-y-6">
              {/* Customer Edit Form Fields */}
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full grid grid-cols-1 gap-4 gap-y-3">
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
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                console.log('✅ Edit Image loaded successfully:', e.target.src);
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

                    {/* Row 8: Price Adjustment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="price_adjustment_type"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          {t('Pricing Adjustment Type')}
                        </FormLabel>
                        <select
                          {...register('price_adjustment_type')}
                          id="price_adjustment_type"
                          name="price_adjustment_type"
                          className={clsx('form-select', {
                            'border-danger': errors.price_adjustment_type,
                          })}
                        >
                          <option value="">{t('None')}</option>
                          <option value="increase">{t('Increase (markup)')}</option>
                          <option value="decrease">{t('Decrease (discount)')}</option>
                        </select>
                        {errors.price_adjustment_type && (
                          <div className="mt-2 text-danger">
                            {typeof errors.price_adjustment_type.message === 'string' &&
                              errors.price_adjustment_type.message}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 input-form">
                        <FormLabel
                          htmlFor="price_adjustment_percent"
                          className="flex flex-col w-full sm:flex-row"
                        >
                          {t('Pricing Adjustment Percent')}
                        </FormLabel>
                        <FormInput
                          {...register('price_adjustment_percent')}
                          id="price_adjustment_percent"
                          type="number"
                          name="price_adjustment_percent"
                          min={0}
                          max={100}
                          className={clsx({
                            'border-danger': errors.price_adjustment_percent,
                          })}
                          placeholder={t('e.g. 5 for 5%')}
                        />
                        {errors.price_adjustment_percent && (
                          <div className="mt-2 text-danger">
                            {typeof errors.price_adjustment_percent.message === 'string' &&
                              errors.price_adjustment_percent.message}
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
                 className="w-24 mr-1"
               >
                 {t("Cancel")}
               </Button>
               <Button type="submit" variant="primary" className="w-24">{t('Update')}</Button>
             </Slideover.Footer>
           </form>
         </Slideover.Panel>
       </Slideover>

      {/* Customer Rules Slideover */}
      {showCustomerRuleModal && createPortal(
        <div className="fixed top-0 left-0 h-screen w-full xl:w-[45%] bg-white dark:bg-darkmode-600 shadow-lg overflow-y-auto p-5 z-[200000]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">{t("Customer Rules")}</h2>
            <button
              onClick={() => setShowCustomerRuleModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2 border-b mb-4">
            <Button
              variant={activeCustomerRuleTab === 'product' ? 'primary' : 'outline-secondary'}
              type="button"
              onClick={() => setActiveCustomerRuleTab('product')}
            >
              {t('Product Visibility')}
            </Button>
            <Button
              variant={activeCustomerRuleTab === 'brand' ? 'primary' : 'outline-secondary'}
              type="button"
              onClick={() => setActiveCustomerRuleTab('brand')}
            >
              {t('Brand Visibility')}
            </Button>
            <Button
              variant={activeCustomerRuleTab === 'pricing' ? 'primary' : 'outline-secondary'}
              type="button"
              onClick={() => setActiveCustomerRuleTab('pricing')}
            >
              {t('Pricing')}
            </Button>
          </div>

          {activeCustomerRuleTab==='product' && (
            <div className="mt-4 space-y-6">
              {/* Table Section */}
              <TableComponent
                page_name={t('Product Visibility')}
                endpoint={`${app_url}/api/customerproductvisibilit?customer_id=${selectedCustomerId || ''}`}
                data={[
                  { title: t('ID'), minWidth: 60, field: 'id', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Customer'), minWidth: 180, field: 'customer_name', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Product'), minWidth: 200, field: 'product_name', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Visibility'), minWidth: 120, field: 'visibility', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                ]}
                searchColumns={[ 'customer_name','product_name','visibility' ]}
                refetch={rulesTableRefetch}
                setRefetch={setRulesTableRefetch}
                permission={'customerproductvisibilit'}
                show_create={false}
              />
              
              {/* Add New Rule Form */}
              <div className="bg-gray-50 dark:bg-darkmode-700 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">{t('Add New Product Visibility Rule')}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <FormLabel className="mb-2">{t('Product')}</FormLabel>
                    <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="rule_product_id"/>
                  </div>
                  <div>
                    <FormLabel className="mb-2">{t('Visibility')}</FormLabel>
                    <select id="rule_product_visibility_modal" className="form-select w-full" {...register('rule_product_visibility')}>
                      <option value="show">{t('Show')}</option>
                      <option value="hide">{t('Hide')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="primary" className="w-full lg:w-auto" onClick={handleAddProductVisibility}>
                      {t('Add Rule')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCustomerRuleTab==='brand' && (
            <div className="mt-4 space-y-6">
              {/* Table Section */}
              <TableComponent
                page_name={t('Brand Visibility')}
                endpoint={`${app_url}/api/customerbrandvisibilit?customer_id=${selectedCustomerId || ''}`}
                data={[
                  { title: t('ID'), minWidth: 60, field: 'id', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Customer'), minWidth: 180, field: 'customer_name', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Brand'), minWidth: 200, field: 'brand_name', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                  { title: t('Visibility'), minWidth: 120, field: 'visibility', hozAlign: 'center', headerHozAlign: 'center', vertAlign: 'middle', print: true, download: true },
                ]}
                searchColumns={[ 'customer_name','brand_name','visibility' ]}
                refetch={rulesTableRefetch}
                setRefetch={setRulesTableRefetch}
                permission={'customerbrandvisibilit'}
                show_create={false}
              />
              
              {/* Add New Rule Form */}
              <div className="bg-gray-50 dark:bg-darkmode-700 p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">{t('Add New Brand Visibility Rule')}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <FormLabel className="mb-2">{t('Brand')}</FormLabel>
                    <TomSelectSearch 
                      apiUrl={`${app_url}/api/search_brandname`} 
                      setValue={setValue} 
                      variable="rule_brand_id"
                      customDataMapping={(item) => ({ value: item.id, text: item.brand_name })}
                    />
                  </div>
                  <div>
                    <FormLabel className="mb-2">{t('Visibility')}</FormLabel>
                    <select id="rule_brand_visibility_modal" className="form-select w-full" {...register('rule_brand_visibility')}>
                      <option value="allow">{t('Allow')}</option>
                      <option value="deny">{t('Deny')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="primary" className="w-full lg:w-auto" onClick={handleAddBrandVisibility}>
                      {t('Add Rule')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCustomerRuleTab==='pricing' && (
            <form onSubmit={handleSubmit(onUpdate)} className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <FormLabel className="mb-1">{t('Price Adjustment Type')}</FormLabel>
                <select className="form-select" {...register('price_adjustment_type')}>
                  <option value="">{t('None')}</option>
                  <option value="increase">{t('Increase')}</option>
                  <option value="decrease">{t('Decrease')}</option>
                </select>
              </div>
              <div>
                <FormLabel className="mb-1">{t('Price Adjustment Percent')}</FormLabel>
                <FormInput type="number" step="0.01" min={0} max={100} {...register('price_adjustment_percent')} />
                {errors.price_adjustment_percent && <div className="mt-2 text-danger">{String(errors.price_adjustment_percent.message||'')}</div>}
              </div>
              <div className="flex items-end">
                <Button type="submit" variant="primary">{t('Save Pricing')}</Button>
              </div>
            </form>
          )}
        </div>,
        document.body
      )}
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
          page_name={"Customer"}
        />
      </Can>
     </div>
   );
 }
 export default index_main;
