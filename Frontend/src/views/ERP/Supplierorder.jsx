
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
  useCreateSupplierorderMutation,
  useDeleteSupplierorderMutation,
  useEditSupplierorderMutation,
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
    useState(t("Are you Sure Do You want to Delete Supplierorder"));

  
 const [
    createSupplierorder,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSupplierorderMutation();
  const [
    updateSupplierorder,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSupplierorderMutation();
  const [
    deleteSupplierorder,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSupplierorderMutation()


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
      title: t("Supplier Invoice No"),
      minWidth: 200,
      field: "supplier_invoice_no",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Supplier Id"),
      minWidth: 200,
      field: "supplier_id",
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
      title: t("Order Period"),
      minWidth: 200,
      field: "order_period",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Arrival Time"),
      minWidth: 200,
      field: "arrival_time",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Qty"),
      minWidth: 200,
      field: "qty",
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
        let permission = "supplierorder";
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
  const [searchColumns, setSearchColumns] = useState(['supplier_invoice_no', 'supplier_id', 'order_date', 'expected_date', 'shipping_date', 'order_period', 'arrival_time', 'qty', 'amount', 'discount', 'extra_expenses', 'status_id', 'internal_note', 'customer_note', ]);

  // schema
  const schema = yup
    .object({
     supplier_invoice_no : yup.string().required(t('The Supplier Invoice No field is required')), 
supplier_id : yup.string().required(t('The Supplier Id field is required')), 
order_period : yup.string().required(t('The Order Period field is required')), 
arrival_time : yup.string().required(t('The Arrival Time field is required')), 
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
      const response = await createSupplierorder(data);
      setToastMessage(t("Supplierorder created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Supplierorder."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateSupplierorder(data);
      setToastMessage(t('Supplierorder updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Supplierorder deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteSupplierorder(id);
        setToastMessage(t("Supplierorder deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Supplierorder."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Supplierorder")}</h2>
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
                        {t("Supplier Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("supplier_invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="supplier_invoice_no"
                        className={clsx({
                          "border-danger": errors.supplier_invoice_no,
                        })}
                        placeholder={t("Enter supplier_invoice_no")}
                      />
                      {errors.supplier_invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.supplier_invoice_no.message === "string" &&
                            errors.supplier_invoice_no.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier`} setValue={setValue} variable="supplier_id"/>
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Period")}
                      </FormLabel>
                      <FormInput
                        {...register("order_period")}
                        id="validation-form-1"
                        type="text"
                        name="order_period"
                        className={clsx({
                          "border-danger": errors.order_period,
                        })}
                        placeholder={t("Enter order_period")}
                      />
                      {errors.order_period && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_period.message === "string" &&
                            errors.order_period.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Arrival Time")}
                      </FormLabel>
                      <FormInput
                        {...register("arrival_time")}
                        id="validation-form-1"
                        type="text"
                        name="arrival_time"
                        className={clsx({
                          "border-danger": errors.arrival_time,
                        })}
                        placeholder={t("Enter arrival_time")}
                      />
                      {errors.arrival_time && (
                        <div className="mt-2 text-danger">
                          {typeof errors.arrival_time.message === "string" &&
                            errors.arrival_time.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("qty")}
                        id="validation-form-1"
                        type="number"
                        name="qty"
                        className={clsx({
                          "border-danger": errors.qty,
                        })}
                        placeholder={t("Enter qty")}
                      />
                      {errors.qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qty.message === "string" &&
                            errors.qty.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Supplierorder")}</h2>
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
                        {t("Supplier Invoice No")}
                      </FormLabel>
                      <FormInput
                        {...register("supplier_invoice_no")}
                        id="validation-form-1"
                        type="text"
                        name="supplier_invoice_no"
                        className={clsx({
                          "border-danger": errors.supplier_invoice_no,
                        })}
                        placeholder={t("Enter supplier_invoice_no")}
                      />
                      {errors.supplier_invoice_no && (
                        <div className="mt-2 text-danger">
                          {typeof errors.supplier_invoice_no.message === "string" &&
                            errors.supplier_invoice_no.message}
                        </div>
                      )}
                    </div>


   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier`} setValue={setValue} variable="supplier_id"/>
      {errors.supplier_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_id.message === "string" &&
            errors.supplier_id.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Order Period")}
                      </FormLabel>
                      <FormInput
                        {...register("order_period")}
                        id="validation-form-1"
                        type="text"
                        name="order_period"
                        className={clsx({
                          "border-danger": errors.order_period,
                        })}
                        placeholder={t("Enter order_period")}
                      />
                      {errors.order_period && (
                        <div className="mt-2 text-danger">
                          {typeof errors.order_period.message === "string" &&
                            errors.order_period.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Arrival Time")}
                      </FormLabel>
                      <FormInput
                        {...register("arrival_time")}
                        id="validation-form-1"
                        type="text"
                        name="arrival_time"
                        className={clsx({
                          "border-danger": errors.arrival_time,
                        })}
                        placeholder={t("Enter arrival_time")}
                      />
                      {errors.arrival_time && (
                        <div className="mt-2 text-danger">
                          {typeof errors.arrival_time.message === "string" &&
                            errors.arrival_time.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Qty")}
                      </FormLabel>
                      <FormInput
                        {...register("qty")}
                        id="validation-form-1"
                        type="number"
                        name="qty"
                        className={clsx({
                          "border-danger": errors.qty,
                        })}
                        placeholder={t("Enter qty")}
                      />
                      {errors.qty && (
                        <div className="mt-2 text-danger">
                          {typeof errors.qty.message === "string" &&
                            errors.qty.message}
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
      <Can permission="supplierorder-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/supplierorder"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Supplierorder"}
        />
      </Can>
    </div>
  );
}
export default index_main;
