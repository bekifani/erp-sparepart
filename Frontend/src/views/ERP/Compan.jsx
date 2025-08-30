
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
  useCreateCompanMutation,
  useDeleteCompanMutation,
  useEditCompanMutation,
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
    useState(t("Are you Sure Do You want to Delete Compan"));

  
 const [
    createCompan,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCompanMutation();
  const [
    updateCompan,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCompanMutation();
  const [
    deleteCompan,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCompanMutation()


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
      title: t("Logo"),
      minWidth: 200,
      field: "logo",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
      return getMiniDisplay(cell.getData().logo)
      }
    },
    

    {
      title: t("Name"),
      minWidth: 200,
      field: "name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Name Cn"),
      minWidth: 200,
      field: "name_cn",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Company Address"),
      minWidth: 200,
      field: "company_address",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Company Address Cn"),
      minWidth: 200,
      field: "company_address_cn",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Bank Details"),
      minWidth: 200,
      field: "bank_details",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Bank Details Cn"),
      minWidth: 200,
      field: "bank_details_cn",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Contact Person"),
      minWidth: 200,
      field: "contact_person",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Phone Number"),
      minWidth: 200,
      field: "phone_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Email"),
      minWidth: 200,
      field: "email",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Website"),
      minWidth: 200,
      field: "website",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Tax Id"),
      minWidth: 200,
      field: "tax_id",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Registration Number"),
      minWidth: 200,
      field: "registration_number",
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
        let permission = "compan";
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
  const [searchColumns, setSearchColumns] = useState(['name', 'name_cn', 'company_address', 'company_address_cn', 'bank_details', 'bank_details_cn', 'contact_person', 'phone_number', 'email', 'website', 'tax_id', 'registration_number', 'status', ]);

  // schema
  const schema = yup
    .object({
     logo : yup.string().required(t('The Logo field is required')), 
name : yup.string().required(t('The Name field is required')), 
name_cn : yup.string().required(t('The Name Cn field is required')), 
company_address : yup.string().required(t('The Company Address field is required')), 
company_address_cn : yup.string().required(t('The Company Address Cn field is required')), 
bank_details : yup.string().required(t('The Bank Details field is required')), 
bank_details_cn : yup.string().required(t('The Bank Details Cn field is required')), 
contact_person : yup.string().required(t('The Contact Person field is required')), 
phone_number : yup.string().required(t('The Phone Number field is required')), 
website : yup.string().required(t('The Website field is required')), 
tax_id : yup.string().required(t('The Tax Id field is required')), 
registration_number : yup.string().required(t('The Registration Number field is required')), 
status : yup.string().required(t('The Status field is required')), 

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

   

          const setUploadLogo  = (value) => {
              setValue('logo', value);
            } 

        

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
      const response = await createCompan(data);
      setToastMessage(t("Compan created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Compan."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateCompan(data);
      setToastMessage(t('Compan updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Compan deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteCompan(id);
        setToastMessage(t("Compan deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Compan."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Compan")}</h2>
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
                    
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadLogo}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name")}
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder={t("Enter name")}
                      />
                      {errors.name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name.message === "string" &&
                            errors.name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("name_cn")}
                        id="validation-form-1"
                        type="text"
                        name="name_cn"
                        className={clsx({
                          "border-danger": errors.name_cn,
                        })}
                        placeholder={t("Enter name_cn")}
                      />
                      {errors.name_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_cn.message === "string" &&
                            errors.name_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address")}
                      </FormLabel>
                      <FormInput
                        {...register("company_address")}
                        id="validation-form-1"
                        type="text"
                        name="company_address"
                        className={clsx({
                          "border-danger": errors.company_address,
                        })}
                        placeholder={t("Enter company_address")}
                      />
                      {errors.company_address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_address.message === "string" &&
                            errors.company_address.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("company_address_cn")}
                        id="validation-form-1"
                        type="text"
                        name="company_address_cn"
                        className={clsx({
                          "border-danger": errors.company_address_cn,
                        })}
                        placeholder={t("Enter company_address_cn")}
                      />
                      {errors.company_address_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_address_cn.message === "string" &&
                            errors.company_address_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details")}
                      </FormLabel>
                      <FormInput
                        {...register("bank_details")}
                        id="validation-form-1"
                        type="text"
                        name="bank_details"
                        className={clsx({
                          "border-danger": errors.bank_details,
                        })}
                        placeholder={t("Enter bank_details")}
                      />
                      {errors.bank_details && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details.message === "string" &&
                            errors.bank_details.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("bank_details_cn")}
                        id="validation-form-1"
                        type="text"
                        name="bank_details_cn"
                        className={clsx({
                          "border-danger": errors.bank_details_cn,
                        })}
                        placeholder={t("Enter bank_details_cn")}
                      />
                      {errors.bank_details_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details_cn.message === "string" &&
                            errors.bank_details_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Contact Person")}
                      </FormLabel>
                      <FormInput
                        {...register("contact_person")}
                        id="validation-form-1"
                        type="text"
                        name="contact_person"
                        className={clsx({
                          "border-danger": errors.contact_person,
                        })}
                        placeholder={t("Enter contact_person")}
                      />
                      {errors.contact_person && (
                        <div className="mt-2 text-danger">
                          {typeof errors.contact_person.message === "string" &&
                            errors.contact_person.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="validation-form-1"
                        type="text"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone_number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Email")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="validation-form-1"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Website")}
                      </FormLabel>
                      <FormInput
                        {...register("website")}
                        id="validation-form-1"
                        type="text"
                        name="website"
                        className={clsx({
                          "border-danger": errors.website,
                        })}
                        placeholder={t("Enter website")}
                      />
                      {errors.website && (
                        <div className="mt-2 text-danger">
                          {typeof errors.website.message === "string" &&
                            errors.website.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Id")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_id")}
                        id="validation-form-1"
                        type="text"
                        name="tax_id"
                        className={clsx({
                          "border-danger": errors.tax_id,
                        })}
                        placeholder={t("Enter tax_id")}
                      />
                      {errors.tax_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_id.message === "string" &&
                            errors.tax_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Registration Number")}
                      </FormLabel>
                      <FormInput
                        {...register("registration_number")}
                        id="validation-form-1"
                        type="text"
                        name="registration_number"
                        className={clsx({
                          "border-danger": errors.registration_number,
                        })}
                        placeholder={t("Enter registration_number")}
                      />
                      {errors.registration_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.registration_number.message === "string" &&
                            errors.registration_number.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Compan")}</h2>
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
                    
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadLogo}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name")}
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder={t("Enter name")}
                      />
                      {errors.name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name.message === "string" &&
                            errors.name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Name Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("name_cn")}
                        id="validation-form-1"
                        type="text"
                        name="name_cn"
                        className={clsx({
                          "border-danger": errors.name_cn,
                        })}
                        placeholder={t("Enter name_cn")}
                      />
                      {errors.name_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.name_cn.message === "string" &&
                            errors.name_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address")}
                      </FormLabel>
                      <FormInput
                        {...register("company_address")}
                        id="validation-form-1"
                        type="text"
                        name="company_address"
                        className={clsx({
                          "border-danger": errors.company_address,
                        })}
                        placeholder={t("Enter company_address")}
                      />
                      {errors.company_address && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_address.message === "string" &&
                            errors.company_address.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Company Address Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("company_address_cn")}
                        id="validation-form-1"
                        type="text"
                        name="company_address_cn"
                        className={clsx({
                          "border-danger": errors.company_address_cn,
                        })}
                        placeholder={t("Enter company_address_cn")}
                      />
                      {errors.company_address_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.company_address_cn.message === "string" &&
                            errors.company_address_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details")}
                      </FormLabel>
                      <FormInput
                        {...register("bank_details")}
                        id="validation-form-1"
                        type="text"
                        name="bank_details"
                        className={clsx({
                          "border-danger": errors.bank_details,
                        })}
                        placeholder={t("Enter bank_details")}
                      />
                      {errors.bank_details && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details.message === "string" &&
                            errors.bank_details.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Bank Details Cn")}
                      </FormLabel>
                      <FormInput
                        {...register("bank_details_cn")}
                        id="validation-form-1"
                        type="text"
                        name="bank_details_cn"
                        className={clsx({
                          "border-danger": errors.bank_details_cn,
                        })}
                        placeholder={t("Enter bank_details_cn")}
                      />
                      {errors.bank_details_cn && (
                        <div className="mt-2 text-danger">
                          {typeof errors.bank_details_cn.message === "string" &&
                            errors.bank_details_cn.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Contact Person")}
                      </FormLabel>
                      <FormInput
                        {...register("contact_person")}
                        id="validation-form-1"
                        type="text"
                        name="contact_person"
                        className={clsx({
                          "border-danger": errors.contact_person,
                        })}
                        placeholder={t("Enter contact_person")}
                      />
                      {errors.contact_person && (
                        <div className="mt-2 text-danger">
                          {typeof errors.contact_person.message === "string" &&
                            errors.contact_person.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Phone Number")}
                      </FormLabel>
                      <FormInput
                        {...register("phone_number")}
                        id="validation-form-1"
                        type="text"
                        name="phone_number"
                        className={clsx({
                          "border-danger": errors.phone_number,
                        })}
                        placeholder={t("Enter phone_number")}
                      />
                      {errors.phone_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone_number.message === "string" &&
                            errors.phone_number.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Email")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="validation-form-1"
                        type="email"
                        name="email"
                        className={clsx({
                          "border-danger": errors.email,
                        })}
                        placeholder={t("Enter email")}
                      />
                      {errors.email && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Website")}
                      </FormLabel>
                      <FormInput
                        {...register("website")}
                        id="validation-form-1"
                        type="text"
                        name="website"
                        className={clsx({
                          "border-danger": errors.website,
                        })}
                        placeholder={t("Enter website")}
                      />
                      {errors.website && (
                        <div className="mt-2 text-danger">
                          {typeof errors.website.message === "string" &&
                            errors.website.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Tax Id")}
                      </FormLabel>
                      <FormInput
                        {...register("tax_id")}
                        id="validation-form-1"
                        type="text"
                        name="tax_id"
                        className={clsx({
                          "border-danger": errors.tax_id,
                        })}
                        placeholder={t("Enter tax_id")}
                      />
                      {errors.tax_id && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax_id.message === "string" &&
                            errors.tax_id.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Registration Number")}
                      </FormLabel>
                      <FormInput
                        {...register("registration_number")}
                        id="validation-form-1"
                        type="text"
                        name="registration_number"
                        className={clsx({
                          "border-danger": errors.registration_number,
                        })}
                        placeholder={t("Enter registration_number")}
                      />
                      {errors.registration_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.registration_number.message === "string" &&
                            errors.registration_number.message}
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
      <Can permission="compan-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/compan"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Compan"}
        />
      </Can>
    </div>
  );
}
export default index_main;
