
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
  useCreateBasketMutation,
  useDeleteBasketMutation,
  useEditBasketMutation,
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
    useState(t("Are you Sure Do You want to Delete Basket"));

  
 const [
    createBasket,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateBasketMutation();
  const [
    updateBasket,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditBasketMutation();
  const [
    deleteBasket,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteBasketMutation()


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
      title: t("Basket Number"),
      minWidth: 200,
      field: "basket_number",
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
      title: t("Status"),
      minWidth: 200,
      field: "status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("First Edit Date"),
      minWidth: 200,
      field: "first_edit_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Last Edit Date"),
      minWidth: 200,
      field: "last_edit_date",
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
        let permission = "basket";
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
  const [searchColumns, setSearchColumns] = useState(['basket_number', 'customer_id', 'total_qty', 'total_weight', 'total_volume', 'total_amount', 'invoice_language', 'status', 'first_edit_date', 'last_edit_date', 'additional_note', ]);

  // schema
  const schema = yup
    .object({
     basket_number : yup.string().required(t('The Basket Number field is required')), 
customer_id : yup.string().required(t('The Customer Id field is required')), 
invoice_language : yup.string().required(t('The Invoice Language field is required')), 
status : yup.string().required(t('The Status field is required')), 
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
      const response = await createBasket(data);
      setToastMessage(t("Basket created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Basket."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateBasket(data);
      setToastMessage(t('Basket updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Basket deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteBasket(id);
        setToastMessage(t("Basket deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Basket."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Basket")}</h2>
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
                        {t("Basket Number")}
                      </FormLabel>
                      <FormInput
                        {...register("basket_number")}
                        id="validation-form-1"
                        type="text"
                        name="basket_number"
                        className={clsx({
                          "border-danger": errors.basket_number,
                        })}
                        placeholder={t("Enter basket_number")}
                      />
                      {errors.basket_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.basket_number.message === "string" &&
                            errors.basket_number.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status")}
                      </FormLabel>
                      <FormInput
                        {...register("status")}
                        id="validation-form-1"
                        type="text"
                        name="status"
                        className={clsx({
                          "border-danger": errors.status,
                        })}
                        placeholder={t("Enter status")}
                      />
                      {errors.status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status.message === "string" &&
                            errors.status.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("First Edit Date")}
                      </FormLabel>
                      <FormInput
                        {...register("first_edit_date")}
                        id="validation-form-1"
                        type="date"
                        name="first_edit_date"
                        className={clsx({
                          "border-danger": errors.first_edit_date,
                        })}
                        placeholder={t("Enter first_edit_date")}
                      />
                      {errors.first_edit_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.first_edit_date.message === "string" &&
                            errors.first_edit_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Last Edit Date")}
                      </FormLabel>
                      <FormInput
                        {...register("last_edit_date")}
                        id="validation-form-1"
                        type="date"
                        name="last_edit_date"
                        className={clsx({
                          "border-danger": errors.last_edit_date,
                        })}
                        placeholder={t("Enter last_edit_date")}
                      />
                      {errors.last_edit_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.last_edit_date.message === "string" &&
                            errors.last_edit_date.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Basket")}</h2>
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
                        {t("Basket Number")}
                      </FormLabel>
                      <FormInput
                        {...register("basket_number")}
                        id="validation-form-1"
                        type="text"
                        name="basket_number"
                        className={clsx({
                          "border-danger": errors.basket_number,
                        })}
                        placeholder={t("Enter basket_number")}
                      />
                      {errors.basket_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.basket_number.message === "string" &&
                            errors.basket_number.message}
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
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Status")}
                      </FormLabel>
                      <FormInput
                        {...register("status")}
                        id="validation-form-1"
                        type="text"
                        name="status"
                        className={clsx({
                          "border-danger": errors.status,
                        })}
                        placeholder={t("Enter status")}
                      />
                      {errors.status && (
                        <div className="mt-2 text-danger">
                          {typeof errors.status.message === "string" &&
                            errors.status.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("First Edit Date")}
                      </FormLabel>
                      <FormInput
                        {...register("first_edit_date")}
                        id="validation-form-1"
                        type="date"
                        name="first_edit_date"
                        className={clsx({
                          "border-danger": errors.first_edit_date,
                        })}
                        placeholder={t("Enter first_edit_date")}
                      />
                      {errors.first_edit_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.first_edit_date.message === "string" &&
                            errors.first_edit_date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Last Edit Date")}
                      </FormLabel>
                      <FormInput
                        {...register("last_edit_date")}
                        id="validation-form-1"
                        type="date"
                        name="last_edit_date"
                        className={clsx({
                          "border-danger": errors.last_edit_date,
                        })}
                        placeholder={t("Enter last_edit_date")}
                      />
                      {errors.last_edit_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.last_edit_date.message === "string" &&
                            errors.last_edit_date.message}
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
      <Can permission="basket-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/basket"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Basket"}
        />
      </Can>
    </div>
  );
}
export default index_main;
