import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormTextarea , FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useEditSupplierMutation,
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editorData, setEditorData] = useState("")
  const [capturedImages, setCapturedImages] = useState([]);
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Supplier"));

  
 const [
    createSupplier,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSupplierMutation();
  const [
    updateSupplier,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSupplierMutation();
  const [
    deleteSupplier,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSupplierMutation()


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
      title: t("Supplier"),
      minWidth: 200,
      field: "supplier",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Name Surname"),
      minWidth: 200,
      field: "name_surname",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Occupation"),
      minWidth: 200,
      field: "occupation",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Code"),
      minWidth: 200,
      field: "code",
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
      minWidth: 200,
      field: "email",
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
      title: t("Whatsapp"),
      minWidth: 200,
      field: "whatsapp",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Wechat Id"),
      minWidth: 200,
      field: "wechat_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Images"),
      minWidth: 200,
      field: "images",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const images = cell.getData().images || [];
        const container = stringToHTML('<div class="flex items-center justify-center gap-1"></div>');
        images.slice(0, 3).forEach((url) => {
          const img = stringToHTML(`<img src="${media_url + url}" class="w-8 h-8 rounded object-cover"/>`);
          container.append(img);
        });
        if (images.length > 3) {
          const more = stringToHTML(`<span class="text-xs text-slate-600">+${images.length - 3} ${t('more')}</span>`);
          container.append(more);
        }
        return container;
      }
    },
    

    {
      title: t("Number Of Products"),
      minWidth: 200,
      field: "number_of_products",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    
    {
      title: t("Category Of Products"),
      minWidth: 200,
      field: "category_of_products",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const container = stringToHTML('<div class="flex items-center justify-center flex-wrap gap-1"></div>');
        const value = cell.getValue() || '';
        const list = value.split(',').map(v => v.trim()).filter(Boolean);
        const preview = list.slice(0, 2);
        preview.forEach(item => {
          const badge = stringToHTML(`<span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">${item}</span>`);
          container.append(badge);
        });
        if (list.length > 2) {
          const moreBtn = stringToHTML(`<a href="javascript:;" class="text-primary text-xs">+${list.length - 2} ${t('more')}</a>`);
          moreBtn.addEventListener('click', () => {
            setCategoriesDialogContent(list);
            setShowCategoriesDialog(true);
          });
          container.append(moreBtn);
        }
        // Fallback tooltip with full list
        container.setAttribute('title', list.join(', '));
        return container;
      }
    },
    

    {
      title: t("Name Of Products"),
      minWidth: 200,
      field: "name_of_products",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const container = stringToHTML('<div class="flex items-center justify-center flex-wrap gap-1"></div>');
        const value = cell.getValue() || '';
        const list = value.split(',').map(v => v.trim()).filter(Boolean);
        const preview = list.slice(0, 2);
        preview.forEach(item => {
          const badge = stringToHTML(`<span class="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">${item}</span>`);
          container.append(badge);
        });
        if (list.length > 2) {
          const moreBtn = stringToHTML(`<a href="javascript:;" class="text-primary text-xs">+${list.length - 2} ${t('more')}</a>`);
          moreBtn.addEventListener('click', () => {
            setNamesDialogContent(list);
            setShowNamesDialog(true);
          });
          container.append(moreBtn);
        }
        container.setAttribute('title', list.join(', '));
        return container;
      }
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
      title: t("Main Supplier"),
      minWidth: 200,
      field: "main_supplier_products",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const container = stringToHTML('<div class="flex items-center justify-center flex-wrap gap-1"></div>');
        const value = cell.getValue() || '';
        const list = value.split(',').map(v => v.trim()).filter(Boolean);
        
        if (list.length === 0) {
          const noBadge = stringToHTML(`<span class="px-2 py-0.5 rounded-full bg-slate/10 text-slate text-xs">${t('No')}</span>`);
          container.append(noBadge);
          return container;
        }
        
        const preview = list.slice(0, 2);
        preview.forEach(item => {
          const badge = stringToHTML(`<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">${item}</span>`);
          container.append(badge);
        });
        if (list.length > 2) {
          const moreBtn = stringToHTML(`<a href="javascript:;" class="text-primary text-xs">+${list.length - 2} ${t('more')}</a>`);
          moreBtn.addEventListener('click', () => {
            setMainSupplierDialogContent(list);
            setShowMainSupplierDialog(true);
          });
          container.append(moreBtn);
        }
        container.setAttribute('title', list.join(', '));
        return container;
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
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setUploadedImages(data.images || []);
          setValue('images', data.images || []);
          setShowUpdateModal(true);
        });
        b.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowDeleteModal(true);
        });
        let permission = "supplier";
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
  const [searchColumns, setSearchColumns] = useState(['supplier', 'name_surname', 'occupation', 'code', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'category_of_products', 'name_of_products', 'additional_note', ]);

  // schema
  const schema = yup
    .object({
      supplier: yup.string().max(255).required(t('The Supplier field is required')),
      name_surname: yup.string().max(255).required(t('The Name Surname field is required')),
      occupation: yup.string().max(255).nullable(),
      code: yup.string().max(255).nullable(),
      address: yup.string().max(255).nullable(),
      email: yup
        .string()
        .email(t('Please enter a valid email'))
        .required(t('The Email field is required')),
      phone_number: yup.string().max(20).nullable(),
      whatsapp: yup.string().max(20).nullable(),
      wechat_id: yup.string().max(255).nullable(),
      images: yup.array().of(yup.string()).nullable(),
      additional_note: yup.string().nullable(),
      price_adjustment_type: yup.string().nullable().oneOf(['increase','decrease']),
      price_adjustment_percent: yup
        .number()
        .nullable()
        .min(0, t('Percent cannot be negative'))
        .max(100, t('Percent cannot exceed 100')),
      is_main_supplier: yup.boolean().nullable(),
      selected_products: yup.array().of(yup.number()).nullable(),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: { images: [] },
  });

  // Multiple uploads support
  const [uploadedImages, setUploadedImages] = useState([]);
  const addUploadedImage = (url) => {
    setUploadedImages((prev) => {
      const next = [...prev, url];
      setValue('images', next);
      return next;
    });
  };
  const removeUploadedImage = (index) => {
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue('images', next);
      return next;
    });
  };
  const clearUploadedImages = () => {
    setUploadedImages([]);
    setValue('images', []);
  };

  // Camera capture functionality
  const handleImageCapture = (blob, imageUrl) => {
    console.log('🟡 handleImageCapture called with:', { blob, imageUrl });
    if (blob && imageUrl) {
      // Convert blob to base64 string for form validation
      const base64String = blob.data || blob;
      console.log('📸 Adding captured image:', base64String.substring(0, 50) + '...');
      
      // Add captured image to the images array
      setCapturedImages(prev => {
        const newCaptured = [...prev, base64String];
        // Combine uploaded and captured images
        const allImages = [...uploadedImages, ...newCaptured];
        setValue('images', allImages);
        return newCaptured;
      });
    }
  };

  const removeCapturedImage = (index) => {
    setCapturedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Combine uploaded and remaining captured images
      const allImages = [...uploadedImages, ...next];
      setValue('images', allImages);
      return next;
    });
  };

  const clearCapturedImages = () => {
    setCapturedImages([]);
    setValue('images', uploadedImages); // Keep only uploaded images
  };

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
    try {
      console.log('Supplier create payload:', data);
      const response = await createSupplier(data);
      console.log('Supplier create response:', response);
      
      if (response?.error) {
        console.error('🔴 Supplier creation failed:', response.error);
        let errorMessage = t("Error creating Supplier");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,
          response?.error?.data?.errors,
          response?.error?.data?.message,
          response?.error?.message
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {
          if (errorSource && typeof errorSource === 'object') {
            validationErrors = errorSource;
            break;
          } else if (typeof errorSource === 'string') {
            errorMessage = errorSource;
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
        }
        
        setToastMessage(errorMessage);
        basicStickyNotification.current?.showToast();
        return;
      }
      
      setToastMessage(t("Supplier created successfully."));
      clearUploadedImages();
      setCapturedImages([]);
      setRefetch(true);
      setShowCreateModal(false);
    } catch (error) {
      console.error('🔴 Exception in onCreate:', error);
      let errorMessage = t("Error creating Supplier");
      
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
          if (typeof errorSource === 'string') {
            errorMessage = errorSource;
            break;
          }
        }
      }
      
      setToastMessage(errorMessage);
    }
    basicStickyNotification.current?.showToast();
  };

  const onUpdate = async (data) => {
    try {
      // Ensure checkbox value is always included (React Hook Form doesn't include unchecked values)
      const formData = {
        ...data,
        is_main_supplier: data.is_main_supplier || false
      };
      console.log('Supplier update payload:', formData);
      const response = await updateSupplier(formData);
      console.log('Supplier update response:', response);
      
      if (response?.error) {
        console.error('🔴 Supplier update failed:', response.error);
        let errorMessage = t("Error updating Supplier");
        
        // Check multiple possible error structures
        const errorSources = [
          response?.error?.data?.data?.errors,
          response?.error?.data?.errors,
          response?.error?.data?.message,
          response?.error?.message
        ];
        
        let validationErrors = null;
        for (const errorSource of errorSources) {
          if (errorSource && typeof errorSource === 'object') {
            validationErrors = errorSource;
            break;
          } else if (typeof errorSource === 'string') {
            errorMessage = errorSource;
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
        }
        
        setToastMessage(errorMessage);
        setShowUpdateModal(true);
        basicStickyNotification.current?.showToast();
        return;
      }
      
      setToastMessage(t('Supplier updated successfully'));
      setRefetch(true);
      clearUploadedImages();
      setCapturedImages([]);
      setShowUpdateModal(false);
    } catch (error) {
      console.error('🔴 Exception in onUpdate:', error);
      let errorMessage = t("Error updating Supplier");
      
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
          if (typeof errorSource === 'string') {
            errorMessage = errorSource;
            break;
          }
        }
      }
      
      setToastMessage(errorMessage);
      setShowUpdateModal(true);
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteSupplier(id);
        setToastMessage(t("Supplier deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Supplier."));
    }
    basicStickyNotification.current?.showToast();
  };    

  // Local UI state for viewing long lists in table cells
  const [showCategoriesDialog, setShowCategoriesDialog] = useState(false);
  const [categoriesDialogContent, setCategoriesDialogContent] = useState([]);
  const [showNamesDialog, setShowNamesDialog] = useState(false);
  const [namesDialogContent, setNamesDialogContent] = useState([]);
  const [showMainSupplierDialog, setShowMainSupplierDialog] = useState(false);
  const [mainSupplierDialogContent, setMainSupplierDialogContent] = useState([]);
  
  // Main supplier functionality
  const [currentSupplierMainProducts, setCurrentSupplierMainProducts] = useState([]);
  
  // Handle product selection change for auto-checking checkbox
  const handleProductSelectionChange = (selectedItems) => {
    if (!Array.isArray(selectedItems)) return;
    
    const selectedProductIds = selectedItems.map(item => parseInt(item.value));
    const mainProductIds = currentSupplierMainProducts || [];
    
    // Check if all selected products are already main supplier products
    const allAreMainSupplier = selectedProductIds.length > 0 && 
      selectedProductIds.every(id => mainProductIds.includes(id));
    
    // Check if some are main supplier and some are not
    const someAreMainSupplier = selectedProductIds.some(id => mainProductIds.includes(id));
    const someAreNotMainSupplier = selectedProductIds.some(id => !mainProductIds.includes(id));
    
    if (allAreMainSupplier) {
      // All selected products are already main supplier - check the box
      setValue('is_main_supplier', true);
    } else if (someAreMainSupplier && someAreNotMainSupplier) {
      // Mixed selection - show notification and uncheck box
      setValue('is_main_supplier', false);
      const mainProducts = selectedProductIds.filter(id => mainProductIds.includes(id));
      const nonMainProducts = selectedProductIds.filter(id => !mainProductIds.includes(id));
      
      setToastMessage(`Mixed selection: ${mainProducts.length} product(s) already marked as main supplier, ${nonMainProducts.length} product(s) not marked.`);
      basicStickyNotification.current?.showToast();
    } else {
      // None are main supplier or no products selected - uncheck box
      setValue('is_main_supplier', false);
    }
  };

  useEffect(() => {
    if (showCreateModal) {
      clearUploadedImages();
      setCapturedImages([]);
      // Optionally reset only images field, keep other fields intact
      // reset({ images: [] }, { keepValues: true });
    }
  }, [showCreateModal]);

  useEffect(() => {
    if (showUpdateModal && editorData) {
      // When editing, load existing images
      const currentImages = getValues('images') || [];
      setUploadedImages(currentImages);
      setCapturedImages([]);
      
      // Load main supplier product IDs for auto-checking
      const mainProductIds = editorData.main_supplier_product_ids || [];
      setCurrentSupplierMainProducts(mainProductIds);
    }
  }, [showUpdateModal, editorData]);

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
          <div className="p-5  text-center overflow-y-auto max-h-[110vh]">
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

      {/* View Supplier Details Slideover */}
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
            <h2 className="mr-auto text-base font-medium">{t("Supplier Details")}</h2>
          </Slideover.Title>
          <Slideover.Description className="p-6">
            {viewData && (
              <div className="space-y-6">
                {/* Supplier Images */}
                {viewData.images && viewData.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Images")} ({viewData.images.length})</label>
                    <div className="overflow-x-auto pb-4">
                      <div className="flex gap-6 min-w-max">
                        {viewData.images.map((image, index) => (
                          <div key={index} className="relative flex-shrink-0">
                            <img 
                              src={media_url + image} 
                              alt={`Supplier Image ${index + 1}`} 
                              className="w-full h-64 object-cover rounded-lg border shadow-lg hover:shadow-xl transition-shadow"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Supplier")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.supplier || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Name Surname")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.name_surname || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Occupation")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.occupation || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Code")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.code || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Address")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.address || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Email")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.email || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Phone Number")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.phone_number || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("WhatsApp")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.whatsapp || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("WeChat ID")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.wechat_id || '-'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("Number Of Products")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">{viewData.number_of_products || '-'}</div>
                  </div>
                </div>

                {/* Category of Products */}
                {viewData.category_of_products && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Category Of Products")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex flex-wrap gap-2">
                        {viewData.category_of_products.split(',').map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-sm">
                            {category.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Name of Products */}
                {viewData.name_of_products && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t("Name Of Products")}</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <div className="flex flex-wrap gap-2">
                        {viewData.name_of_products.split(',').map((product, index) => (
                          <span key={index} className="px-2 py-1 bg-success/10 text-success rounded-full text-sm">
                            {product.trim()}
                          </span>
                        ))}
                      </div>
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
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Supplier")}</h2>
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
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Supplier")}
                      </FormLabel>
                      <FormInput
                        {...register("supplier")}
                        id="validation-form-1"
                        type="text"
                        name="supplier"
                        className={clsx({
                          "border-danger": errors.supplier,
                        })}
                        placeholder={t("Enter supplier")}
                      />
                      {errors.supplier && (
                        <div className="mt-2 text-danger">
                          {typeof errors.supplier.message === "string" &&
                            errors.supplier.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Surname")}
                      </FormLabel>
                      <FormInput
                        {...register("name_surname")}
                        id="validation-form-1"
                        type="text"
                        name="name_surname"
                        className={clsx({
                          "border-danger": errors.name_surname,
                        })}
                        placeholder={t("Enter name_surname")}
                      />
                      {errors.name_surname && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_surname.message === "string" &&
                            errors.name_surname.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Occupation")}
                      </FormLabel>
                      <FormInput
                        {...register("occupation")}
                        id="validation-form-1"
                        type="text"
                        name="occupation"
                        className={clsx({
                          "border-danger": errors.occupation,
                        })}
                        placeholder={t("Enter occupation")}
                      />
                      {errors.occupation && (
                        <div className="mt-2 text-danger">
                          {typeof errors.occupation.message === "string" &&
                            errors.occupation.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Code")}
                      </FormLabel>
                      <FormInput
                        {...register("code")}
                        id="validation-form-1"
                        type="text"
                        name="code"
                        className={clsx({
                          "border-danger": errors.code,
                        })}
                        placeholder={t("Enter code")}
                      />
                      {errors.code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.code.message === "string" &&
                            errors.code.message}
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
                        {t("Whatsapp")}
                      </FormLabel>
                      <FormInput
                        {...register("whatsapp")}
                        id="validation-form-1"
                        type="text"
                        name="whatsapp"
                        className={clsx({
                          "border-danger": errors.whatsapp,
                        })}
                        placeholder={t("Enter whatsapp")}
                      />
                      {errors.whatsapp && (
                        <div className="mt-2 text-danger">
                          {typeof errors.whatsapp.message === "string" &&
                            errors.whatsapp.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Wechat Id")}
                      </FormLabel>
                      <FormInput
                        {...register("wechat_id")}
                        id="validation-form-1"
                        type="text"
                        name="wechat_id"
                        className={clsx({
                          "border-danger": errors.wechat_id,
                        })}
                        placeholder={t("Enter wechat_id")}
                      />
                      {errors.wechat_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.wechat_id.message === "string" &&
                            errors.wechat_id.message}
                        </div>
                      )}
                    </div>


          <div className="w-full md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Upload Images")}</label>
                  <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={addUploadedImage}/>
                </div>
                
                {/* Camera Capture Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Take Pictures")}</label>
                  <CameraCapture 
                    onCapture={handleImageCapture}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Display all images (uploaded + captured) */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Uploaded Images */}
                {uploadedImages.map((url, idx) => (
                  <div key={`uploaded-${idx}`} className="relative">
                    <img src={`${media_url + url}`} alt="" className="w-16 h-16 rounded object-cover" />
                    <button type="button" className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onClick={() => removeUploadedImage(idx)}>×</button>
                    <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">📁</div>
                  </div>
                ))}
                
                {/* Captured Images */}
                {capturedImages.map((base64, idx) => (
                  <div key={`captured-${idx}`} className="relative">
                    <img src={base64} alt="" className="w-16 h-16 rounded object-cover" />
                    <button type="button" className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onClick={() => removeCapturedImage(idx)}>×</button>
                    <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr">📸</div>
                  </div>
                ))}
              </div>
              
              {/* Clear buttons */}
              {(uploadedImages.length > 0 || capturedImages.length > 0) && (
                <div className="mt-3 flex gap-2">
                  {uploadedImages.length > 0 && (
                    <Button type="button" variant="outline-secondary" onClick={clearUploadedImages}>{t('Clear uploaded')}</Button>
                  )}
                  {capturedImages.length > 0 && (
                    <Button type="button" variant="outline-secondary" onClick={clearCapturedImages}>{t('Clear captured')}</Button>
                  )}
                  {(uploadedImages.length > 0 || capturedImages.length > 0) && (
                    <Button type="button" variant="outline-danger" onClick={() => { clearUploadedImages(); clearCapturedImages(); }}>{t('Clear all images')}</Button>
                  )}
                </div>
              )}
          </div>
        


<div className="mt-3 input-form md:col-span-2">
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Supplier")}</h2>
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
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Supplier")}
                      </FormLabel>
                      <FormInput
                        {...register("supplier")}
                        id="validation-form-1"
                        type="text"
                        name="supplier"
                        className={clsx({
                          "border-danger": errors.supplier,
                        })}
                        placeholder={t("Enter supplier")}
                      />
                      {errors.supplier && (
                        <div className="mt-2 text-danger">
                          {typeof errors.supplier.message === "string" &&
                            errors.supplier.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Surname")}
                      </FormLabel>
                      <FormInput
                        {...register("name_surname")}
                        id="validation-form-1"
                        type="text"
                        name="name_surname"
                        className={clsx({
                          "border-danger": errors.name_surname,
                        })}
                        placeholder={t("Enter name_surname")}
                      />
                      {errors.name_surname && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_surname.message === "string" &&
                            errors.name_surname.message}
                        </div>
                      )}
                    </div>

                    {/* Main Supplier Section - Only in Edit Form */}
                    <div className="col-span-2 mt-6 border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{t("Designate as Main Supplier")}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Search */}
                        <div className="input-form">
                          <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                            {t("Select Products for Main Supplier")}
                          </FormLabel>
                          <TomSelectSearch
                            apiUrl={`${app_url}/api/search_product`}
                            setValue={setValue}
                            variable="selected_products"
                            multiple={true}
                            customDataMapping={(item) => ({
                              value: item.value || item.id,
                              text: item.text || item.product_name || item.product_code || item.name || String(item.id)
                            })}
                            onSelectionChange={(selectedItems) => {
                              handleProductSelectionChange(selectedItems);
                            }}
                            options={{
                              placeholder: t("Search and select products..."),
                              persist: false,
                              createOnBlur: false,
                              create: false,
                            }}
                          />
                        </div>
                        
                        {/* Main Supplier Checkbox */}
                        <div className="input-form flex items-end">
                          <FormCheck className="mt-6">
                            <FormCheck.Input
                              {...register("is_main_supplier")}
                              id="is_main_supplier_update"
                              type="checkbox"
                              className="mr-2"
                              value="true"
                              onChange={(e) => {
                                setValue("is_main_supplier", e.target.checked);
                              }}
                            />
                            <FormCheck.Label htmlFor="is_main_supplier_update" className="cursor-pointer">
                              {t("Mark as Main Supplier")}
                            </FormCheck.Label>
                          </FormCheck>
                        </div>
                      </div>
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Occupation")}
                      </FormLabel>
                      <FormInput
                        {...register("occupation")}
                        id="validation-form-1"
                        type="text"
                        name="occupation"
                        className={clsx({
                          "border-danger": errors.occupation,
                        })}
                        placeholder={t("Enter occupation")}
                      />
                      {errors.occupation && (
                        <div className="mt-2 text-danger">
                          {typeof errors.occupation.message === "string" &&
                            errors.occupation.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Code")}
                      </FormLabel>
                      <FormInput
                        {...register("code")}
                        id="validation-form-1"
                        type="text"
                        name="code"
                        className={clsx({
                          "border-danger": errors.code,
                        })}
                        placeholder={t("Enter code")}
                      />
                      {errors.code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.code.message === "string" &&
                            errors.code.message}
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
                        {t("Whatsapp")}
                      </FormLabel>
                      <FormInput
                        {...register("whatsapp")}
                        id="validation-form-1"
                        type="text"
                        name="whatsapp"
                        className={clsx({
                          "border-danger": errors.whatsapp,
                        })}
                        placeholder={t("Enter whatsapp")}
                      />
                      {errors.whatsapp && (
                        <div className="mt-2 text-danger">
                          {typeof errors.whatsapp.message === "string" &&
                            errors.whatsapp.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Wechat Id")}
                      </FormLabel>
                      <FormInput
                        {...register("wechat_id")}
                        id="validation-form-1"
                        type="text"
                        name="wechat_id"
                        className={clsx({
                          "border-danger": errors.wechat_id,
                        })}
                        placeholder={t("Enter wechat_id")}
                      />
                      {errors.wechat_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.wechat_id.message === "string" &&
                            errors.wechat_id.message}
                        </div>
                      )}
                    </div>


          <div className="w-full md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Upload Images")}</label>
                  <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={addUploadedImage}/>
                </div>
                
                {/* Camera Capture Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t("Take Pictures")}</label>
                  <CameraCapture 
                    onCapture={handleImageCapture}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Display all images (uploaded + captured) */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Uploaded Images */}
                {uploadedImages.map((url, idx) => (
                  <div key={`uploaded-${idx}`} className="relative">
                    <img src={`${media_url + url}`} alt="" className="w-16 h-16 rounded object-cover" />
                    <button type="button" className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onClick={() => removeUploadedImage(idx)}>×</button>
                    <div className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded-tr">📁</div>
                  </div>
                ))}
                
                {/* Captured Images */}
                {capturedImages.map((base64, idx) => (
                  <div key={`captured-${idx}`} className="relative">
                    <img src={base64} alt="" className="w-16 h-16 rounded object-cover" />
                    <button type="button" className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" onClick={() => removeCapturedImage(idx)}>×</button>
                    <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded-tr">📸</div>
                  </div>
                ))}
              </div>
              
              {/* Clear buttons */}
              {(uploadedImages.length > 0 || capturedImages.length > 0) && (
                <div className="mt-3 flex gap-2">
                  {uploadedImages.length > 0 && (
                    <Button type="button" variant="outline-secondary" onClick={clearUploadedImages}>{t('Clear uploaded')}</Button>
                  )}
                  {capturedImages.length > 0 && (
                    <Button type="button" variant="outline-secondary" onClick={clearCapturedImages}>{t('Clear captured')}</Button>
                  )}
                  {(uploadedImages.length > 0 || capturedImages.length > 0) && (
                    <Button type="button" variant="outline-danger" onClick={() => { clearUploadedImages(); clearCapturedImages(); }}>{t('Clear all images')}</Button>
                  )}
                </div>
              )}
          </div>
        


<div className="mt-3 input-form md:col-span-2">
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


                    {/* Price Adjustment Section - Only in Edit Form */}
                    <div className="col-span-2 mt-6 border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{t("Global Price Adjustment")}</h3>
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
        options={{ duration: 3000, close: true }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
      <Can permission="supplier-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/supplier"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Supplier"}
        />
      </Can>

      {/* Categories viewer */}
      <Slideover
        open={showCategoriesDialog}
        onClose={() => setShowCategoriesDialog(false)}
        size="md"
      >
        <Slideover.Panel>
          <div className="p-5">
            <h2 className="text-base font-medium mb-3">{t('Categories')}</h2>
            <div className="flex flex-wrap gap-2">
              {categoriesDialogContent.map((c, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">{c}</span>
              ))}
            </div>
            <div className="mt-5 text-right">
              <Button variant="primary" onClick={() => setShowCategoriesDialog(false)}>{t('Close')}</Button>
            </div>
          </div>
        </Slideover.Panel>
      </Slideover>

      {/* Product names viewer */}
      <Slideover
        open={showNamesDialog}
        onClose={() => setShowNamesDialog(false)}
        size="md"
      >
        <Slideover.Panel>
          <div className="p-5">
            <h2 className="text-base font-medium mb-3">{t('Product Names')}</h2>
            <div className="flex flex-wrap gap-2">
              {namesDialogContent.map((n, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-success/10 text-success text-xs">{n}</span>
              ))}
            </div>
            <div className="mt-5 text-right">
              <Button variant="primary" onClick={() => setShowNamesDialog(false)}>{t('Close')}</Button>
            </div>
          </div>
        </Slideover.Panel>
      </Slideover>

      {/* Main Supplier Products viewer */}
      <Slideover
        open={showMainSupplierDialog}
        onClose={() => setShowMainSupplierDialog(false)}
        size="md"
      >
        <Slideover.Panel>
          <div className="p-5">
            <h2 className="text-base font-medium mb-3">{t('Main Supplier Products')}</h2>
            <div className="flex flex-wrap gap-2">
              {mainSupplierDialogContent.map((p, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{p}</span>
              ))}
            </div>
            <div className="mt-5 text-right">
              <Button variant="primary" onClick={() => setShowMainSupplierDialog(false)}>{t('Close')}</Button>
            </div>
          </div>
        </Slideover.Panel>
      </Slideover>
    </div>
  );
}
export default index_main;
