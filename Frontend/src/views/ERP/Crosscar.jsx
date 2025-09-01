
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
  useCreateCrosscarMutation,
  useDeleteCrosscarMutation,
  useEditCrosscarMutation,
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
    useState(t("Are you Sure Do You want to Delete Crosscar"));

  
 const [
    createCrosscar,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCrosscarMutation();
  const [
    updateCrosscar,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCrosscarMutation();
  const [
    deleteCrosscar,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCrosscarMutation()


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
      title: t("Product Id"),
      minWidth: 200,
      field: "product_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Car Model Id"),
      minWidth: 200,
      field: "car_model_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Cross Code"),
      minWidth: 200,
      field: "cross_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Is Visible"),
      minWidth: 200,
      field: "is_visible",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Created At"),
      minWidth: 200,
      field: "created_at",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Updated At"),
      minWidth: 200,
      field: "updated_at",
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
        let permission = "crosscar";
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
  const [searchColumns, setSearchColumns] = useState(['product_id', 'car_model_id', 'cross_code', 'is_visible', 'created_at', 'updated_at', ]);

  // schema
  const schema = yup
    .object({
     product_id : yup.string().required(t('The Product Id field is required')), 
car_model_id : yup.string().required(t('The Car Model Id field is required')), 
cross_code : yup.string().required(t('The Cross Code field is required')), 
is_visible : yup.string().required(t('The Is Visible field is required')), 

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
      const response = await createCrosscar(data);
      setToastMessage(t("Crosscar created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Crosscar."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateCrosscar(data);
      setToastMessage(t('Crosscar updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Crosscar deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteCrosscar(id);
        setToastMessage(t("Crosscar deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Crosscar."));
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
          <div className="p-5 text-center overflow-y-auto max-h-[110vh]">
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
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Crosscar")}</h2>
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
        {t("Product Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="product_id"/>
      {errors.product_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_id.message === "string" &&
            errors.product_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Car Model Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_car model`} setValue={setValue} variable="car_model_id"/>
      {errors.car_model_id && (
        <div className="mt-2 text-danger">
          {typeof errors.car_model_id.message === "string" &&
            errors.car_model_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Cross Code")}
                      </FormLabel>
                      <FormInput
                        {...register("cross_code")}
                        id="validation-form-1"
                        type="text"
                        name="cross_code"
                        className={clsx({
                          "border-danger": errors.cross_code,
                        })}
                        placeholder={t("Enter cross_code")}
                      />
                      {errors.cross_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.cross_code.message === "string" &&
                            errors.cross_code.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Visible")}
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
      {errors.is_visible && (
        <div className="mt-2 text-danger">
          {typeof errors.is_visible.message === "string" &&
            errors.is_visible.message}
        </div>
      )}
    </div>
    

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Created At")}
                      </FormLabel>
                      <FormInput
                        {...register("created_at")}
                        id="validation-form-1"
                        type="date"
                        name="created_at"
                        className={clsx({
                          "border-danger": errors.created_at,
                        })}
                        placeholder={t("Enter created_at")}
                      />
                      {errors.created_at && (
                        <div className="mt-2 text-danger">
                          {typeof errors.created_at.message === "string" &&
                            errors.created_at.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Updated At")}
                      </FormLabel>
                      <FormInput
                        {...register("updated_at")}
                        id="validation-form-1"
                        type="date"
                        name="updated_at"
                        className={clsx({
                          "border-danger": errors.updated_at,
                        })}
                        placeholder={t("Enter updated_at")}
                      />
                      {errors.updated_at && (
                        <div className="mt-2 text-danger">
                          {typeof errors.updated_at.message === "string" &&
                            errors.updated_at.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Crosscar")}</h2>
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
        {t("Product Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="product_id"/>
      {errors.product_id && (
        <div className="mt-2 text-danger">
          {typeof errors.product_id.message === "string" &&
            errors.product_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Car Model Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_car model`} setValue={setValue} variable="car_model_id"/>
      {errors.car_model_id && (
        <div className="mt-2 text-danger">
          {typeof errors.car_model_id.message === "string" &&
            errors.car_model_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Cross Code")}
                      </FormLabel>
                      <FormInput
                        {...register("cross_code")}
                        id="validation-form-1"
                        type="text"
                        name="cross_code"
                        className={clsx({
                          "border-danger": errors.cross_code,
                        })}
                        placeholder={t("Enter cross_code")}
                      />
                      {errors.cross_code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.cross_code.message === "string" &&
                            errors.cross_code.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Visible")}
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
      {errors.is_visible && (
        <div className="mt-2 text-danger">
          {typeof errors.is_visible.message === "string" &&
            errors.is_visible.message}
        </div>
      )}
    </div>
    

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Created At")}
                      </FormLabel>
                      <FormInput
                        {...register("created_at")}
                        id="validation-form-1"
                        type="date"
                        name="created_at"
                        className={clsx({
                          "border-danger": errors.created_at,
                        })}
                        placeholder={t("Enter created_at")}
                      />
                      {errors.created_at && (
                        <div className="mt-2 text-danger">
                          {typeof errors.created_at.message === "string" &&
                            errors.created_at.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Updated At")}
                      </FormLabel>
                      <FormInput
                        {...register("updated_at")}
                        id="validation-form-1"
                        type="date"
                        name="updated_at"
                        className={clsx({
                          "border-danger": errors.updated_at,
                        })}
                        placeholder={t("Enter updated_at")}
                      />
                      {errors.updated_at && (
                        <div className="mt-2 text-danger">
                          {typeof errors.updated_at.message === "string" &&
                            errors.updated_at.message}
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
      <Can permission="crosscar-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/crosscar"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Crosscar"}
        />
      </Can>
    </div>
  );
}
export default index_main;
