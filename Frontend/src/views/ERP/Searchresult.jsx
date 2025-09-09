
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
  useCreateSearchresultMutation,
  useDeleteSearchresultMutation,
  useEditSearchresultMutation,
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
    useState(t("Are you Sure Do You want to Delete Searchresult"));

  
 const [
    createSearchresult,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSearchresultMutation();
  const [
    updateSearchresult,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSearchresultMutation();
  const [
    deleteSearchresult,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSearchresultMutation()


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
      title: t("User Id"),
      minWidth: 200,
      field: "user_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Id"),
      minWidth: 200,
      field: "customer_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Query Text"),
      minWidth: 200,
      field: "query_text",
      hozAlign: "center",
      headerHozAlign: "center",
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
        let permission = "searchresult";
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
  const [searchColumns, setSearchColumns] = useState(['user_id', 'customer_id', 'query_text', 'entity_type', 'entity_id', ]);

  // schema
  const schema = yup
    .object({
     user_id : yup.string().required(t('The User Id field is required')), 
customer_id : yup.string().required(t('The Customer Id field is required')), 
query_text : yup.string().required(t('The Query Text field is required')), 
entity_type : yup.string().required(t('The Entity Type field is required')), 

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
      const response = await createSearchresult(data);
      setToastMessage(t("Searchresult created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Searchresult."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateSearchresult(data);
      setToastMessage(t('Searchresult updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Searchresult deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteSearchresult(id);
        setToastMessage(t("Searchresult deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Searchresult."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Searchresult")}</h2>
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
        {t("User Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="user_id"/>
      {errors.user_id && (
        <div className="mt-2 text-danger">
          {typeof errors.user_id.message === "string" &&
            errors.user_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      {errors.customer_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_id.message === "string" &&
            errors.customer_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Query Text")}
                      </FormLabel>
                      <FormInput
                        {...register("query_text")}
                        id="validation-form-1"
                        type="text"
                        name="query_text"
                        className={clsx({
                          "border-danger": errors.query_text,
                        })}
                        placeholder={t("Enter query_text")}
                      />
                      {errors.query_text && (
                        <div className="mt-2 text-danger">
                          {typeof errors.query_text.message === "string" &&
                            errors.query_text.message}
                        </div>
                      )}
                    </div>


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
              <h2 className="mr-auto text-base font-medium">{t("Edit Searchresult")}</h2>
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
        {t("User Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_user`} setValue={setValue} variable="user_id"/>
      {errors.user_id && (
        <div className="mt-2 text-danger">
          {typeof errors.user_id.message === "string" &&
            errors.user_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      {errors.customer_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_id.message === "string" &&
            errors.customer_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Query Text")}
                      </FormLabel>
                      <FormInput
                        {...register("query_text")}
                        id="validation-form-1"
                        type="text"
                        name="query_text"
                        className={clsx({
                          "border-danger": errors.query_text,
                        })}
                        placeholder={t("Enter query_text")}
                      />
                      {errors.query_text && (
                        <div className="mt-2 text-danger">
                          {typeof errors.query_text.message === "string" &&
                            errors.query_text.message}
                        </div>
                      )}
                    </div>


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
      <Can permission="searchresult-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/searchresult"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Searchresult"}
        />
      </Can>
    </div>
  );
}
export default index_main;
