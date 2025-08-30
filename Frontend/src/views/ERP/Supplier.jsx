
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
        let permission = "supplier";
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
  const [searchColumns, setSearchColumns] = useState(['supplier', 'name_surname', 'occupation', 'code', 'address', 'email', 'phone_number', 'whatsapp', 'wechat_id', 'number_of_products', 'category_of_products', 'name_of_products', 'additional_note', ]);

  // schema
  const schema = yup
    .object({
     supplier : yup.string().required(t('The Supplier field is required')), 
name_surname : yup.string().required(t('The Name Surname field is required')), 
occupation : yup.string().required(t('The Occupation field is required')), 
code : yup.string().required(t('The Code field is required')), 
address : yup.string().required(t('The Address field is required')), 
phone_number : yup.string().required(t('The Phone Number field is required')), 
whatsapp : yup.string().required(t('The Whatsapp field is required')), 
wechat_id : yup.string().required(t('The Wechat Id field is required')), 
image : yup.string().required(t('The Image field is required')), 
category_of_products : yup.string().required(t('The Category Of Products field is required')), 
name_of_products : yup.string().required(t('The Name Of Products field is required')), 
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
      const response = await createSupplier(data);
      setToastMessage(t("Supplier created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Supplier."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateSupplier(data);
      setToastMessage(t('Supplier updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Supplier deletion failed'));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Supplier")}</h2>
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


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Number Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("number_of_products")}
                        id="validation-form-1"
                        type="number"
                        name="number_of_products"
                        className={clsx({
                          "border-danger": errors.number_of_products,
                        })}
                        placeholder={t("Enter number_of_products")}
                      />
                      {errors.number_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.number_of_products.message === "string" &&
                            errors.number_of_products.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("category_of_products")}
                        id="validation-form-1"
                        type="text"
                        name="category_of_products"
                        className={clsx({
                          "border-danger": errors.category_of_products,
                        })}
                        placeholder={t("Enter category_of_products")}
                      />
                      {errors.category_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_of_products.message === "string" &&
                            errors.category_of_products.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("name_of_products")}
                        id="validation-form-1"
                        type="text"
                        name="name_of_products"
                        className={clsx({
                          "border-danger": errors.name_of_products,
                        })}
                        placeholder={t("Enter name_of_products")}
                      />
                      {errors.name_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_of_products.message === "string" &&
                            errors.name_of_products.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Supplier")}</h2>
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


          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadImage}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Number Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("number_of_products")}
                        id="validation-form-1"
                        type="number"
                        name="number_of_products"
                        className={clsx({
                          "border-danger": errors.number_of_products,
                        })}
                        placeholder={t("Enter number_of_products")}
                      />
                      {errors.number_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.number_of_products.message === "string" &&
                            errors.number_of_products.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("category_of_products")}
                        id="validation-form-1"
                        type="text"
                        name="category_of_products"
                        className={clsx({
                          "border-danger": errors.category_of_products,
                        })}
                        placeholder={t("Enter category_of_products")}
                      />
                      {errors.category_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_of_products.message === "string" &&
                            errors.category_of_products.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Of Products")}
                      </FormLabel>
                      <FormInput
                        {...register("name_of_products")}
                        id="validation-form-1"
                        type="text"
                        name="name_of_products"
                        className={clsx({
                          "border-danger": errors.name_of_products,
                        })}
                        placeholder={t("Enter name_of_products")}
                      />
                      {errors.name_of_products && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_of_products.message === "string" &&
                            errors.name_of_products.message}
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
    </div>
  );
}
export default index_main;
