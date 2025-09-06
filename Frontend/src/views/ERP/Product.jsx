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
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
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
    'brand_name',
    'brand_code_name',
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
     brand_id: yup.string().nullable(),
     brand_code: yup.string().nullable(),
     oe_code: yup.string().nullable(),
     description: yup.string().nullable(),
     supplier_code: yup.string().nullable(),
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
    // Validate client-side first
    const valid = await trigger();
    if (!valid) {
      setToastMessage(t("Please fix the validation errors."));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      const response = await createProduct(data);
      if (response && response.success !== false && !response.error) {
        setToastMessage(t("Product created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Creation failed');
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
      const response = await updateProduct(data);
      if (response && response.success !== false && !response.error) {
        setToastMessage(t('Product updated successfully'));
        setRefetch(true)
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Update failed');
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
      <FormLabel htmlFor="brand_id" className="flex flex-col w-full sm:flex-row">
        {t("Brand")}
      </FormLabel>
      <TomSelectSearch
        apiUrl={`${app_url}/api/search_brandname`}
        setValue={setValue}
        variable="brand_id"
        customDataMapping={(item) => ({ value: item.id, text: `${item.brand_name}` })}
      />
      {errors.brand_id && (
        <div className="mt-2 text-danger">
          {typeof errors.brand_id.message === "string" && errors.brand_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="brand_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Brand Code")}
      </FormLabel>
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
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="oe_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("OE Code")}
      </FormLabel>
      <FormInput
        {...register("oe_code")}
        id="oe_code"
        type="text"
        name="oe_code"
        className={clsx({ "border-danger": errors.oe_code })}
        placeholder={t("Enter OE code")}
      />
      {errors.oe_code && (
        <div className="mt-2 text-danger">{typeof errors.oe_code.message === "string" && errors.oe_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="description" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Description")}
      </FormLabel>
      <FormInput
        {...register("description")}
        id="description"
        type="text"
        name="description"
        className={clsx({ "border-danger": errors.description })}
        placeholder={t("Enter description")}
      />
      {errors.description && (
        <div className="mt-2 text-danger">{typeof errors.description.message === "string" && errors.description.message}</div>
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
      <FormLabel htmlFor="brand_id" className="flex flex-col w-full sm:flex-row">
        {t("Brand")}
      </FormLabel>
      <TomSelectSearch
        apiUrl={`${app_url}/api/search_brandname`}
        setValue={setValue}
        variable="brand_id"
        customDataMapping={(item) => ({ value: item.id, text: `${item.brand_name}` })}
      />
      {errors.brand_id && (
        <div className="mt-2 text-danger">
          {typeof errors.brand_id.message === "string" && errors.brand_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="brand_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Brand Code")}
      </FormLabel>
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
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="oe_code" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("OE Code")}
      </FormLabel>
      <FormInput
        {...register("oe_code")}
        id="oe_code"
        type="text"
        name="oe_code"
        className={clsx({ "border-danger": errors.oe_code })}
        placeholder={t("Enter OE code")}
      />
      {errors.oe_code && (
        <div className="mt-2 text-danger">{typeof errors.oe_code.message === "string" && errors.oe_code.message}</div>
      )}
    </div>

<div className="mt-3 input-form">
      <FormLabel htmlFor="description" className="flex justify-start items-start flex-col w-full sm:flex-row">
        {t("Description")}
      </FormLabel>
      <FormInput
        {...register("description")}
        id="description"
        type="text"
        name="description"
        className={clsx({ "border-danger": errors.description })}
        placeholder={t("Enter description")}
      />
      {errors.description && (
        <div className="mt-2 text-danger">{typeof errors.description.message === "string" && errors.description.message}</div>
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
}
export default index_main;
