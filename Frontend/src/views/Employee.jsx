
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
  useActivateEmployeeAccountMutation,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEditEmployeeMutation,
  useTerminateEmployeeMutation,
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
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Employee"));

  
 const [
    createEmployee,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateEmployeeMutation();
  const [
    updateEmployee,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditEmployeeMutation();
  const [
    deleteEmployee,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteEmployeeMutation()
  const [
    terminateUser, 
    {isLoading: terminating, isSuccess: terminated, error: terminationError}
  ] = useTerminateEmployeeMutation()
  const [
    activateEmployeeAccount,
    {isLoading: activating, isSuccess: activated, error: activationError}
  ] = useActivateEmployeeAccountMutation();


  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = (permission) => {
    return user.permissions.includes(permission)
  }
  const [data, setData] = useState([
    {
      title: t("First Name"),
      minWidth: 200,
      field: "first_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },

    {
      title: t("Last Name"),
      minWidth: 200,
      field: "last_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
   
    {
      title: t("Image"),
      minWidth: 100,
      field: "photo",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        return getMiniDisplay(cell.getData().photo)
      }
    },
    
    {
      title: t("E-mail"),
      minWidth: 200,
      field: "email",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },

    {
      title: t("Phone"),
      minWidth: 150,
      field: "phone",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("Position"),
      minWidth: 150,
      field: "position",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("Birth date"),
      minWidth: 120,
      field: "birthdate",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("WhatsApp"),
      minWidth: 150,
      field: "whatsapp",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    
    {
      title: t("Wechat"),
      minWidth: 150,
      field: "wechat",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },

    {
      title: t("Salary"),
      minWidth: 120,
      field: "salary",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },

    {
      title: t("Salary date"),
      minWidth: 120,
      field: "hire_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    

    {
      title: t("Is Active"),
      minWidth: 200,
      field: "is_active",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell){
        if(cell.getData().is_active == 0){
          return t("Not Active")
        }
        return t("Active")
      }
      
    },
    

    {
      title: t("Additional note"),
      minWidth: 200,
      field: "note",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    

    {
      title: t("Actions"),
      minWidth: 400,
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
                <i data-lucide="check-square" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> ${t('Edit')}
              </a>`);
        const b = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 stroke-[1.7]  mr-1.5"></i> ${t('Delete')}
              </a>
            </div>`);
        const c = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="circle-x" class="w-3.5 h-3.5 stroke-[1.7]  mr-1.5"></i> ${t('Terminate')}
              </a>
            </div>`);
        const d = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="circle-x" class="w-3.5 h-3.5 stroke-[1.7]  mr-1.5"></i> ${t('Activate Employee')}
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
        c.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setShowTerminateModal(true);
        });
        d.addEventListener("click", function () {
          const data = cell.getData();
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          activateEmployee();
        });
        let permission = "Employee";

        if(hasPermission(permission.toLowerCase()+'-edit')){
          element.append(a)
        }
        if(hasPermission(permission.toLowerCase()+'-delete')){
          element.append(b)
        }
        if(hasPermission('terminate-employee') && cell.getData().is_active == 1){
          element.append(c)
        }
        if(hasPermission('terminate-employee') && cell.getData().is_active == 0){
          element.append(d)
        }
        return element;
      },
    },
]);
  const [searchColumns, setSearchColumns] = useState(['first_name', 'last_name', 'position', 'email', 'phone', 'whatsapp', 'wechat', 'birthdate', 'salary', 'hire_date', 'is_active', 'note']);

  // schema
  const schema = yup
    .object({
     photo : yup.string().required(t('The Photo field is required')), 
first_name : yup.string().required(t('The First Name field is required')), 
last_name : yup.string().required(t('The Last Name field is required')), 
position : yup.string().nullable(), 
email : yup.string().email(t('Please enter a valid email')).nullable(), 
phone : yup.string().required(t('The Phone field is required')), 
whatsapp : yup.string().nullable(), 
wechat : yup.string().nullable(), 
birthdate : yup.date().nullable(), 
salary : yup.number().nullable(), 
hire_date : yup.date().required(t('The Hire Date field is required')), 
is_active : yup.string().required(t('The Is Active field is required')), 
note : yup.string().nullable(), 

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

   

          const setUploadPhoto  = (value) => {
              setValue('photo', value);
            } 

        

  const [refetch, setRefetch] = useState(false);
  const getMiniDisplay = (url) => {
    let data = app_url + url;
    const fileExtension = data.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    let element;
    
    if (imageExtensions.includes(fileExtension)) {
      element = (
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

  const formatErrorMessage = (error) => {
    if (error.data?.errors) {
      // Extract validation errors and format them
      const errors = error.data.errors;
      const errorMessages = [];
      
      Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(msg => {
            errorMessages.push(`${field.replace('_', ' ').toUpperCase()}: ${msg}`);
          });
        }
      });
      
      return errorMessages.length > 0 ? errorMessages.join(' | ') : 'Validation failed';
    }
    
    if (error.data?.message) {
      return error.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  };

  const onCreate = async (data) => {
    try {
      const response = await createEmployee(data);
      if (response.error) {
        const errorMsg = formatErrorMessage(response.error);
        setToastMessage(t("Failed to create employee") + ": " + errorMsg);
      } else {
        setToastMessage(t("Employee created successfully"));
        setRefetch(true);
        setShowCreateModal(false);
      }
    } catch (error) {
      setToastMessage(t("Failed to create employee") + ": " + (error.message || t("Network or server error")));
    }
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  };

  const onUpdate = async (data) => {
    try {
      const response = await updateEmployee(data);
      if (response.error) {
        const errorMsg = formatErrorMessage(response.error);
        setToastMessage(t("Failed to update employee") + ": " + errorMsg);
        setShowUpdateModal(true);
      } else {
        setToastMessage(t("Employee updated successfully"));
        setRefetch(true);
        setShowUpdateModal(false);
      }
    } catch (error) {
      setToastMessage(t("Failed to update employee") + ": " + (error.message || t("Network or server error")));
      setShowUpdateModal(true);
    }
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = await deleteEmployee(id);
        if (response.error) {
          const errorMsg = formatErrorMessage(response.error);
          setToastMessage(t("Failed to delete employee") + ": " + errorMsg);
        } else {
          setToastMessage(t("Employee deleted successfully"));
          setRefetch(true);
        }
      }
    catch (error) {
      setToastMessage(t("Failed to delete employee") + ": " + (error.message || t("Network or server error")));
    }
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  };  
  
  const terminateEmployee = async () => {
    let id = getValues("id");
    setShowTerminateModal(false)
    try {
        const response = await terminateUser(id);
        if (response.error) {
          const errorMsg = formatErrorMessage(response.error);
          setToastMessage(t("Failed to terminate employee") + ": " + errorMsg);
        } else {
          setToastMessage(t("Employee terminated successfully"));
          setRefetch(true);
        }
      }
    catch (error) {
      setToastMessage(t("Failed to terminate employee") + ": " + (error.message || t("Network or server error")));
    }
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  }

  const activateEmployee = async () => {
    let id = getValues("id");
    try {
        const response = await activateEmployeeAccount(id);
        if (response.error) {
          const errorMsg = formatErrorMessage(response.error);
          setToastMessage(t("Failed to activate employee account") + ": " + errorMsg);
        } else {
          setToastMessage(t("Employee account activated successfully"));
          setRefetch(true);
        }
      }
    catch (error) {
      setToastMessage(t("Failed to activate employee account") + ": " + (error.message || t("Network or server error")));
    }
    basicStickyNotification.current?.showToast();
    // Auto-hide toast after 7 seconds
    setTimeout(() => {
      basicStickyNotification.current?.hideToast();
    }, 7000);
  }

return (
    <div>
      <Slideover
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
        }}
      >
        <Slideover.Panel>
          <div className="p-5   text-center overflow-y-auto max-h-[110vh]">
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
        open={showTerminateModal}
        onClose={() => {
          setShowTerminateModal(false);
        }}
      >
        <Slideover.Panel>
          <div className="p-5  text-center overflow-y-auto max-h-[110vh]">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">{t("Are you sure?")}</div>
            <div className="mt-2 text-slate-500">{t("Do you want to terminate the employee ?")}</div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setShowTerminateModal(false);
              }}
              className="w-24 mr-1"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-24"
              onClick={() => terminateEmployee()}
            >
              {t("Terminate")}
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
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Employee")}</h2>
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
                    
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadPhoto}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("First Name")}
                      </FormLabel>
                      <FormInput
                        {...register("first_name")}
                        id="validation-form-1"
                        type="text"
                        name="first_name"
                        className={clsx({
                          "border-danger": errors.first_name,
                        })}
                        placeholder={t("Enter first_name")}
                      />
                      {errors.first_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.first_name.message === "string" &&
                            errors.first_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Last Name")}
                      </FormLabel>
                      <FormInput
                        {...register("last_name")}
                        id="validation-form-1"
                        type="text"
                        name="last_name"
                        className={clsx({
                          "border-danger": errors.last_name,
                        })}
                        placeholder={t("Enter last_name")}
                      />
                      {errors.last_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.last_name.message === "string" &&
                            errors.last_name.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Position")}
                      </FormLabel>
                      <FormInput
                        {...register("position")}
                        id="validation-form-1"
                        type="text"
                        name="position"
                        className={clsx({
                          "border-danger": errors.position,
                        })}
                        placeholder={t("Enter position")}
                      />
                      {errors.position && (
                        <div className="mt-2 text-danger">
                          {typeof errors.position.message === "string" &&
                            errors.position.message}
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
                        {t("Phone")}
                      </FormLabel>
                      <FormInput
                        {...register("phone")}
                        id="validation-form-1"
                        type="text"
                        name="phone"
                        className={clsx({
                          "border-danger": errors.phone,
                        })}
                        placeholder={t("Enter phone")}
                      />
                      {errors.phone && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone.message === "string" &&
                            errors.phone.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("WhatsApp")}
                      </FormLabel>
                      <FormInput
                        {...register("whatsapp")}
                        id="validation-form-1"
                        type="text"
                        name="whatsapp"
                        className={clsx({
                          "border-danger": errors.whatsapp,
                        })}
                        placeholder={t("Enter whatsapp")}
                      />
                      {errors.whatsapp && (
                        <div className="mt-2 text-danger">
                          {typeof errors.whatsapp.message === "string" &&
                            errors.whatsapp.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("WeChat")}
                      </FormLabel>
                      <FormInput
                        {...register("wechat")}
                        id="validation-form-1"
                        type="text"
                        name="wechat"
                        className={clsx({
                          "border-danger": errors.wechat,
                        })}
                        placeholder={t("Enter wechat")}
                      />
                      {errors.wechat && (
                        <div className="mt-2 text-danger">
                          {typeof errors.wechat.message === "string" &&
                            errors.wechat.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Birth Date")}
                      </FormLabel>
                      <FormInput
                        {...register("birthdate")}
                        id="validation-form-1"
                        type="date"
                        name="birthdate"
                        className={clsx({
                          "border-danger": errors.birthdate,
                        })}
                        placeholder={t("Enter birthdate")}
                      />
                      {errors.birthdate && (
                        <div className="mt-2 text-danger">
                          {typeof errors.birthdate.message === "string" &&
                            errors.birthdate.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Salary")}
                      </FormLabel>
                      <FormInput
                        {...register("salary")}
                        id="validation-form-1"
                        type="number"
                        name="salary"
                        className={clsx({
                          "border-danger": errors.salary,
                        })}
                        placeholder={t("Enter salary")}
                      />
                      {errors.salary && (
                        <div className="mt-2 text-danger">
                          {typeof errors.salary.message === "string" &&
                            errors.salary.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Salary Date")}
                      </FormLabel>
                      <FormInput
                        {...register("hire_date")}
                        id="validation-form-1"
                        type="date"
                        name="hire_date"
                        className={clsx({
                          "border-danger": errors.hire_date,
                        })}
                        placeholder={t("Enter hire_date")}
                      />
                      {errors.hire_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.hire_date.message === "string" &&
                            errors.hire_date.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Active")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            />  {t('Active')}
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> {t('Inactive')}
      </div>
          </div>
      {errors.is_active && (
        <div className="mt-2 text-danger">
          {typeof errors.is_active.message === "string" &&
            errors.is_active.message}
        </div>
      )}
    </div>
    

  <div className="mt-3 input-form">
        <FormLabel
          htmlFor="validation-form-6"
          className="flex flex-col w-full sm:flex-row"
        >
          {t("Note")}
        </FormLabel>
        <FormTextarea
          {...register("note")}
          id="validation-form-6"
          name="note"
          className={clsx({
            "border-danger": errors.note,
          })}
          placeholder={t("note")}
        ></FormTextarea>
        {errors.note && (
          <div className="mt-2 text-danger">
            {typeof errors.note.message ===
              "string" && errors.note.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Employee")}</h2>
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
                    
          <div className="w-full ">
              <FileUpload endpoint={upload_url} type="image/*" className="w-full " setUploadedURL={setUploadPhoto}/>
          </div>
        
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("First Name")}
                      </FormLabel>
                      <FormInput
                        {...register("first_name")}
                        id="validation-form-1"
                        type="text"
                        name="first_name"
                        className={clsx({
                          "border-danger": errors.first_name,
                        })}
                        placeholder={t("Enter first_name")}
                      />
                      {errors.first_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.first_name.message === "string" &&
                            errors.first_name.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Last Name")}
                      </FormLabel>
                      <FormInput
                        {...register("last_name")}
                        id="validation-form-1"
                        type="text"
                        name="last_name"
                        className={clsx({
                          "border-danger": errors.last_name,
                        })}
                        placeholder={t("Enter last_name")}
                      />
                      {errors.last_name && (
                        <div className="mt-2 text-danger">
                          {typeof errors.last_name.message === "string" &&
                            errors.last_name.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Position")}
                      </FormLabel>
                      <FormInput
                        {...register("position")}
                        id="validation-form-1"
                        type="text"
                        name="position"
                        className={clsx({
                          "border-danger": errors.position,
                        })}
                        placeholder={t("Enter position")}
                      />
                      {errors.position && (
                        <div className="mt-2 text-danger">
                          {typeof errors.position.message === "string" &&
                            errors.position.message}
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
                        {t("Phone")}
                      </FormLabel>
                      <FormInput
                        {...register("phone")}
                        id="validation-form-1"
                        type="text"
                        name="phone"
                        className={clsx({
                          "border-danger": errors.phone,
                        })}
                        placeholder={t("Enter phone")}
                      />
                      {errors.phone && (
                        <div className="mt-2 text-danger">
                          {typeof errors.phone.message === "string" &&
                            errors.phone.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("WhatsApp")}
                      </FormLabel>
                      <FormInput
                        {...register("whatsapp")}
                        id="validation-form-1"
                        type="text"
                        name="whatsapp"
                        className={clsx({
                          "border-danger": errors.whatsapp,
                        })}
                        placeholder={t("Enter whatsapp")}
                      />
                      {errors.whatsapp && (
                        <div className="mt-2 text-danger">
                          {typeof errors.whatsapp.message === "string" &&
                            errors.whatsapp.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("WeChat")}
                      </FormLabel>
                      <FormInput
                        {...register("wechat")}
                        id="validation-form-1"
                        type="text"
                        name="wechat"
                        className={clsx({
                          "border-danger": errors.wechat,
                        })}
                        placeholder={t("Enter wechat")}
                      />
                      {errors.wechat && (
                        <div className="mt-2 text-danger">
                          {typeof errors.wechat.message === "string" &&
                            errors.wechat.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Birth Date")}
                      </FormLabel>
                      <FormInput
                        {...register("birthdate")}
                        id="validation-form-1"
                        type="date"
                        name="birthdate"
                        className={clsx({
                          "border-danger": errors.birthdate,
                        })}
                        placeholder={t("Enter birthdate")}
                      />
                      {errors.birthdate && (
                        <div className="mt-2 text-danger">
                          {typeof errors.birthdate.message === "string" &&
                            errors.birthdate.message}
                        </div>
                      )}
                    </div>

<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Salary")}
                      </FormLabel>
                      <FormInput
                        {...register("salary")}
                        id="validation-form-1"
                        type="number"
                        name="salary"
                        className={clsx({
                          "border-danger": errors.salary,
                        })}
                        placeholder={t("Enter salary")}
                      />
                      {errors.salary && (
                        <div className="mt-2 text-danger">
                          {typeof errors.salary.message === "string" &&
                            errors.salary.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Salary Date")}
                      </FormLabel>
                      <FormInput
                        {...register("hire_date")}
                        id="validation-form-1"
                        type="date"
                        name="hire_date"
                        className={clsx({
                          "border-danger": errors.hire_date,
                        })}
                        placeholder={t("Enter hire_date")}
                      />
                      {errors.hire_date && (
                        <div className="mt-2 text-danger">
                          {typeof errors.hire_date.message === "string" &&
                            errors.hire_date.message}
                        </div>
                      )}
                    </div>


 <div className="mt-3 input-form">
      <FormLabel
        htmlFor="validation-form-1"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Is Active")}
      </FormLabel>
          <div className="flex flex-col mt-2 sm:flex-row">
              <div>
            <input
              {...register('is_active')}
              type="radio"
              value={1}
              className="mx-2"
            />  {t('Active')}
            <input
              {...register('is_active')}
              type="radio"
              value={0}
              className="mx-2"
            /> {t('Inactive')}
      </div>
          </div>
      {errors.is_active && (
        <div className="mt-2 text-danger">
          {typeof errors.is_active.message === "string" &&
            errors.is_active.message}
        </div>
      )}
    </div>
    

  <div className="mt-3 input-form">
        <FormLabel
          htmlFor="validation-form-6"
          className="flex flex-col w-full sm:flex-row"
        >
          {t("Note")}
        </FormLabel>
        <FormTextarea
          {...register("note")}
          id="validation-form-6"
          name="note"
          className={clsx({
            "border-danger": errors.note,
          })}
          placeholder={t("note")}
        ></FormTextarea>
        {errors.note && (
          <div className="mt-2 text-danger">
            {typeof errors.note.message ===
              "string" && errors.note.message}
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
      <Can permission="employee-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/employee"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Employee"}
          page_name={"Employee"}
        />
      </Can>
    </div>
  );
}
export default index_main;
