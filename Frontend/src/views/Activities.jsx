
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
import TomSelect from "@/components/Base/TomSelect";


import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetRolesQuery,
  useResetUserPasswordMutation,
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete User"));

 const { data: roles, isLoading:fetching_roles, refetch:refetchRoles} = useGetRolesQuery()

 const [
    createUser,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateUserMutation();
  const [
    updateUser,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditUserMutation();
  const [
    deleteUser,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteUserMutation()
  const [
    resetPassword, 
    { isLoading: resting_password, isSuccess: reset_successful, error: reset_error },
  ] = useResetUserPasswordMutation()

  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = (permission) => {
    return user.permissions.includes(permission)
  }
  const [activeId, setActiveId] = useState();
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectMultiple, setSelectMultiple] = useState([])
  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value)
  }  
  const resetUserPassword = async() => {
    let payload = {
      "user_id": activeId,
      "password": newPassword
    }
    try{
      const response = await resetPassword(payload)
      setShowPasswordResetModal(false)
    }
    catch(error){
      alert('error')
    }
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
      title: t("Employee"),
      minWidth: 200,
      field: "causer",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell){
        return `<p>${(cell.getData().causer?.name)}</p>`
      }
    },
    

    {
      title: t("Performed On"),
      minWidth: 200,
      field: "log_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell){
        return `<p>${t(cell.getData().log_name)}</p>`
      }
    },
    

    {
      title: t("Action Type"),
      minWidth: 200,
      field: "event",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell){
        return `<p>${t(cell.getData().event)}</p>`
      }
    },
    

    {
      title: t("At"),
      minWidth: 200,
      field: "created_at",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    
    

    {
      title: t("Actions"),
      minWidth: 300,
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
                <i data-lucide="eye" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> ${t('View Detail')}
              </a>`);
        a.addEventListener("click", function () {
          const data = cell.getData();
          console.log(data, 'is data');
          setDetailData(data)
          setShowDetailModal(true);
        });
        element.append(a);
        return element;
      },
    },
]);
  const [searchColumns, setSearchColumns] = useState(['event', 'causer_id',  ]);

  // schema
  const schema = yup
    .object({
     name : yup.string().required(t('The Name field is required')), 
email : yup.string().required(t('The Name field is required')), 
phone : yup.string().required(t('The Phone field is required')), 
password : yup.string(t('The Password field is required')), 
roles : yup.array()
.min(1, t('You must select at least one role'))
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
      roles: [],
    },
  });

   


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
      const response = await createUser(data);
      setToastMessage(t("User created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating User."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateUser(data);
      setToastMessage(t('User updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('User deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteUser(id);
        setToastMessage(t("User deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting User."));
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
       
        open={showPasswordResetModal}
        onClose={() => {
          setShowPasswordResetModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <div>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Reset Your Password")}</h2>
            </Dialog.Title>
            <Dialog.Description className="relative">
              <div className="relative">
                {loading || updating || deleting || resting_password ? (
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
                        {t("New Password")}
                      </FormLabel>
                      <FormInput
                        onChange={handlePasswordChange}
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder={t("Enter New Password")}
                      />
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
                  setShowPasswordResetModal(false);
                }}
                className="w-20 mx-2"
              >
                {t("Cancel")}
              </Button>
              <Button type="button" onClick={()=>resetUserPassword()} variant="primary" className="w-20">
                {t("Reset Password")}
              </Button>
            </Dialog.Footer>
          </div>
        </Dialog.Panel>
      </Dialog>


      <Dialog
        size="modal-xl"
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
        }}
      >
        <Dialog.Panel className="text-center">
          <form onSubmit={handleSubmit(onCreate)}>
            <Dialog.Title>
              <h2 className="mr-auto text-base font-medium">{t("Activity Details")}</h2>
            </Dialog.Title>
            <Dialog.Description className="relative">
              <div className="flex flex-col gap-2">
                {detailData != null && 
                <>
                {/* Employee Account: {detailData.causer.name} */}
                  {["log_name", "description",  "event", "created_at" ].map((key, index) =>  (
                    <div key={index} className="flex justify-start items-start">
                      <p>{key} :</p>
                      <p>{JSON.stringify(detailData[key])}</p>
                    </div>
                  ))}
                   {Object.keys(detailData.properties).map((key, index) =>  (
                    <div key={index} className="flex flex-col justify-start items-start border-[1px] rounded-xl p-4">
                      <p>{key} :</p>
                      {Object.keys(detailData.properties[key]).map((detialKey, detialIndex) =>  (
                        <div key={detialIndex} className="flex justify-start items-start">
                          <p>{detialKey} :</p>
                          <p>{detailData.properties[key][detialKey]}</p>
                          <br/>
                        </div>
                      ))}
                    </div>
                  ))}
                </>
                }

              </div>
            </Dialog.Description>
            <Dialog.Footer>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  setShowDetailModal(false);
                }}
                className="w-20 mx-2"
              >
                {t("Cancel")}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit User")}</h2>
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
                        {t("Email")}
                      </FormLabel>
                      <FormInput
                        {...register("email")}
                        id="validation-form-1"
                        type="text"
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
                        {t("Roles")}
                      </FormLabel>

                      <TomSelect value={selectMultiple}  onChange={(e) => {
                                setValue('roles', e.target.value);
                                setSelectMultiple(e.target.value);
                              }} options={{
                              placeholder: t("Select Roles"),
                                      }} className="w-full" multiple>
                              {roles && roles.data.map((d, index)=>(
                           <option key={index} value={d.name}>{d.name}</option>
                              ))}
                      </TomSelect>
                      {errors.roles && (
                        <div className="mt-2 text-danger">
                          {typeof errors.roles.message === "string" &&
                            errors.roles.message}
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
      <Can permission="user-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/getActivities"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Activities"}
          page_name={"Activities"}
        />
      </Can>
    </div>
  );
}
export default index_main;
