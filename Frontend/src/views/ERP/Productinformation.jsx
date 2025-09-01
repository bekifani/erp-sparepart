
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
  useCreateProductinformationMutation,
  useDeleteProductinformationMutation,
  useEditProductinformationMutation,
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
    useState(t("Are you Sure Do You want to Delete ProductInformation"));

  
const [
    createProductinformation,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductinformationMutation();
  
  const [
    updateProductinformation,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductinformationMutation();
  
  const [
    deleteProductinformation,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductinformationMutation();


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
      title: t("Product Name Id"),
      minWidth: 200,
      field: "product_name_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Code"),
      minWidth: 200,
      field: "product_code",
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
      title: t("Net Weight"),
      minWidth: 200,
      field: "net_weight",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Gross Weight"),
      minWidth: 200,
      field: "gross_weight",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Unit Id"),
      minWidth: 200,
      field: "unit_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Box Id"),
      minWidth: 200,
      field: "box_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Size A"),
      minWidth: 200,
      field: "product_size_a",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Size B"),
      minWidth: 200,
      field: "product_size_b",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Size C"),
      minWidth: 200,
      field: "product_size_c",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Volume"),
      minWidth: 200,
      field: "volume",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Label Id"),
      minWidth: 200,
      field: "label_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Qr Code"),
      minWidth: 200,
      field: "qr_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Properties"),
      minWidth: 200,
      field: "properties",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Technical Image"),
      minWidth: 200,
      field: "technical_image",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
      return getMiniDisplay(cell.getData().technical_image)
      }
    },
    

    {
      title: t("Image"),
      minWidth: 200,
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
      title: t("Size Mode"),
      minWidth: 200,
      field: "size_mode",
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
        let permission = "productinformation";
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
  const [searchColumns, setSearchColumns] = useState(['product_name_id', 'product_code', 'brand_code', 'oe_code', 'description', 'net_weight', 'gross_weight', 'unit_id', 'box_id', 'product_size_a', 'product_size_b', 'product_size_c', 'volume', 'label_id', 'qr_code', 'properties', 'size_mode', 'additional_note', ]);

  // schema
  const schema = yup
    .object({
     product_name_id : yup.string().required(t('The Product Name Id field is required')), 
product_code : yup.string().required(t('The Product Code field is required')), 
brand_code : yup.string().required(t('The Brand Code field is required')), 
oe_code : yup.string().required(t('The Oe Code field is required')), 
description : yup.string().required(t('The Description field is required')), 
unit_id : yup.string().required(t('The Unit Id field is required')), 
box_id : yup.string().required(t('The Box Id field is required')), 
label_id : yup.string().required(t('The Label Id field is required')), 
qr_code : yup.string().required(t('The Qr Code field is required')), 
properties : yup.string().required(t('The Properties field is required')), 
technical_image : yup.string().required(t('The Technical Image field is required')), 
image : yup.string().required(t('The Image field is required')), 
size_mode : yup.string().required(t('The Size Mode field is required')), 
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

   

          const setUploadTechnical_image  = (value) => {
              setValue('technical_image', value);
            } 

        
          const setUploadImage  = (value) => {
              setValue('image', value);
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
    try {
      const response = await createProductinformation(data);
      setToastMessage(t("ProductInformation created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating ProductInformation."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateProductinformation(data);
      setToastMessage(t('ProductInformation updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('ProductInformation deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteProductinformation(id);
        setToastMessage(t("ProductInformation deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting ProductInformation."));
    }
    basicStickyNotification.current?.showToast();
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


      <Slideover
       
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New ProductInformation")}</h2>
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
                    
   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product Name Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product name`} setValue={setValue} variable="product_name_id"/>
      {errors.product_name_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_name_id.message === "string" &&
            errors.product_name_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Code")}
                      </FormLabel>
                      <FormInput
                        {...register("product_code")}
                        id="validation-form-1"
                        type="text"
                        name="product_code"
                        className={clsx({
                          "border-danger": errors.product_code,
                        })}
                        placeholder={t("Enter product_code")}
                      />
                      {errors.product_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_code.message === "string" &&
                            errors.product_code.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Brand Code")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_brand`} setValue={setValue} variable="brand_code"/>
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
                        {t("Net Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("net_weight")}
                        id="validation-form-1"
                        type="number"
                        name="net_weight"
                        className={clsx({
                          "border-danger": errors.net_weight,
                        })}
                        placeholder={t("Enter net_weight")}
                      />
                      {errors.net_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.net_weight.message === "string" &&
                            errors.net_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Gross Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("gross_weight")}
                        id="validation-form-1"
                        type="number"
                        name="gross_weight"
                        className={clsx({
                          "border-danger": errors.gross_weight,
                        })}
                        placeholder={t("Enter gross_weight")}
                      />
                      {errors.gross_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.gross_weight.message === "string" &&
                            errors.gross_weight.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Unit Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_unit`} setValue={setValue} variable="unit_id"/>
      {errors.unit_id && (
        <div className="mt-2 text-danger">
          {typeof errors.unit_id.message === "string" &&
            errors.unit_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Box Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_box`} setValue={setValue} variable="box_id"/>
      {errors.box_id && (
        <div className="mt-2 text-danger">
          {typeof errors.box_id.message === "string" &&
            errors.box_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_a")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_a"
                        className={clsx({
                          "border-danger": errors.product_size_a,
                        })}
                        placeholder={t("Enter product_size_a")}
                      />
                      {errors.product_size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_a.message === "string" &&
                            errors.product_size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_b")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_b"
                        className={clsx({
                          "border-danger": errors.product_size_b,
                        })}
                        placeholder={t("Enter product_size_b")}
                      />
                      {errors.product_size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_b.message === "string" &&
                            errors.product_size_b.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size C")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_c")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_c"
                        className={clsx({
                          "border-danger": errors.product_size_c,
                        })}
                        placeholder={t("Enter product_size_c")}
                      />
                      {errors.product_size_c && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_c.message === "string" &&
                            errors.product_size_c.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("volume")}
                        id="validation-form-1"
                        type="number"
                        name="volume"
                        className={clsx({
                          "border-danger": errors.volume,
                        })}
                        placeholder={t("Enter volume")}
                      />
                      {errors.volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.volume.message === "string" &&
                            errors.volume.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Label Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_label`} setValue={setValue} variable="label_id"/>
      {errors.label_id && (
        <div className="mt-2 text-danger">
          {typeof errors.label_id.message === "string" &&
            errors.label_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qr Code")}
                      </FormLabel>
                      <FormInput
                        {...register("qr_code")}
                        id="validation-form-1"
                        type="text"
                        name="qr_code"
                        className={clsx({
                          "border-danger": errors.qr_code,
                        })}
                        placeholder={t("Enter qr_code")}
                      />
                      {errors.qr_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qr_code.message === "string" &&
                            errors.qr_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Properties")}
                      </FormLabel>
                      <FormInput
                        {...register("properties")}
                        id="validation-form-1"
                        type="text"
                        name="properties"
                        className={clsx({
                          "border-danger": errors.properties,
                        })}
                        placeholder={t("Enter properties")}
                      />
                      {errors.properties && (
                        <div className="mt-2 text-danger">
                          {typeof errors.properties.message === "string" &&
                            errors.properties.message}
                        </div>
                      )}
                    </div>


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadTechnical_image}/>
          </div>
        
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size Mode")}
                      </FormLabel>
                      <FormInput
                        {...register("size_mode")}
                        id="validation-form-1"
                        type="text"
                        name="size_mode"
                        className={clsx({
                          "border-danger": errors.size_mode,
                        })}
                        placeholder={t("Enter size_mode")}
                      />
                      {errors.size_mode && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_mode.message === "string" &&
                            errors.size_mode.message}
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
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit ProductInformation")}</h2>
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
                    
   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product Name Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product name`} setValue={setValue} variable="product_name_id"/>
      {errors.product_name_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_name_id.message === "string" &&
            errors.product_name_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Code")}
                      </FormLabel>
                      <FormInput
                        {...register("product_code")}
                        id="validation-form-1"
                        type="text"
                        name="product_code"
                        className={clsx({
                          "border-danger": errors.product_code,
                        })}
                        placeholder={t("Enter product_code")}
                      />
                      {errors.product_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_code.message === "string" &&
                            errors.product_code.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Brand Code")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_brand`} setValue={setValue} variable="brand_code"/>
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
                        {t("Net Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("net_weight")}
                        id="validation-form-1"
                        type="number"
                        name="net_weight"
                        className={clsx({
                          "border-danger": errors.net_weight,
                        })}
                        placeholder={t("Enter net_weight")}
                      />
                      {errors.net_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.net_weight.message === "string" &&
                            errors.net_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Gross Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("gross_weight")}
                        id="validation-form-1"
                        type="number"
                        name="gross_weight"
                        className={clsx({
                          "border-danger": errors.gross_weight,
                        })}
                        placeholder={t("Enter gross_weight")}
                      />
                      {errors.gross_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.gross_weight.message === "string" &&
                            errors.gross_weight.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Unit Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_unit`} setValue={setValue} variable="unit_id"/>
      {errors.unit_id && (
        <div className="mt-2 text-danger">
          {typeof errors.unit_id.message === "string" &&
            errors.unit_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Box Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_box`} setValue={setValue} variable="box_id"/>
      {errors.box_id && (
        <div className="mt-2 text-danger">
          {typeof errors.box_id.message === "string" &&
            errors.box_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_a")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_a"
                        className={clsx({
                          "border-danger": errors.product_size_a,
                        })}
                        placeholder={t("Enter product_size_a")}
                      />
                      {errors.product_size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_a.message === "string" &&
                            errors.product_size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_b")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_b"
                        className={clsx({
                          "border-danger": errors.product_size_b,
                        })}
                        placeholder={t("Enter product_size_b")}
                      />
                      {errors.product_size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_b.message === "string" &&
                            errors.product_size_b.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Size C")}
                      </FormLabel>
                      <FormInput
                        {...register("product_size_c")}
                        id="validation-form-1"
                        type="number"
                        name="product_size_c"
                        className={clsx({
                          "border-danger": errors.product_size_c,
                        })}
                        placeholder={t("Enter product_size_c")}
                      />
                      {errors.product_size_c && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_size_c.message === "string" &&
                            errors.product_size_c.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("volume")}
                        id="validation-form-1"
                        type="number"
                        name="volume"
                        className={clsx({
                          "border-danger": errors.volume,
                        })}
                        placeholder={t("Enter volume")}
                      />
                      {errors.volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.volume.message === "string" &&
                            errors.volume.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Label Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_label`} setValue={setValue} variable="label_id"/>
      {errors.label_id && (
        <div className="mt-2 text-danger">
          {typeof errors.label_id.message === "string" &&
            errors.label_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qr Code")}
                      </FormLabel>
                      <FormInput
                        {...register("qr_code")}
                        id="validation-form-1"
                        type="text"
                        name="qr_code"
                        className={clsx({
                          "border-danger": errors.qr_code,
                        })}
                        placeholder={t("Enter qr_code")}
                      />
                      {errors.qr_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qr_code.message === "string" &&
                            errors.qr_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Properties")}
                      </FormLabel>
                      <FormInput
                        {...register("properties")}
                        id="validation-form-1"
                        type="text"
                        name="properties"
                        className={clsx({
                          "border-danger": errors.properties,
                        })}
                        placeholder={t("Enter properties")}
                      />
                      {errors.properties && (
                        <div className="mt-2 text-danger">
                          {typeof errors.properties.message === "string" &&
                            errors.properties.message}
                        </div>
                      )}
                    </div>


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadTechnical_image}/>
          </div>
        
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size Mode")}
                      </FormLabel>
                      <FormInput
                        {...register("size_mode")}
                        id="validation-form-1"
                        type="text"
                        name="size_mode"
                        className={clsx({
                          "border-danger": errors.size_mode,
                        })}
                        placeholder={t("Enter size_mode")}
                      />
                      {errors.size_mode && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_mode.message === "string" &&
                            errors.size_mode.message}
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
      <Can permission="productInformation-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/productinformation"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"ProductInformation"}
        />
      </Can>
    </div>
  );
}
export default index_main;
