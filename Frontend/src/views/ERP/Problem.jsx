
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
  useCreateProblemMutation,
  useDeleteProblemMutation,
  useEditProblemMutation,
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
    useState(t("Are you Sure Do You want to Delete Problem"));

  
 const [
    createProblem,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProblemMutation();
  const [
    updateProblem,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProblemMutation();
  const [
    deleteProblem,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProblemMutation()


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
      title: t("Problem Number"),
      minWidth: 200,
      field: "problem_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Supplier Invoice Id"),
      minWidth: 200,
      field: "supplier_invoice_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Invoice Id"),
      minWidth: 200,
      field: "customer_invoice_id",
      hozAlign: "center",
      headerHozAlign: "center",
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
      title: t("Problem Type"),
      minWidth: 200,
      field: "problem_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Solution Type"),
      minWidth: 200,
      field: "solution_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Status Id"),
      minWidth: 200,
      field: "status_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Refund Amount"),
      minWidth: 200,
      field: "refund_amount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Internal Note"),
      minWidth: 200,
      field: "internal_note",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Note"),
      minWidth: 200,
      field: "customer_note",
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
        let permission = "problem";
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
  const [searchColumns, setSearchColumns] = useState(['problem_number', 'supplier_invoice_id', 'customer_invoice_id', 'user_id', 'problem_type', 'solution_type', 'status_id', 'refund_amount', 'internal_note', 'customer_note', ]);

  // schema
  const schema = yup
    .object({
     problem_number : yup.string().required(t('The Problem Number field is required')), 
supplier_invoice_id : yup.string().required(t('The Supplier Invoice Id field is required')), 
customer_invoice_id : yup.string().required(t('The Customer Invoice Id field is required')), 
user_id : yup.string().required(t('The User Id field is required')), 
problem_type : yup.string().required(t('The Problem Type field is required')), 
solution_type : yup.string().required(t('The Solution Type field is required')), 
status_id : yup.string().required(t('The Status Id field is required')), 
internal_note : yup.string().required(t('The Internal Note field is required')), 
customer_note : yup.string().required(t('The Customer Note field is required')), 

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
      const response = await createProblem(data);
      setToastMessage(t("Problem created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Problem."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateProblem(data);
      setToastMessage(t('Problem updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Problem deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteProblem(id);
        setToastMessage(t("Problem deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Problem."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Problem")}</h2>
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
                        {t("Problem Number")}
                      </FormLabel>
                      <FormInput
                        {...register("problem_number")}
                        id="validation-form-1"
                        type="text"
                        name="problem_number"
                        className={clsx({
                          "border-danger": errors.problem_number,
                        })}
                        placeholder={t("Enter problem_number")}
                      />
                      {errors.problem_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.problem_number.message === "string" &&
                            errors.problem_number.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Invoice Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier invoice`} setValue={setValue} variable="supplier_invoice_id"/>
      {errors.supplier_invoice_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_invoice_id.message === "string" &&
            errors.supplier_invoice_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Invoice Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer invoice`} setValue={setValue} variable="customer_invoice_id"/>
      {errors.customer_invoice_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_invoice_id.message === "string" &&
            errors.customer_invoice_id.message}
        </div>
      )}
    </div>

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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Problem Type")}
                      </FormLabel>
                      <FormInput
                        {...register("problem_type")}
                        id="validation-form-1"
                        type="text"
                        name="problem_type"
                        className={clsx({
                          "border-danger": errors.problem_type,
                        })}
                        placeholder={t("Enter problem_type")}
                      />
                      {errors.problem_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.problem_type.message === "string" &&
                            errors.problem_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Solution Type")}
                      </FormLabel>
                      <FormInput
                        {...register("solution_type")}
                        id="validation-form-1"
                        type="text"
                        name="solution_type"
                        className={clsx({
                          "border-danger": errors.solution_type,
                        })}
                        placeholder={t("Enter solution_type")}
                      />
                      {errors.solution_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.solution_type.message === "string" &&
                            errors.solution_type.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Status Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_status`} setValue={setValue} variable="status_id"/>
      {errors.status_id && (
        <div className="mt-2 text-danger">
          {typeof errors.status_id.message === "string" &&
            errors.status_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Refund Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("refund_amount")}
                        id="validation-form-1"
                        type="number"
                        name="refund_amount"
                        className={clsx({
                          "border-danger": errors.refund_amount,
                        })}
                        placeholder={t("Enter refund_amount")}
                      />
                      {errors.refund_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.refund_amount.message === "string" &&
                            errors.refund_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Internal Note")}
                      </FormLabel>
                      <FormInput
                        {...register("internal_note")}
                        id="validation-form-1"
                        type="text"
                        name="internal_note"
                        className={clsx({
                          "border-danger": errors.internal_note,
                        })}
                        placeholder={t("Enter internal_note")}
                      />
                      {errors.internal_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.internal_note.message === "string" &&
                            errors.internal_note.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Note")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_note")}
                        id="validation-form-1"
                        type="text"
                        name="customer_note"
                        className={clsx({
                          "border-danger": errors.customer_note,
                        })}
                        placeholder={t("Enter customer_note")}
                      />
                      {errors.customer_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_note.message === "string" &&
                            errors.customer_note.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Problem")}</h2>
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
                        {t("Problem Number")}
                      </FormLabel>
                      <FormInput
                        {...register("problem_number")}
                        id="validation-form-1"
                        type="text"
                        name="problem_number"
                        className={clsx({
                          "border-danger": errors.problem_number,
                        })}
                        placeholder={t("Enter problem_number")}
                      />
                      {errors.problem_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.problem_number.message === "string" &&
                            errors.problem_number.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Invoice Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier invoice`} setValue={setValue} variable="supplier_invoice_id"/>
      {errors.supplier_invoice_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_invoice_id.message === "string" &&
            errors.supplier_invoice_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer Invoice Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_customer invoice`} setValue={setValue} variable="customer_invoice_id"/>
      {errors.customer_invoice_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_invoice_id.message === "string" &&
            errors.customer_invoice_id.message}
        </div>
      )}
    </div>

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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Problem Type")}
                      </FormLabel>
                      <FormInput
                        {...register("problem_type")}
                        id="validation-form-1"
                        type="text"
                        name="problem_type"
                        className={clsx({
                          "border-danger": errors.problem_type,
                        })}
                        placeholder={t("Enter problem_type")}
                      />
                      {errors.problem_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.problem_type.message === "string" &&
                            errors.problem_type.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Solution Type")}
                      </FormLabel>
                      <FormInput
                        {...register("solution_type")}
                        id="validation-form-1"
                        type="text"
                        name="solution_type"
                        className={clsx({
                          "border-danger": errors.solution_type,
                        })}
                        placeholder={t("Enter solution_type")}
                      />
                      {errors.solution_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.solution_type.message === "string" &&
                            errors.solution_type.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Status Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_status`} setValue={setValue} variable="status_id"/>
      {errors.status_id && (
        <div className="mt-2 text-danger">
          {typeof errors.status_id.message === "string" &&
            errors.status_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Refund Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("refund_amount")}
                        id="validation-form-1"
                        type="number"
                        name="refund_amount"
                        className={clsx({
                          "border-danger": errors.refund_amount,
                        })}
                        placeholder={t("Enter refund_amount")}
                      />
                      {errors.refund_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.refund_amount.message === "string" &&
                            errors.refund_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Internal Note")}
                      </FormLabel>
                      <FormInput
                        {...register("internal_note")}
                        id="validation-form-1"
                        type="text"
                        name="internal_note"
                        className={clsx({
                          "border-danger": errors.internal_note,
                        })}
                        placeholder={t("Enter internal_note")}
                      />
                      {errors.internal_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.internal_note.message === "string" &&
                            errors.internal_note.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Note")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_note")}
                        id="validation-form-1"
                        type="text"
                        name="customer_note"
                        className={clsx({
                          "border-danger": errors.customer_note,
                        })}
                        placeholder={t("Enter customer_note")}
                      />
                      {errors.customer_note && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_note.message === "string" &&
                            errors.customer_note.message}
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
      <Can permission="problem-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/problem"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Problem"}
        />
      </Can>
    </div>
  );
}
export default index_main;
