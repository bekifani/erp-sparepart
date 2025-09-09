
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
  useCreateAttachmentMutation,
  useDeleteAttachmentMutation,
  useEditAttachmentMutation,
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
    useState(t("Are you Sure Do You want to Delete Attachment"));

  
 const [
    createAttachment,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateAttachmentMutation();
  const [
    updateAttachment,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditAttachmentMutation();
  const [
    deleteAttachment,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteAttachmentMutation()


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
      title: t("Entity Type"),
      minWidth: 200,
      field: "entity_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Entity Id"),
      minWidth: 200,
      field: "entity_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("File Path"),
      minWidth: 200,
      field: "file_path",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("File Type"),
      minWidth: 200,
      field: "file_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Original Filename"),
      minWidth: 200,
      field: "original_filename",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Uploaded By"),
      minWidth: 200,
      field: "uploaded_by",
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
        let permission = "attachment";
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
  const [searchColumns, setSearchColumns] = useState(['entity_type', 'entity_id', 'file_path', 'file_type', 'original_filename', 'uploaded_by', ]);

  // schema
  const schema = yup
    .object({
     entity_type : yup.string().required(t('The Entity Type field is required')), 
file_path : yup.string().required(t('The File Path field is required')), 
file_type : yup.string().required(t('The File Type field is required')), 
original_filename : yup.string().required(t('The Original Filename field is required')), 
uploaded_by : yup.string().required(t('The Uploaded By field is required')), 

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
      const response = await createAttachment(data);
      setToastMessage(t("Attachment created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Attachment."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateAttachment(data);
      setToastMessage(t('Attachment updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Attachment deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteAttachment(id);
        setToastMessage(t("Attachment deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Attachment."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Attachment")}</h2>
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
                        {t("Entity Type")}
                      </FormLabel>
                      <FormInput
                        {...register("entity_type")}
                        id="validation-form-1"
                        type="text"
                        name="entity_type"
                        className={clsx({
                          "border-danger": errors.entity_type,
                        })}
                        placeholder={t("Enter entity_type")}
                      />
                      {errors.entity_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.entity_type.message === "string" &&
                            errors.entity_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Entity Id")}
                      </FormLabel>
                      <FormInput
                        {...register("entity_id")}
                        id="validation-form-1"
                        type="number"
                        name="entity_id"
                        className={clsx({
                          "border-danger": errors.entity_id,
                        })}
                        placeholder={t("Enter entity_id")}
                      />
                      {errors.entity_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.entity_id.message === "string" &&
                            errors.entity_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("File Path")}
                      </FormLabel>
                      <FormInput
                        {...register("file_path")}
                        id="validation-form-1"
                        type="text"
                        name="file_path"
                        className={clsx({
                          "border-danger": errors.file_path,
                        })}
                        placeholder={t("Enter file_path")}
                      />
                      {errors.file_path && (
                        <div className="mt-2 text-danger">
                          {typeof errors.file_path.message === "string" &&
                            errors.file_path.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("File Type")}
                      </FormLabel>
                      <FormInput
                        {...register("file_type")}
                        id="validation-form-1"
                        type="text"
                        name="file_type"
                        className={clsx({
                          "border-danger": errors.file_type,
                        })}
                        placeholder={t("Enter file_type")}
                      />
                      {errors.file_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.file_type.message === "string" &&
                            errors.file_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Original Filename")}
                      </FormLabel>
                      <FormInput
                        {...register("original_filename")}
                        id="validation-form-1"
                        type="text"
                        name="original_filename"
                        className={clsx({
                          "border-danger": errors.original_filename,
                        })}
                        placeholder={t("Enter original_filename")}
                      />
                      {errors.original_filename && (
                        <div className="mt-2 text-danger">
                          {typeof errors.original_filename.message === "string" &&
                            errors.original_filename.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Uploaded By")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="uploaded_by"/>
      {errors.uploaded_by && (
        <div className="mt-2 text-danger">
          {typeof errors.uploaded_by.message === "string" &&
            errors.uploaded_by.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Attachment")}</h2>
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
                        {t("Entity Type")}
                      </FormLabel>
                      <FormInput
                        {...register("entity_type")}
                        id="validation-form-1"
                        type="text"
                        name="entity_type"
                        className={clsx({
                          "border-danger": errors.entity_type,
                        })}
                        placeholder={t("Enter entity_type")}
                      />
                      {errors.entity_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.entity_type.message === "string" &&
                            errors.entity_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Entity Id")}
                      </FormLabel>
                      <FormInput
                        {...register("entity_id")}
                        id="validation-form-1"
                        type="number"
                        name="entity_id"
                        className={clsx({
                          "border-danger": errors.entity_id,
                        })}
                        placeholder={t("Enter entity_id")}
                      />
                      {errors.entity_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.entity_id.message === "string" &&
                            errors.entity_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("File Path")}
                      </FormLabel>
                      <FormInput
                        {...register("file_path")}
                        id="validation-form-1"
                        type="text"
                        name="file_path"
                        className={clsx({
                          "border-danger": errors.file_path,
                        })}
                        placeholder={t("Enter file_path")}
                      />
                      {errors.file_path && (
                        <div className="mt-2 text-danger">
                          {typeof errors.file_path.message === "string" &&
                            errors.file_path.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("File Type")}
                      </FormLabel>
                      <FormInput
                        {...register("file_type")}
                        id="validation-form-1"
                        type="text"
                        name="file_type"
                        className={clsx({
                          "border-danger": errors.file_type,
                        })}
                        placeholder={t("Enter file_type")}
                      />
                      {errors.file_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.file_type.message === "string" &&
                            errors.file_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Original Filename")}
                      </FormLabel>
                      <FormInput
                        {...register("original_filename")}
                        id="validation-form-1"
                        type="text"
                        name="original_filename"
                        className={clsx({
                          "border-danger": errors.original_filename,
                        })}
                        placeholder={t("Enter original_filename")}
                      />
                      {errors.original_filename && (
                        <div className="mt-2 text-danger">
                          {typeof errors.original_filename.message === "string" &&
                            errors.original_filename.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Uploaded By")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="uploaded_by"/>
      {errors.uploaded_by && (
        <div className="mt-2 text-danger">
          {typeof errors.uploaded_by.message === "string" &&
            errors.uploaded_by.message}
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
      <Can permission="attachment-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/attachment"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Attachment"}
        />
      </Can>
    </div>
  );
}
export default index_main;
