
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
  useCreateBasketitemMutation,
  useDeleteBasketitemMutation,
  useEditBasketitemMutation,
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
    useState(t("Are you Sure Do You want to Delete Basketitem"));

  
 const [
    createBasketitem,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateBasketitemMutation();
  const [
    updateBasketitem,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditBasketitemMutation();
  const [
    deleteBasketitem,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteBasketitemMutation()


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
      title: t("Basket Id"),
      minWidth: 200,
      field: "basket_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Id"),
      minWidth: 200,
      field: "product_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Brand"),
      minWidth: 200,
      field: "brand",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Brand Code"),
      minWidth: 200,
      field: "brand_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Oe Code"),
      minWidth: 200,
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
      title: t("Unit Price"),
      minWidth: 200,
      field: "unit_price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("File Id"),
      minWidth: 200,
      field: "file_id",
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
      title: t("Line Total"),
      minWidth: 200,
      field: "line_total",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Weight Per Unit"),
      minWidth: 200,
      field: "weight_per_unit",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Volume Per Unit"),
      minWidth: 200,
      field: "volume_per_unit",
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
        let permission = "basketitem";
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
  const [searchColumns, setSearchColumns] = useState(['basket_id', 'product_id', 'brand', 'brand_code', 'oe_code', 'description', 'unit_price', 'file_id', 'qty', 'line_total', 'weight_per_unit', 'volume_per_unit', ]);

  // schema
  const schema = yup
    .object({
     basket_id : yup.string().required(t('The Basket Id field is required')), 
product_id : yup.string().required(t('The Product Id field is required')), 
brand : yup.string().required(t('The Brand field is required')), 
brand_code : yup.string().required(t('The Brand Code field is required')), 
oe_code : yup.string().required(t('The Oe Code field is required')), 
description : yup.string().required(t('The Description field is required')), 
file_id : yup.string().required(t('The File Id field is required')), 

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
    try {
      const response = await createBasketitem(data);
      setToastMessage(t("Basketitem created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Basketitem."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateBasketitem(data);
      setToastMessage(t('Basketitem updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Basketitem deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteBasketitem(id);
        setToastMessage(t("Basketitem deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Basketitem."));
    }
    basicStickyNotification.current?.showToast();
  };    

return (
    <div>
      <Dialog
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <Dialog.Panel>
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
        </Dialog.Panel>
      </Dialog>


      <Dialog
       
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <form onSubmit={handleSubmit(onCreate)}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Basketitem")}</h2>
            </Dialog.Title>
            <Dialog.Description className="relative">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-1 gap-4 gap-y-3">
                    
   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Basket Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_basket`} setValue={setValue} variable="basket_id"/>
      {errors.basket_id && (
        <div className="mt-2 text-danger">
          {typeof errors.basket_id.message === "string" &&
            errors.basket_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="product_id"/>
      {errors.product_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_id.message === "string" &&
            errors.product_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Brand")}
                      </FormLabel>
                      <FormInput
                        {...register("brand")}
                        id="validation-form-1"
                        type="text"
                        name="brand"
                        className={clsx({
                          "border-danger": errors.brand,
                        })}
                        placeholder={t("Enter brand")}
                      />
                      {errors.brand && (
                        <div className="mt-2 text-danger">
                          {typeof errors.brand.message === "string" &&
                            errors.brand.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Brand Code")}
                      </FormLabel>
                      <FormInput
                        {...register("brand_code")}
                        id="validation-form-1"
                        type="text"
                        name="brand_code"
                        className={clsx({
                          "border-danger": errors.brand_code,
                        })}
                        placeholder={t("Enter brand_code")}
                      />
                      {errors.brand_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.brand_code.message === "string" &&
                            errors.brand_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Oe Code")}
                      </FormLabel>
                      <FormInput
                        {...register("oe_code")}
                        id="validation-form-1"
                        type="text"
                        name="oe_code"
                        className={clsx({
                          "border-danger": errors.oe_code,
                        })}
                        placeholder={t("Enter oe_code")}
                      />
                      {errors.oe_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.oe_code.message === "string" &&
                            errors.oe_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Description")}
                      </FormLabel>
                      <FormInput
                        {...register("description")}
                        id="validation-form-1"
                        type="text"
                        name="description"
                        className={clsx({
                          "border-danger": errors.description,
                        })}
                        placeholder={t("Enter description")}
                      />
                      {errors.description && (
                        <div className="mt-2 text-danger">
                          {typeof errors.description.message === "string" &&
                            errors.description.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Unit Price")}
                      </FormLabel>
                      <FormInput
                        {...register("unit_price")}
                        id="validation-form-1"
                        type="number"
                        name="unit_price"
                        className={clsx({
                          "border-danger": errors.unit_price,
                        })}
                        placeholder={t("Enter unit_price")}
                      />
                      {errors.unit_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.unit_price.message === "string" &&
                            errors.unit_price.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("File Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_file`} setValue={setValue} variable="file_id"/>
      {errors.file_id && (
        <div className="mt-2 text-danger">
          {typeof errors.file_id.message === "string" &&
            errors.file_id.message}
        </div>
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
                        {t("Line Total")}
                      </FormLabel>
                      <FormInput
                        {...register("line_total")}
                        id="validation-form-1"
                        type="number"
                        name="line_total"
                        className={clsx({
                          "border-danger": errors.line_total,
                        })}
                        placeholder={t("Enter line_total")}
                      />
                      {errors.line_total && (
                        <div className="mt-2 text-danger">
                          {typeof errors.line_total.message === "string" &&
                            errors.line_total.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Weight Per Unit")}
                      </FormLabel>
                      <FormInput
                        {...register("weight_per_unit")}
                        id="validation-form-1"
                        type="number"
                        name="weight_per_unit"
                        className={clsx({
                          "border-danger": errors.weight_per_unit,
                        })}
                        placeholder={t("Enter weight_per_unit")}
                      />
                      {errors.weight_per_unit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.weight_per_unit.message === "string" &&
                            errors.weight_per_unit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Volume Per Unit")}
                      </FormLabel>
                      <FormInput
                        {...register("volume_per_unit")}
                        id="validation-form-1"
                        type="number"
                        name="volume_per_unit"
                        className={clsx({
                          "border-danger": errors.volume_per_unit,
                        })}
                        placeholder={t("Enter volume_per_unit")}
                      />
                      {errors.volume_per_unit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.volume_per_unit.message === "string" &&
                            errors.volume_per_unit.message}
                        </div>
                      )}
                    </div>


                  </div>
                      )}
              </div>
            </Dialog.Description>
            <Dialog.Footer>
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
            </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>
      <Dialog
       
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Basketitem")}</h2>
            </Dialog.Title>
            <Dialog.Description className="relative">
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
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Basket Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_basket`} setValue={setValue} variable="basket_id"/>
      {errors.basket_id && (
        <div className="mt-2 text-danger">
          {typeof errors.basket_id.message === "string" &&
            errors.basket_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="product_id"/>
      {errors.product_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_id.message === "string" &&
            errors.product_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Brand")}
                      </FormLabel>
                      <FormInput
                        {...register("brand")}
                        id="validation-form-1"
                        type="text"
                        name="brand"
                        className={clsx({
                          "border-danger": errors.brand,
                        })}
                        placeholder={t("Enter brand")}
                      />
                      {errors.brand && (
                        <div className="mt-2 text-danger">
                          {typeof errors.brand.message === "string" &&
                            errors.brand.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Brand Code")}
                      </FormLabel>
                      <FormInput
                        {...register("brand_code")}
                        id="validation-form-1"
                        type="text"
                        name="brand_code"
                        className={clsx({
                          "border-danger": errors.brand_code,
                        })}
                        placeholder={t("Enter brand_code")}
                      />
                      {errors.brand_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.brand_code.message === "string" &&
                            errors.brand_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Oe Code")}
                      </FormLabel>
                      <FormInput
                        {...register("oe_code")}
                        id="validation-form-1"
                        type="text"
                        name="oe_code"
                        className={clsx({
                          "border-danger": errors.oe_code,
                        })}
                        placeholder={t("Enter oe_code")}
                      />
                      {errors.oe_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.oe_code.message === "string" &&
                            errors.oe_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Description")}
                      </FormLabel>
                      <FormInput
                        {...register("description")}
                        id="validation-form-1"
                        type="text"
                        name="description"
                        className={clsx({
                          "border-danger": errors.description,
                        })}
                        placeholder={t("Enter description")}
                      />
                      {errors.description && (
                        <div className="mt-2 text-danger">
                          {typeof errors.description.message === "string" &&
                            errors.description.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Unit Price")}
                      </FormLabel>
                      <FormInput
                        {...register("unit_price")}
                        id="validation-form-1"
                        type="number"
                        name="unit_price"
                        className={clsx({
                          "border-danger": errors.unit_price,
                        })}
                        placeholder={t("Enter unit_price")}
                      />
                      {errors.unit_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.unit_price.message === "string" &&
                            errors.unit_price.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("File Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_file`} setValue={setValue} variable="file_id"/>
      {errors.file_id && (
        <div className="mt-2 text-danger">
          {typeof errors.file_id.message === "string" &&
            errors.file_id.message}
        </div>
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
                        {t("Line Total")}
                      </FormLabel>
                      <FormInput
                        {...register("line_total")}
                        id="validation-form-1"
                        type="number"
                        name="line_total"
                        className={clsx({
                          "border-danger": errors.line_total,
                        })}
                        placeholder={t("Enter line_total")}
                      />
                      {errors.line_total && (
                        <div className="mt-2 text-danger">
                          {typeof errors.line_total.message === "string" &&
                            errors.line_total.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Weight Per Unit")}
                      </FormLabel>
                      <FormInput
                        {...register("weight_per_unit")}
                        id="validation-form-1"
                        type="number"
                        name="weight_per_unit"
                        className={clsx({
                          "border-danger": errors.weight_per_unit,
                        })}
                        placeholder={t("Enter weight_per_unit")}
                      />
                      {errors.weight_per_unit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.weight_per_unit.message === "string" &&
                            errors.weight_per_unit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Volume Per Unit")}
                      </FormLabel>
                      <FormInput
                        {...register("volume_per_unit")}
                        id="validation-form-1"
                        type="number"
                        name="volume_per_unit"
                        className={clsx({
                          "border-danger": errors.volume_per_unit,
                        })}
                        placeholder={t("Enter volume_per_unit")}
                      />
                      {errors.volume_per_unit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.volume_per_unit.message === "string" &&
                            errors.volume_per_unit.message}
                        </div>
                      )}
                    </div>


                  </div>
                )}
              </div>
            </Dialog.Description>
            <Dialog.Footer>
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
            </Dialog.Footer>
          </form>
        </Dialog.Panel>
      </Dialog>
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
      <Can permission="basketitem-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/basketitem"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Basketitem"}
        />
      </Can>
    </div>
  );
}
export default index_main;
