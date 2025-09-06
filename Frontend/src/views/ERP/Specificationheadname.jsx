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
  useCreateSpecificationheadnameMutation,
  useDeleteSpecificationheadnameMutation,
  useEditSpecificationheadnameMutation,
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
    useState(t("Are you Sure Do You want to Delete Specificationheadname"));

  
 const [
    createSpecificationheadname,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSpecificationheadnameMutation();
  const [
    updateSpecificationheadname,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSpecificationheadnameMutation();
  const [
    deleteSpecificationheadname,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSpecificationheadnameMutation()


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
      title: t("Headname"),
      minWidth: 200,
      field: "headname",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Translate Az"),
      minWidth: 200,
      field: "translate_az",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Translate Ru"),
      minWidth: 200,
      field: "translate_ru",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Translate Ch"),
      minWidth: 200,
      field: "translate_ch",
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
        let permission = "specificationheadname";
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
  const [searchColumns, setSearchColumns] = useState(['headname', 'translate_az', 'translate_ru', 'translate_ch', ]);

  // schema
  const schema = yup
    .object({
     headname : yup.string().required(t('The Headname field is required')), 
translate_az : yup.string().required(t('The Translate Az field is required')), 
translate_ru : yup.string().required(t('The Translate Ru field is required')), 
translate_ch : yup.string().required(t('The Translate Ch field is required')), 

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

  // Pre-submit duplicate check for headname (case-insensitive)
  const headnameExists = async (name, excludeId = null) => {
    try {
      const url = new URL(`${app_url}/api/specificationheadname`);
      // Use Tabulator-like filter expected by index endpoints
      url.searchParams.set('size', '1');
      url.searchParams.set('filter[0][field]', 'headname');
      url.searchParams.set('filter[0][type]', 'like');
      url.searchParams.set('filter[0][value]', name);
      const res = await fetch(url.toString(), { credentials: 'include' });
      const json = await res.json();
      const rows = json?.data?.data || [];
      if (rows.length === 0) return false;
      // Basic case-insensitive comparison and optional id exclusion
      const match = rows.find(r => (r.headname || '').toLowerCase() === (name || '').toLowerCase());
      if (!match) return false;
      if (excludeId && String(match.id) === String(excludeId)) return false;
      return true;
    } catch (_) {
      // On error, do not block; let backend enforce if present
      return false;
    }
  };

  const onCreate = async (data) => {
    const valid = await trigger();
    if (!valid) {
      setToastMessage(t("Please fix the validation errors."));
      basicStickyNotification.current?.showToast();
      return;
    }
    // Duplicate check
    const exists = await headnameExists(data.headname);
    if (exists) {
      setToastMessage(t("Headname already exists."));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      const response = await createSpecificationheadname(data);
      if (response && response.success !== false && !response.error) {
        setToastMessage(t("Specificationheadname created successfully."));
        setRefetch(true);
        setShowCreateModal(false);
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Creation failed');
        throw new Error(msg);
      }
    } catch (error) {
      setToastMessage(getErrorMessage(error, t("Error creating Specificationheadname.")));
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
    // Duplicate check excluding current id
    const exists = await headnameExists(data.headname, data.id);
    if (exists) {
      setToastMessage(t("Headname already exists."));
      basicStickyNotification.current?.showToast();
      return;
    }
    setShowUpdateModal(false)
    try {
      const response = await updateSpecificationheadname(data);
      if (response && response.success !== false && !response.error) {
        setToastMessage(t('Specificationheadname updated successfully'));
        setRefetch(true)
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Update failed');
        throw new Error(msg);
      }
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(getErrorMessage(error, t('Error updating Specificationheadname.')));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteSpecificationheadname(id);
        setToastMessage(t("Specificationheadname deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Specificationheadname."));
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
        size="xl"
      >
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Specificationheadname")}</h2>
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
                        {t("Headname")}
                      </FormLabel>
                      <FormInput
                        {...register("headname")}
                        id="validation-form-1"
                        type="text"
                        name="headname"
                        className={clsx({
                          "border-danger": errors.headname,
                        })}
                        placeholder={t("Enter headname")}
                      />
                      {errors.headname && (
                        <div className="mt-2 text-danger">
                          {typeof errors.headname.message === "string" &&
                            errors.headname.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Az")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_az")}
                        id="validation-form-1"
                        type="text"
                        name="translate_az"
                        className={clsx({
                          "border-danger": errors.translate_az,
                        })}
                        placeholder={t("Enter translate_az")}
                      />
                      {errors.translate_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_az.message === "string" &&
                            errors.translate_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_ru")}
                        id="validation-form-1"
                        type="text"
                        name="translate_ru"
                        className={clsx({
                          "border-danger": errors.translate_ru,
                        })}
                        placeholder={t("Enter translate_ru")}
                      />
                      {errors.translate_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_ru.message === "string" &&
                            errors.translate_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Ch")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_ch")}
                        id="validation-form-1"
                        type="text"
                        name="translate_ch"
                        className={clsx({
                          "border-danger": errors.translate_ch,
                        })}
                        placeholder={t("Enter translate_ch")}
                      />
                      {errors.translate_ch && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_ch.message === "string" &&
                            errors.translate_ch.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Specificationheadname")}</h2>
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
                        {t("Headname")}
                      </FormLabel>
                      <FormInput
                        {...register("headname")}
                        id="validation-form-1"
                        type="text"
                        name="headname"
                        className={clsx({
                          "border-danger": errors.headname,
                        })}
                        placeholder={t("Enter headname")}
                      />
                      {errors.headname && (
                        <div className="mt-2 text-danger">
                          {typeof errors.headname.message === "string" &&
                            errors.headname.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Az")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_az")}
                        id="validation-form-1"
                        type="text"
                        name="translate_az"
                        className={clsx({
                          "border-danger": errors.translate_az,
                        })}
                        placeholder={t("Enter translate_az")}
                      />
                      {errors.translate_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_az.message === "string" &&
                            errors.translate_az.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Ru")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_ru")}
                        id="validation-form-1"
                        type="text"
                        name="translate_ru"
                        className={clsx({
                          "border-danger": errors.translate_ru,
                        })}
                        placeholder={t("Enter translate_ru")}
                      />
                      {errors.translate_ru && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_ru.message === "string" &&
                            errors.translate_ru.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Translate Ch")}
                      </FormLabel>
                      <FormInput
                        {...register("translate_ch")}
                        id="validation-form-1"
                        type="text"
                        name="translate_ch"
                        className={clsx({
                          "border-danger": errors.translate_ch,
                        })}
                        placeholder={t("Enter translate_ch")}
                      />
                      {errors.translate_ch && (
                        <div className="mt-2 text-danger">
                          {typeof errors.translate_ch.message === "string" &&
                            errors.translate_ch.message}
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
      <Can permission="specificationheadname-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/specificationheadname"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Specificationheadname"}
        />
      </Can>
    </div>
  );
}
export default index_main;
