import React, { useState, useRef } from "react";
import { Slideover } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { FormInput, FormLabel, FormTextarea, FormSelect } from "@/components/Base/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import TomSelectSearch from "@/helpers/ui/Tomselect.jsx";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import { useSelector } from "react-redux";
import clsx from "clsx";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";

function AddPaymentModal({ 
  isOpen, 
  onClose, 
  accountType, // 'customer', 'supplier', 'company', 'warehouse'
  entityId = null, // customer_id, supplier_id, etc.
  entityName = "",
  onPaymentAdded 
}) {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const [isLoading, setIsLoading] = useState(false);

  // Schema for payment form
  const schema = yup.object({
    transaction_date: yup.date().required(t('Transaction date is required')),
    amount: yup.number().positive(t('Amount must be positive')).required(t('Amount is required')),
    invoice_number: yup.string().nullable(),
    payment_status: yup.string().oneOf(['income', 'expense']).required(t('Payment status is required')),
    account_type_id: yup.string().required(t('Account type is required')),
    payment_note_id: yup.string().required(t('Payment note is required')),
    additional_note: yup.string().nullable(),
    picture_url: yup.string().nullable(),
  }).required();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      transaction_date: new Date().toISOString().split('T')[0],
      payment_status: accountType === 'customer' ? 'income' : 'expense'
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Generate transaction number
      const transNumber = `${accountType.toUpperCase()}-${Date.now()}`;
      
      const paymentData = {
        ...data,
        trans_number: transNumber,
        [`${accountType}_id`]: entityId,
      };

      // Add specific fields based on account type
      if (accountType === 'warehouse') {
        // For warehouse, we might need both customer and supplier
        paymentData.customer_id = data.customer_id || null;
        paymentData.supplier_id = data.supplier_id || null;
      } else if (accountType === 'company') {
        paymentData.worker_entity_name = data.worker_entity_name || null;
        paymentData.linked_invoice_number = data.linked_invoice_number || null;
      }

      const response = await fetch(`${app_url}/api/${accountType}account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const result = await response.json();
        onPaymentAdded?.(result);
        reset();
        onClose();
      } else {
        throw new Error('Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    const titles = {
      customer: t("Add Customer Payment"),
      supplier: t("Add Supplier Payment"),
      company: t("Add Company Payment"),
      warehouse: t("Add Warehouse Payment")
    };
    return titles[accountType] || t("Add Payment");
  };

  return (
    <Slideover size="xl" open={isOpen} onClose={onClose}>
      <Slideover.Panel className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{getModalTitle()}</h2>
            {entityName && (
              <p className="text-sm text-gray-600 mt-1">
                {t("For")}: {entityName}
              </p>
            )}
          </Slideover.Title>
          
          <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="relative">
              {isLoading && (
                <div className="w-full h-full z-[99999px] absolute backdrop-blur-md bg-gray-600">
                  <div className="w-full h-full flex justify-center items-center">
                    <LoadingIcon icon="tail-spin" className="w-8 h-8" />
                  </div>
                </div>
              )}
              
              <div className="w-full grid grid-cols-2 gap-4 gap-y-3">
                {/* Transaction Date */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="transaction_date" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Transaction Date")} *
                  </FormLabel>
                  <FormInput
                    {...register("transaction_date")}
                    id="transaction_date"
                    type="date"
                    className={clsx({ "border-danger": errors.transaction_date })}
                  />
                  {errors.transaction_date && (
                    <div className="mt-2 text-danger">
                      {errors.transaction_date.message}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="amount" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Amount")} *
                  </FormLabel>
                  <FormInput
                    {...register("amount")}
                    id="amount"
                    type="number"
                    step="0.01"
                    className={clsx({ "border-danger": errors.amount })}
                    placeholder={t("Enter amount")}
                  />
                  {errors.amount && (
                    <div className="mt-2 text-danger">
                      {errors.amount.message}
                    </div>
                  )}
                </div>

                {/* Invoice Number */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="invoice_number" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Invoice Number")}
                  </FormLabel>
                  <FormInput
                    {...register("invoice_number")}
                    id="invoice_number"
                    type="text"
                    className={clsx({ "border-danger": errors.invoice_number })}
                    placeholder={t("Enter invoice number")}
                  />
                </div>

                {/* Payment Status */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="payment_status" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Payment Status")} *
                  </FormLabel>
                  <FormSelect
                    {...register("payment_status")}
                    id="payment_status"
                    className={clsx({ "border-danger": errors.payment_status })}
                  >
                    <option value="income">{t("Income (+)")}</option>
                    <option value="expense">{t("Expense (-)")}</option>
                  </FormSelect>
                  {errors.payment_status && (
                    <div className="mt-2 text-danger">
                      {errors.payment_status.message}
                    </div>
                  )}
                </div>

                {/* Account Type */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="account_type_id" className="flex flex-col w-full sm:flex-row">
                    {t("Account Type")} *
                  </FormLabel>
                  <TomSelectSearch 
                    apiUrl={`${app_url}/api/search_accounttype`} 
                    setValue={setValue} 
                    variable="account_type_id"
                    customDataMapping={(item) => ({
                      value: item.id,
                      text: item.name || item.name_ch || item.name_az || item.name_ru || String(item.id)
                    })}
                  />
                  {errors.account_type_id && (
                    <div className="mt-2 text-danger">
                      {errors.account_type_id.message}
                    </div>
                  )}
                </div>

                {/* Payment Note */}
                <div className="mt-3 input-form">
                  <FormLabel htmlFor="payment_note_id" className="flex flex-col w-full sm:flex-row">
                    {t("Payment Note")} *
                  </FormLabel>
                  <TomSelectSearch 
                    apiUrl={`${app_url}/api/search_paymentnote`} 
                    setValue={setValue} 
                    variable="payment_note_id"
                    customDataMapping={(item) => ({
                      value: item.id,
                      text: item.note || item.note_ch || item.note_az || item.note_ru || String(item.id)
                    })}
                  />
                  {errors.payment_note_id && (
                    <div className="mt-2 text-danger">
                      {errors.payment_note_id.message}
                    </div>
                  )}
                </div>

                {/* Company-specific fields */}
                {accountType === 'company' && (
                  <>
                    <div className="mt-3 input-form">
                      <FormLabel htmlFor="worker_entity_name" className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Worker/Entity Name")}
                      </FormLabel>
                      <FormInput
                        {...register("worker_entity_name")}
                        id="worker_entity_name"
                        type="text"
                        placeholder={t("Enter worker or entity name")}
                      />
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel htmlFor="linked_invoice_number" className="flex justify-start items-start flex-col w-full sm:flex-row">
                        {t("Linked Invoice Number")}
                      </FormLabel>
                      <FormInput
                        {...register("linked_invoice_number")}
                        id="linked_invoice_number"
                        type="text"
                        placeholder={t("For COGS calculation")}
                      />
                    </div>
                  </>
                )}

                {/* Warehouse-specific fields */}
                {accountType === 'warehouse' && (
                  <>
                    <div className="mt-3 input-form">
                      <FormLabel htmlFor="customer_id" className="flex flex-col w-full sm:flex-row">
                        {t("Customer")}
                      </FormLabel>
                      <TomSelectSearch 
                        apiUrl={`${app_url}/api/search_customer`} 
                        setValue={setValue} 
                        variable="customer_id"
                        customDataMapping={(item) => ({
                          value: item.id,
                          text: item.name_surname || item.shipping_mark || item.email || String(item.id)
                        })}
                      />
                    </div>
                    <div className="mt-3 input-form">
                      <FormLabel htmlFor="supplier_id" className="flex flex-col w-full sm:flex-row">
                        {t("Supplier")}
                      </FormLabel>
                      <TomSelectSearch 
                        apiUrl={`${app_url}/api/search_supplier`} 
                        setValue={setValue} 
                        variable="supplier_id"
                        customDataMapping={(item) => ({
                          value: item.id,
                          text: item.company_name || item.name || item.email || String(item.id)
                        })}
                      />
                    </div>
                  </>
                )}

                {/* Picture Upload */}
                <div className="mt-3 input-form col-span-2">
                  <FormLabel htmlFor="picture_url" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Attachment")}
                  </FormLabel>
                  <FileUpload setValue={setValue} variable="picture_url" />
                </div>

                {/* Additional Note */}
                <div className="mt-3 input-form col-span-2">
                  <FormLabel htmlFor="additional_note" className="flex justify-start items-start flex-col w-full sm:flex-row">
                    {t("Additional Note")}
                  </FormLabel>
                  <FormTextarea
                    {...register("additional_note")}
                    id="additional_note"
                    rows={3}
                    placeholder={t("Enter additional notes")}
                  />
                </div>
              </div>
            </div>
          </Slideover.Description>
          
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={onClose}
              className="w-24 mr-1"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-24"
              disabled={isLoading}
            >
              {isLoading ? <LoadingIcon icon="tail-spin" className="w-4 h-4" /> : t("Add Payment")}
            </Button>
          </div>
        </form>
      </Slideover.Panel>
    </Slideover>
  );
}

export default AddPaymentModal;
