
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
  useCreateCustomeraccountMutation,
  useDeleteCustomeraccountMutation,
  useEditCustomeraccountMutation,
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
    useState(t("Are you Sure Do You want to Delete Customeraccount"));

  
 const [
    createCustomeraccount,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCustomeraccountMutation();
  const [
    updateCustomeraccount,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCustomeraccountMutation();
  const [
    deleteCustomeraccount,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCustomeraccountMutation()


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
      title: t("Trans Number"),
      minWidth: 200,
      field: "trans_number",
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
      title: t("Amount"),
      minWidth: 200,
      field: "amount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Invoice Number"),
      minWidth: 200,
      field: "invoice_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Payment Status"),
      minWidth: 200,
      field: "payment_status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Account Type Id"),
      minWidth: 200,
      field: "account_type_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Payment Note Id"),
      minWidth: 200,
      field: "payment_note_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Picture Url"),
      minWidth: 200,
      field: "picture_url",
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
      title: t("Balance"),
      minWidth: 200,
      field: "balance",
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
        let permission = "customeraccount";
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
  const [searchColumns, setSearchColumns] = useState(['trans_number', 'user_id', 'amount', 'invoice_number', 'payment_status', 'account_type_id', 'payment_note_id', 'picture_url', 'additional_note', 'balance', ]);

  // schema
  const schema = yup
    .object({
     trans_number : yup.string().required(t('The Trans Number field is required')), 
user_id : yup.string().required(t('The User Id field is required')), 
invoice_number : yup.string().required(t('The Invoice Number field is required')), 
payment_status : yup.string().required(t('The Payment Status field is required')), 
account_type_id : yup.string().required(t('The Account Type Id field is required')), 
payment_note_id : yup.string().required(t('The Payment Note Id field is required')), 
picture_url : yup.string().required(t('The Picture Url field is required')), 
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
      const response = await createCustomeraccount(data);
      setToastMessage(t("Customeraccount created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Customeraccount."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateCustomeraccount(data);
      setToastMessage(t('Customeraccount updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Customeraccount deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteCustomeraccount(id);
        setToastMessage(t("Customeraccount deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Customeraccount."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Customeraccount")}</h2>
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
                        {t("Trans Number")}
                      </FormLabel>
                      <FormInput
                        {...register("trans_number")}
                        id="validation-form-1"
                        type="text"
                        name="trans_number"
                        className={clsx({
                          "border-danger": errors.trans_number,
                        })}
                        placeholder={t("Enter trans_number")}
                      />
                      {errors.trans_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.trans_number.message === "string" &&
                            errors.trans_number.message}
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
                        {t("Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("amount")}
                        id="validation-form-1"
                        type="number"
                        name="amount"
                        className={clsx({
                          "border-danger": errors.amount,
                        })}
                        placeholder={t("Enter amount")}
                      />
                      {errors.amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.amount.message === "string" &&
                            errors.amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Invoice Number")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_number")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_number"
                        className={clsx({
                          "border-danger": errors.invoice_number,
                        })}
                        placeholder={t("Enter invoice_number")}
                      />
                      {errors.invoice_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_number.message === "string" &&
                            errors.invoice_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Status")}
                      </FormLabel>
                      <FormInput
                        {...register("payment_status")}
                        id="validation-form-1"
                        type="text"
                        name="payment_status"
                        className={clsx({
                          "border-danger": errors.payment_status,
                        })}
                        placeholder={t("Enter payment_status")}
                      />
                      {errors.payment_status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_status.message === "string" &&
                            errors.payment_status.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Account Type Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_account type`} setValue={setValue} variable="account_type_id"/>
      {errors.account_type_id && (
        <div className="mt-2 text-danger">
          {typeof errors.account_type_id.message === "string" &&
            errors.account_type_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Payment Note Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_payment note`} setValue={setValue} variable="payment_note_id"/>
      {errors.payment_note_id && (
        <div className="mt-2 text-danger">
          {typeof errors.payment_note_id.message === "string" &&
            errors.payment_note_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Picture Url")}
                      </FormLabel>
                      <FormInput
                        {...register("picture_url")}
                        id="validation-form-1"
                        type="text"
                        name="picture_url"
                        className={clsx({
                          "border-danger": errors.picture_url,
                        })}
                        placeholder={t("Enter picture_url")}
                      />
                      {errors.picture_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.picture_url.message === "string" &&
                            errors.picture_url.message}
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
                        {t("Balance")}
                      </FormLabel>
                      <FormInput
                        {...register("balance")}
                        id="validation-form-1"
                        type="number"
                        name="balance"
                        className={clsx({
                          "border-danger": errors.balance,
                        })}
                        placeholder={t("Enter balance")}
                      />
                      {errors.balance && (
                        <div className="mt-2 text-danger">
                          {typeof errors.balance.message === "string" &&
                            errors.balance.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Customeraccount")}</h2>
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
                        {t("Trans Number")}
                      </FormLabel>
                      <FormInput
                        {...register("trans_number")}
                        id="validation-form-1"
                        type="text"
                        name="trans_number"
                        className={clsx({
                          "border-danger": errors.trans_number,
                        })}
                        placeholder={t("Enter trans_number")}
                      />
                      {errors.trans_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.trans_number.message === "string" &&
                            errors.trans_number.message}
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
                        {t("Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("amount")}
                        id="validation-form-1"
                        type="number"
                        name="amount"
                        className={clsx({
                          "border-danger": errors.amount,
                        })}
                        placeholder={t("Enter amount")}
                      />
                      {errors.amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.amount.message === "string" &&
                            errors.amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Invoice Number")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_number")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_number"
                        className={clsx({
                          "border-danger": errors.invoice_number,
                        })}
                        placeholder={t("Enter invoice_number")}
                      />
                      {errors.invoice_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_number.message === "string" &&
                            errors.invoice_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Payment Status")}
                      </FormLabel>
                      <FormInput
                        {...register("payment_status")}
                        id="validation-form-1"
                        type="text"
                        name="payment_status"
                        className={clsx({
                          "border-danger": errors.payment_status,
                        })}
                        placeholder={t("Enter payment_status")}
                      />
                      {errors.payment_status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.payment_status.message === "string" &&
                            errors.payment_status.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Account Type Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_account type`} setValue={setValue} variable="account_type_id"/>
      {errors.account_type_id && (
        <div className="mt-2 text-danger">
          {typeof errors.account_type_id.message === "string" &&
            errors.account_type_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Payment Note Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_payment note`} setValue={setValue} variable="payment_note_id"/>
      {errors.payment_note_id && (
        <div className="mt-2 text-danger">
          {typeof errors.payment_note_id.message === "string" &&
            errors.payment_note_id.message}
        </div>
      )}
    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Picture Url")}
                      </FormLabel>
                      <FormInput
                        {...register("picture_url")}
                        id="validation-form-1"
                        type="text"
                        name="picture_url"
                        className={clsx({
                          "border-danger": errors.picture_url,
                        })}
                        placeholder={t("Enter picture_url")}
                      />
                      {errors.picture_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.picture_url.message === "string" &&
                            errors.picture_url.message}
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
                        {t("Balance")}
                      </FormLabel>
                      <FormInput
                        {...register("balance")}
                        id="validation-form-1"
                        type="number"
                        name="balance"
                        className={clsx({
                          "border-danger": errors.balance,
                        })}
                        placeholder={t("Enter balance")}
                      />
                      {errors.balance && (
                        <div className="mt-2 text-danger">
                          {typeof errors.balance.message === "string" &&
                            errors.balance.message}
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
      <Can permission="customeraccount-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/customeraccount"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Customeraccount"}
        />
      </Can>
    </div>
  );
}
export default index_main;
