
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
  useCreateProductnameMutation,
  useDeleteProductnameMutation,
  useEditProductnameMutation,
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
    useState(t("Are you Sure Do You want to Delete Productname"));

  
 const [
    createProductname,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductnameMutation();
  const [
    updateProductname,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductnameMutation();
  const [
    deleteProductname,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductnameMutation()


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
      title: t("Hs Code"),
      minWidth: 200,
      field: "hs_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Name Az"),
      minWidth: 200,
      field: "name_az",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Description En"),
      minWidth: 200,
      field: "description_en",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Name Ru"),
      minWidth: 200,
      field: "name_ru",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Name Cn"),
      minWidth: 200,
      field: "name_cn",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Categories"),
      minWidth: 200,
      field: "categories",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product Name Code"),
      minWidth: 200,
      field: "product_name_code",
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
      title: t("Product Qty"),
      minWidth: 200,
      field: "product_qty",
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
        let permission = "productname";
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
  const [searchColumns, setSearchColumns] = useState(['hs_code', 'name_az', 'description_en', 'name_ru', 'name_cn', 'categories', 'product_name_code', 'additional_note', 'product_qty', ]);

  // schema
  const schema = yup
    .object({
     hs_code : yup.string().required(t('The Hs Code field is required')), 
name_az : yup.string().required(t('The Name Az field is required')), 
description_en : yup.string().required(t('The Description En field is required')), 
name_ru : yup.string().required(t('The Name Ru field is required')), 
name_cn : yup.string().required(t('The Name Cn field is required')), 
categories : yup.string().required(t('The Categories field is required')), 
product_name_code : yup.string().required(t('The Product Name Code field is required')), 
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
      const response = await createProductname(data);
      setToastMessage(t("Productname created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Productname."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateProductname(data);
      setToastMessage(t('Productname updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Productname deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteProductname(id);
        setToastMessage(t("Productname deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Productname."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Productname")}</h2>
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
                        {t("Hs Code")}
                      </FormLabel>
                      <FormInput
                        {...register("hs_code")}
                        id="validation-form-1"
                        type="text"
                        name="hs_code"
                        className={clsx({
                          "border-danger": errors.hs_code,
                        })}
                        placeholder={t("Enter hs_code")}
                      />
                      {errors.hs_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.hs_code.message === "string" &&
                            errors.hs_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Az")}
                      </FormLabel>
                      <FormInput
                        {...register("name_az")}
                        id="validation-form-1"
                        type="text"
                        name="name_az"
                        className={clsx({
                          "border-danger": errors.name_az,
                        })}
                        placeholder={t("Enter name_az")}
                      />
                      {errors.name_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_az.message === "string" &&
                            errors.name_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Description En")}
                      </FormLabel>
                      <FormInput
                        {...register("description_en")}
                        id="validation-form-1"
                        type="text"
                        name="description_en"
                        className={clsx({
                          "border-danger": errors.description_en,
                        })}
                        placeholder={t("Enter description_en")}
                      />
                      {errors.description_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.description_en.message === "string" &&
                            errors.description_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("name_ru")}
                        id="validation-form-1"
                        type="text"
                        name="name_ru"
                        className={clsx({
                          "border-danger": errors.name_ru,
                        })}
                        placeholder={t("Enter name_ru")}
                      />
                      {errors.name_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_ru.message === "string" &&
                            errors.name_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("name_cn")}
                        id="validation-form-1"
                        type="text"
                        name="name_cn"
                        className={clsx({
                          "border-danger": errors.name_cn,
                        })}
                        placeholder={t("Enter name_cn")}
                      />
                      {errors.name_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_cn.message === "string" &&
                            errors.name_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Categories")}
                      </FormLabel>
                      <FormInput
                        {...register("categories")}
                        id="validation-form-1"
                        type="text"
                        name="categories"
                        className={clsx({
                          "border-danger": errors.categories,
                        })}
                        placeholder={t("Enter categories")}
                      />
                      {errors.categories && (
                        <div className="mt-2 text-danger">
                          {typeof errors.categories.message === "string" &&
                            errors.categories.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Name Code")}
                      </FormLabel>
                      <FormInput
                        {...register("product_name_code")}
                        id="validation-form-1"
                        type="text"
                        name="product_name_code"
                        className={clsx({
                          "border-danger": errors.product_name_code,
                        })}
                        placeholder={t("Enter product_name_code")}
                      />
                      {errors.product_name_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_name_code.message === "string" &&
                            errors.product_name_code.message}
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
                        {t("Product Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("product_qty")}
                        id="validation-form-1"
                        type="number"
                        name="product_qty"
                        className={clsx({
                          "border-danger": errors.product_qty,
                        })}
                        placeholder={t("Enter product_qty")}
                      />
                      {errors.product_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_qty.message === "string" &&
                            errors.product_qty.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Productname")}</h2>
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
                        {t("Hs Code")}
                      </FormLabel>
                      <FormInput
                        {...register("hs_code")}
                        id="validation-form-1"
                        type="text"
                        name="hs_code"
                        className={clsx({
                          "border-danger": errors.hs_code,
                        })}
                        placeholder={t("Enter hs_code")}
                      />
                      {errors.hs_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.hs_code.message === "string" &&
                            errors.hs_code.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Az")}
                      </FormLabel>
                      <FormInput
                        {...register("name_az")}
                        id="validation-form-1"
                        type="text"
                        name="name_az"
                        className={clsx({
                          "border-danger": errors.name_az,
                        })}
                        placeholder={t("Enter name_az")}
                      />
                      {errors.name_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_az.message === "string" &&
                            errors.name_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Description En")}
                      </FormLabel>
                      <FormInput
                        {...register("description_en")}
                        id="validation-form-1"
                        type="text"
                        name="description_en"
                        className={clsx({
                          "border-danger": errors.description_en,
                        })}
                        placeholder={t("Enter description_en")}
                      />
                      {errors.description_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.description_en.message === "string" &&
                            errors.description_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("name_ru")}
                        id="validation-form-1"
                        type="text"
                        name="name_ru"
                        className={clsx({
                          "border-danger": errors.name_ru,
                        })}
                        placeholder={t("Enter name_ru")}
                      />
                      {errors.name_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_ru.message === "string" &&
                            errors.name_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("name_cn")}
                        id="validation-form-1"
                        type="text"
                        name="name_cn"
                        className={clsx({
                          "border-danger": errors.name_cn,
                        })}
                        placeholder={t("Enter name_cn")}
                      />
                      {errors.name_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_cn.message === "string" &&
                            errors.name_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Categories")}
                      </FormLabel>
                      <FormInput
                        {...register("categories")}
                        id="validation-form-1"
                        type="text"
                        name="categories"
                        className={clsx({
                          "border-danger": errors.categories,
                        })}
                        placeholder={t("Enter categories")}
                      />
                      {errors.categories && (
                        <div className="mt-2 text-danger">
                          {typeof errors.categories.message === "string" &&
                            errors.categories.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Product Name Code")}
                      </FormLabel>
                      <FormInput
                        {...register("product_name_code")}
                        id="validation-form-1"
                        type="text"
                        name="product_name_code"
                        className={clsx({
                          "border-danger": errors.product_name_code,
                        })}
                        placeholder={t("Enter product_name_code")}
                      />
                      {errors.product_name_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_name_code.message === "string" &&
                            errors.product_name_code.message}
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
                        {t("Product Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("product_qty")}
                        id="validation-form-1"
                        type="number"
                        name="product_qty"
                        className={clsx({
                          "border-danger": errors.product_qty,
                        })}
                        placeholder={t("Enter product_qty")}
                      />
                      {errors.product_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.product_qty.message === "string" &&
                            errors.product_qty.message}
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
      <Can permission="productname-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/productname"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Productname"}
        />
      </Can>
    </div>
  );
}
export default index_main;
