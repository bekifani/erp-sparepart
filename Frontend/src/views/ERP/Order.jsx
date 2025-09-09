
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
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useEditOrderMutation,
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
    useState(t("Are you Sure Do You want to Delete Order"));

  
 const [
    createOrder,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateOrderMutation();
  const [
    updateOrder,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditOrderMutation();
  const [
    deleteOrder,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteOrderMutation()


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
      title: t("Invoice No"),
      minWidth: 200,
      field: "invoice_no",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Qty"),
      minWidth: 200,
      field: "total_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Weight"),
      minWidth: 200,
      field: "total_weight",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Volume"),
      minWidth: 200,
      field: "total_volume",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Subtotal"),
      minWidth: 200,
      field: "subtotal",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Discount"),
      minWidth: 200,
      field: "discount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Extra Expenses"),
      minWidth: 200,
      field: "extra_expenses",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Total Amount"),
      minWidth: 200,
      field: "total_amount",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Deposit"),
      minWidth: 200,
      field: "deposit",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Customer Debt"),
      minWidth: 200,
      field: "customer_debt",
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
      title: t("Order Date"),
      minWidth: 200,
      field: "order_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Expected Date"),
      minWidth: 200,
      field: "expected_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Shipping Date"),
      minWidth: 200,
      field: "shipping_date",
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
      title: t("Invoice Language"),
      minWidth: 200,
      field: "invoice_language",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Company Id"),
      minWidth: 200,
      field: "company_id",
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
        let permission = "order";
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
  const [searchColumns, setSearchColumns] = useState(['customer_id', 'invoice_no', 'total_qty', 'total_weight', 'total_volume', 'subtotal', 'discount', 'extra_expenses', 'total_amount', 'deposit', 'customer_debt', 'balance', 'order_date', 'expected_date', 'shipping_date', 'status_id', 'invoice_language', 'company_id', 'internal_note', 'customer_note', ]);

  // schema
  const schema = yup
    .object({
     customer_id : yup.string().required(t('The Customer Id field is required')), 
invoice_no : yup.string().required(t('The Invoice No field is required')), 
status_id : yup.string().required(t('The Status Id field is required')), 
invoice_language : yup.string().required(t('The Invoice Language field is required')), 
company_id : yup.string().required(t('The Company Id field is required')), 
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
      const response = await createOrder(data);
      setToastMessage(t("Order created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Order."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateOrder(data);
      setToastMessage(t('Order updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Order deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteOrder(id);
        setToastMessage(t("Order deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Order."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Order")}</h2>
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
                        {t("Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_no"
                        className={clsx({
                          "border-danger": errors.invoice_no,
                        })}
                        placeholder={t("Enter invoice_no")}
                      />
                      {errors.invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_no.message === "string" &&
                            errors.invoice_no.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("total_qty")}
                        id="validation-form-1"
                        type="number"
                        name="total_qty"
                        className={clsx({
                          "border-danger": errors.total_qty,
                        })}
                        placeholder={t("Enter total_qty")}
                      />
                      {errors.total_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_qty.message === "string" &&
                            errors.total_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_weight"
                        className={clsx({
                          "border-danger": errors.total_weight,
                        })}
                        placeholder={t("Enter total_weight")}
                      />
                      {errors.total_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_weight.message === "string" &&
                            errors.total_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("total_volume")}
                        id="validation-form-1"
                        type="number"
                        name="total_volume"
                        className={clsx({
                          "border-danger": errors.total_volume,
                        })}
                        placeholder={t("Enter total_volume")}
                      />
                      {errors.total_volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_volume.message === "string" &&
                            errors.total_volume.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Subtotal")}
                      </FormLabel>
                      <FormInput
                        {...register("subtotal")}
                        id="validation-form-1"
                        type="number"
                        name="subtotal"
                        className={clsx({
                          "border-danger": errors.subtotal,
                        })}
                        placeholder={t("Enter subtotal")}
                      />
                      {errors.subtotal && (
                        <div className="mt-2 text-danger">
                          {typeof errors.subtotal.message === "string" &&
                            errors.subtotal.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Discount")}
                      </FormLabel>
                      <FormInput
                        {...register("discount")}
                        id="validation-form-1"
                        type="number"
                        name="discount"
                        className={clsx({
                          "border-danger": errors.discount,
                        })}
                        placeholder={t("Enter discount")}
                      />
                      {errors.discount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.discount.message === "string" &&
                            errors.discount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Expenses")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_expenses")}
                        id="validation-form-1"
                        type="number"
                        name="extra_expenses"
                        className={clsx({
                          "border-danger": errors.extra_expenses,
                        })}
                        placeholder={t("Enter extra_expenses")}
                      />
                      {errors.extra_expenses && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_expenses.message === "string" &&
                            errors.extra_expenses.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("total_amount")}
                        id="validation-form-1"
                        type="number"
                        name="total_amount"
                        className={clsx({
                          "border-danger": errors.total_amount,
                        })}
                        placeholder={t("Enter total_amount")}
                      />
                      {errors.total_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_amount.message === "string" &&
                            errors.total_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Deposit")}
                      </FormLabel>
                      <FormInput
                        {...register("deposit")}
                        id="validation-form-1"
                        type="number"
                        name="deposit"
                        className={clsx({
                          "border-danger": errors.deposit,
                        })}
                        placeholder={t("Enter deposit")}
                      />
                      {errors.deposit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.deposit.message === "string" &&
                            errors.deposit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Debt")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_debt")}
                        id="validation-form-1"
                        type="number"
                        name="customer_debt"
                        className={clsx({
                          "border-danger": errors.customer_debt,
                        })}
                        placeholder={t("Enter customer_debt")}
                      />
                      {errors.customer_debt && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_debt.message === "string" &&
                            errors.customer_debt.message}
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


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Date")}
                      </FormLabel>
                      <FormInput
                        {...register("order_date")}
                        id="validation-form-1"
                        type="date"
                        name="order_date"
                        className={clsx({
                          "border-danger": errors.order_date,
                        })}
                        placeholder={t("Enter order_date")}
                      />
                      {errors.order_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_date.message === "string" &&
                            errors.order_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Expected Date")}
                      </FormLabel>
                      <FormInput
                        {...register("expected_date")}
                        id="validation-form-1"
                        type="date"
                        name="expected_date"
                        className={clsx({
                          "border-danger": errors.expected_date,
                        })}
                        placeholder={t("Enter expected_date")}
                      />
                      {errors.expected_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.expected_date.message === "string" &&
                            errors.expected_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Date")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_date")}
                        id="validation-form-1"
                        type="date"
                        name="shipping_date"
                        className={clsx({
                          "border-danger": errors.shipping_date,
                        })}
                        placeholder={t("Enter shipping_date")}
                      />
                      {errors.shipping_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_date.message === "string" &&
                            errors.shipping_date.message}
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
                        {t("Invoice Language")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_language")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_language"
                        className={clsx({
                          "border-danger": errors.invoice_language,
                        })}
                        placeholder={t("Enter invoice_language")}
                      />
                      {errors.invoice_language && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_language.message === "string" &&
                            errors.invoice_language.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Company Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_company`} setValue={setValue} variable="company_id"/>
      {errors.company_id && (
        <div className="mt-2 text-danger">
          {typeof errors.company_id.message === "string" &&
            errors.company_id.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Order")}</h2>
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
                        {t("Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_no"
                        className={clsx({
                          "border-danger": errors.invoice_no,
                        })}
                        placeholder={t("Enter invoice_no")}
                      />
                      {errors.invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_no.message === "string" &&
                            errors.invoice_no.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("total_qty")}
                        id="validation-form-1"
                        type="number"
                        name="total_qty"
                        className={clsx({
                          "border-danger": errors.total_qty,
                        })}
                        placeholder={t("Enter total_qty")}
                      />
                      {errors.total_qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_qty.message === "string" &&
                            errors.total_qty.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Weight")}
                      </FormLabel>
                      <FormInput
                        {...register("total_weight")}
                        id="validation-form-1"
                        type="number"
                        name="total_weight"
                        className={clsx({
                          "border-danger": errors.total_weight,
                        })}
                        placeholder={t("Enter total_weight")}
                      />
                      {errors.total_weight && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_weight.message === "string" &&
                            errors.total_weight.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Volume")}
                      </FormLabel>
                      <FormInput
                        {...register("total_volume")}
                        id="validation-form-1"
                        type="number"
                        name="total_volume"
                        className={clsx({
                          "border-danger": errors.total_volume,
                        })}
                        placeholder={t("Enter total_volume")}
                      />
                      {errors.total_volume && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_volume.message === "string" &&
                            errors.total_volume.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Subtotal")}
                      </FormLabel>
                      <FormInput
                        {...register("subtotal")}
                        id="validation-form-1"
                        type="number"
                        name="subtotal"
                        className={clsx({
                          "border-danger": errors.subtotal,
                        })}
                        placeholder={t("Enter subtotal")}
                      />
                      {errors.subtotal && (
                        <div className="mt-2 text-danger">
                          {typeof errors.subtotal.message === "string" &&
                            errors.subtotal.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Discount")}
                      </FormLabel>
                      <FormInput
                        {...register("discount")}
                        id="validation-form-1"
                        type="number"
                        name="discount"
                        className={clsx({
                          "border-danger": errors.discount,
                        })}
                        placeholder={t("Enter discount")}
                      />
                      {errors.discount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.discount.message === "string" &&
                            errors.discount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Expenses")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_expenses")}
                        id="validation-form-1"
                        type="number"
                        name="extra_expenses"
                        className={clsx({
                          "border-danger": errors.extra_expenses,
                        })}
                        placeholder={t("Enter extra_expenses")}
                      />
                      {errors.extra_expenses && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_expenses.message === "string" &&
                            errors.extra_expenses.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Total Amount")}
                      </FormLabel>
                      <FormInput
                        {...register("total_amount")}
                        id="validation-form-1"
                        type="number"
                        name="total_amount"
                        className={clsx({
                          "border-danger": errors.total_amount,
                        })}
                        placeholder={t("Enter total_amount")}
                      />
                      {errors.total_amount && (
                        <div className="mt-2 text-danger">
                          {typeof errors.total_amount.message === "string" &&
                            errors.total_amount.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Deposit")}
                      </FormLabel>
                      <FormInput
                        {...register("deposit")}
                        id="validation-form-1"
                        type="number"
                        name="deposit"
                        className={clsx({
                          "border-danger": errors.deposit,
                        })}
                        placeholder={t("Enter deposit")}
                      />
                      {errors.deposit && (
                        <div className="mt-2 text-danger">
                          {typeof errors.deposit.message === "string" &&
                            errors.deposit.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Customer Debt")}
                      </FormLabel>
                      <FormInput
                        {...register("customer_debt")}
                        id="validation-form-1"
                        type="number"
                        name="customer_debt"
                        className={clsx({
                          "border-danger": errors.customer_debt,
                        })}
                        placeholder={t("Enter customer_debt")}
                      />
                      {errors.customer_debt && (
                        <div className="mt-2 text-danger">
                          {typeof errors.customer_debt.message === "string" &&
                            errors.customer_debt.message}
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


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Date")}
                      </FormLabel>
                      <FormInput
                        {...register("order_date")}
                        id="validation-form-1"
                        type="date"
                        name="order_date"
                        className={clsx({
                          "border-danger": errors.order_date,
                        })}
                        placeholder={t("Enter order_date")}
                      />
                      {errors.order_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_date.message === "string" &&
                            errors.order_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Expected Date")}
                      </FormLabel>
                      <FormInput
                        {...register("expected_date")}
                        id="validation-form-1"
                        type="date"
                        name="expected_date"
                        className={clsx({
                          "border-danger": errors.expected_date,
                        })}
                        placeholder={t("Enter expected_date")}
                      />
                      {errors.expected_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.expected_date.message === "string" &&
                            errors.expected_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Date")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_date")}
                        id="validation-form-1"
                        type="date"
                        name="shipping_date"
                        className={clsx({
                          "border-danger": errors.shipping_date,
                        })}
                        placeholder={t("Enter shipping_date")}
                      />
                      {errors.shipping_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_date.message === "string" &&
                            errors.shipping_date.message}
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
                        {t("Invoice Language")}
                      </FormLabel>
                      <FormInput
                        {...register("invoice_language")}
                        id="validation-form-1"
                        type="text"
                        name="invoice_language"
                        className={clsx({
                          "border-danger": errors.invoice_language,
                        })}
                        placeholder={t("Enter invoice_language")}
                      />
                      {errors.invoice_language && (
                        <div className="mt-2 text-danger">
                          {typeof errors.invoice_language.message === "string" &&
                            errors.invoice_language.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Company Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_company`} setValue={setValue} variable="company_id"/>
      {errors.company_id && (
        <div className="mt-2 text-danger">
          {typeof errors.company_id.message === "string" &&
            errors.company_id.message}
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
      <Can permission="order-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/order"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Order"}
        />
      </Can>
    </div>
  );
}
export default index_main;
