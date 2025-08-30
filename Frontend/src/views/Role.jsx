
import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useEffect, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormTextarea , FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useEditRoleMutation,
  useGetRolesQuery,
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
  const [active_id, setActiveId] = useState("")
  const [permissions_list , setPermissionsList] = useState([])
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Role"));

 const { data: roles, isLoading:fetching_roles, refetch:refetchRoles} = useGetRolesQuery()
 const [
    createRole,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateRoleMutation();
  const [
    updateRole,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditRoleMutation();
  const [
    deleteRole,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteRoleMutation()


  const [toastMessage, setToastMessage] = useState("");
  const [selected_permissions, setSelectedPermissions] = useState([])
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
                <i data-lucide="check-square" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> ${t('Edit')}
              </a>`);
        const b = stringToHTML(`
              <a class="edit-btn flex items-center text-danger" href="javascript:;">
                <i data-lucide="trash-2" class="w-3.5 h-3.5 stroke-[1.7]  mr-1.5"></i> ${t('Delete')}
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
        let permission = "Role";

        if(hasPermission(permission.toLowerCase()+'-edit')){
          element.append(a)
        }
        if(hasPermission(permission.toLowerCase()+'-delete')){
          element.append(b)
        }
        return element;
      },
    },
]);

  useEffect(()=>{
    if(roles && roles.permissions){
      setPermissionsList(roles.permissions);
      console.log(roles.permissions	);
    }
  },[roles])

  const [searchColumns, setSearchColumns] = useState(['name', 'permissions', ]);

  // schema
  const schema = yup
    .object({
    name : yup.string().required(t('The Name field is required')), 
    permissions : yup.array()
          .min(1, t('You must select at least one item'))
          .required(),
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
    defaultValues: {
      permissions: [],
    },
  });

  const handleCheckboxChange = (itemId) => {
    const currentSelected = getValues('permissions') || [];
    const updatedSelected = currentSelected.includes(itemId)
      ? currentSelected.filter((id) => id !== itemId) // Uncheck
      : [...currentSelected, itemId]; // Check
    setValue('permissions', updatedSelected);
    setSelectedPermissions(updatedSelected);
    console.log(getValues('permissions').includes(itemId), ' is the permission');
  };

   


  const [refetch, setRefetch] = useState(false);
  const getMiniDisplay = (url) => {
    let data = app_url + url;
    const fileExtension = data.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];

    let element;
    
    if (imageExtensions.includes(fileExtension)) {
      element = (
        <img data-action="zoom" src={data} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-md"/>
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
      const response = await createRole(data);
      setToastMessage(t("Role created successfully."));
      refetchRoles()
      setSelectedPermissions([])

    } catch (error) {
      setToastMessage(t("Error creating Role."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateRole(data);
      setToastMessage(t('Role updated successfully'));
      refetchRoles()
      setSelectedPermissions([])
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Role deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    setShowDeleteModal(false)
    try {
        const response = deleteRole(active_id);
        setToastMessage(t("Role deleted successfully."));
        refetchRoles();
      }
    catch (error) {
      setToastMessage(t("Error deleting Role."));
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
       size="xl" 
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <form onSubmit={handleSubmit(onCreate)}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Role")}</h2>
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
                        {t("Role Name")}
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder={t("Enter Role Name")}
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
                        {t("Select Permission")}
                      </FormLabel>
                      {/* <FormInput
                        {...register("permissions")}
                        id="validation-form-1"
                        type="text"
                        name="permissions"
                        className={clsx({
                          "border-danger": errors.permissions,
                        })}
                        placeholder={t("Enter permissions")}
                      /> */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-3">
                      {permissions_list.map((d, index)=>(
                        <label className="w-full flex gap-2 justify-start items-start" key={index}> 
                          <input 
                          id={"id-"+d.id}
                          value={d.id}
                          type="checkbox"
                          label={d.name}
                          className="form-checkbox form-input"
                          onChange={() => handleCheckboxChange(d.id)}
                          checked={selected_permissions.includes(d.id)}
                          /> 
                          {t(d.name)}
                          </label>
                      ))}
                      
                      </div>
                      
                     
                      {errors.permissions && (
                        <div className="mt-2 text-danger">
                          {typeof errors.permissions.message === "string" &&
                            errors.permissions.message}
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
        size="xl"
        open={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Role")}</h2>
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
                        {t("Role Name")}
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder={t("Enter Role Name")}
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
                        {t("Select Permission")}
                      </FormLabel>
                      {/* <FormInput
                        {...register("permissions")}
                        id="validation-form-1"
                        type="text"
                        name="permissions"
                        className={clsx({
                          "border-danger": errors.permissions,
                        })}
                        placeholder={t("Enter permissions")}
                      /> */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-3">
                      {permissions_list.map((d, index)=>(
                        <label className="w-full flex gap-2 justify-start items-start" key={index}> 
                          <input 
                          id={"id-"+d.id}
                          value={d.id}
                          type="checkbox"
                          label={d.name}
                          className="form-checkbox form-input"
                          onChange={() => handleCheckboxChange(d.id)}
                          checked={selected_permissions.includes(d.id)}
                          /> 
                           {t(d.name)}
                          </label>
                      ))}
                      
                      </div>
                      
                     
                      {errors.permissions && (
                        <div className="mt-2 text-danger">
                          {typeof errors.permissions.message === "string" &&
                            errors.permissions.message}
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
      <Can permission="role-list">
        <div className="box box--stacked px-2 py-5">
          <div className="w-full flex justify-between items-center">
            <h2 className="text-xl mb-3 font-bold px-3 py-2 rounded-xl">{t('Roles List')}</h2>
            <Button onClick={()=>{setSelectedPermissions([]);setValue('permissions', []);setShowCreateModal(true)}} className="btn btn-primary">{t('Add New Role')}</Button>
          </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {!fetching_roles ? (
            <>
          {roles && roles.data && <>
            {roles.data.map((d, index)=>(
              <div key={index} className="p-5 box box--stacked">
              <div className="flex items-center gap-3.5">
                <div>
                  <div className="w-10 h-10 overflow-hidden rounded-full image-fit border-[3px] border-slate-200/70">
                  <Lucide icon="Activity" className="block mx-auto w-10 h-auto" />
                  </div>
                </div>
                <div className="w-full flex justify-between">
                  <div className="flex flex-col">
                      <div className="truncate max-w-[12rem] md:max-w-none text-base font-medium">
                        {t("Role")} {index+1}
                      </div>
                      <div className="text-slate-500 mt-0.5 truncate max-w-[11rem] md:max-w-none">
                      {t(d.name)}
                      </div>
                  </div>
                 
                  <div className="flex items-center mt-1.5">
                    <div className="text-base font-medium text-primary">
                      
                    </div>
                    <div className="flex gap-2">
                    <Can permission="role-delete">
                      <button onClick={()=>{
                        setActiveId(d.id);
                        setShowDeleteModal(true)
                        }} className="ml-auto">
                        <Lucide
                          icon="Trash"
                          className="w-5 h-5 text-pending "
                        />
                      </button>
                    </Can>
                    <Can permission="role-edit">
                      <button onClick={()=>{
                        setValue("name", d.name);
                        setValue("id", d.id);
                        setValue("permissions", d.permissions.map(d => d.id));
                        setSelectedPermissions(d.permissions.map(d => d.id));
                        setShowUpdateModal(true);
                      }} className="ml-auto">
                      
                        <Lucide
                          icon="Check"
                          className="w-5 h-5 text-pending "
                        />
                      </button>
                    </Can>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            ))}
          </>}
          </>
          ):(
            <div className="md:col-span-3 w-full flex justify-center items-center">
               <div className="flex flex-col items-center justify-end col-span-6 sm:col-span-3 xl:col-span-2">
                  <LoadingIcon icon="oval" className="w-8 h-8" />
                  <div className="mt-2 text-xs text-center">
                      
                  </div>
              </div>
            </div>
          )}
        </div>
          </div>
      </Can>
      
      {/* <Can permission="view-Role">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/role"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Role"}
        />
      </Can> */}
    </div>
  );
}
export default index_main;
