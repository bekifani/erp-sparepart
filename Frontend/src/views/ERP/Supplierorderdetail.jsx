
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
  useCreateSupplierorderdetailMutation,
  useDeleteSupplierorderdetailMutation,
  useEditSupplierorderdetailMutation,
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
    useState(t("Are you Sure Do You want to Delete Supplierorderdetail"));

  
 const [
    createSupplierorderdetail,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSupplierorderdetailMutation();
  const [
    updateSupplierorderdetail,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSupplierorderdetailMutation();
  const [
    deleteSupplierorderdetail,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSupplierorderdetailMutation()


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
      title: t("Supplier Order Id"),
      minWidth: 200,
      field: "supplier_order_id",
      hozAlign: "center",
      headerHozAlign: "center",
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
      title: t("Order Detail Id"),
      minWidth: 200,
      field: "order_detail_id",
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
      title: t("Price"),
      minWidth: 200,
      field: "price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Shipping Mark"),
      minWidth: 200,
      field: "shipping_mark",
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
      title: t("Box Name"),
      minWidth: 200,
      field: "box_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Purchase Price"),
      minWidth: 200,
      field: "purchase_price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Extra Cost"),
      minWidth: 200,
      field: "extra_cost",
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
      title: t("Image Url"),
      minWidth: 200,
      field: "image_url",
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
        let permission = "supplierorderdetail";
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
  const [searchColumns, setSearchColumns] = useState(['supplier_order_id', 'product_id', 'order_detail_id', 'qty', 'price', 'shipping_mark', 'arrival_time', 'box_name', 'purchase_price', 'extra_cost', 'amount', 'status_id', 'additional_note', 'image_url', ]);

  // schema
  const schema = yup
    .object({
     supplier_order_id : yup.string().required(t('The Supplier Order Id field is required')), 
product_id : yup.string().required(t('The Product Id field is required')), 
order_detail_id : yup.string().required(t('The Order Detail Id field is required')), 
shipping_mark : yup.string().required(t('The Shipping Mark field is required')), 
arrival_time : yup.string().required(t('The Arrival Time field is required')), 
box_name : yup.string().required(t('The Box Name field is required')), 
status_id : yup.string().required(t('The Status Id field is required')), 
additional_note : yup.string().required(t('The Additional Note field is required')), 
image_url : yup.string().required(t('The Image Url field is required')), 

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
      const response = await createSupplierorderdetail(data);
      setToastMessage(t("Supplierorderdetail created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Supplierorderdetail."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateSupplierorderdetail(data);
      setToastMessage(t('Supplierorderdetail updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Supplierorderdetail deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteSupplierorderdetail(id);
        setToastMessage(t("Supplierorderdetail deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Supplierorderdetail."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Supplierorderdetail")}</h2>
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
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Order Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier order`} setValue={setValue} variable="supplier_order_id"/>
      {errors.supplier_order_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_order_id.message === "string" &&
            errors.supplier_order_id.message}
        </div>
      )}
    </div>

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
        {t("Order Detail Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_order detail`} setValue={setValue} variable="order_detail_id"/>
      {errors.order_detail_id && (
        <div className="mt-2 text-danger">
          {typeof errors.order_detail_id.message === "string" &&
            errors.order_detail_id.message}
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
                        {t("Price")}
                      </FormLabel>
                      <FormInput
                        {...register("price")}
                        id="validation-form-1"
                        type="number"
                        name="price"
                        className={clsx({
                          "border-danger": errors.price,
                        })}
                        placeholder={t("Enter price")}
                      />
                      {errors.price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.price.message === "string" &&
                            errors.price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Mark")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_mark")}
                        id="validation-form-1"
                        type="text"
                        name="shipping_mark"
                        className={clsx({
                          "border-danger": errors.shipping_mark,
                        })}
                        placeholder={t("Enter shipping_mark")}
                      />
                      {errors.shipping_mark && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_mark.message === "string" &&
                            errors.shipping_mark.message}
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
                        {t("Box Name")}
                      </FormLabel>
                      <FormInput
                        {...register("box_name")}
                        id="validation-form-1"
                        type="text"
                        name="box_name"
                        className={clsx({
                          "border-danger": errors.box_name,
                        })}
                        placeholder={t("Enter box_name")}
                      />
                      {errors.box_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.box_name.message === "string" &&
                            errors.box_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Purchase Price")}
                      </FormLabel>
                      <FormInput
                        {...register("purchase_price")}
                        id="validation-form-1"
                        type="number"
                        name="purchase_price"
                        className={clsx({
                          "border-danger": errors.purchase_price,
                        })}
                        placeholder={t("Enter purchase_price")}
                      />
                      {errors.purchase_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.purchase_price.message === "string" &&
                            errors.purchase_price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Cost")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_cost")}
                        id="validation-form-1"
                        type="number"
                        name="extra_cost"
                        className={clsx({
                          "border-danger": errors.extra_cost,
                        })}
                        placeholder={t("Enter extra_cost")}
                      />
                      {errors.extra_cost && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_cost.message === "string" &&
                            errors.extra_cost.message}
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
                        {t("Image Url")}
                      </FormLabel>
                      <FormInput
                        {...register("image_url")}
                        id="validation-form-1"
                        type="text"
                        name="image_url"
                        className={clsx({
                          "border-danger": errors.image_url,
                        })}
                        placeholder={t("Enter image_url")}
                      />
                      {errors.image_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.image_url.message === "string" &&
                            errors.image_url.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Supplierorderdetail")}</h2>
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
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Supplier Order Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_supplier order`} setValue={setValue} variable="supplier_order_id"/>
      {errors.supplier_order_id && (
        <div className="mt-2 text-danger">
          {typeof errors.supplier_order_id.message === "string" &&
            errors.supplier_order_id.message}
        </div>
      )}
    </div>

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
        {t("Order Detail Id")}
      </FormLabel>
      <TomSelectSearch apiUrl={`${app_url}/api/search_order detail`} setValue={setValue} variable="order_detail_id"/>
      {errors.order_detail_id && (
        <div className="mt-2 text-danger">
          {typeof errors.order_detail_id.message === "string" &&
            errors.order_detail_id.message}
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
                        {t("Price")}
                      </FormLabel>
                      <FormInput
                        {...register("price")}
                        id="validation-form-1"
                        type="number"
                        name="price"
                        className={clsx({
                          "border-danger": errors.price,
                        })}
                        placeholder={t("Enter price")}
                      />
                      {errors.price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.price.message === "string" &&
                            errors.price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Shipping Mark")}
                      </FormLabel>
                      <FormInput
                        {...register("shipping_mark")}
                        id="validation-form-1"
                        type="text"
                        name="shipping_mark"
                        className={clsx({
                          "border-danger": errors.shipping_mark,
                        })}
                        placeholder={t("Enter shipping_mark")}
                      />
                      {errors.shipping_mark && (
                        <div className="mt-2 text-danger">
                          {typeof errors.shipping_mark.message === "string" &&
                            errors.shipping_mark.message}
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
                        {t("Box Name")}
                      </FormLabel>
                      <FormInput
                        {...register("box_name")}
                        id="validation-form-1"
                        type="text"
                        name="box_name"
                        className={clsx({
                          "border-danger": errors.box_name,
                        })}
                        placeholder={t("Enter box_name")}
                      />
                      {errors.box_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.box_name.message === "string" &&
                            errors.box_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Purchase Price")}
                      </FormLabel>
                      <FormInput
                        {...register("purchase_price")}
                        id="validation-form-1"
                        type="number"
                        name="purchase_price"
                        className={clsx({
                          "border-danger": errors.purchase_price,
                        })}
                        placeholder={t("Enter purchase_price")}
                      />
                      {errors.purchase_price && (
                        <div className="mt-2 text-danger">
                          {typeof errors.purchase_price.message === "string" &&
                            errors.purchase_price.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Extra Cost")}
                      </FormLabel>
                      <FormInput
                        {...register("extra_cost")}
                        id="validation-form-1"
                        type="number"
                        name="extra_cost"
                        className={clsx({
                          "border-danger": errors.extra_cost,
                        })}
                        placeholder={t("Enter extra_cost")}
                      />
                      {errors.extra_cost && (
                        <div className="mt-2 text-danger">
                          {typeof errors.extra_cost.message === "string" &&
                            errors.extra_cost.message}
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
                        {t("Image Url")}
                      </FormLabel>
                      <FormInput
                        {...register("image_url")}
                        id="validation-form-1"
                        type="text"
                        name="image_url"
                        className={clsx({
                          "border-danger": errors.image_url,
                        })}
                        placeholder={t("Enter image_url")}
                      />
                      {errors.image_url && (
                        <div className="mt-2 text-danger">
                          {typeof errors.image_url.message === "string" &&
                            errors.image_url.message}
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
      <Can permission="supplierorderdetail-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/supplierorderdetail"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Supplierorderdetail"}
        />
      </Can>
    </div>
  );
}
export default index_main;
