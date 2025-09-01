
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
  useCreateLabelMutation,
  useDeleteLabelMutation,
  useEditLabelMutation,
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
    useState(t("Are you Sure Do You want to Delete Label"));

  
 const [
    createLabel,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateLabelMutation();
  const [
    updateLabel,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditLabelMutation();
  const [
    deleteLabel,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteLabelMutation()


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
      title: t("Label Name"),
      minWidth: 200,
      field: "label_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Price"),
      minWidth: 200,
      field: "price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Stock Qty"),
      minWidth: 200,
      field: "stock_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Order Qty"),
      minWidth: 200,
      field: "order_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Labels Size A"),
      minWidth: 200,
      field: "labels_size_a",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Labels Size B"),
      minWidth: 200,
      field: "labels_size_b",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
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
      title: t("Design File"),
      minWidth: 200,
      field: "design_file",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
      return getMiniDisplay(cell.getData().design_file)
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
      title: t("Operation Mode"),
      minWidth: 200,
      field: "operation_mode",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Is Factory Supplied"),
      minWidth: 200,
      field: "is_factory_supplied",
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
        let permission = "label";
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
  const [searchColumns, setSearchColumns] = useState(['brand', 'label_name', 'price', 'stock_qty', 'order_qty', 'labels_size_a', 'labels_size_b', 'additional_note', 'operation_mode', 'is_factory_supplied', ]);

  // schema
  const schema = yup
    .object({
     brand : yup.string().required(t('The Brand field is required')), 
label_name : yup.string().required(t('The Label Name field is required')), 
image : yup.string().required(t('The Image field is required')), 
design_file : yup.string().required(t('The Design File field is required')), 
additional_note : yup.string().required(t('The Additional Note field is required')), 
operation_mode : yup.string().required(t('The Operation Mode field is required')), 
is_factory_supplied : yup.string().required(t('The Is Factory Supplied field is required')), 

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

   

          const setUploadImage  = (value) => {
              setValue('image', value);
            } 

        
          const setUploadDesign_file  = (value) => {
              setValue('design_file', value);
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
      const response = await createLabel(data);
      setToastMessage(t("Label created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Label."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateLabel(data);
      setToastMessage(t('Label updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Label deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteLabel(id);
        setToastMessage(t("Label deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Label."));
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
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Label")}</h2>
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
                        {t("Label Name")}
                      </FormLabel>
                      <FormInput
                        {...register("label_name")}
                        id="validation-form-1"
                        type="text"
                        name="label_name"
                        className={clsx({
                          "border-danger": errors.label_name,
                        })}
                        placeholder={t("Enter label_name")}
                      />
                      {errors.label_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.label_name.message === "string" &&
                            errors.label_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Price")}
                      </FormLabel>
                      <FormInput
                        {...register("price")}
                        id="validation-form-1"
                        type="number"
                        name="price"
                        className={clsx({
                          "border-danger": errors.price,
                        })}
                        placeholder={t("Enter price")}
                      />
                      {errors.price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.price.message === "string" &&
                            errors.price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Stock Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("stock_qty")}
                        id="validation-form-1"
                        type="number"
                        name="stock_qty"
                        className={clsx({
                          "border-danger": errors.stock_qty,
                        })}
                        placeholder={t("Enter stock_qty")}
                      />
                      {errors.stock_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.stock_qty.message === "string" &&
                            errors.stock_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("order_qty")}
                        id="validation-form-1"
                        type="number"
                        name="order_qty"
                        className={clsx({
                          "border-danger": errors.order_qty,
                        })}
                        placeholder={t("Enter order_qty")}
                      />
                      {errors.order_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_qty.message === "string" &&
                            errors.order_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Labels Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("labels_size_a")}
                        id="validation-form-1"
                        type="number"
                        name="labels_size_a"
                        className={clsx({
                          "border-danger": errors.labels_size_a,
                        })}
                        placeholder={t("Enter labels_size_a")}
                      />
                      {errors.labels_size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.labels_size_a.message === "string" &&
                            errors.labels_size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Labels Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("labels_size_b")}
                        id="validation-form-1"
                        type="number"
                        name="labels_size_b"
                        className={clsx({
                          "border-danger": errors.labels_size_b,
                        })}
                        placeholder={t("Enter labels_size_b")}
                      />
                      {errors.labels_size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.labels_size_b.message === "string" &&
                            errors.labels_size_b.message}
                        </div>
                      )}
                    </div>


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadDesign_file}/>
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
                        {t("Operation Mode")}
                      </FormLabel>
                      <FormInput
                        {...register("operation_mode")}
                        id="validation-form-1"
                        type="text"
                        name="operation_mode"
                        className={clsx({
                          "border-danger": errors.operation_mode,
                        })}
                        placeholder={t("Enter operation_mode")}
                      />
                      {errors.operation_mode && (
                        <div className="mt-2 text-danger">
                          {typeof errors.operation_mode.message === "string" &&
                            errors.operation_mode.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Factory Supplied")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            /> Active
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> Inactive
      </div>
          </div>
      {errors.is_factory_supplied && (
        <div className="mt-2 text-danger">
          {typeof errors.is_factory_supplied.message === "string" &&
            errors.is_factory_supplied.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Label")}</h2>
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
                        {t("Label Name")}
                      </FormLabel>
                      <FormInput
                        {...register("label_name")}
                        id="validation-form-1"
                        type="text"
                        name="label_name"
                        className={clsx({
                          "border-danger": errors.label_name,
                        })}
                        placeholder={t("Enter label_name")}
                      />
                      {errors.label_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.label_name.message === "string" &&
                            errors.label_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Price")}
                      </FormLabel>
                      <FormInput
                        {...register("price")}
                        id="validation-form-1"
                        type="number"
                        name="price"
                        className={clsx({
                          "border-danger": errors.price,
                        })}
                        placeholder={t("Enter price")}
                      />
                      {errors.price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.price.message === "string" &&
                            errors.price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Stock Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("stock_qty")}
                        id="validation-form-1"
                        type="number"
                        name="stock_qty"
                        className={clsx({
                          "border-danger": errors.stock_qty,
                        })}
                        placeholder={t("Enter stock_qty")}
                      />
                      {errors.stock_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.stock_qty.message === "string" &&
                            errors.stock_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("order_qty")}
                        id="validation-form-1"
                        type="number"
                        name="order_qty"
                        className={clsx({
                          "border-danger": errors.order_qty,
                        })}
                        placeholder={t("Enter order_qty")}
                      />
                      {errors.order_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_qty.message === "string" &&
                            errors.order_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Labels Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("labels_size_a")}
                        id="validation-form-1"
                        type="number"
                        name="labels_size_a"
                        className={clsx({
                          "border-danger": errors.labels_size_a,
                        })}
                        placeholder={t("Enter labels_size_a")}
                      />
                      {errors.labels_size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.labels_size_a.message === "string" &&
                            errors.labels_size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Labels Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("labels_size_b")}
                        id="validation-form-1"
                        type="number"
                        name="labels_size_b"
                        className={clsx({
                          "border-danger": errors.labels_size_b,
                        })}
                        placeholder={t("Enter labels_size_b")}
                      />
                      {errors.labels_size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.labels_size_b.message === "string" &&
                            errors.labels_size_b.message}
                        </div>
                      )}
                    </div>


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadDesign_file}/>
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
                        {t("Operation Mode")}
                      </FormLabel>
                      <FormInput
                        {...register("operation_mode")}
                        id="validation-form-1"
                        type="text"
                        name="operation_mode"
                        className={clsx({
                          "border-danger": errors.operation_mode,
                        })}
                        placeholder={t("Enter operation_mode")}
                      />
                      {errors.operation_mode && (
                        <div className="mt-2 text-danger">
                          {typeof errors.operation_mode.message === "string" &&
                            errors.operation_mode.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Factory Supplied")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            /> Active
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> Inactive
      </div>
          </div>
      {errors.is_factory_supplied && (
        <div className="mt-2 text-danger">
          {typeof errors.is_factory_supplied.message === "string" &&
            errors.is_factory_supplied.message}
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
      <Can permission="label-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/label"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Label"}
        />
      </Can>
    </div>
  );
}
export default index_main;
