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
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useCreateProductruleMutation,
  useGetProductrulesByProductQuery,
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
import { X } from 'lucide-react';

function index_main() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url)
  const upload_url = useSelector((state)=> state.auth.upload_url)
  const media_url = useSelector((state)=>state.auth.media_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Product"));

  
 const [
    createProduct,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductMutation();
  const [
    updateProduct,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductMutation();
  const [
    deleteProduct,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductMutation()
  const [createProductrule, { isLoading: creatingRule }] = useCreateProductruleMutation();
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
      title: t("Supplier Code"),
      minWidth: 160,
      field: "supplier_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    // Moved up: Brand and Brand Code directly after Supplier Code
    {
      title: t("Brand"),
      minWidth: 200,
      field: "brand_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Brand Code"),
      minWidth: 160,
      field: "brand_code_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Qty"),
      minWidth: 200,
      field: "qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Min Qty"),
      minWidth: 200,
      field: "min_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Purchase Price"),
      minWidth: 200,
      field: "purchase_price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Extra Cost"),
      minWidth: 200,
      field: "extra_cost",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Cost Basis"),
      minWidth: 200,
      field: "cost_basis",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Selling Price"),
      minWidth: 200,
      field: "selling_price",
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
      title: t("Status"),
      minWidth: 200,
      field: "status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    // Hidden duplicates at original positions to preserve layout compatibility
    { title: t("Brand"), minWidth: 200, field: "brand_name", visible: false },
    { title: t("Brand Code"), minWidth: 160, field: "brand_code_name", visible: false },
    {
      title: t("OE Code"),
      minWidth: 160,
      field: "oe_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Description"),
      minWidth: 200,
      field: "description",
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
        let permission = "product";
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
  const [searchColumns, setSearchColumns] = useState([
    // product fields
    'id',
    'qty',
    'min_qty',
    'purchase_price',
    'extra_cost',
    'cost_basis',
    'selling_price',
    'additional_note',
    'status',
    // product_information joined fields (aliases from backend select)
    'oe_code', // now on products
    'description', // now on products
    'product_name',
    'product_name_code',
    'box_name',
    'label_name',
    'unit_name',
    'supplier',
    'supplier_code',
  ]);

  // schema
  const schema = yup
    .object({
     supplier_id : yup.string().required(t('The Supplier Id field is required')), 
     additional_note : yup.string().required(t('The Additional Note field is required')), 
     status : yup.string().required(t('The Status field is required')), 
     qty: yup
       .number()
       .typeError(t('Qty must be a number'))
       .required(t('Qty is required'))
       .min(0, t('Qty cannot be negative')),
     min_qty: yup
       .number()
       .typeError(t('Min Qty must be a number'))
       .nullable()
       .min(0, t('Min Qty cannot be negative')), 
     purchase_price: yup
       .number()
       .typeError(t('Purchase Price must be a number'))
       .nullable()
       .min(0, t('Purchase Price cannot be negative')),
     extra_cost: yup
       .number()
       .typeError(t('Extra Cost must be a number'))
       .nullable()
       .min(0, t('Extra Cost cannot be negative')),
     cost_basis: yup
       .number()
       .typeError(t('Cost Basis must be a number'))
       .nullable()
       .min(0, t('Cost Basis cannot be negative')),
     selling_price: yup
       .number()
       .typeError(t('Selling Price must be a number'))
       .nullable()
       .min(0, t('Selling Price cannot be negative')),
     brand_name: yup.string().nullable(),
     brand_code: yup.string().nullable(),
     oe_code: yup.string().nullable(),
     description: yup.string().nullable(),
     supplier_code: yup.string().nullable(),
     auto_brand_code: yup.boolean().nullable(),
     product_name_id: yup.string().nullable(),
    })
    .required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      auto_brand_code: false,
    },
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
    // Validate client-side first
    const valid = await trigger();
    if (!valid) {
      setToastMessage(t("Please fix the validation errors."));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      const clean = { ...data };
      // When auto is selected, do not send brand_code; instead send auto flag and product_name_id
      if (clean.auto_brand_code) {
        delete clean.brand_code;
        if (!clean.product_name_id) {
          setToastMessage(t('Please select a Product Name for auto brand code generation.'));
          basicStickyNotification.current?.showToast();
          return;
        }
      } else {
        // Manual: do not send helper fields
        delete clean.product_name_id;
        delete clean.auto_brand_code;
      }
      const response = await createProduct(clean).unwrap();
      if (response?.success) {
        setToastMessage(t("Product created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
      } else {
        const msg = response?.message || t('Creation failed');
        throw new Error(msg);
      }
    } catch (error) {
      const msg = getErrorMessage(error, t("Error creating Product."));
      setToastMessage(msg);
    }
    basicStickyNotification.current?.showToast();
  };

  const onUpdate = async (data) => {
    const valid = await trigger();
    if (!valid) {
      setToastMessage(t("Please fix the validation errors."));
      basicStickyNotification.current?.showToast();
      return;
    }
    setShowUpdateModal(false)
    try {
      const clean = { ...data };
      if (clean.auto_brand_code) {
        delete clean.brand_code;
        if (!clean.product_name_id) {
          setToastMessage(t('Please select a Product Name for auto brand code generation.'));
          basicStickyNotification.current?.showToast();
          setShowUpdateModal(true);
          return;
        }
      } else {
        delete clean.product_name_id;
        delete clean.auto_brand_code;
      }
      const response = await updateProduct(clean).unwrap();
      if (response?.success) {
        setToastMessage(t('Product updated successfully'));
        setRefetch(true)
      } else {
        const msg = response?.message || t('Update failed');
        throw new Error(msg);
      }
    } catch (error) {
      setShowUpdateModal(true)
      const msg = getErrorMessage(error, t('Error updating Product.'))
      setToastMessage(msg);
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = await deleteProduct(id);
        if (response && response.success !== false && !response.error) {
          setToastMessage(t("Product deleted successfully."));
          setRefetch(true);
        } else {
          const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Deletion failed');
          throw new Error(msg);
        }
      }
    catch (error) {
      const msg = getErrorMessage(error, t("Error deleting Product."));
      setToastMessage(msg);
    }
    basicStickyNotification.current?.showToast();
  };    

  // Extract meaningful error message from server/RTK Query responses
  const getErrorMessage = (err, fallback = t("An error occurred")) => {
    try {
      const data = err?.data || err?.error || err;
      const firstError = data?.errors && typeof data.errors === 'object'
        ? Object.values(data.errors).flat().find(Boolean)
        : null;
      return data?.message || firstError || err?.message || fallback;
    } catch (_) {
      return fallback;
    }
  };

  // Product Rule state
  const [activeRuleTab, setActiveRuleTab] = useState('customer'); // 'customer' | 'supplier'
  
  // Customer Rule state
  const [ruleCustomer, setRuleCustomer] = useState(null);
  const [customerRuleQuantity, setCustomerRuleQuantity] = useState(1);
  const [customerRulePrice, setCustomerRulePrice] = useState(0);
  const [customerRuleNote, setCustomerRuleNote] = useState("");
  
  // Supplier Rule state
  const [ruleSupplier, setRuleSupplier] = useState(null);
  const [supplierRuleCode, setSupplierRuleCode] = useState('');
  const [supplierRuleQuantity, setSupplierRuleQuantity] = useState(1);
  const [supplierRulePrice, setSupplierRulePrice] = useState(0);
  const [supplierRuleNote, setSupplierRuleNote] = useState("");
  
  const currentProductId = getValues("id");
  const { data: rulesData, refetch: refetchRules } = useGetProductrulesByProductQuery(currentProductId, { skip: !showRuleModal || !currentProductId });
  const [rulesTableRefetch, setRulesTableRefetch] = useState(false);
  
  // Customer Rules Table
  const ruleTableColumnsCustomer = [
    { title: t("ID"), minWidth: 60, field: "id", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Customer"), minWidth: 180, field: "customer_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand"), minWidth: 160, field: "brand_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand Code"), minWidth: 140, field: "brand_code_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("OE Code"), minWidth: 140, field: "oe_code", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Description"), minWidth: 200, field: "description", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Quantity"), minWidth: 100, field: "quantity", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Price"), minWidth: 120, field: "price", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Amount"), minWidth: 130, field: "amount", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true, 
      formatter(cell) { 
        const d = cell.getRow().getData(); 
        const q = Number(d.quantity)||0; 
        const p = Number(d.price)||0; 
        const a = d.amount != null ? Number(d.amount) : (q*p); 
        return (a).toFixed(2);
      } 
    },
    { title: t("Note"), minWidth: 180, field: "note", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
  ];
  
  // Supplier Rules Table
  const ruleTableColumnsSupplier = [
    { title: t("Date"), minWidth: 140, field: "created_at", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Supplier"), minWidth: 180, field: "supplier_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Supplier Code"), minWidth: 150, field: "supplier_code", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand"), minWidth: 160, field: "brand_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand Code"), minWidth: 140, field: "brand_code_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("OE Code"), minWidth: 140, field: "oe_code", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Description"), minWidth: 200, field: "description", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Qty"), minWidth: 100, field: "quantity", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Price"), minWidth: 120, field: "price", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
  ];
  
  // Search columns for filtering
  const ruleSearchColumnsCustomer = ["id", "customer_name", "brand_name", "brand_code_name", "oe_code", "description", "quantity", "price", "note"];
  const ruleSearchColumnsSupplier = ["created_at", "supplier_name", "supplier_code", "brand_name", "brand_code_name", "oe_code", "description", "quantity", "price"];
  
  // Handle form submission
  const handleAddRule = async (type) => {
    if (!currentProductId) {
      setToastMessage(t("No product selected."));
      basicStickyNotification.current?.showToast();
      return;
    }
    
    try {
      console.log('Creating rule with type:', type);
      
      // Get values from form
      const quantity = type === 'customer' 
        ? parseInt(customerRuleQuantity) 
        : parseInt(supplierRuleQuantity);
      
      const price = type === 'customer'
        ? parseFloat(customerRulePrice)
        : parseFloat(supplierRulePrice);
      
      // Validate required fields
      if (isNaN(quantity) || quantity < 1) {
        setToastMessage(t("Please enter a valid quantity (minimum 1)."));
        basicStickyNotification.current?.showToast();
        return;
      }
      
      if (isNaN(price) || price < 0) {
        setToastMessage(t("Please enter a valid price (minimum 0)."));
        basicStickyNotification.current?.showToast();
        return;
      }
      
      // Prepare the base payload with required fields
      const payload = {
        product_id: parseInt(currentProductId),
        quantity: quantity,
        price: price,
        note: type === 'customer' ? customerRuleNote || null : supplierRuleNote || null
      };
      
      // Add customer or supplier specific fields
      if (type === 'customer') {
        if (!ruleCustomer) {
          setToastMessage(t("Please select a customer."));
          basicStickyNotification.current?.showToast();
          return;
        }
        payload.customer_id = parseInt(ruleCustomer.value);
      } else {
        if (!ruleSupplier) {
          setToastMessage(t("Please select a supplier."));
          basicStickyNotification.current?.showToast();
          return;
        }
        payload.supplier_id = parseInt(ruleSupplier.value);
      }
      
      console.log('Final payload:', JSON.stringify(payload, null, 2));
      
      // Send the request
      const res = await createProductrule(payload).unwrap();
      console.log('API Response:', res);
      
      // Handle success
      setToastMessage(t("Product rule added successfully."));
      
      // Reset form
      if (type === 'customer') {
        setRuleCustomer(null);
        setCustomerRuleQuantity(1);
        setCustomerRulePrice(0);
        setCustomerRuleNote("");
      } else {
        setRuleSupplier(null);
        setSupplierRuleCode('');
        setSupplierRuleQuantity(1);
        setSupplierRulePrice(0);
        setSupplierRuleNote("");
      }
      
      // Refresh the rules table
      await refetchRules();
      setRulesTableRefetch(prev => !prev);
      
    } catch (err) {
      console.error('Error in handleAddRule:', {
        error: err,
        message: err.message,
        response: err.data,
        status: err.status
      });
      
      const errorMessage = err.data?.message || 
                         err.message || 
                         t("An error occurred while adding the product rule. Please try again.");
      
      setToastMessage(errorMessage);
      basicStickyNotification.current?.showToast();
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
          <div className="p-5 text-center overflow-y-auto max-h-[110vh]">
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
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Product")}</h2>
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
                  <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    
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
        customDataMapping={(item) => ({ value: item.id, text: item.supplier, code: item.code })}
        onSelectionChange={(item) => {
          if (item && item.code) setValue('supplier_code', item.code);
        }}
      />
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
        </div>
      )}
    </div>

    <div className="mt-3 input-form">
      <FormLabel htmlFor="supplier_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Supplier Code")}
      </FormLabel>
      <FormInput
        {...register("supplier_code")}
        id="supplier_code"
        type="text"
        name="supplier_code"
        className={clsx({ "border-danger": errors.supplier_code })}
        placeholder={t("Auto-filled from supplier selection")}
      />
      {errors.supplier_code && (
        <div className="mt-2 text-danger">{typeof errors.supplier_code.message === "string" && errors.supplier_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="brand_name" className="flex flex-col w-full sm:flex-row">
        {t("Brand")}
      </FormLabel>
      <FormInput
        {...register("brand_name")}
        id="brand_name"
        type="text"
        name="brand_name"
        className={clsx({ "border-danger": errors.brand_name })}
        placeholder={t("Enter brand name (optional)")}
      />
      {errors.brand_name && (
        <div className="mt-2 text-danger">
          {typeof errors.brand_name.message === "string" && errors.brand_name.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Brand Code")}
      </FormLabel>
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={!!watch('auto_brand_code')}
            onChange={(e) => setValue('auto_brand_code', e.target.checked, { shouldDirty: true, shouldValidate: true })}
          />
          <span>{t('Auto-create Code')}</span>
        </label>
      </div>
      {!watch('auto_brand_code') && (
        <>
          <FormInput
            {...register("brand_code")}
            id="brand_code"
            type="text"
            name="brand_code"
            className={clsx({ "border-danger": errors.brand_code })}
            placeholder={t("Enter brand code")}
          />
          {errors.brand_code && (
            <div className="mt-2 text-danger">{typeof errors.brand_code.message === "string" && errors.brand_code.message}</div>
          )}
        </>
      )}
      {watch('auto_brand_code') && (
        <div className="mt-2 text-slate-600 text-xs">
          {t('Auto mode: Use the Description field (Product Name selector) above to choose the Product Name. The selected Product Name will be used for brand code generation.')}
          <div className="mt-1">
            {t('Brand code will be generated as: 1 char Category Code + 2 chars Product Name Code + 3 chars Product Code (capacity 3299 per category+name).')}
          </div>
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Description (Select Product Name)")}
      </FormLabel>
      <TomSelectSearch
        apiUrl={`${app_url}/api/search_productname`}
        setValue={(field, value, options) => {
          if (typeof field === 'string') {
            setValue(field, value, options);
          } else {
            setValue('description', field, value);
          }
        }}
        variable="product_name_id"
        onSelectionChange={(item) => {
          setValue('product_name_id', item?.value, { shouldDirty: true, shouldValidate: true });
          const label = item?.text || '';
          setValue('description', label, { shouldDirty: true, shouldValidate: true });
        }}
        customDataMapping={(item) => {
          const name = item.name_az || '';
          const desc = item.description_en || item.description || '';
          const hs = item.hs_code || '';
          const label = [name, desc || hs].filter(Boolean).join(' — ');
          return { value: item.id, text: label || name || desc || hs };
        }}
        placeholder={t('Search by name or description and select')}
      />
      <div className="mt-2 text-slate-600 text-sm">
        <strong>{t('Selected Description')}:</strong> {getValues('description') || t('None')}
      </div>
      {errors.description && (
        <div className="mt-2 text-danger">{typeof errors.description.message === "string" && errors.description.message}</div>
      )}
    </div>

    {/* OE Code */}
    <div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("OE Code")}</FormLabel>
      <FormInput
        {...register("oe_code")}
        type="text"
        name="oe_code"
        className={clsx({ "border-danger": errors.oe_code })}
        placeholder={t("Enter OE Code")}
      />
      {errors.oe_code && (
        <div className="mt-2 text-danger">{typeof errors.oe_code.message === "string" && errors.oe_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("qty")}
                        id="validation-form-1"
                        type="number"
                        name="qty"
                        className={clsx({
                          "border-danger": errors.qty,
                        })}
                        placeholder={t("Enter qty")}
                      />
                      {errors.qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qty.message === "string" &&
                            errors.qty.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Min Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("min_qty")}
                        id="validation-form-1"
                        type="number"
                        name="min_qty"
                        className={clsx({
                          "border-danger": errors.min_qty,
                        })}
                        placeholder={t("Enter min_qty")}
                      />
                      {errors.min_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.min_qty.message === "string" &&
                            errors.min_qty.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Purchase Price")}
                      </FormLabel>
                      <FormInput
                        {...register("purchase_price")}
                        id="validation-form-1"
                        type="number"
                        name="purchase_price"
                        className={clsx({
                          "border-danger": errors.purchase_price,
                        })}
                        placeholder={t("Enter purchase_price")}
                      />
                      {errors.purchase_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.purchase_price.message === "string" &&
                            errors.purchase_price.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Cost")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_cost")}
                        id="validation-form-1"
                        type="number"
                        name="extra_cost"
                        className={clsx({
                          "border-danger": errors.extra_cost,
                        })}
                        placeholder={t("Enter extra_cost")}
                      />
                      {errors.extra_cost && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_cost.message === "string" &&
                            errors.extra_cost.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Cost Basis")}
                      </FormLabel>
                      <FormInput
                        {...register("cost_basis")}
                        id="validation-form-1"
                        type="number"
                        name="cost_basis"
                        className={clsx({
                          "border-danger": errors.cost_basis,
                        })}
                        placeholder={t("Enter cost_basis")}
                      />
                      {errors.cost_basis && (
                        <div className="mt-2 text-danger">
                          {typeof errors.cost_basis.message === "string" &&
                            errors.cost_basis.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Selling Price")}
                      </FormLabel>
                      <FormInput
                        {...register("selling_price")}
                        id="validation-form-1"
                        type="number"
                        name="selling_price"
                        className={clsx({
                          "border-danger": errors.selling_price,
                        })}
                        placeholder={t("Enter selling_price")}
                      />
                      {errors.selling_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.selling_price.message === "string" &&
                            errors.selling_price.message}
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
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Product")}</h2>
              <div className="mt-2 text-left">
                <Button type="button" variant="outline-primary" onClick={() => setShowRuleModal((v) => !v)}>
                  {showRuleModal ? t("Hide Product Rule") : t("Open Product Rule")}
                </Button>
              </div>
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
                  <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    
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
        customDataMapping={(item) => ({ value: item.id, text: item.supplier, code: item.code })}
        onSelectionChange={(item) => {
          if (item && item.code) setValue('supplier_code', item.code);
        }}
      />
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
        </div>
      )}
    </div>

    <div className="mt-3 input-form">
      <FormLabel htmlFor="supplier_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Supplier Code")}
      </FormLabel>
      <FormInput
        {...register("supplier_code")}
        id="supplier_code"
        type="text"
        name="supplier_code"
        className={clsx({ "border-danger": errors.supplier_code })}
        placeholder={t("Auto-filled from supplier selection")}
      />
      {errors.supplier_code && (
        <div className="mt-2 text-danger">{typeof errors.supplier_code.message === "string" && errors.supplier_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="brand_name" className="flex flex-col w-full sm:flex-row">
        {t("Brand")}
      </FormLabel>
      <FormInput
        {...register("brand_name")}
        id="brand_name"
        type="text"
        name="brand_name"
        className={clsx({ "border-danger": errors.brand_name })}
        placeholder={t("Enter brand name (optional)")}
      />
      {errors.brand_name && (
        <div className="mt-2 text-danger">
          {typeof errors.brand_name.message === "string" && errors.brand_name.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Brand Code")}
      </FormLabel>
      <div className="flex items-center gap-4 mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="form-check-input"
            checked={!!watch('auto_brand_code')}
            onChange={(e) => setValue('auto_brand_code', e.target.checked, { shouldDirty: true, shouldValidate: true })}
          />
          <span>{t('Auto-create Code')}</span>
        </label>
      </div>
      {!watch('auto_brand_code') && (
        <>
          <FormInput
            {...register("brand_code")}
            id="brand_code"
            type="text"
            name="brand_code"
            className={clsx({ "border-danger": errors.brand_code })}
            placeholder={t("Enter brand code")}
          />
          {errors.brand_code && (
            <div className="mt-2 text-danger">{typeof errors.brand_code.message === "string" && errors.brand_code.message}</div>
          )}
        </>
      )}
      {watch('auto_brand_code') && (
        <div className="mt-2 text-slate-600 text-xs">
          {t('Auto mode: Use the Description field (Product Name selector) above to choose the Product Name. The selected Product Name will be used for brand code generation.')}
          <div className="mt-1">
            {t('Brand code will be generated as: 1 char Category Code + 2 chars Product Name Code + 3 chars Product Code (capacity 3299 per category+name).')}
          </div>
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Description (Select Product Name)")}
      </FormLabel>
      <TomSelectSearch
        apiUrl={`${app_url}/api/search_productname`}
        setValue={(field, value, options) => {
          if (typeof field === 'string') {
            setValue(field, value, options);
          } else {
            setValue('description', field, value);
          }
        }}
        variable="product_name_id"
        onSelectionChange={(item) => {
          setValue('product_name_id', item?.value, { shouldDirty: true, shouldValidate: true });
          const label = item?.text || '';
          setValue('description', label, { shouldDirty: true, shouldValidate: true });
        }}
        customDataMapping={(item) => {
          const name = item.name_az || '';
          const desc = item.description_en || item.description || '';
          const hs = item.hs_code || '';
          const label = [name, desc || hs].filter(Boolean).join(' — ');
          return { value: item.id, text: label || name || desc || hs };
        }}
        placeholder={t('Search by name or description and select')}
      />
      <div className="mt-2 text-slate-600 text-sm">
        <strong>{t('Selected Description')}:</strong> {getValues('description') || t('None')}
      </div>
      {errors.description && (
        <div className="mt-2 text-danger">{typeof errors.description.message === "string" && errors.description.message}</div>
      )}
    </div>

    {/* OE Code */}
    <div className="mt-3 input-form">
      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("OE Code")}</FormLabel>
      <FormInput
        {...register("oe_code")}
        type="text"
        name="oe_code"
        className={clsx({ "border-danger": errors.oe_code })}
        placeholder={t("Enter OE Code")}
      />
      {errors.oe_code && (
        <div className="mt-2 text-danger">{typeof errors.oe_code.message === "string" && errors.oe_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("qty")}
                        id="validation-form-1"
                        type="number"
                        name="qty"
                        className={clsx({
                          "border-danger": errors.qty,
                        })}
                        placeholder={t("Enter qty")}
                      />
                      {errors.qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qty.message === "string" &&
                            errors.qty.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Min Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("min_qty")}
                        id="validation-form-1"
                        type="number"
                        name="min_qty"
                        className={clsx({
                          "border-danger": errors.min_qty,
                        })}
                        placeholder={t("Enter min_qty")}
                      />
                      {errors.min_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.min_qty.message === "string" &&
                            errors.min_qty.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Purchase Price")}
                      </FormLabel>
                      <FormInput
                        {...register("purchase_price")}
                        id="validation-form-1"
                        type="number"
                        name="purchase_price"
                        className={clsx({
                          "border-danger": errors.purchase_price,
                        })}
                        placeholder={t("Enter purchase_price")}
                      />
                      {errors.purchase_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.purchase_price.message === "string" &&
                            errors.purchase_price.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Cost")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_cost")}
                        id="validation-form-1"
                        type="number"
                        name="extra_cost"
                        className={clsx({
                          "border-danger": errors.extra_cost,
                        })}
                        placeholder={t("Enter extra_cost")}
                      />
                      {errors.extra_cost && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_cost.message === "string" &&
                            errors.extra_cost.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Cost Basis")}
                      </FormLabel>
                      <FormInput
                        {...register("cost_basis")}
                        id="validation-form-1"
                        type="number"
                        name="cost_basis"
                        className={clsx({
                          "border-danger": errors.cost_basis,
                        })}
                        placeholder={t("Enter cost_basis")}
                      />
                      {errors.cost_basis && (
                        <div className="mt-2 text-danger">
                          {typeof errors.cost_basis.message === "string" &&
                            errors.cost_basis.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Selling Price")}
                      </FormLabel>
                      <FormInput
                        {...register("selling_price")}
                        id="validation-form-1"
                        type="number"
                        name="selling_price"
                        className={clsx({
                          "border-danger": errors.selling_price,
                        })}
                        placeholder={t("Enter selling_price")}
                      />
                      {errors.selling_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.selling_price.message === "string" &&
                            errors.selling_price.message}
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
      {showRuleModal && createPortal(
        <div className="fixed top-0 left-0 h-screen w-full xl:w-[45%] bg-white dark:bg-darkmode-600 shadow-lg overflow-y-auto p-5 z-[200000]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">{t("Product Rules")}</h2>
            <button
              onClick={() => setShowRuleModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="mb-4 flex gap-2">
            <Button 
              type="button" 
              variant={activeRuleTab === 'customer' ? 'primary' : 'outline-secondary'} 
              onClick={() => setActiveRuleTab('customer')}
            >
              {t('Customer Rules')}
            </Button>
            <Button 
              type="button" 
              variant={activeRuleTab === 'supplier' ? 'primary' : 'outline-secondary'} 
              onClick={() => setActiveRuleTab('supplier')}
            >
              {t('Supplier Rules')}
            </Button>
          </div>

          {/* Customer Rules Tab */}
          {activeRuleTab === 'customer' && (
            <>
              {/* Customer Rules Table */}
              <div className="mb-6">
                <TableComponent
                  show_create={false}
                  setShowCreateModal={() => {}}
                  endpoint={`${app_url}/api/productrule?filter[0][field]=product_id&filter[0][type]==&filter[0][value]=${currentProductId ?? ''}&filter[1][field]=supplier_id&filter[1][type]==&filter[1][value]=null`}
                  data={ruleTableColumnsCustomer}
                  searchColumns={ruleSearchColumnsCustomer}
                  refetch={rulesTableRefetch}
                  setRefetch={setRulesTableRefetch}
                  permission={"productrule"}
                  page_name={"Customer Rules"}
                />
              </div>

              {/* Customer Rule Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <h3 className="text-lg font-semibold col-span-full">{t('Add Customer Rule')}</h3>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Customer")}</FormLabel>
                  <TomSelectSearch
                    apiUrl={`${app_url}/api/search_customer`}
                    setValue={setValue}
                    variable="customer_id"
                    customDataMapping={(item) => ({ 
                      value: item.id, 
                      text: item.name_surname || item.shipping_mark || item.email || String(item.id) 
                    })}
                    onSelectionChange={(item) => {
                      setRuleCustomer(item ? { value: item.value, text: item.text } : null);
                    }}
                    value={ruleCustomer?.value}
                  />
                </div>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Quantity")}</FormLabel>
                  <FormInput 
                    type="number" 
                    value={customerRuleQuantity} 
                    onChange={(e) => setCustomerRuleQuantity(e.target.value)} 
                    min="1"
                  />
                </div>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Price")}</FormLabel>
                  <FormInput 
                    type="number" 
                    value={customerRulePrice} 
                    onChange={(e) => setCustomerRulePrice(e.target.value)} 
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="input-form md:col-span-2">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Amount")}</FormLabel>
                  <FormInput 
                    type="text" 
                    value={(customerRuleQuantity * customerRulePrice).toFixed(2)} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="input-form md:col-span-2">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Note")}</FormLabel>
                  <FormInput 
                    type="text" 
                    value={customerRuleNote} 
                    onChange={(e) => setCustomerRuleNote(e.target.value)}
                    placeholder={t('Optional note')}
                  />
                </div>
                <div className="col-span-full flex justify-end">
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={() => handleAddRule('customer')}
                  >
                    {t('Add Customer Rule')}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Supplier Rules Tab */}
          {activeRuleTab === 'supplier' && (
            <>
              {/* Supplier Rules Table */}
              <div className="mb-6">
                <TableComponent
                  show_create={false}
                  setShowCreateModal={() => {}}
                  endpoint={`${app_url}/api/productrule?filter[0][field]=product_id&filter[0][type]==&filter[0][value]=${currentProductId ?? ''}&filter[1][field]=supplier_id&filter[1][type]=!=&filter[1][value]=null`}
                  data={ruleTableColumnsSupplier}
                  searchColumns={ruleSearchColumnsSupplier}
                  refetch={rulesTableRefetch}
                  setRefetch={setRulesTableRefetch}
                  permission={"productrule"}
                  page_name={"Supplier Rules"}
                />
              </div>

              {/* Supplier Rule Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-lg font-semibold col-span-full">{t('Add Supplier Rule')}</h3>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Supplier")}</FormLabel>
                  <TomSelectSearch
                    apiUrl={`${app_url}/api/search_supplier`}
                    setValue={setValue}
                    variable="supplier_id"
                    customDataMapping={(item) => ({ 
                      value: item.id, 
                      text: item.supplier || item.name_surname || String(item.id),
                      code: item.code 
                    })}
                    onSelectionChange={(item) => {
                      setRuleSupplier(item ? { value: item.value, text: item.text } : null);
                      setSupplierRuleCode(item?.code || '');
                    }}
                    value={ruleSupplier?.value}
                  />
                </div>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Supplier Code")}</FormLabel>
                  <FormInput 
                    type="text" 
                    value={supplierRuleCode} 
                    onChange={(e) => setSupplierRuleCode(e.target.value)} 
                    placeholder={t('Enter supplier code')}
                  />
                </div>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Quantity")}</FormLabel>
                  <FormInput 
                    type="number" 
                    value={supplierRuleQuantity} 
                    onChange={(e) => setSupplierRuleQuantity(e.target.value)}
                    min="1"
                  />
                </div>
                <div className="input-form">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Price")}</FormLabel>
                  <FormInput 
                    type="number" 
                    value={supplierRulePrice} 
                    onChange={(e) => setSupplierRulePrice(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="input-form md:col-span-2">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Amount")}</FormLabel>
                  <FormInput 
                    type="text" 
                    value={(supplierRuleQuantity * supplierRulePrice).toFixed(2)} 
                    readOnly 
                    disabled
                  />
                </div>
                <div className="input-form md:col-span-2">
                  <FormLabel className="flex flex-col w-full sm:flex-row">{t("Note")}</FormLabel>
                  <FormInput 
                    type="text" 
                    value={supplierRuleNote} 
                    onChange={(e) => setSupplierRuleNote(e.target.value)}
                    placeholder={t('Optional note')}
                  />
                </div>
                <div className="col-span-full flex justify-end">
                  <Button 
                    type="button" 
                    variant="primary" 
                    onClick={() => handleAddRule('supplier')}
                  >
                    {t('Add Supplier Rule')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>,
        document.body
      )}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        options={{ duration: 3000 }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
      <Can permission="product-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/product"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Product"}
        />
      </Can>
    </div>
  );
};

export default index_main;
