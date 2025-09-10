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
  useCreateCustomerproductvisibilitMutation,
  useDeleteCustomerproductvisibilitMutation,
  useEditCustomerproductvisibilitMutation,
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
  const authToken = useSelector((state) => state.auth.token)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Customerproductvisibilit"));

  
 const [
    createCustomerproductvisibilit,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateCustomerproductvisibilitMutation();
  const [
    updateCustomerproductvisibilit,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditCustomerproductvisibilitMutation();
  const [
    deleteCustomerproductvisibilit,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteCustomerproductvisibilitMutation()


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
      title: t("Customer"),
      minWidth: 220,
      field: "customer_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Product"),
      minWidth: 220,
      field: "product_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Visibility"),
      minWidth: 160,
      field: "visibility",
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
        let permission = "customerproductvisibilit";
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
  const [searchColumns, setSearchColumns] = useState(['customer_name', 'product_name', 'visibility']);

  // schema
  const schema = yup
    .object({
     customer_id : yup.string().required(t('The Customer field is required')), 
product_id : yup.string().required(t('The Product field is required')), 
visibility : yup.string().required(t('The Visibility field is required')), 

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

  // Prefill customer_id from query string and lock field
  const [lockedCustomerName, setLockedCustomerName] = useState("");
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cid = params.get('customer_id');
      if (cid) {
        setValue('customer_id', cid);
        // fetch customer to show name
        fetch(`${app_url}/api/customer/${cid}`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            ...(localStorage.getItem('token') && !authToken ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}),
          },
        })
          .then(r => r.json())
          .then(res => {
            const c = res?.data || res; // depending on sendResponse wrapper
            if (c && (c.name_surname || c.data?.name_surname)) {
              setLockedCustomerName(c.name_surname || c.data?.name_surname);
            }
          })
          .catch(() => { setLockedCustomerName(String(cid)); });
      }
    } catch (_) {}
  }, [setValue, app_url, authToken]);
  
 

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
      const response = await createCustomerproductvisibilit(data);
      setToastMessage(t("Customerproductvisibilit created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Customerproductvisibilit."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateCustomerproductvisibilit(data);
      setToastMessage(t('Customerproductvisibilit updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Customerproductvisibilit deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteCustomerproductvisibilit(id);
        setToastMessage(t("Customerproductvisibilit deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Customerproductvisibilit."));
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
              <h2 className="mr-auto text-base font-medium">{t("Add New Customerproductvisibilit")}</h2>
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
        htmlFor="customer_id"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer")}
      </FormLabel>
      {getValues('customer_id') ? (
        <>
          <FormInput
            id="customer_name"
            type="text"
            value={lockedCustomerName || t('Loading...')}
            readOnly
          />
          <input type="hidden" {...register('customer_id')} name="customer_id" />
        </>
      ) : (
        <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      )}
      {errors.customer_id && (
        <div className="mt-2 text-danger">
          {typeof errors.customer_id.message === "string" &&
            errors.customer_id.message}
        </div>
      )}
    </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="product_id"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product")}
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
                        htmlFor="visibility"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Visibility")}
                      </FormLabel>
                      <select
                        {...register('visibility')}
                        id="visibility"
                        name="visibility"
                        className={clsx('form-select', { 'border-danger': errors.visibility })}
                      >
                        <option value="show">{t('Show')}</option>
                        <option value="hide">{t('Hide')}</option>
                      </select>
                       {errors.visibility && (
                         <div className="mt-2 text-danger">
                           {typeof errors.visibility.message === "string" &&
                             errors.visibility.message}
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
              <h2 className="mr-auto text-base font-medium">{t("Edit Customerproductvisibilit")}</h2>
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
        htmlFor="customer_id_update"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Customer")}
      </FormLabel>
      {getValues('customer_id') ? (
        <>
          <FormInput
            id="customer_name_update"
            type="text"
            value={lockedCustomerName || t('Loading...')}
            readOnly
          />
          <input type="hidden" {...register('customer_id')} name="customer_id" />
        </>
      ) : (
        <TomSelectSearch apiUrl={`${app_url}/api/search_customer`} setValue={setValue} variable="customer_id"/>
      )}
       {errors.customer_id && (
         <div className="mt-2 text-danger">
           {typeof errors.customer_id.message === "string" &&
             errors.customer_id.message}
         </div>
       )}
     </div>

   <div className="mt-3 input-form">
      <FormLabel
        htmlFor="product_id_update"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Product")}
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
                        htmlFor="visibility_update"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Visibility")}
                      </FormLabel>
                      <select
                        {...register('visibility')}
                        id="visibility_update"
                        name="visibility"
                        className={clsx('form-select', { 'border-danger': errors.visibility })}
                      >
                        <option value="show">{t('Show')}</option>
                        <option value="hide">{t('Hide')}</option>
                      </select>
                       {errors.visibility && (
                         <div className="mt-2 text-danger">
                           {typeof errors.visibility.message === "string" &&
                             errors.visibility.message}
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
      <Can permission="customerproductvisibilit-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/customerproductvisibilit"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Customerproductvisibilit"}
        />
      </Can>
    </div>
  );
}
export default index_main;
