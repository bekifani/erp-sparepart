import React from "react";
import { FormLabel, FormInput, FormTextarea } from "@/components/Base/Form";
import FileUpload from "@/helpers/ui/FileUpload.jsx";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const CompanForm = ({ register, errors, upload_url, setUploadLogo }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full space-y-6">
      {/* Basic Company Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Basic Company Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Name* */}
          <div className="input-form">
            <FormLabel htmlFor="company_name" className="flex justify-start items-start flex-col w-full">
              {t("Legal Company Name")} <span className="text-danger">*</span>
            </FormLabel>
            <FormInput
              {...register("company_name")}
              id="company_name"
              type="text"
              name="company_name"
              className={clsx({ "border-danger": errors.company_name })}
              placeholder={t("Enter legal company name")}
            />
            {errors.company_name && (
              <div className="mt-2 text-danger">
                {typeof errors.company_name.message === "string" && errors.company_name.message}
              </div>
            )}
          </div>

          {/* Trading Name */}
          <div className="input-form">
            <FormLabel htmlFor="trading_name" className="flex justify-start items-start flex-col w-full">
              {t("Trading Name")} <span className="text-sm text-gray-500">({t("if different")})</span>
            </FormLabel>
            <FormInput
              {...register("trading_name")}
              id="trading_name"
              type="text"
              name="trading_name"
              className={clsx({ "border-danger": errors.trading_name })}
              placeholder={t("Enter trading name")}
            />
            {errors.trading_name && (
              <div className="mt-2 text-danger">
                {typeof errors.trading_name.message === "string" && errors.trading_name.message}
              </div>
            )}
          </div>

          {/* Website */}
          <div className="input-form">
            <FormLabel htmlFor="website" className="flex justify-start items-start flex-col w-full">
              {t("Website")}
            </FormLabel>
            <FormInput
              {...register("website")}
              id="website"
              type="url"
              name="website"
              className={clsx({ "border-danger": errors.website })}
              placeholder={t("Enter website URL")}
            />
            {errors.website && (
              <div className="mt-2 text-danger">
                {typeof errors.website.message === "string" && errors.website.message}
              </div>
            )}
          </div>

          {/* Our Reference* */}
          <div className="input-form">
            <FormLabel htmlFor="our_ref" className="flex justify-start items-start flex-col w-full">
              {t("Our Reference")} <span className="text-danger">*</span>
            </FormLabel>
            <FormInput
              {...register("our_ref")}
              id="our_ref"
              type="text"
              name="our_ref"
              className={clsx({ "border-danger": errors.our_ref })}
              placeholder={t("Enter our reference")}
            />
            {errors.our_ref && (
              <div className="mt-2 text-danger">
                {typeof errors.our_ref.message === "string" && errors.our_ref.message}
              </div>
            )}
          </div>
        </div>

        {/* Company Logo */}
        <div className="mt-4 input-form">
          <FormLabel className="flex justify-start items-start flex-col w-full">
            {t("Company Logo")}
          </FormLabel>
          <FileUpload endpoint={upload_url} type="image/*" className="w-full" setUploadedURL={setUploadLogo}/>
        </div>
      </div>

      {/* Address Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Address Information")}</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Legacy Address (for backward compatibility) */}
          <div className="input-form">
            <FormLabel htmlFor="address" className="flex justify-start items-start flex-col w-full">
              {t("Full Address")} <span className="text-sm text-gray-500">({t("legacy format")})</span>
            </FormLabel>
            <FormTextarea
              {...register("address")}
              id="address"
              name="address"
              className={clsx({ "border-danger": errors.address })}
              placeholder={t("Enter complete address")}
              rows={2}
            />
            {errors.address && (
              <div className="mt-2 text-danger">
                {typeof errors.address.message === "string" && errors.address.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Street Address */}
            <div className="input-form">
              <FormLabel htmlFor="street_address" className="flex justify-start items-start flex-col w-full">
                {t("Street Address")}
              </FormLabel>
              <FormInput
                {...register("street_address")}
                id="street_address"
                type="text"
                name="street_address"
                className={clsx({ "border-danger": errors.street_address })}
                placeholder={t("Enter street address")}
              />
              {errors.street_address && (
                <div className="mt-2 text-danger">
                  {typeof errors.street_address.message === "string" && errors.street_address.message}
                </div>
              )}
            </div>

            {/* City */}
            <div className="input-form">
              <FormLabel htmlFor="city" className="flex justify-start items-start flex-col w-full">
                {t("City")}
              </FormLabel>
              <FormInput
                {...register("city")}
                id="city"
                type="text"
                name="city"
                className={clsx({ "border-danger": errors.city })}
                placeholder={t("Enter city")}
              />
              {errors.city && (
                <div className="mt-2 text-danger">
                  {typeof errors.city.message === "string" && errors.city.message}
                </div>
              )}
            </div>

            {/* State/Region */}
            <div className="input-form">
              <FormLabel htmlFor="state_region" className="flex justify-start items-start flex-col w-full">
                {t("State/Region")}
              </FormLabel>
              <FormInput
                {...register("state_region")}
                id="state_region"
                type="text"
                name="state_region"
                className={clsx({ "border-danger": errors.state_region })}
                placeholder={t("Enter state or region")}
              />
              {errors.state_region && (
                <div className="mt-2 text-danger">
                  {typeof errors.state_region.message === "string" && errors.state_region.message}
                </div>
              )}
            </div>

            {/* Postal Code */}
            <div className="input-form">
              <FormLabel htmlFor="postal_code" className="flex justify-start items-start flex-col w-full">
                {t("Postal Code")}
              </FormLabel>
              <FormInput
                {...register("postal_code")}
                id="postal_code"
                type="text"
                name="postal_code"
                className={clsx({ "border-danger": errors.postal_code })}
                placeholder={t("Enter postal code")}
              />
              {errors.postal_code && (
                <div className="mt-2 text-danger">
                  {typeof errors.postal_code.message === "string" && errors.postal_code.message}
                </div>
              )}
            </div>
          </div>

          {/* Country */}
          <div className="input-form">
            <FormLabel htmlFor="country" className="flex justify-start items-start flex-col w-full">
              {t("Country")}
            </FormLabel>
            <FormInput
              {...register("country")}
              id="country"
              type="text"
              name="country"
              className={clsx({ "border-danger": errors.country })}
              placeholder={t("Enter country")}
            />
            {errors.country && (
              <div className="mt-2 text-danger">
                {typeof errors.country.message === "string" && errors.country.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Contact Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="input-form">
            <FormLabel htmlFor="email" className="flex justify-start items-start flex-col w-full">
              {t("Email Address")}
            </FormLabel>
            <FormInput
              {...register("email")}
              id="email"
              type="email"
              name="email"
              className={clsx({ "border-danger": errors.email })}
              placeholder={t("Enter email address")}
            />
            {errors.email && (
              <div className="mt-2 text-danger">
                {typeof errors.email.message === "string" && errors.email.message}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="input-form">
            <FormLabel htmlFor="phone_number" className="flex justify-start items-start flex-col w-full">
              {t("Phone Number")}
            </FormLabel>
            <FormInput
              {...register("phone_number")}
              id="phone_number"
              type="tel"
              name="phone_number"
              className={clsx({ "border-danger": errors.phone_number })}
              placeholder={t("Enter phone number")}
            />
            {errors.phone_number && (
              <div className="mt-2 text-danger">
                {typeof errors.phone_number.message === "string" && errors.phone_number.message}
              </div>
            )}
          </div>

          {/* Mobile Number */}
          <div className="input-form">
            <FormLabel htmlFor="mobile_number" className="flex justify-start items-start flex-col w-full">
              {t("Mobile Number")}
            </FormLabel>
            <FormInput
              {...register("mobile_number")}
              id="mobile_number"
              type="tel"
              name="mobile_number"
              className={clsx({ "border-danger": errors.mobile_number })}
              placeholder={t("Enter mobile number")}
            />
            {errors.mobile_number && (
              <div className="mt-2 text-danger">
                {typeof errors.mobile_number.message === "string" && errors.mobile_number.message}
              </div>
            )}
          </div>

          {/* Origin */}
          <div className="input-form">
            <FormLabel htmlFor="origin" className="flex justify-start items-start flex-col w-full">
              {t("Origin")}
            </FormLabel>
            <FormInput
              {...register("origin")}
              id="origin"
              type="text"
              name="origin"
              className={clsx({ "border-danger": errors.origin })}
              placeholder={t("Enter origin")}
            />
            {errors.origin && (
              <div className="mt-2 text-danger">
                {typeof errors.origin.message === "string" && errors.origin.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tax & Legal Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Tax & Legal Information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* VAT Number */}
          <div className="input-form">
            <FormLabel htmlFor="vat_number" className="flex justify-start items-start flex-col w-full">
              {t("VAT Number")}
            </FormLabel>
            <FormInput
              {...register("vat_number")}
              id="vat_number"
              type="text"
              name="vat_number"
              className={clsx({ "border-danger": errors.vat_number })}
              placeholder={t("Enter VAT number")}
            />
            {errors.vat_number && (
              <div className="mt-2 text-danger">
                {typeof errors.vat_number.message === "string" && errors.vat_number.message}
              </div>
            )}
          </div>

          {/* Tax ID */}
          <div className="input-form">
            <FormLabel htmlFor="tax_id" className="flex justify-start items-start flex-col w-full">
              {t("Tax ID")}
            </FormLabel>
            <FormInput
              {...register("tax_id")}
              id="tax_id"
              type="text"
              name="tax_id"
              className={clsx({ "border-danger": errors.tax_id })}
              placeholder={t("Enter tax ID")}
            />
            {errors.tax_id && (
              <div className="mt-2 text-danger">
                {typeof errors.tax_id.message === "string" && errors.tax_id.message}
              </div>
            )}
          </div>

          {/* Business Registration Number */}
          <div className="input-form md:col-span-2">
            <FormLabel htmlFor="business_registration_number" className="flex justify-start items-start flex-col w-full">
              {t("Business Registration Number")}
            </FormLabel>
            <FormInput
              {...register("business_registration_number")}
              id="business_registration_number"
              type="text"
              name="business_registration_number"
              className={clsx({ "border-danger": errors.business_registration_number })}
              placeholder={t("Enter business registration number")}
            />
            {errors.business_registration_number && (
              <div className="mt-2 text-danger">
                {typeof errors.business_registration_number.message === "string" && errors.business_registration_number.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Terms */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Business Terms")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Payment Terms */}
          <div className="input-form">
            <FormLabel htmlFor="payment_terms" className="flex justify-start items-start flex-col w-full">
              {t("Payment Terms")}
            </FormLabel>
            <FormTextarea
              {...register("payment_terms")}
              id="payment_terms"
              name="payment_terms"
              className={clsx({ "border-danger": errors.payment_terms })}
              placeholder={t("Enter payment terms")}
              rows={3}
            />
            {errors.payment_terms && (
              <div className="mt-2 text-danger">
                {typeof errors.payment_terms.message === "string" && errors.payment_terms.message}
              </div>
            )}
          </div>

          {/* Shipping Terms */}
          <div className="input-form">
            <FormLabel htmlFor="shipping_terms" className="flex justify-start items-start flex-col w-full">
              {t("Shipping Terms")}
            </FormLabel>
            <FormTextarea
              {...register("shipping_terms")}
              id="shipping_terms"
              name="shipping_terms"
              className={clsx({ "border-danger": errors.shipping_terms })}
              placeholder={t("Enter shipping terms")}
              rows={3}
            />
            {errors.shipping_terms && (
              <div className="mt-2 text-danger">
                {typeof errors.shipping_terms.message === "string" && errors.shipping_terms.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banking & Additional Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{t("Banking & Additional Information")}</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Bank Details */}
          <div className="input-form">
            <FormLabel htmlFor="bank_details" className="flex justify-start items-start flex-col w-full">
              {t("Bank Account Details")}
            </FormLabel>
            <FormTextarea
              {...register("bank_details")}
              id="bank_details"
              name="bank_details"
              className={clsx({ "border-danger": errors.bank_details })}
              placeholder={t("Enter bank account details for invoices")}
              rows={4}
            />
            {errors.bank_details && (
              <div className="mt-2 text-danger">
                {typeof errors.bank_details.message === "string" && errors.bank_details.message}
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div className="input-form">
            <FormLabel htmlFor="additional_note" className="flex justify-start items-start flex-col w-full">
              {t("Additional Notes")}
            </FormLabel>
            <FormTextarea
              {...register("additional_note")}
              id="additional_note"
              name="additional_note"
              className={clsx({ "border-danger": errors.additional_note })}
              placeholder={t("Enter any additional notes or information")}
              rows={4}
            />
            {errors.additional_note && (
              <div className="mt-2 text-danger">
                {typeof errors.additional_note.message === "string" && errors.additional_note.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanForm;
