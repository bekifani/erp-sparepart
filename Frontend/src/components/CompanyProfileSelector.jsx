import React from 'react';
import { FormLabel } from "@/components/Base/Form";
import { useTranslation } from "react-i18next";

const CompanyProfileSelector = ({ 
  companiesData, 
  selectedCompany, 
  onCompanyChange, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mt-3 input-form ${className}`}>
      <FormLabel
        htmlFor="company-profile-select"
        className="flex flex-col w-full sm:flex-row"
      >
        {t("Company Profile")}
      </FormLabel>
      <select
        id="company-profile-select"
        value={selectedCompany}
        onChange={(e) => onCompanyChange(e.target.value)}
        className="form-select w-full"
      >
        <option value="">{t("Select Company Profile")}</option>
        {companiesData?.data?.data?.map((company) => (
          <option key={company.id} value={company.id}>
            {company.company_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanyProfileSelector;
