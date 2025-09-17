import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import React, { useRef, useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { FormCheck, FormTextarea , FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useCreateExchangerateMutation,
  useDeleteExchangerateMutation,
  useEditExchangerateMutation,
} from "@/stores/apiSlice";
import {
  useGetAllCurrenciesQuery,
  useCreateCurrencyMutation,
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
  const [showAddCurrencyModal, setShowAddCurrencyModal] = useState(false);
  const [selectedExchangerate, setSelectedExchangerate] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorData, setEditorData] = useState("")
  const [confirmationMessage, setConfirmationMessage] =
    useState(t("Are you Sure Do You want to Delete Exchange Rate"));

  // Currency form state
  const [currencyForm, setCurrencyForm] = useState({
    code: '',
    name: '',
    symbol: ''
  });
  const [currencyErrors, setCurrencyErrors] = useState({});

  const [
    createExchangerate,
    { isLoading: loading, isSuccess: success, error: successError },
  ] = useCreateExchangerateMutation();
  const [
    updateExchangerate,
    { isLoading: updating, isSuccess: updated, error: updateError },
  ] = useEditExchangerateMutation();
  const [
    deleteExchangerate,
    { isLoading: deleting, isSuccess: deleted, error: deleteError },
  ] = useDeleteExchangerateMutation();
  
  const [
    createCurrency,
    { isLoading: currencyLoading, isSuccess: currencySuccess, error: currencyError },
  ] = useCreateCurrencyMutation();
  
  const { data: currenciesData, isLoading: currenciesLoading, refetch: refetchCurrencies } = useGetAllCurrenciesQuery();


  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state)=> state.auth.user)
  const hasPermission = (permission) => {
    return user.permissions.includes(permission)
  }
  
  // Get currencies from API
  const supportedCurrencies = currenciesData?.data ? 
    currenciesData.data.map(currency => ({
      value: currency.code,
      label: `${currency.code} - ${currency.name}`
    })) : [];

  // Form validation schema
  const schema = yup.object({
    date: yup.string().required(t("Date is required")),
    currency: yup.string().required(t("Currency is required")),
    rate: yup.number()
      .required(t("Rate is required"))
      .positive(t("Rate must be positive"))
      .test('decimal-places', t('Rate can have maximum 6 decimal places'), (value) => {
        if (value === undefined) return true;
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        return decimalPlaces <= 6;
      }),
    base_currency: yup.string().required(t("Base currency is required")),
  });

  // Initialize useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      base_currency: 'RMB'
    }
  });

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
      title: t("Date"),
      minWidth: 200,
      field: "date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Currency"),
      minWidth: 200,
      field: "currency",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      
    },
    

    {
      title: t("Rate"),
      minWidth: 200,
      field: "rate",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: function(cell) {
        const value = cell.getValue();
        return value ? parseFloat(value).toFixed(6) : '0.000000';
      }
    },
    

    {
      title: t("Base Currency"),
      minWidth: 200,
      field: "base_currency",
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
        let permission = "exchangerate";
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
  const [searchColumns, setSearchColumns] = useState(['date', 'currency', 'rate', 'base_currency']);

  // Using the schema defined above

  useEffect(() => {
    if (success) {
      setToastMessage(t("Exchange Rate Created Successfully"));
      basicStickyNotification.current.showToast();
      setShowCreateModal(false);
      setSelectedExchangerate({});
      setIsSubmitting(false);
      reset();
    }
    if (successError) {
      setIsSubmitting(false);
    }
  }, [success, successError, reset, t]);

  useEffect(() => {
    if (updated) {
      setToastMessage(t("Exchange Rate Updated Successfully"));
      basicStickyNotification.current.showToast();
      setShowUpdateModal(false);
      setSelectedExchangerate({});
      setIsSubmitting(false);
      reset();
    }
    if (updateError) {
      setIsSubmitting(false);
    }
  }, [updated, updateError, reset, t]);

  useEffect(() => {
    if (deleted) {
      setToastMessage(t("Exchange Rate Deleted Successfully"));
      basicStickyNotification.current.showToast();
      setShowDeleteModal(false);
      setSelectedExchangerate({});
    }
    if (deleteError) {
      setToastMessage(t("Error deleting exchange rate"));
      basicStickyNotification.current.showToast();
    }
  }, [deleted, deleteError, t]);

  useEffect(() => {
    if (currencySuccess) {
      setToastMessage(t("Currency Added Successfully"));
      basicStickyNotification.current.showToast();
      setShowAddCurrencyModal(false);
      setCurrencyForm({ code: '', name: '', symbol: '' });
      setCurrencyErrors({});
      refetchCurrencies(); // Refresh currency list
    }
    if (currencyError) {
      setCurrencyErrors(currencyError?.data?.data?.errors || {});
    }
  }, [currencySuccess, currencyError, refetchCurrencies, t]);

   

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
      // Set base currency to RMB by default
      data.base_currency = 'RMB';
      const response = await createExchangerate(data);
      setToastMessage(t("Exchange rate created successfully."));
    } catch (error) {
      setToastMessage(t("Error creating exchange rate."));
    }
    basicStickyNotification.current?.showToast();
    setRefetch(true);
    setShowCreateModal(false);
  };

  const onUpdate = async (data) => {
    setShowUpdateModal(false);
    try {
      // Ensure base currency is RMB
      data.base_currency = 'RMB';
      
      const response = await updateExchangerate(data);
      setToastMessage(t("Exchange rate updated successfully."));
      setRefetch(true);
    } catch (error) {
      setToastMessage(t("Error updating exchange rate."));
    }
    basicStickyNotification.current?.showToast();
  };

  const onDelete = async () => {
    let id = getValues("id");
    setShowDeleteModal(false);
    try {
      const response = await deleteExchangerate(id);
      setToastMessage(t("Exchange rate deleted successfully."));
      setRefetch(true);
    } catch (error) {
      setToastMessage(t("Error deleting exchange rate."));
    }
    basicStickyNotification.current?.showToast();
  };

  // Currency management handlers
  const handleAddCurrency = async () => {
    try {
      await createCurrency(currencyForm);
    } catch (error) {
      console.error('Error adding currency:', error);
    }
  };

  const handleCurrencyFormChange = (field, value) => {
    setCurrencyForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (currencyErrors[field]) {
      setCurrencyErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
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
          <div className="p-5  text-center overflow-y-auto max-h-[110vh]">
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
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onCreate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Add New Exchange Rate")}</h2>
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
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-1"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Date")}
                      </FormLabel>
                      <FormInput
                        {...register("date")}
                        id="validation-form-1"
                        type="date"
                        name="date"
                        className={clsx({
                          "border-danger": formErrors.date,
                        })}
                        placeholder={t("Enter date")}
                      />
                      {formErrors.date && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.date.message === "string" &&
                            formErrors.date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-2"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Currency")}
                      </FormLabel>
                      <div className="flex gap-2 items-center">
                        <select
                          {...register("currency")}
                          id="validation-form-2"
                          name="currency"
                          className={clsx("form-select flex-1", {
                            "border-danger": formErrors.currency,
                          })}
                        >
                          <option value="">{t("Select Currency")}</option>
                          {supportedCurrencies.map((curr) => (
                            <option key={curr.value} value={curr.value}>
                              {curr.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="md"
                          onClick={() => setShowAddCurrencyModal(true)}
                          className="px-4 py-2 whitespace-nowrap"
                        >
                          <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                          {t("Add New Currency")}
                        </Button>
                      </div>
                      {formErrors.currency && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.currency.message === "string" &&
                            formErrors.currency.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-3"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Rate")} <span className="text-xs text-slate-500 ml-2">(1 RMB = Rate Currency)</span>
                      </FormLabel>
                      <FormInput
                        {...register("rate")}
                        id="validation-form-3"
                        type="number"
                        step="0.000001"
                        name="rate"
                        className={clsx({
                          "border-danger": formErrors.rate,
                        })}
                        placeholder={t("Enter rate (e.g., 0.140250)")}
                      />
                      {formErrors.rate && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.rate.message === "string" &&
                            formErrors.rate.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-4"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Base Currency")}
                      </FormLabel>
                      <FormInput
                        {...register("base_currency")}
                        id="validation-form-4"
                        type="text"
                        name="base_currency"
                        value="RMB"
                        readOnly
                        className="bg-slate-100 cursor-not-allowed"
                        placeholder="RMB (Chinese Yuan)"
                      />
                      {formErrors.base_currency && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.base_currency.message === "string" &&
                            formErrors.base_currency.message}
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
        <Slideover.Panel className="  text-center overflow-y-auto max-h-[110vh]">
          <form onSubmit={handleSubmit(onUpdate)}>
            <Slideover.Title>
              <h2 className="mr-auto text-base font-medium">{t("Edit Exchange Rate")}</h2>
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
                    
<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-5"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Date")}
                      </FormLabel>
                      <FormInput
                        {...register("date")}
                        id="validation-form-5"
                        type="date"
                        name="date"
                        className={clsx({
                          "border-danger": formErrors.date,
                        })}
                        placeholder={t("Enter date")}
                      />
                      {formErrors.date && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.date.message === "string" &&
                            formErrors.date.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-6"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Currency")}
                      </FormLabel>
                      <div className="flex gap-2 items-center">
                        <select
                          {...register("currency")}
                          id="validation-form-6"
                          name="currency"
                          className={clsx("form-select flex-1", {
                            "border-danger": formErrors.currency,
                          })}
                        >
                          <option value="">{t("Select Currency")}</option>
                          {supportedCurrencies.map((curr) => (
                            <option key={curr.value} value={curr.value}>
                              {curr.label}
                            </option>
                          ))}
                        </select>
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="md"
                          onClick={() => setShowAddCurrencyModal(true)}
                          className="px-4 py-2 whitespace-nowrap"
                        >
                          <Lucide icon="Plus" className="w-4 h-4 mr-2" />
                          {t("Add New Currency")}
                        </Button>
                      </div>
                      {formErrors.currency && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.currency.message === "string" &&
                            formErrors.currency.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-7"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Rate")} <span className="text-xs text-slate-500 ml-2">(1 RMB = Rate Currency)</span>
                      </FormLabel>
                      <FormInput
                        {...register("rate")}
                        id="validation-form-7"
                        type="number"
                        step="0.000001"
                        name="rate"
                        className={clsx({
                          "border-danger": formErrors.rate,
                        })}
                        placeholder={t("Enter rate (e.g., 0.140250)")}
                      />
                      {formErrors.rate && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.rate.message === "string" &&
                            formErrors.rate.message}
                        </div>
                      )}
                    </div>


<div className="mt-3 input-form">
                      <FormLabel
                        htmlFor="validation-form-8"
                        className="flex justify-start items-start flex-col w-full sm:flex-row"
                      >
                        {t("Base Currency")}
                      </FormLabel>
                      <FormInput
                        {...register("base_currency")}
                        id="validation-form-8"
                        type="text"
                        name="base_currency"
                        value="RMB"
                        readOnly
                        className="bg-slate-100 cursor-not-allowed"
                        placeholder="RMB (Chinese Yuan)"
                      />
                      {formErrors.base_currency && (
                        <div className="mt-2 text-danger">
                          {typeof formErrors.base_currency.message === "string" &&
                            formErrors.base_currency.message}
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

      {/* Add Currency Modal */}
      <Slideover
        open={showAddCurrencyModal}
        onClose={() => {
          setShowAddCurrencyModal(false);
          setCurrencyForm({ code: '', name: '', symbol: '' });
          setCurrencyErrors({});
        }}
        size="xl"
      >
        <Slideover.Panel className="text-center overflow-y-auto max-h-[110vh]">
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("Add New Currency")}</h2>
          </Slideover.Title>
          <Slideover.Description className="relative">
            <div className="relative">
              {currencyLoading ? (
                <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                  <div className="w-full h-full flex justify-center items-center">
                    <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                  </div>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 gap-4 gap-y-3">
                  
                  <div className="mt-3 input-form">
                    <FormLabel
                      htmlFor="currency-code"
                      className="flex justify-start items-start flex-col w-full sm:flex-row"
                    >
                      {t("Currency Code")} <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      id="currency-code"
                      type="text"
                      value={currencyForm.code}
                      onChange={(e) => handleCurrencyFormChange('code', e.target.value.toUpperCase())}
                      className={clsx({
                        "border-danger": currencyErrors.code,
                      })}
                      placeholder={t("Enter 3-letter currency code (e.g., USD)")}
                      maxLength={3}
                    />
                    {currencyErrors.code && (
                      <div className="mt-2 text-danger">
                        {typeof currencyErrors.code === 'string' ? currencyErrors.code : currencyErrors.code[0]}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 input-form">
                    <FormLabel
                      htmlFor="currency-name"
                      className="flex justify-start items-start flex-col w-full sm:flex-row"
                    >
                      {t("Currency Name")} <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      id="currency-name"
                      type="text"
                      value={currencyForm.name}
                      onChange={(e) => handleCurrencyFormChange('name', e.target.value)}
                      className={clsx({
                        "border-danger": currencyErrors.name,
                      })}
                      placeholder={t("Enter currency name (e.g., US Dollar)")}
                    />
                    {currencyErrors.name && (
                      <div className="mt-2 text-danger">
                        {typeof currencyErrors.name === 'string' ? currencyErrors.name : currencyErrors.name[0]}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 input-form">
                    <FormLabel
                      htmlFor="currency-symbol"
                      className="flex justify-start items-start flex-col w-full sm:flex-row"
                    >
                      {t("Currency Symbol")} <span className="text-danger">*</span>
                    </FormLabel>
                    <FormInput
                      id="currency-symbol"
                      type="text"
                      value={currencyForm.symbol}
                      onChange={(e) => handleCurrencyFormChange('symbol', e.target.value)}
                      className={clsx({
                        "border-danger": currencyErrors.symbol,
                      })}
                      placeholder={t("Enter currency symbol (e.g., $)")}
                      maxLength={5}
                    />
                    {currencyErrors.symbol && (
                      <div className="mt-2 text-danger">
                        {typeof currencyErrors.symbol === 'string' ? currencyErrors.symbol : currencyErrors.symbol[0]}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </Slideover.Description>
          <Slideover.Footer>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setShowAddCurrencyModal(false);
                setCurrencyForm({ code: '', name: '', symbol: '' });
                setCurrencyErrors({});
              }}
              className="w-20 mr-1"
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handleAddCurrency}
              className="w-20"
              disabled={currencyLoading || !currencyForm.code || !currencyForm.name || !currencyForm.symbol}
            >
              {t("Save")}
            </Button>
          </Slideover.Footer>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{t("Exchange Rate Management")}</h2>
        <Can permission="currency-create">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddCurrencyModal(true)}
            className="ml-2"
          >
            <Lucide icon="Plus" className="w-4 h-4 mr-2" />
            {t("Add Currency")}
          </Button>
        </Can>
      </div>
      
      <Can permission="exchangerate-list">
        <TableComponent
          setShowCreateModal={setShowCreateModal}
          endpoint={app_url + "/api/exchangerate"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Exchangerate"}
        />
      </Can>
    </div>
  );
}
export default index_main;
