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
import { FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateProductinformationMutation,
  useDeleteProductinformationMutation,
  useEditProductinformationMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import { useSelector } from "react-redux";

function index_main() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const upload_url = useSelector((state)=> state.auth.upload_url);
  const media_url = useSelector((state)=>state.auth.media_url);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [confirmationMessage] = useState(t("Are you Sure Do You want to Delete ProductInformation"));

  const [
    createProductinformation,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductinformationMutation();

  const [
    updateProductinformation,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductinformationMutation();

  const [
    deleteProductinformation,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductinformationMutation();

  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user);
  const hasPermission = (permission) => user.permissions.includes(permission);

  const [data, setData] = useState([
    { title: t("Id"), minWidth: 50, responsive: 0, field: "id", vertAlign: "middle", print: true, download: true },
    { title: t("Product Code"), minWidth: 200, field: "product_code", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand Name"), minWidth: 200, field: "brand_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Brand Code"), minWidth: 200, field: "brand_code_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Oe Code"), minWidth: 200, field: "oe_code", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Description"), minWidth: 200, field: "description", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Net Weight"), minWidth: 200, field: "net_weight", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Gross Weight"), minWidth: 200, field: "gross_weight", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Unit Name"), minWidth: 200, field: "unit_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Box Name"), minWidth: 200, field: "box_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Product Size A"), minWidth: 200, field: "product_size_a", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Product Size B"), minWidth: 200, field: "product_size_b", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Product Size C"), minWidth: 200, field: "product_size_c", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Volume"), minWidth: 200, field: "volume", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Label Name"), minWidth: 200, field: "label_name", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    {
      title: t("QR Code"),
      minWidth: 200,
      field: "qr_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().qr_code);
      }
    },
    {
      title: t("Technical Image"),
      minWidth: 200,
      field: "technical_image",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().technical_image);
      }
    },
    {
      title: t("Image"),
      minWidth: 200,
      field: "image",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().image);
      }
    },
    { title: t("Size Mode"), minWidth: 200, field: "size_mode", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
    { title: t("Additional Note"), minWidth: 200, field: "additional_note", hozAlign: "center", headerHozAlign: "center", vertAlign: "middle", print: true, download: true },
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
        const element = stringToHTML(`<div class="flex items-center lg:justify-center"></div>`);
        const v = stringToHTML(`<div class="flex items-center lg:justify-center">
              <a class="view-btn flex items-center mr-3 text-primary" href="javascript:;">
                <i data-lucide="eye" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> View
              </a>`);
        const p = stringToHTML(`<a class="print-btn flex items-center mr-3 text-success" href="javascript:;">
                <i data-lucide="printer" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Print
              </a>`);
        const a = stringToHTML(`<div class="flex items-center lg:justify-center">
              <a class="delete-btn flex items-center mr-3" href="javascript:;">
                <i data-lucide="check-square" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Edit
              </a>`);
        const b = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> Delete
              </a>
            </div>`);
        v.addEventListener("click", function () {
          const data = cell.getData();
          setViewData(data);
          setShowViewModal(true);
        });
        p.addEventListener("click", function () {
          const data = cell.getData();
          printRecord(data);
        });
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
        let permission = "productinformation";
        element.append(v);
        element.append(p);
        if (hasPermission(permission + '-edit')) element.append(a);
        if (hasPermission(permission + '-delete')) element.append(b);
        return element;
      },
    },
  ]);

  const [searchColumns, setSearchColumns] = useState(['product_code', 'brand_name', 'brand_code_name', 'description']);

  // Validation schema (file uploads and numeric fields optional)
  const schema = yup.object({
    product_id: yup.string().required(t('The Product field is required')),
    unit_id: yup.string().required(t('The Unit Id field is required')),
    box_id: yup.string().required(t('The Box Id field is required')),
    label_id: yup.string().required(t('The Label Id field is required')),
    qr_code: yup.string().required(t('The Qr Code field is required')),
    properties: yup.string().required(t('The Properties field is required')),
    technical_image: yup.string().nullable(),
    image: yup.string().nullable(),
    size_mode: yup.string().required(t('The Size Mode field is required')),
    additional_note: yup.string().required(t('The Additional Note field is required')),
    oe_code: yup.string().nullable(),
    net_weight: yup.number().nullable(),
    gross_weight: yup.number().nullable(),
    product_size_a: yup.number().nullable(),
    product_size_b: yup.number().nullable(),
    product_size_c: yup.number().nullable(),
    volume: yup.number().nullable(),
  }).required();

  const {
    register,
    trigger,
    getValues,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [refetch, setRefetch] = useState(false);

  const getMiniDisplay = (url) => {
    let data = app_url + '/api/file/' + url;
    const fileExtension = data.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    let element;
    if (imageExtensions.includes(fileExtension)) {
      element = (<img data-action="zoom" src={media_url + url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-md" />);
    } else if (videoExtensions.includes(fileExtension)) {
      element = <Lucide icon="Film" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="block mx-auto" />;
    } else {
      element = (
        <a href={data} target="_blank" rel="noopener noreferrer">
          <Lucide icon="File" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="block mx-auto" />
        </a>
      );
    }
    return ReactDOMServer.renderToString(element);
  };

  // Build printable HTML for a single Product Information record
  const buildPrintHtml = (item) => {
    const logoUrl = `${media_url || ''}`; // customize if you have a logo path
    const safe = (v) => (v === null || v === undefined ? '' : String(v));
    const imgTag = (url) => url ? `<img src="${media_url + url}" style="max-width:100%;border:1px solid #eee;border-radius:6px;padding:6px;"/>` : '<span style="color:#999;">-</span>';
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Product Information</title>
  <style>
    @page { size: A4; margin: 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #111827; }
    .header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px; }
    .brand { font-size: 22px; font-weight: 700; }
    .meta { font-size: 12px; color:#6b7280; }
    .section { margin-bottom: 14px; }
    .section-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; color:#111827; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; }
    .row { display:flex; }
    .label { width: 160px; color:#374151; font-weight:600; }
    .value { flex:1; color:#111827; }
    .images { display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; }
    .footer { margin-top: 24px; font-size: 12px; color:#6b7280; text-align:center; }
    hr { border: none; height: 1px; background: #e5e7eb; margin: 12px 0; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Product Information</div>
    <div class="meta">Printed: ${new Date().toLocaleString()}</div>
  </div>
  <hr />
  <div class="section">
    <div class="section-title">General</div>
    <div class="grid">
      <div class="row"><div class="label">Product Code</div><div class="value">${safe(item.product_code)}</div></div>
      <div class="row"><div class="label">OE Code</div><div class="value">${safe(item.oe_code)}</div></div>
      <div class="row"><div class="label">Brand</div><div class="value">${safe(item.brand_name)} ${item.brand_code_name ? '('+safe(item.brand_code_name)+')' : ''}</div></div>
      <div class="row"><div class="label">Description</div><div class="value">${safe(item.description)}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Measurements</div>
    <div class="grid">
      <div class="row"><div class="label">Net Weight</div><div class="value">${safe(item.net_weight)}</div></div>
      <div class="row"><div class="label">Gross Weight</div><div class="value">${safe(item.gross_weight)}</div></div>
      <div class="row"><div class="label">Size (A)</div><div class="value">${safe(item.product_size_a)}</div></div>
      <div class="row"><div class="label">Size (B)</div><div class="value">${safe(item.product_size_b)}</div></div>
      <div class="row"><div class="label">Size (C)</div><div class="value">${safe(item.product_size_c)}</div></div>
      <div class="row"><div class="label">Volume</div><div class="value">${safe(item.volume)}</div></div>
      <div class="row"><div class="label">Unit</div><div class="value">${safe(item.unit_name)}</div></div>
      <div class="row"><div class="label">Box</div><div class="value">${safe(item.box_name)}</div></div>
      <div class="row"><div class="label">Label</div><div class="value">${safe(item.label_name)}</div></div>
      <div class="row"><div class="label">Size Mode</div><div class="value">${safe(item.size_mode)}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Identifiers</div>
    <div class="grid">
      <div class="row"><div class="label">QR Code</div><div class="value">${safe(item.qr_code)}</div></div>
      <div class="row"><div class="label">Properties</div><div class="value">${safe(item.properties)}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Images</div>
    <div class="images">
      <div>
        <div class="label" style="margin-bottom:6px;">Technical Image</div>
        ${imgTag(item.technical_image)}
      </div>
      <div>
        <div class="label" style="margin-bottom:6px;">Image</div>
        ${imgTag(item.image)}
      </div>
      <div>
        <div class="label" style="margin-bottom:6px;">QR Code</div>
        ${imgTag(item.qr_code)}
      </div>
    </div>
  </div>
  <hr />
  <div class="footer">ERP Spare Part • Product Information Sheet</div>
</body>
</html>
    `;
  };

  const printRecord = (item) => {
    const html = buildPrintHtml(item);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Ensure images load before printing
    const onLoad = () => { w.focus(); w.print(); w.close(); };
    w.onload = onLoad;
    // Fallback if onload doesn't fire
    setTimeout(onLoad, 1200);
  };

  // Helper to extract a meaningful error message from RTK Query/axios-like responses
  const getErrorMessage = (err, fallback = t("An error occurred")) => {
    try {
      // RTK Query style
      const data = err?.data || err?.error || err;
      const firstError = data?.errors && typeof data.errors === 'object'
        ? Object.values(data.errors).flat().find(Boolean)
        : null;
      return (
        data?.message || firstError || err?.message || fallback
      );
    } catch (_) {
      return fallback;
    }
  };

  // Create
  const onCreate = async (data) => {
    const validationResult = await trigger();
    if (!validationResult) {
      setToastMessage(t("Please fix the validation errors before submitting."));
      basicStickyNotification.current?.showToast();
      return;
    }
    if (!data.product_id) {
      setToastMessage(t("Product ID is required."));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      const { oe_code, product_code, ...payload } = data; // product_code is auto-generated server-side
      const response = await createProductinformation(payload);
      if (response && response.success !== false) {
        setToastMessage(t("ProductInformation created successfully."));
        reset();
        setShowCreateModal(false);
        setRefetch(true);
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Creation failed');
        throw new Error(msg);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("Error creating ProductInformation."));
      setToastMessage(errorMessage);
    }
    basicStickyNotification.current?.showToast();
  };

  // Update
  const onUpdate = async (data) => {
    const validationResult = await trigger();
    if (!validationResult) {
      setToastMessage(t("Please fix the validation errors before updating."));
      basicStickyNotification.current?.showToast();
      return;
    }
    if (!data.product_id) {
      setToastMessage(t("Product ID is required."));
      basicStickyNotification.current?.showToast();
      return;
    }
    try {
      const { oe_code, product_code, ...payload } = data; // product_code is auto-generated server-side
      const response = await updateProductinformation({ ...payload, id: data.id });
      if (response && response.success !== false) {
        setToastMessage(t("ProductInformation updated successfully."));
        reset();
        setShowUpdateModal(false);
        setRefetch(true);
      } else {
        const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Update failed');
        throw new Error(msg);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error, t("Error updating ProductInformation."));
      setToastMessage(errorMessage);
    }
    basicStickyNotification.current?.showToast();
  };

  // File upload setters
  const setUploadTechnical_image = (value) => setValue('technical_image', value);
  const setUploadImage = (value) => setValue('image', value);
  const setUploadQrCode = (value) => setValue('qr_code', value, { shouldValidate: true });

  return (
    <div>
      {/* Hidden registered field for selected row id used by Delete/Update handlers */}
      <input type="hidden" {...register("id")} />
      {/* Delete Modal */}
      <Slideover
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        size="xl"
      >
        <Slideover.Panel>
          <div className="p-5 text-center overflow-y-auto max-h-[110vh]">
            <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
            <div className="mt-5 text-3xl">{t("Are you sure?")}</div>
            <div className="mt-2 text-slate-500">{confirmationMessage}</div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button type="button" variant="outline-secondary" onClick={() => setShowDeleteModal(false)} className="w-24 mr-1">
              {t("Cancel")}
            </Button>
            <Button type="button" variant="danger" className="w-24" onClick={async () => {
              const id = getValues("id");
              setShowDeleteModal(false);
              try {
                const response = await deleteProductinformation(id);
                if (response && response.success !== false) {
                  setToastMessage(t("ProductInformation deleted successfully."));
                  setRefetch(true);
                } else {
                  const msg = response?.data?.message || response?.error?.data?.message || response?.message || t('Deletion failed');
                  throw new Error(msg);
                }
              } catch (error) {
                const errorMessage = getErrorMessage(error, t("Error deleting ProductInformation."));
                setToastMessage(errorMessage);
              }
              basicStickyNotification.current?.showToast();
            }}>
              {t("Delete")}
            </Button>
          </div>
        </Slideover.Panel>
      </Slideover>

      {/* Create Modal */}
      <Slideover open={showCreateModal} onClose={() => setShowCreateModal(false)} size="xl">
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={(e) => {
            handleSubmit((data) => onCreate(data))(e);
          }}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New ProductInformation")}</h2>
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
                  <div className="w-full grid grid-cols-12 gap-4">

                    {/* Row 1 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="form-label">{t("Product")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_product`}
                        setValue={setValue}
                        variable="product_id"
                        // If supported by your component, allow 1-char search:
                        minQueryLength={1}
                        customDataMapping={(item) => ({
                          value: item.value,
                          text: `${item.brand_name || ''} | ${item.brand_code_name || ''} | ${item.oe_code || ''} | ${item.description || ''}`,
                          oe_code: item.oe_code || ''
                        })}
                        onSelectionChange={(item) => {
                          if (item) {
                            setValue('product_id', item.value, { shouldValidate: true });
                            if (item.oe_code) setValue('oe_code', item.oe_code);
                          }
                        }}
                      />
                      <FormInput type="hidden" {...register("product_id", { required: true })} />
                      {errors.product_id && <div className="mt-2 text-danger">{errors.product_id.message}</div>}
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Oe Code")}</FormLabel>
                      <FormInput
                        {...register("oe_code")}
                        type="text"
                        name="oe_code"
                        className={clsx({ "border-danger": errors.oe_code })}
                        placeholder={t("Enter oe_code")}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Net Weight")}</FormLabel>
                      <FormInput
                        {...register("net_weight")}
                        type="number"
                        name="net_weight"
                        className={clsx({ "border-danger": errors.net_weight })}
                        placeholder={t("Enter net_weight")}
                      />
                      {errors.net_weight && <div className="mt-2 text-danger">{errors.net_weight.message}</div>}
                    </div>

                    {/* Row 3 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Gross Weight")}</FormLabel>
                      <FormInput
                        {...register("gross_weight")}
                        type="number"
                        name="gross_weight"
                        className={clsx({ "border-danger": errors.gross_weight })}
                        placeholder={t("Enter gross_weight")}
                      />
                      {errors.gross_weight && <div className="mt-2 text-danger">{errors.gross_weight.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Unit Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_unit`}
                        setValue={setValue}
                        variable="unit_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.unit_name })}
                      />
                      {errors.unit_id && <div className="mt-2 text-danger">{errors.unit_id.message}</div>}
                    </div>

                    {/* Row 4 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Box Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_boxe`}
                        setValue={setValue}
                        variable="box_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.box_name })}
                      />
                      {errors.box_id && <div className="mt-2 text-danger">{errors.box_id.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size A")}</FormLabel>
                      <FormInput
                        {...register("product_size_a")}
                        type="number"
                        name="product_size_a"
                        className={clsx({ "border-danger": errors.product_size_a })}
                        placeholder={t("Enter product_size_a")}
                      />
                      {errors.product_size_a && <div className="mt-2 text-danger">{errors.product_size_a.message}</div>}
                    </div>

                    {/* Row 5 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size B")}</FormLabel>
                      <FormInput
                        {...register("product_size_b")}
                        type="number"
                        name="product_size_b"
                        className={clsx({ "border-danger": errors.product_size_b })}
                        placeholder={t("Enter product_size_b")}
                      />
                      {errors.product_size_b && <div className="mt-2 text-danger">{errors.product_size_b.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size C")}</FormLabel>
                      <FormInput
                        {...register("product_size_c")}
                        type="number"
                        name="product_size_c"
                        className={clsx({ "border-danger": errors.product_size_c })}
                        placeholder={t("Enter product_size_c")}
                      />
                      {errors.product_size_c && <div className="mt-2 text-danger">{errors.product_size_c.message}</div>}
                    </div>

                    {/* Row 6 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Volume")}</FormLabel>
                      <FormInput
                        {...register("volume")}
                        type="number"
                        name="volume"
                        className={clsx({ "border-danger": errors.volume })}
                        placeholder={t("Enter volume")}
                      />
                      {errors.volume && <div className="mt-2 text-danger">{errors.volume.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Label Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_label`}
                        setValue={setValue}
                        variable="label_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.label_name })}
                      />
                      {errors.label_id && <div className="mt-2 text-danger">{errors.label_id.message}</div>}
                    </div>

                    {/* Row 7 */}
                

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Properties")}</FormLabel>
                      <FormInput
                        {...register("properties")}
                        type="text"
                        name="properties"
                        className={clsx({ "border-danger": errors.properties })}
                        placeholder={t("Enter properties")}
                      />
                      {errors.properties && <div className="mt-2 text-danger">{errors.properties.message}</div>}
                    </div>
                    <div className="col-span-12 sm:col-span-12 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("QR Code (Image)")}</FormLabel>
                      <FileUpload
                        endpoint={upload_url}
                        type="image/*"
                        className="w-full"
                        setUploadedURL={setUploadQrCode}
                      />
                      {getValues('qr_code') ? (
                        <img src={`${media_url}${getValues('qr_code')}`} alt="QR Code" className="mt-2 w-24 h-24 object-contain border rounded p-1" />
                      ) : null}
                      {errors.qr_code && <div className="mt-2 text-danger">{errors.qr_code.message}</div>}
                    </div>

                    {/* Row 8 */}
                    <div className="col-span-12">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Technical Image")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadTechnical_image} />
                    </div>

                    <div className="col-span-12">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Image")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadImage} />
                    </div>

                    {/* Row 9 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Size Mode")}</FormLabel>
                      <FormInput
                        {...register("size_mode")}
                        type="text"
                        name="size_mode"
                        className={clsx({ "border-danger": errors.size_mode })}
                        placeholder={t("Enter size_mode")}
                      />
                      {errors.size_mode && <div className="mt-2 text-danger">{errors.size_mode.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Additional Note")}</FormLabel>
                      <FormInput
                        {...register("additional_note")}
                        type="text"
                        name="additional_note"
                        className={clsx({ "border-danger": errors.additional_note })}
                        placeholder={t("Enter additional_note")}
                      />
                      {errors.additional_note && <div className="mt-2 text-danger">{errors.additional_note.message}</div>}
                    </div>

                  </div>
                )}
              </div>
            </Slideover.Description>
            <Slideover.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowCreateModal(false)}
                className="w-24 mr-1"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-24"
                disabled={loading || updating}
              >
                {loading || updating ? <LoadingIcon icon="tail-spin" className="w-4 h-4" /> : t("Save")}
              </Button>
            </Slideover.Footer>
          </form>
        </Slideover.Panel>
      </Slideover>

      {/* Update Modal */}
      <Slideover open={showUpdateModal} onClose={() => setShowUpdateModal(false)} size="xl">
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit ProductInformation")}</h2>
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
                  <div className="w-full grid grid-cols-12 gap-4">

                    {/* Row 1 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="form-label">{t("Product")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_product`}
                        setValue={setValue}
                        variable="product_id"
                        minQueryLength={1}
                        customDataMapping={(item) => ({
                          value: item.value,
                          text: `${item.brand_name || ''} | ${item.brand_code_name || ''} | ${item.oe_code || ''} | ${item.description || ''}`,
                          oe_code: item.oe_code || ''
                        })}
                        onSelectionChange={(item) => {
                          if (item) {
                            setValue('product_id', item.value, { shouldValidate: true });
                            if (item.oe_code) setValue('oe_code', item.oe_code);
                          }
                        }}
                      />
                      <FormInput type="hidden" {...register("product_id", { required: true })} />
                      {errors.product_id && <div className="mt-2 text-danger">{errors.product_id.message}</div>}
                    </div>

                    {/* Row 2 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Oe Code")}</FormLabel>
                      <FormInput
                        {...register("oe_code")}
                        type="text"
                        name="oe_code"
                        className={clsx({ "border-danger": errors.oe_code })}
                        placeholder={t("Enter oe_code")}
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Net Weight")}</FormLabel>
                      <FormInput
                        {...register("net_weight")}
                        type="number"
                        name="net_weight"
                        className={clsx({ "border-danger": errors.net_weight })}
                        placeholder={t("Enter net_weight")}
                      />
                      {errors.net_weight && <div className="mt-2 text-danger">{errors.net_weight.message}</div>}
                    </div>

                    {/* Row 3 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Gross Weight")}</FormLabel>
                      <FormInput
                        {...register("gross_weight")}
                        type="number"
                        name="gross_weight"
                        className={clsx({ "border-danger": errors.gross_weight })}
                        placeholder={t("Enter gross_weight")}
                      />
                      {errors.gross_weight && <div className="mt-2 text-danger">{errors.gross_weight.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Unit Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_unit`}
                        setValue={setValue}
                        variable="unit_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.unit_name })}
                      />
                      {errors.unit_id && <div className="mt-2 text-danger">{errors.unit_id.message}</div>}
                    </div>

                    {/* Row 4 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Box Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_boxe`}
                        setValue={setValue}
                        variable="box_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.box_name })}
                      />
                      {errors.box_id && <div className="mt-2 text-danger">{errors.box_id.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size A")}</FormLabel>
                      <FormInput
                        {...register("product_size_a")}
                        type="number"
                        name="product_size_a"
                        className={clsx({ "border-danger": errors.product_size_a })}
                        placeholder={t("Enter product_size_a")}
                      />
                      {errors.product_size_a && <div className="mt-2 text-danger">{errors.product_size_a.message}</div>}
                    </div>

                    {/* Row 5 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size B")}</FormLabel>
                      <FormInput
                        {...register("product_size_b")}
                        type="number"
                        name="product_size_b"
                        className={clsx({ "border-danger": errors.product_size_b })}
                        placeholder={t("Enter product_size_b")}
                      />
                      {errors.product_size_b && <div className="mt-2 text-danger">{errors.product_size_b.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Product Size C")}</FormLabel>
                      <FormInput
                        {...register("product_size_c")}
                        type="number"
                        name="product_size_c"
                        className={clsx({ "border-danger": errors.product_size_c })}
                        placeholder={t("Enter product_size_c")}
                      />
                      {errors.product_size_c && <div className="mt-2 text-danger">{errors.product_size_c.message}</div>}
                    </div>

                    {/* Row 6 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Volume")}</FormLabel>
                      <FormInput
                        {...register("volume")}
                        type="number"
                        name="volume"
                        className={clsx({ "border-danger": errors.volume })}
                        placeholder={t("Enter volume")}
                      />
                      {errors.volume && <div className="mt-2 text-danger">{errors.volume.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex flex-col w-full sm:flex-row">{t("Label Id")}</FormLabel>
                      <TomSelectSearch
                        apiUrl={`${app_url}/api/search_label`}
                        setValue={setValue}
                        variable="label_id"
                        customDataMapping={(item) => ({ value: item.id, text: item.label_name })}
                      />
                      {errors.label_id && <div className="mt-2 text-danger">{errors.label_id.message}</div>}
                    </div>

                    {/* Row 7 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("QR Code (Image)")}</FormLabel>
                      <FileUpload
                        endpoint={upload_url}
                        type="image/*"
                        className="w-full"
                        setUploadedURL={setUploadQrCode}
                      />
                      {getValues('qr_code') ? (
                        <img src={`${media_url}${getValues('qr_code')}`} alt="QR Code" className="mt-2 w-24 h-24 object-contain border rounded p-1" />
                      ) : null}
                      {errors.qr_code && <div className="mt-2 text-danger">{errors.qr_code.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Properties")}</FormLabel>
                      <FormInput
                        {...register("properties")}
                        type="text"
                        name="properties"
                        className={clsx({ "border-danger": errors.properties })}
                        placeholder={t("Enter properties")}
                      />
                      {errors.properties && <div className="mt-2 text-danger">{errors.properties.message}</div>}
                    </div>

                    {/* Row 8 */}
                    <div className="col-span-12">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Technical Image")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadTechnical_image} />
                    </div>

                    <div className="col-span-12">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Image")}
                      </FormLabel>
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadImage} />
                    </div>

                    {/* Row 9 */}
                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Size Mode")}</FormLabel>
                      <FormInput
                        {...register("size_mode")}
                        type="text"
                        name="size_mode"
                        className={clsx({ "border-danger": errors.size_mode })}
                        placeholder={t("Enter size_mode")}
                      />
                      {errors.size_mode && <div className="mt-2 text-danger">{errors.size_mode.message}</div>}
                    </div>

                    <div className="col-span-12 sm:col-span-6 input-form">
                      <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">{t("Additional Note")}</FormLabel>
                      <FormInput
                        {...register("additional_note")}
                        type="text"
                        name="additional_note"
                        className={clsx({ "border-danger": errors.additional_note })}
                        placeholder={t("Enter additional_note")}
                      />
                      {errors.additional_note && <div className="mt-2 text-danger">{errors.additional_note.message}</div>}
                    </div>

                  </div>
                )}
              </div>
            </Slideover.Description>
            <Slideover.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => setShowUpdateModal(false)}
                className="w-20 mx-2"
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="w-20"
                disabled={loading || updating}
              >
                {loading || updating ? <LoadingIcon icon="tail-spin" className="w-4 h-4" /> : t("Update")}
              </Button>
            </Slideover.Footer>
          </form>
        </Slideover.Panel>
      </Slideover>

      {/* View Modal */}
      <Slideover open={showViewModal} onClose={() => setShowViewModal(false)} size="xl">
        <Slideover.Panel className="text-left overflow-y-auto max-h-[110vh]">
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("ProductInformation Overview")}</h2>
          </Slideover.Title>
          <Slideover.Description className="relative">
            <div className="p-4">
              {viewData ? (
                <div className="grid grid-cols-12 gap-6">
                  {/* General */}
                  <div className="col-span-12 xl:col-span-6">
                    <div className="rounded-lg border border-slate-200 p-5 bg-white">
                      <div className="text-sm font-semibold text-slate-700 mb-4">{t('General')}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <div className="text-xs text-slate-500">{t('Product Code')}</div>
                          <div className="text-sm text-slate-800">{viewData.product_code || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('OE Code')}</div>
                          <div className="text-sm text-slate-800">{viewData.oe_code || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Brand')}</div>
                          <div className="text-sm text-slate-800">{viewData.brand_name || '-'} {viewData.brand_code_name ? `(${viewData.brand_code_name})` : ''}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Description')}</div>
                          <div className="text-sm text-slate-800">{viewData.description || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Unit')}</div>
                          <div className="text-sm text-slate-800">{viewData.unit_name || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Box')}</div>
                          <div className="text-sm text-slate-800">{viewData.box_name || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Label')}</div>
                          <div className="text-sm text-slate-800">{viewData.label_name || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Size Mode')}</div>
                          <div className="text-sm text-slate-800">{viewData.size_mode || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Measurements */}
                  <div className="col-span-12 xl:col-span-6">
                    <div className="rounded-lg border border-slate-200 p-5 bg-white">
                      <div className="text-sm font-semibold text-slate-700 mb-4">{t('Measurements')}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <div className="text-xs text-slate-500">{t('Net Weight')}</div>
                          <div className="text-sm text-slate-800">{viewData.net_weight || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Gross Weight')}</div>
                          <div className="text-sm text-slate-800">{viewData.gross_weight || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Size (A)')}</div>
                          <div className="text-sm text-slate-800">{viewData.product_size_a || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Size (B)')}</div>
                          <div className="text-sm text-slate-800">{viewData.product_size_b || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Size (C)')}</div>
                          <div className="text-sm text-slate-800">{viewData.product_size_c || '-'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Volume')}</div>
                          <div className="text-sm text-slate-800">{viewData.volume || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Identifiers */}
                  <div className="col-span-12">
                    <div className="rounded-lg border border-slate-200 p-5 bg-white">
                      <div className="text-sm font-semibold text-slate-700 mb-4">{t('Identifiers')}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs text-slate-500">{t('QR Code')}</div>
                          {viewData.qr_code ? (
                            <img src={`${media_url}${viewData.qr_code}`} alt="QR Code" className="mt-2 rounded border border-slate-200 p-2 max-h-56 object-contain bg-white" />
                          ) : (
                            <div className="text-slate-400 mt-2">{t('No image')}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Properties')}</div>
                          <div className="text-sm text-slate-800 mt-2 whitespace-pre-line break-words">{viewData.properties || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="col-span-12">
                    <div className="rounded-lg border border-slate-200 p-5 bg-white">
                      <div className="text-sm font-semibold text-slate-700 mb-4">{t('Images')}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs text-slate-500">{t('Technical Image')}</div>
                          {viewData.technical_image ? (
                            <img src={`${media_url}${viewData.technical_image}`} className="mt-2 rounded border border-slate-200 p-2 max-h-64 object-contain bg-white" />
                          ) : (
                            <div className="text-slate-400 mt-2">{t('No image')}</div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">{t('Image')}</div>
                          {viewData.image ? (
                            <img src={`${media_url}${viewData.image}`} className="mt-2 rounded border border-slate-200 p-2 max-h-64 object-contain bg-white" />
                          ) : (
                            <div className="text-slate-400 mt-2">{t('No image')}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">{t("No data selected.")}</div>
              )}
            </div>
          </Slideover.Description>
          <Slideover.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setShowViewModal(false)} className="w-24 mr-2">
              {t('Close')}
            </Button>
            <Button type="button" variant="primary" className="w-24" onClick={() => viewData && printRecord(viewData)}>
              {t('Print')}
            </Button>
          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>

      <Notification
        getRef={(el) => { basicStickyNotification.current = el; }}
        options={{ duration: 3000 }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium">{toastMessage}</div>
      </Notification>

      <Can permission="productinformation-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/ProductInformation"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"productinformation-create"}
        />
      </Can>
    </div>
  );
}

export default index_main;