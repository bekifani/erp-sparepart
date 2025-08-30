import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
} from "@/stores/apiSlice";
import clsx from "clsx";
import { Dialog } from "@/components/Base/Headless";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import ConfirmationModal from "./ConfirmationModal.jsx";
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
    useState("Are you Sure");
  const [
    createProduct,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateProductMutation();
  const [
    updateProduct,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditProductMutation();
  const [
    deleteProduct,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteProductMutation();
  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = (permission) => {
    return user.permissions.includes(permission)
  }
  const [data, setData] = useState([
    {
      title: "Id",
      minWidth: 50,
      responsive: 0,
      field: "id",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: "Product Name",
      minWidth: 200,
      responsive: 0,
      field: "name",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const response = cell.getData();
        return `<div>
            <div class="font-medium whitespace-nowrap">${response.name}</div>
       
          </div>`;
      },
    },
    {
      title: "code",
      minWidth: 200,
      field: "code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: "Address",
      minWidth: 200,
      field: "address",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: "Domain",
      minWidth: 200,
      field: "domain",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: "Tin number",
      minWidth: 200,
      field: "tin",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },

    {
      title: "Actions",
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
        let permission = "";

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
  const [searchColumns, setSearchColumns] = useState([
    "code",
    "name",
    "address",
    "domain",
    "tin_number",
  ]);

  // schema
  const schema = yup
    .object({
      code: yup.string().required("Code is Required"),
      name: yup.string().required("name is Required"),
      address: yup.string().required("address is Required"),
      domain: yup.string().required("domain is Required"),
      tin_number: yup.string().required("Tin Number is Required"),
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

  const setUploadedURL  = (value) => {
    setValue('domain', value);
  }

  const [refetch, setRefetch] = useState(false);
  const onCreate = async (data) => {
    try {
      const response = await createProduct(data);
      setToastMessage(t("Product created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating product."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateProduct(data);
      setToastMessage(t('Product updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Product deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = deleteProduct(id);
        setToastMessage(t("Product deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting product."));
    }
    basicStickyNotification.current?.showToast();
  
  };

  const showToast = async () => {
    // try {
    //   const response = await updateProduct(data);
    //   setToastMessage();
    // } catch (error) {
    //   setToastMessage();
    // }
    basicStickyNotification.current?.showToast();
  };

  // table schema & endpoint

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
            <div className="mt-5 text-3xl">Are you sure?</div>
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
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              className="w-24"
              onClick={() => onDelete()}
            >
              Delete
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
              <h2 className="mr-auto text-base font-medium">Add New Product</h2>
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
                  <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        Name *
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder="Enter Product Name"
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
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Code *
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                          Required, at least 2 characters
                        </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("code")}
                        id="validation-form-1"
                        type="text"
                        name="code"
                        className={clsx({
                          "border-danger": errors.code,
                        })}
                        placeholder="Your code"
                      />
                      {errors.code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Address
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("address")}
                        id="validation-form-1"
                        type="text"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder="address"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Domain
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("domain")}
                        id="validation-form-1"
                        type="text"
                        name="domain"
                        className={clsx({
                          "border-danger": errors.password,
                        })}
                        placeholder="Password"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Password
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("tin_number")}
                        id="validation-form-1"
                        type="text"
                        name="tin_number"
                        className={clsx({
                          "border-danger": errors.tin_number,
                        })}
                        placeholder="tin_number"
                      />
                      {errors.tin_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tin_number.message === "string" &&
                            errors.tin_number.message}
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
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="w-20">
                Save
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
              <h2 className="mr-auto text-base font-medium">Edit Product</h2>
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
                  <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-3">
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        Name *
                      </FormLabel>
                      <FormInput
                        {...register("name")}
                        id="validation-form-1"
                        type="text"
                        name="name"
                        className={clsx({
                          "border-danger": errors.name,
                        })}
                        placeholder="Enter Product Name"
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
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Code *
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                          Required, at least 2 characters
                        </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("code")}
                        id="validation-form-1"
                        type="text"
                        name="code"
                        className={clsx({
                          "border-danger": errors.code,
                        })}
                        placeholder="Your code"
                      />
                      {errors.code && (
                        <div className="mt-2 text-danger">
                          {typeof errors.email.message === "string" &&
                            errors.email.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Address
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("address")}
                        id="validation-form-1"
                        type="text"
                        name="address"
                        className={clsx({
                          "border-danger": errors.address,
                        })}
                        placeholder="address"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Domain
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("domain")}
                        id="validation-form-1"
                        type="text"
                        name="domain"
                        className={clsx({
                          "border-danger": errors.password,
                        })}
                        placeholder="Password"
                      />
                      {errors.password && (
                        <div className="mt-2 text-danger">
                          {typeof errors.password.message === "string" &&
                            errors.password.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Password
                        {/* <span className="mt-1 text-xs sm:ml-auto sm:mt-0 text-slate-500">
                            Required, at least 2 characters
                          </span> */}
                      </FormLabel>
                      <FormInput
                        {...register("tin_number")}
                        id="validation-form-1"
                        type="text"
                        name="tin_number"
                        className={clsx({
                          "border-danger": errors.tin_number,
                        })}
                        placeholder="tin_number"
                      />
                      {errors.tin_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tin_number.message === "string" &&
                            errors.tin_number.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Product
                      </FormLabel>
                      <TomSelectSearch apiUrl={`${app_url}/api/search_product`} setValue={setValue} variable="tin_number"/>
                      {errors.tin_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tin_number.message === "string" &&
                            errors.tin_number.message}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Product
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.tin_number && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tin_number.message === "string" &&
                            errors.tin_number.message}
                        </div>
                      )}
                    </div>
                    <div className="w-full col-span-2">
                      <FileUpload endpoint={upload_url} type="image/*" className="w-full col-span-2" setUploadedURL={setUploadedURL}/>
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
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="w-20">
                Update
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
      <Can permission="edit">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          showToast={showToast}
          endpoint={app_url + "/api/products"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
        />
      </Can>
    </div>
  );
}
export default index_main;
