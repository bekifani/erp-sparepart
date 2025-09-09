
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
  useCreateProductstatusMutation,
  useDeleteProductstatusMutation,
  useEditProductstatusMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
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
    useState(t("Are you Sure Do You want to Delete Productstatus"));

  
 const [
    createProductstatus,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductstatusMutation();
  const [
    updateProductstatus,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductstatusMutation();
  const [
    deleteProductstatus,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductstatusMutation()


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
      title: t("Status Key"),
      minWidth: 200,
      field: "status_key",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Status Name En"),
      minWidth: 200,
      field: "status_name_en",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Status Name Ch"),
      minWidth: 200,
      field: "status_name_ch",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Status Name Az"),
      minWidth: 200,
      field: "status_name_az",
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
        let permission = "productstatus";
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
  const [searchColumns, setSearchColumns] = useState(['status_key', 'status_name_en', 'status_name_ch', 'status_name_az', 'description', ]);

  // schema
  const schema = yup
    .object({
     status_key : yup.string().required(t('The Status Key field is required')), 
status_name_en : yup.string().required(t('The Status Name En field is required')), 
status_name_ch : yup.string().required(t('The Status Name Ch field is required')), 
status_name_az : yup.string().required(t('The Status Name Az field is required')), 
description : yup.string().required(t('The Description field is required')), 

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
      const response = await createProductstatus(data);
      setToastMessage(t("Productstatus created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Productstatus."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateProductstatus(data);
      setToastMessage(t('Productstatus updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Productstatus deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteProductstatus(id);
        setToastMessage(t("Productstatus deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Productstatus."));
    }
    basicStickyNotification.current?.showToast();
  };    

return (
    <div>
      <Slideover
        size="xl"
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <Slideover.Panel>
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
        </Slideover.Panel>
      </Slideover>


      <Slideover
        size="xl"
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
      >
        <Slideover.Panel className="text-center">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Productstatus")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="relative">
                {loading || updating || deleting ? (
                  <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                    <div className="w-full h-full flex justify-center items-center">
                      <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                    </div>
                  </div>
                ) : (
                  <div className=" w-full grid grid-cols-2 gap-4 gap-y-3">
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Key")}
                      </FormLabel>
                      <FormInput
                        {...register("status_key")}
                        id="validation-form-1"
                        type="text"
                        name="status_key"
                        className={clsx({
                          "border-danger": errors.status_key,
                        })}
                        placeholder={t("Enter status_key")}
                      />
                      {errors.status_key && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_key.message === "string" &&
                            errors.status_key.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name En")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_en")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_en"
                        className={clsx({
                          "border-danger": errors.status_name_en,
                        })}
                        placeholder={t("Enter status_name_en")}
                      />
                      {errors.status_name_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_en.message === "string" &&
                            errors.status_name_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name Ch")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_ch")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_ch"
                        className={clsx({
                          "border-danger": errors.status_name_ch,
                        })}
                        placeholder={t("Enter status_name_ch")}
                      />
                      {errors.status_name_ch && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_ch.message === "string" &&
                            errors.status_name_ch.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name Az")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_az")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_az"
                        className={clsx({
                          "border-danger": errors.status_name_az,
                        })}
                        placeholder={t("Enter status_name_az")}
                      />
                      {errors.status_name_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_az.message === "string" &&
                            errors.status_name_az.message}
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
        size="xl"
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
      >
        <Slideover.Panel className="text-center">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Productstatus")}</h2>
            </Slideover.Title>
            <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
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
                        {t("Status Key")}
                      </FormLabel>
                      <FormInput
                        {...register("status_key")}
                        id="validation-form-1"
                        type="text"
                        name="status_key"
                        className={clsx({
                          "border-danger": errors.status_key,
                        })}
                        placeholder={t("Enter status_key")}
                      />
                      {errors.status_key && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_key.message === "string" &&
                            errors.status_key.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name En")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_en")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_en"
                        className={clsx({
                          "border-danger": errors.status_name_en,
                        })}
                        placeholder={t("Enter status_name_en")}
                      />
                      {errors.status_name_en && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_en.message === "string" &&
                            errors.status_name_en.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name Ch")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_ch")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_ch"
                        className={clsx({
                          "border-danger": errors.status_name_ch,
                        })}
                        placeholder={t("Enter status_name_ch")}
                      />
                      {errors.status_name_ch && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_ch.message === "string" &&
                            errors.status_name_ch.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status Name Az")}
                      </FormLabel>
                      <FormInput
                        {...register("status_name_az")}
                        id="validation-form-1"
                        type="text"
                        name="status_name_az"
                        className={clsx({
                          "border-danger": errors.status_name_az,
                        })}
                        placeholder={t("Enter status_name_az")}
                      />
                      {errors.status_name_az && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status_name_az.message === "string" &&
                            errors.status_name_az.message}
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
      <Can permission="productstatus-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/productstatus"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Productstatus"}
        />
      </Can>
    </div>
  );
}
export default index_main;
