
import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "../../helpers/ui/TableComponent.jsx";
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
import FileUpload from "../../helpers/ui/FileUpload.jsx";
import TomSelectSearch from "../../helpers/ui/Tomselect.jsx";
import { useSelector } from "react-redux";
import { ClassicEditor } from "@/components/Base/Ckeditor";


function index_main() {
  const { t, i18n } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Setting"));

  {
 const [
    createSetting,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateSettingMutation();
  const [
    updateProduct,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditSettingMutation();
  const [
    deleteProduct,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteSettingMutation()
}

  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const [data, setData] = useState({});
  const [searchColumns, setSearchColumns] = useState(['service_charge', 'tax', 'refund_policy', 'privacy_policy', 'terms_and_conditions', 'socials', ]);

  // schema
  const schema = yup
    .object({
     service_charge : yup.string().required(t('The Service Charge field is required')), 
tax : yup.string().required(t('The Tax field is required')), 
refund_policy : yup.string().required(t('The Refund Policy field is required')), 
privacy_policy : yup.string().required(t('The Privacy Policy field is required')), 
terms_and_conditions : yup.string().required(t('The Terms And Conditions field is required')), 
socials : yup.string().required(t('The Socials field is required')), 

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
  const onCreate = async (data) => {
    try {
      const response = await createSetting(data);
      setToastMessage(t("Setting created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating Setting."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false)
    try {
      const response = await updateSetting(data);
      setToastMessage(t('Setting updated successfully'));
      setRefetch(true)
    } catch (error) {
      setShowUpdateModal(true)
      setToastMessage(t('Setting deletion failed'));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false)
    try {
        const response = delete{capital_name_to_fill}(id);
        setToastMessage(t("Setting deleted successfully."));
        setRefetch(true);
      }
    catch (error) {
      setToastMessage(t("Error deleting Setting."));
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
              <h2 className="mr-auto text-base font-medium">Add New Setting</h2>
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
                        Service Charge *
                      </FormLabel>
                      <FormInput
                        {...register("service_charge")}
                        id="validation-form-1"
                        type="service_charge"
                        name="service_charge"
                        className={clsx({
                          "border-danger": errors.service_charge,
                        })}
                        placeholder="Enter service_charge"
                      />
                      {errors.service_charge && (
                        <div className="mt-2 text-danger">
                          {typeof errors.service_charge.message === "string" &&
                            errors.service_charge.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Tax
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.tax && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax.message === "string" &&
                            errors.tax.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Refund Policy
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.refund_policy && (
                        <div className="mt-2 text-danger">
                          {typeof errors.refund_policy.message === "string" &&
                            errors.refund_policy.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Privacy Policy
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.privacy_policy && (
                        <div className="mt-2 text-danger">
                          {typeof errors.privacy_policy.message === "string" &&
                            errors.privacy_policy.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Terms And Conditions
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.terms_and_conditions && (
                        <div className="mt-2 text-danger">
                          {typeof errors.terms_and_conditions.message === "string" &&
                            errors.terms_and_conditions.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        Socials *
                      </FormLabel>
                      <FormInput
                        {...register("socials")}
                        id="validation-form-1"
                        type="socials"
                        name="socials"
                        className={clsx({
                          "border-danger": errors.socials,
                        })}
                        placeholder="Enter socials"
                      />
                      {errors.socials && (
                        <div className="mt-2 text-danger">
                          {typeof errors.socials.message === "string" &&
                            errors.socials.message}
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
              <h2 className="mr-auto text-base font-medium">Edit Setting</h2>
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
                        Service Charge *
                      </FormLabel>
                      <FormInput
                        {...register("service_charge")}
                        id="validation-form-1"
                        type="service_charge"
                        name="service_charge"
                        className={clsx({
                          "border-danger": errors.service_charge,
                        })}
                        placeholder="Enter service_charge"
                      />
                      {errors.service_charge && (
                        <div className="mt-2 text-danger">
                          {typeof errors.service_charge.message === "string" &&
                            errors.service_charge.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Tax
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.tax && (
                        <div className="mt-2 text-danger">
                          {typeof errors.tax.message === "string" &&
                            errors.tax.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Refund Policy
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.refund_policy && (
                        <div className="mt-2 text-danger">
                          {typeof errors.refund_policy.message === "string" &&
                            errors.refund_policy.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Privacy Policy
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.privacy_policy && (
                        <div className="mt-2 text-danger">
                          {typeof errors.privacy_policy.message === "string" &&
                            errors.privacy_policy.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form col-span-2">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex flex-col w-full sm:flex-row"
                      >
                        Terms And Conditions
                      </FormLabel>
                      <ClassicEditor value={editorData} onChange={setEditorData} />
                      {errors.terms_and_conditions && (
                        <div className="mt-2 text-danger">
                          {typeof errors.terms_and_conditions.message === "string" &&
                            errors.terms_and_conditions.message}
                        </div>
                      )}
                    </div>
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        Socials *
                      </FormLabel>
                      <FormInput
                        {...register("socials")}
                        id="validation-form-1"
                        type="socials"
                        name="socials"
                        className={clsx({
                          "border-danger": errors.socials,
                        })}
                        placeholder="Enter socials"
                      />
                      {errors.socials && (
                        <div className="mt-2 text-danger">
                          {typeof errors.socials.message === "string" &&
                            errors.socials.message}
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
          endpoint={app_url + "/api/Setting"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={Setting}
        />
      </Can>
    </div>
  );
}
export default index_main;

