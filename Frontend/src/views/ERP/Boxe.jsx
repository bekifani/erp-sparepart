
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
import { FormCheck, FormTextarea, FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateBoxeMutation,
  useDeleteBoxeMutation,
  useEditBoxeMutation,
  useGetBrandnamesQuery,
  useGetLabelsQuery,
  useGetUnitsQuery,
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
  const upload_url = useSelector((state) => state.auth.upload_url)
  const media_url = useSelector((state) => state.auth.media_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Boxe"));


  const [
    createBoxe,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateBoxeMutation();
  const [
    updateBoxe,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditBoxeMutation();
  const [
    deleteBoxe,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteBoxeMutation()


  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state) => state.auth.user)
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
      title: t("Brand"),
      minWidth: 200,
      field: "brand",
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
      title: t("Material"),
      minWidth: 200,
      field: "material",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Stock Qty"),
      minWidth: 200,
      field: "stock_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Order Qty"),
      minWidth: 200,
      field: "order_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },

    {
      title: t("Available Qty"),
      minWidth: 200,
      field: "available_qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const data = cell.getData();
        const stockQty = parseFloat(data.stock_qty) || 0;
        const orderQty = parseFloat(data.order_qty) || 0;
        const availableQty = stockQty - orderQty;
        
        // Apply red color and bold if available qty <= 0
        const style = availableQty <= 0 ? 'color: red; font-weight: bold;' : '';
        return `<span style="${style}">${availableQty}</span>`;
      }
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
      title: t("Size A"),
      minWidth: 200,
      field: "size_a",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Size B"),
      minWidth: 200,
      field: "size_b",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Size C"),
      minWidth: 200,
      field: "size_c",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Volume"),
      minWidth: 200,
      field: "volume",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },


    {
      title: t("Label"),
      minWidth: 200,
      field: "label",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

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
        return getMiniDisplay(cell.getData().image)
      }
    },


    {
      title: t("Design File"),
      minWidth: 200,
      field: "design_file",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().design_file)
      }
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
      title: t("Package Type"),
      minWidth: 150,
      field: "package_type",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,

    },

    {
      title: t("Box Size (L×W×H)"),
      minWidth: 200,
      field: "box_size",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const data = cell.getData();
        const packageType = data.package_type || '3D';
        const sizeA = parseFloat(data.size_a) || 0;
        const sizeB = parseFloat(data.size_b) || 0;
        const sizeC = parseFloat(data.size_c) || 0;
        
        if (packageType === '3D') {
          // 3D Boxes: Show L×W×H format
          return `${sizeA}×${sizeB}×${sizeC} cm`;
        } else {
          // 2D Packaging: Show L×W format
          return `${sizeA}×${sizeB} cm`;
        }
      }
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
        let permission = "boxe";
        if (hasPermission(permission + '-edit')) {
          element.append(a)
        }
        if (hasPermission(permission + '-delete')) {
          element.append(b)
        }
        return element;
      },
    },
  ]);
  const [searchColumns, setSearchColumns] = useState(['brand', 'box_name', 'material', 'stock_qty', 'order_qty', 'available_qty', 'price', 'size_a', 'size_b', 'size_c', 'volume', 'label', 'additional_note', 'package_type']);
  const [packageType, setPackageType] = useState('3D');

  // schema
  const schema = yup
    .object({
      brand: yup.string().required(t('The Brand field is required')),
      box_name: yup.string().required(t('The Box Name field is required')),
      material: yup.string().required(t('The Material field is required')),
      label: yup.string().nullable(),
      size_a: yup.number().nullable(),
      size_b: yup.number().nullable(),
      size_c: yup.number().nullable(),
      unit_id: yup.string().nullable(),
      volume: yup.number().nullable(),
      stock_qty: yup.number().nullable(),
      price: yup.number().nullable(),
      image: yup.string().nullable(),
      design_file: yup.string().nullable(),
      additional_note: yup.string().nullable(),
      package_type: yup.string().nullable(),
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



  const setUploadImage = (value) => {
    setValue('image', value);
  }


  const setUploadDesign_file = (value) => {
    setValue('design_file', value);
  }



  const [refetch, setRefetch] = useState(false);

  // Fetch brandnames, labels and units for dropdowns
  const { data: brandnamesResponse } = useGetBrandnamesQuery();
  const { data: labelsResponse } = useGetLabelsQuery();
  const { data: unitsResponse } = useGetUnitsQuery();

  // Handle API response structure - data might be nested in response.data
  const brandnames = Array.isArray(brandnamesResponse) ? brandnamesResponse : (brandnamesResponse?.data || []);
  const labels = Array.isArray(labelsResponse) ? labelsResponse : (labelsResponse?.data || []);
  const units = Array.isArray(unitsResponse) ? unitsResponse : (unitsResponse?.data || []);
  const getMiniDisplay = (url) => {
    let data = app_url + '/api/file/' + url;

    const fileExtension = data.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    let element;

    if (imageExtensions.includes(fileExtension)) {
      element = (
        // <DynamicImage imagePath={url} token={token}/>
        <img data-action="zoom" src={media_url + url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-md" />
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

  const onCreateModal = () => {
    setShowCreateModal(true);
    // Set default package type to 3D
    setValue("package_type", "3D");
    setPackageType("3D");
  };

  const onEdit = (data) => {
    setShowUpdateModal(true);
    setValue("brand", data.brand);
    setValue("box_name", data.box_name);
    setValue("material", data.material);
    setValue("label", data.label);
    setValue("size_a", data.size_a);
    setValue("size_b", data.size_b);
    setValue("size_c", data.size_c);
    setValue("unit_id", data.unit_id);
    setValue("volume", data.volume);
    setValue("stock_qty", data.stock_qty);
    setValue("price", data.price);
    setValue("image", data.image);
    setValue("design_file", data.design_file);
    setValue("additional_note", data.additional_note);
    setValue("package_type", data.package_type || '3D');
    setPackageType(data.package_type || '3D');
    setSelectedData(data);
  };

  const onCreate = async (data) => {
    // Filter out unwanted fields and only send necessary data
    const cleanData = {
      brand: data.brand,
      box_name: data.box_name,
      material: data.material,
      label: data.label,
      size_a: data.size_a,
      size_b: data.size_b,
      size_c: data.size_c,
      unit_id: data.unit_id,
      volume: data.volume,
      stock_qty: data.stock_qty,
      price: data.price,
      image: data.image,
      design_file: data.design_file,
      additional_note: data.additional_note,
      package_type: data.package_type,
    };
    
    console.log('Frontend sending clean data:', cleanData);
    console.log('Brand Name:', cleanData.brand);
    console.log('Label Name:', cleanData.label);
    
    try {
      const response = await createBoxe(cleanData);
      console.log('Backend response:', response);
      if (response.error) {
        console.error('API Error:', response.error);
        setToastMessage(t("Error creating Boxe: ") + JSON.stringify(response.error));
      } else {
        setToastMessage(t("Boxe created successfully."));
      }
    } catch (error) {
      console.error('Request failed:', error);
      setToastMessage(t("Error creating Boxe: ") + error.message);
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateBoxe(data);
      setToastMessage(t('Boxe updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Boxe deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
      const response = deleteBoxe(id);
      setToastMessage(t("Boxe deleted successfully."));
      setRefetch(true);
    }
    catch (error) {
      setToastMessage(t("Error deleting Boxe."));
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
        size="xl"
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
        size="xl"
      >
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Box")}</h2>
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
                  <div className="w-full gap-4 gap-y-3">
                    {/* Row 1: Brand and Box Name side by side */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Brand")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_brandname`}
                          setValue={setValue}
                          variable="brand"
                          customDataMapping={(item) => ({
                            value: item.brand_name,
                            text: item.brand_name
                          })}
                          className={clsx({
                            "border-danger": errors.brand,
                          })}
                        />
                        {errors.brand && (
                          <div className="mt-2 text-danger">
                            {typeof errors.brand.message === "string" &&
                              errors.brand.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
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
                    </div>
  
                    {/* Row 2: Material and Label side by side */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Material")}
                        </FormLabel>
                        <FormInput
                          {...register("material")}
                          id="validation-form-1"
                          type="text"
                          name="material"
                          className={clsx({
                            "border-danger": errors.material,
                          })}
                          placeholder={t("Enter material")}
                        />
                        {errors.material && (
                          <div className="mt-2 text-danger">
                            {typeof errors.material.message === "string" &&
                              errors.material.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Label")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_label`}
                          setValue={setValue}
                          variable="label"
                          customDataMapping={(item) => ({
                            value: item.label_name || item.labelname || item.name,
                            text: item.label_name || item.labelname || item.name
                          })}
                          className={clsx({
                            "border-danger": errors.label,
                          })}
                        />
                        {errors.label && (
                          <div className="mt-2 text-danger">
                            {typeof errors.label.message === "string" &&
                              errors.label.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Package Type Selection */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Package Type")}
                      </FormLabel>
                      <select
                        {...register("package_type")}
                        className={clsx("form-select", {
                          "border-danger": errors.package_type,
                        })}
                        onChange={(e) => {
                          setValue("package_type", e.target.value);
                          setPackageType(e.target.value);
                          // Clear Size C if switching to 2D
                          if (e.target.value === '2D') {
                            setValue("size_c", null);
                          }
                          // Recalculate volume when package type changes
                          const sizeA = parseFloat(getValues("size_a")) || 0;
                          const sizeB = parseFloat(getValues("size_b")) || 0;
                          const sizeC = parseFloat(getValues("size_c")) || 0;
                          const volume = e.target.value === '3D' ? sizeA * sizeB * sizeC : sizeA * sizeB;
                          setValue("volume", volume);
                        }}
                      >
                        <option value="3D">{t("3D Boxes (L×W×H)")}</option>
                        <option value="2D">{t("2D Packaging (L×W)")}</option>
                      </select>
                      {errors.package_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.package_type.message === "string" &&
                            errors.package_type.message}
                        </div>
                      )}
                    </div>
  
                    {/* Row 3: Box Sizes (A, B, C) with Unit Type */}
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Size A")}
                        </FormLabel>
                        <FormInput
                          {...register("size_a")}
                          type="number"
                          name="size_a"
                          className={clsx({"border-danger": errors.size_a})}
                          placeholder={t("Enter size A")}
                          onChange={(e) => {
                            const sizeA = parseFloat(e.target.value) || 0;
                            const sizeB = parseFloat(getValues("size_b")) || 0;
                            const sizeC = parseFloat(getValues("size_c")) || 0;
                            const volume = sizeA * sizeB * sizeC;
                            setValue("volume", volume);
                          }}
                        />
                        {errors.size_a && (
                          <div className="mt-2 text-danger">
                            {typeof errors.size_a.message === "string" && errors.size_a.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Size B")}
                        </FormLabel>
                        <FormInput
                          {...register("size_b")}
                          type="number"
                          name="size_b"
                          className={clsx({"border-danger": errors.size_b})}
                          placeholder={t("Enter size B")}
                          onChange={(e) => {
                            const sizeA = parseFloat(getValues("size_a")) || 0;
                            const sizeB = parseFloat(e.target.value) || 0;
                            const sizeC = parseFloat(getValues("size_c")) || 0;
                            const volume = sizeA * sizeB * sizeC;
                            setValue("volume", volume);
                          }}
                        />
                        {errors.size_b && (
                          <div className="mt-2 text-danger">
                            {typeof errors.size_b.message === "string" && errors.size_b.message}
                          </div>
                        )}
                      </div>
  
                      {/* Size C - Only show for 3D packages */}
                      {packageType === '3D' && (
                        <div className="input-form">
                          <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                            {t("Size C (Height)")}
                          </FormLabel>
                          <FormInput
                            {...register("size_c")}
                            type="number"
                            name="size_c"
                            className={clsx({"border-danger": errors.size_c})}
                            placeholder={t("Enter size C (Height)")}
                            onChange={(e) => {
                              const sizeA = parseFloat(getValues("size_a")) || 0;
                              const sizeB = parseFloat(getValues("size_b")) || 0;
                              const sizeC = parseFloat(e.target.value) || 0;
                              const volume = sizeA * sizeB * sizeC;
                              setValue("volume", volume);
                            }}
                          />
                          {errors.size_c && (
                            <div className="mt-2 text-danger">
                              {typeof errors.size_c.message === "string" && errors.size_c.message}
                            </div>
                          )}
                        </div>
                      )}
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Unit Type")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_unit`}
                          setValue={setValue}
                          variable="unit_id"
                          customDataMapping={(item) => ({
                            value: item.id,
                            text: item.unit_name || item.name
                          })}
                          className={clsx({"border-danger": errors.unit_id})}
                        />
                        {errors.unit_id && (
                          <div className="mt-2 text-danger">
                            {typeof errors.unit_id.message === "string" && errors.unit_id.message}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* Row 4: Volume, Stock Qty */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Volume")}
                        </FormLabel>
                        <FormInput
                          {...register("volume")}
                          type="number"
                          name="volume"
                          className={clsx({"border-danger": errors.volume})}
                          placeholder={t("Auto-calculated volume")}
                          readOnly
                          style={{backgroundColor: '#f8f9fa'}}
                        />
                        {errors.volume && (
                          <div className="mt-2 text-danger">
                            {typeof errors.volume.message === "string" && errors.volume.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Stock Qty")}
                        </FormLabel>
                        <FormInput
                          {...register("stock_qty")}
                          type="number"
                          name="stock_qty"
                          className={clsx({"border-danger": errors.stock_qty})}
                          placeholder={t("Enter stock qty")}
                        />
                        {errors.stock_qty && (
                          <div className="mt-2 text-danger">
                            {typeof errors.stock_qty.message === "string" && errors.stock_qty.message}
                          </div>
                        )}
                      </div>
  
                    </div>
  
                    {/* Row 5: Price */}
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
  
                    {/* Row 6: Design File */}
                    <div className="mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Design File")}
                        </FormLabel>
                        <FileUpload endpoint={upload_url} type="*" className="w-full" setUploadedURL={setUploadDesign_file}/>
                      </div>
                    </div>
  
                    {/* Row 7: Image */}
                    <div className="mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Image")}
                        </FormLabel>
                        <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadImage}/>
                      </div>
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
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
        size="xl"
      >
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Boxe")}</h2>
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
                  <div className="w-full gap-4 gap-y-3">
                    {/* Row 1: Brand and Box Name side by side */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Brand")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_brandname`}
                          setValue={setValue}
                          variable="brand"
                          customDataMapping={(item) => ({
                            value: item.brand_name,
                            text: item.brand_name
                          })}
                          className={clsx({
                            "border-danger": errors.brand,
                          })}
                        />
                        {errors.brand && (
                          <div className="mt-2 text-danger">
                            {typeof errors.brand.message === "string" &&
                              errors.brand.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
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
                    </div>
  
                    {/* Row 2: Material and Label side by side */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Material")}
                        </FormLabel>
                        <FormInput
                          {...register("material")}
                          id="validation-form-1"
                          type="text"
                          name="material"
                          className={clsx({
                            "border-danger": errors.material,
                          })}
                          placeholder={t("Enter material")}
                        />
                        {errors.material && (
                          <div className="mt-2 text-danger">
                            {typeof errors.material.message === "string" &&
                              errors.material.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel
                          htmlFor="validation-form-1"
                          className="flex justify-start items-start flex-col w-full sm:flex-row"
                        >
                          {t("Label")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_label`}
                          setValue={setValue}
                          variable="label"
                          customDataMapping={(item) => ({
                            value: item.label_name || item.labelname || item.name,
                            text: item.label_name || item.labelname || item.name
                          })}
                          className={clsx({
                            "border-danger": errors.label,
                          })}
                        />
                        {errors.label && (
                          <div className="mt-2 text-danger">
                            {typeof errors.label.message === "string" &&
                              errors.label.message}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Package Type Selection */}
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Package Type")}
                      </FormLabel>
                      <select
                        {...register("package_type")}
                        className={clsx("form-select", {
                          "border-danger": errors.package_type,
                        })}
                        onChange={(e) => {
                          setValue("package_type", e.target.value);
                          setPackageType(e.target.value);
                          // Clear Size C if switching to 2D
                          if (e.target.value === '2D') {
                            setValue("size_c", null);
                          }
                          // Recalculate volume when package type changes
                          const sizeA = parseFloat(getValues("size_a")) || 0;
                          const sizeB = parseFloat(getValues("size_b")) || 0;
                          const sizeC = parseFloat(getValues("size_c")) || 0;
                          const volume = e.target.value === '3D' ? sizeA * sizeB * sizeC : sizeA * sizeB;
                          setValue("volume", volume);
                        }}
                      >
                        <option value="3D">{t("3D Boxes (L×W×H)")}</option>
                        <option value="2D">{t("2D Packaging (L×W)")}</option>
                      </select>
                      {errors.package_type && (
                        <div className="mt-2 text-danger">
                          {typeof errors.package_type.message === "string" &&
                            errors.package_type.message}
                        </div>
                      )}
                    </div>
  
                    {/* Row 3: Box Sizes (A, B, C) with Unit Type */}
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Size A")}
                        </FormLabel>
                        <FormInput
                          {...register("size_a")}
                          type="number"
                          name="size_a"
                          className={clsx({"border-danger": errors.size_a})}
                          placeholder={t("Enter size A")}
                          onChange={(e) => {
                            const sizeA = parseFloat(e.target.value) || 0;
                            const sizeB = parseFloat(getValues("size_b")) || 0;
                            const sizeC = parseFloat(getValues("size_c")) || 0;
                            const volume = sizeA * sizeB * sizeC;
                            setValue("volume", volume);
                          }}
                        />
                        {errors.size_a && (
                          <div className="mt-2 text-danger">
                            {typeof errors.size_a.message === "string" && errors.size_a.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Size B")}
                        </FormLabel>
                        <FormInput
                          {...register("size_b")}
                          type="number"
                          name="size_b"
                          className={clsx({"border-danger": errors.size_b})}
                          placeholder={t("Enter size B")}
                          onChange={(e) => {
                            const sizeA = parseFloat(getValues("size_a")) || 0;
                            const sizeB = parseFloat(e.target.value) || 0;
                            const sizeC = parseFloat(getValues("size_c")) || 0;
                            const volume = packageType === '3D' ? sizeA * sizeB * sizeC : sizeA * sizeB;
                            setValue("volume", volume);
                          }}
                        />
                        {errors.size_b && (
                          <div className="mt-2 text-danger">
                            {typeof errors.size_b.message === "string" && errors.size_b.message}
                          </div>
                        )}
                      </div>
  
                      {/* Size C - Only show for 3D packages */}
                      {packageType === '3D' && (
                        <div className="input-form">
                          <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                            {t("Size C (Height)")}
                          </FormLabel>
                          <FormInput
                            {...register("size_c")}
                            type="number"
                            name="size_c"
                            className={clsx({"border-danger": errors.size_c})}
                            placeholder={t("Enter size C (Height)")}
                          />
                          {errors.size_c && (
                            <div className="mt-2 text-danger">
                              {typeof errors.size_c.message === "string" && errors.size_c.message}
                            </div>
                          )}
                        </div>
                      )}
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Unit Type")}
                        </FormLabel>
                        <TomSelectSearch
                          apiUrl={`${app_url}/api/search_unit`}
                          setValue={setValue}
                          variable="unit_id"
                          customDataMapping={(item) => ({
                            value: item.id,
                            text: item.unit_name || item.name
                          })}
                          className={clsx({"border-danger": errors.unit_id})}
                        />
                        {errors.unit_id && (
                          <div className="mt-2 text-danger">
                            {typeof errors.unit_id.message === "string" && errors.unit_id.message}
                          </div>
                        )}
                      </div>
                    </div>
  
                    {/* Row 4: Volume, Stock Qty */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Volume")}
                        </FormLabel>
                        <FormInput
                          {...register("volume")}
                          type="number"
                          name="volume"
                          className={clsx({"border-danger": errors.volume})}
                          placeholder={t("Auto-calculated volume")}
                          readOnly
                          style={{backgroundColor: '#f8f9fa'}}
                        />
                        {errors.volume && (
                          <div className="mt-2 text-danger">
                            {typeof errors.volume.message === "string" && errors.volume.message}
                          </div>
                        )}
                      </div>
  
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Stock Qty")}
                        </FormLabel>
                        <FormInput
                          {...register("stock_qty")}
                          type="number"
                          name="stock_qty"
                          className={clsx({"border-danger": errors.stock_qty})}
                          placeholder={t("Enter stock qty")}
                        />
                        {errors.stock_qty && (
                          <div className="mt-2 text-danger">
                            {typeof errors.stock_qty.message === "string" && errors.stock_qty.message}
                          </div>
                        )}
                      </div>
  
                    </div>
  
                    {/* Row 5: Price */}
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
  
                    {/* Row 6: Design File */}
                    <div className="mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Design File")}
                        </FormLabel>
                        <FileUpload endpoint={upload_url} type="*" className="w-full" setUploadedURL={setUploadDesign_file}/>
                      </div>
                    </div>
  
                    {/* Row 7: Image */}
                    <div className="mt-3">
                      <div className="input-form">
                        <FormLabel className="flex justify-start items-start flex-col w-full sm:flex-row">
                          {t("Image")}
                        </FormLabel>
                        <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadImage}/>
                      </div>
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
      
      <Can permission="boxe-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/boxe"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Boxe"}
        />
      </Can>
    </div>
  );
}
export default index_main;
