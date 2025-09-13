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
  useCreateCategorMutation,
  useDeleteCategorMutation,
  useEditCategorMutation,
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
    useState(t("Are you Sure Do You want to Delete Categor"));

  
 const [
    createCategor,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCategorMutation();
  const [
    updateCategor,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCategorMutation();
  const [
    deleteCategor,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCategorMutation()


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
      title: t("Category En"),
      minWidth: 200,
      field: "category_en",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Category Ru"),
      minWidth: 200,
      field: "category_ru",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Category Cn"),
      minWidth: 200,
      field: "category_cn",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Category Az"),
      minWidth: 200,
      field: "category_az",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Category Code"),
      minWidth: 200,
      field: "category_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    
    {
      title: t("Product Qty"),
      minWidth: 120,
      field: "products_count",
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
        let permission = "categor";
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
  const [searchColumns, setSearchColumns] = useState(['category_en', 'category_ru', 'category_cn', 'category_az', 'category_code', ]);

  // schema
  const allowedCategoryCode = /^[0-9SPEBNMCFGHRTZXDYKLVJUAW]$/i;
  const schema = yup
    .object({
     category_en : yup.string().required(t('The Category En field is required')), 
category_ru : yup.string().required(t('The Category Ru field is required')), 
category_cn : yup.string().required(t('The Category Cn field is required')), 
category_az : yup.string().required(t('The Category Az field is required')), 
category_code : yup
      .string()
      .transform((v) => (v ? v.toString().trim().toUpperCase().slice(0,1) : v))
      .required(t('The Category Code field is required'))
      .length(1, t('Category Code must be exactly 1 character'))
      .matches(allowedCategoryCode, t('Allowed: digits 0-9 or one of S P E B N M C F G H R T Z X D Y K L V J U A W')), 

    })
    .required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    setError,
    reset,
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
      await createCategor(data).unwrap();
      setToastMessage(t("Categor created successfully."));
      // Clear form after successful create
      reset({
        category_en: '',
        category_ru: '',
        category_cn: '',
        category_az: '',
        category_code: '',
      });
    } catch (error) {
      // Map backend validation errors to field errors
      const backendErrors = error?.data?.errors || error?.data?.data?.errors;
      if (backendErrors && typeof backendErrors === 'object') {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          setError(field, { type: 'server', message });
        });
      }
      const serverMsg = error?.data?.message
        || (backendErrors && Object.values(backendErrors).flat()[0])
        || error?.error
        || t("Error creating Categor.");
      setToastMessage(serverMsg);
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      await updateCategor(data).unwrap();
      setToastMessage(t('Categor updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      const backendErrors = error?.data?.errors || error?.data?.data?.errors;
      if (backendErrors && typeof backendErrors === 'object') {
        Object.entries(backendErrors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : String(messages);
          setError(field, { type: 'server', message });
        });
      }
      const serverMsg = error?.data?.message
        || (backendErrors && Object.values(backendErrors).flat()[0])
        || error?.error
        || t('Categor update failed');
      setToastMessage(serverMsg);
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteCategor(id);
        setToastMessage(t("Categor deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Categor."));
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
        size="xl"
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
        size="xl"
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Categor")}</h2>
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
                        {t("Category En")}
                      </FormLabel>
                      <FormInput
                        {...register("category_en")}
                        id="validation-form-1"
                        type="text"
                        name="category_en"
                        className={clsx({
                          "border-danger": errors.category_en,
                        })}
                        placeholder={t("Enter category_en")}
                      />
                      {errors.category_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_en.message === "string" &&
                            errors.category_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("category_ru")}
                        id="validation-form-1"
                        type="text"
                        name="category_ru"
                        className={clsx({
                          "border-danger": errors.category_ru,
                        })}
                        placeholder={t("Enter category_ru")}
                      />
                      {errors.category_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_ru.message === "string" &&
                            errors.category_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("category_cn")}
                        id="validation-form-1"
                        type="text"
                        name="category_cn"
                        className={clsx({
                          "border-danger": errors.category_cn,
                        })}
                        placeholder={t("Enter category_cn")}
                      />
                      {errors.category_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_cn.message === "string" &&
                            errors.category_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Az")}
                      </FormLabel>
                      <FormInput
                        {...register("category_az")}
                        id="validation-form-1"
                        type="text"
                        name="category_az"
                        className={clsx({
                          "border-danger": errors.category_az,
                        })}
                        placeholder={t("Enter category_az")}
                      />
                      {errors.category_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_az.message === "string" &&
                            errors.category_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Code")}
                      </FormLabel>
                      <FormInput
                        {...register("category_code", { onChange: (e) => {
                          const raw = e.target.value || '';
                          // allow only allowed set, uppercase, and max 1 char
                          const up = raw.toUpperCase();
                          const allowed = '0123456789SPEBNMCFGHRTZXDYKLVJUAW';
                          const filtered = up.split('').filter(ch => allowed.includes(ch)).join('');
                          const val = filtered.slice(0,1);
                          setValue('category_code', val, { shouldDirty: true, shouldValidate: true });
                        }})}
                        id="validation-form-1"
                        type="text"
                        name="category_code"
                        className={clsx({
                          "border-danger": errors.category_code,
                        })}
                        placeholder={t("Enter category_code")}
                      />
                      {errors.category_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_code.message === "string" &&
                            errors.category_code.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Categor")}</h2>
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
                        {t("Category En")}
                      </FormLabel>
                      <FormInput
                        {...register("category_en")}
                        id="validation-form-1"
                        type="text"
                        name="category_en"
                        className={clsx({
                          "border-danger": errors.category_en,
                        })}
                        placeholder={t("Enter category_en")}
                      />
                      {errors.category_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_en.message === "string" &&
                            errors.category_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("category_ru")}
                        id="validation-form-1"
                        type="text"
                        name="category_ru"
                        className={clsx({
                          "border-danger": errors.category_ru,
                        })}
                        placeholder={t("Enter category_ru")}
                      />
                      {errors.category_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_ru.message === "string" &&
                            errors.category_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("category_cn")}
                        id="validation-form-1"
                        type="text"
                        name="category_cn"
                        className={clsx({
                          "border-danger": errors.category_cn,
                        })}
                        placeholder={t("Enter category_cn")}
                      />
                      {errors.category_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_cn.message === "string" &&
                            errors.category_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Az")}
                      </FormLabel>
                      <FormInput
                        {...register("category_az")}
                        id="validation-form-1"
                        type="text"
                        name="category_az"
                        className={clsx({
                          "border-danger": errors.category_az,
                        })}
                        placeholder={t("Enter category_az")}
                      />
                      {errors.category_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_az.message === "string" &&
                            errors.category_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Category Code")}
                      </FormLabel>
                      <FormInput
                        {...register("category_code", { onChange: (e) => {
                          const raw = e.target.value || '';
                          const up = raw.toUpperCase();
                          const allowed = '0123456789SPEBNMCFGHRTZXDYKLVJUAW';
                          const filtered = up.split('').filter(ch => allowed.includes(ch)).join('');
                          const val = filtered.slice(0,1);
                          setValue('category_code', val, { shouldDirty: true, shouldValidate: true });
                        }})}
                        id="validation-form-1"
                        type="text"
                        name="category_code"
                        className={clsx({
                          "border-danger": errors.category_code,
                        })}
                        placeholder={t("Enter category_code")}
                      />
                      {errors.category_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.category_code.message === "string" &&
                            errors.category_code.message}
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
        options={{ duration: 3000, close: true }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>
      <Can permission="categor-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/categor"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Categor"}
        />
      </Can>
    </div>
  );
}
export default index_main;
