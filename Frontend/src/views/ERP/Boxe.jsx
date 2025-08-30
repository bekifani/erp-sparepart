
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
  useCreateBoxeMutation,
  useDeleteBoxeMutation,
  useEditBoxeMutation,
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
    useState(t("Are you Sure Do You want to Delete Boxe"));

  
 const [
    createBoxe,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateBoxeMutation();
  const [
    updateBoxe,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditBoxeMutation();
  const [
    deleteBoxe,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteBoxeMutation()


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
      title: t("Box Name"),
      minWidth: 200,
      field: "box_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Material"),
      minWidth: 200,
      field: "material",
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
      title: t("Size A"),
      minWidth: 200,
      field: "size_a",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Size B"),
      minWidth: 200,
      field: "size_b",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Size C"),
      minWidth: 200,
      field: "size_c",
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
      title: t("Label"),
      minWidth: 200,
      field: "label",
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
        let permission = "boxe";
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
  const [searchColumns, setSearchColumns] = useState(['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'additional_note', 'operation_mode', 'is_factory_supplied', ]);

  // schema
  const schema = yup
    .object({
     brand : yup.string().required(t('The Brand field is required')), 
box_name : yup.string().required(t('The Box Name field is required')), 
material : yup.string().required(t('The Material field is required')), 
label : yup.string().required(t('The Label field is required')), 
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
      const response = await createBoxe(data);
      setToastMessage(t("Boxe created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Boxe."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateBoxe(data);
      setToastMessage(t('Boxe updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Boxe deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteBoxe(id);
        setToastMessage(t("Boxe deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Boxe."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Boxe")}</h2>
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
                        {t("Box Name")}
                      </FormLabel>
                      <FormInput
                        {...register("box_name")}
                        id="validation-form-1"
                        type="text"
                        name="box_name"
                        className={clsx({
                          "border-danger": errors.box_name,
                        })}
                        placeholder={t("Enter box_name")}
                      />
                      {errors.box_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.box_name.message === "string" &&
                            errors.box_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Material")}
                      </FormLabel>
                      <FormInput
                        {...register("material")}
                        id="validation-form-1"
                        type="text"
                        name="material"
                        className={clsx({
                          "border-danger": errors.material,
                        })}
                        placeholder={t("Enter material")}
                      />
                      {errors.material && (
                        <div className="mt-2 text-danger">
                          {typeof errors.material.message === "string" &&
                            errors.material.message}
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
                        {t("Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("size_a")}
                        id="validation-form-1"
                        type="number"
                        name="size_a"
                        className={clsx({
                          "border-danger": errors.size_a,
                        })}
                        placeholder={t("Enter size_a")}
                      />
                      {errors.size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_a.message === "string" &&
                            errors.size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("size_b")}
                        id="validation-form-1"
                        type="number"
                        name="size_b"
                        className={clsx({
                          "border-danger": errors.size_b,
                        })}
                        placeholder={t("Enter size_b")}
                      />
                      {errors.size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_b.message === "string" &&
                            errors.size_b.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size C")}
                      </FormLabel>
                      <FormInput
                        {...register("size_c")}
                        id="validation-form-1"
                        type="number"
                        name="size_c"
                        className={clsx({
                          "border-danger": errors.size_c,
                        })}
                        placeholder={t("Enter size_c")}
                      />
                      {errors.size_c && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_c.message === "string" &&
                            errors.size_c.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Label")}
                      </FormLabel>
                      <FormInput
                        {...register("label")}
                        id="validation-form-1"
                        type="text"
                        name="label"
                        className={clsx({
                          "border-danger": errors.label,
                        })}
                        placeholder={t("Enter label")}
                      />
                      {errors.label && (
                        <div className="mt-2 text-danger">
                          {typeof errors.label.message === "string" &&
                            errors.label.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Boxe")}</h2>
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
                        {t("Box Name")}
                      </FormLabel>
                      <FormInput
                        {...register("box_name")}
                        id="validation-form-1"
                        type="text"
                        name="box_name"
                        className={clsx({
                          "border-danger": errors.box_name,
                        })}
                        placeholder={t("Enter box_name")}
                      />
                      {errors.box_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.box_name.message === "string" &&
                            errors.box_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Material")}
                      </FormLabel>
                      <FormInput
                        {...register("material")}
                        id="validation-form-1"
                        type="text"
                        name="material"
                        className={clsx({
                          "border-danger": errors.material,
                        })}
                        placeholder={t("Enter material")}
                      />
                      {errors.material && (
                        <div className="mt-2 text-danger">
                          {typeof errors.material.message === "string" &&
                            errors.material.message}
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
                        {t("Size A")}
                      </FormLabel>
                      <FormInput
                        {...register("size_a")}
                        id="validation-form-1"
                        type="number"
                        name="size_a"
                        className={clsx({
                          "border-danger": errors.size_a,
                        })}
                        placeholder={t("Enter size_a")}
                      />
                      {errors.size_a && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_a.message === "string" &&
                            errors.size_a.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size B")}
                      </FormLabel>
                      <FormInput
                        {...register("size_b")}
                        id="validation-form-1"
                        type="number"
                        name="size_b"
                        className={clsx({
                          "border-danger": errors.size_b,
                        })}
                        placeholder={t("Enter size_b")}
                      />
                      {errors.size_b && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_b.message === "string" &&
                            errors.size_b.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Size C")}
                      </FormLabel>
                      <FormInput
                        {...register("size_c")}
                        id="validation-form-1"
                        type="number"
                        name="size_c"
                        className={clsx({
                          "border-danger": errors.size_c,
                        })}
                        placeholder={t("Enter size_c")}
                      />
                      {errors.size_c && (
                        <div className="mt-2 text-danger">
                          {typeof errors.size_c.message === "string" &&
                            errors.size_c.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Label")}
                      </FormLabel>
                      <FormInput
                        {...register("label")}
                        id="validation-form-1"
                        type="text"
                        name="label"
                        className={clsx({
                          "border-danger": errors.label,
                        })}
                        placeholder={t("Enter label")}
                      />
                      {errors.label && (
                        <div className="mt-2 text-danger">
                          {typeof errors.label.message === "string" &&
                            errors.label.message}
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
      <Can permission="boxe-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/boxe"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Boxe"}
        />
      </Can>
    </div>
  );
}
export default index_main;
