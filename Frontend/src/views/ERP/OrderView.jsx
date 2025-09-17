import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import ReactDOMServer from 'react-dom/server';
import Button from "@/components/Base/Button";
import React, { useRef, useState, useEffect } from "react";
import { FormSelect, FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useGetOrderDetailQuery,
  useGetOrderdetailsQuery,
  useGetCompansQuery,
} from "@/stores/apiSlice";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import { useSelector } from "react-redux";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import { useSearchParams } from "react-router-dom";

function OrderView() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [selectedCompanyData, setSelectedCompanyData] = useState(null);

  // Fetch order details
  const { data: orderData, isLoading: orderLoading } = useGetOrderDetailQuery(orderId, {
    skip: !orderId
  });

  // Fetch order line items
  const { data: orderDetailsData, isLoading: detailsLoading } = useGetOrderdetailsQuery({
    filter: [{ field: 'order_id', type: '=', value: orderId }]
  }, {
    skip: !orderId
  });

  // Fetch companies for dropdown
  const { data: companiesData } = useGetCompansQuery();

  const [orderDetailsColumns] = useState([
    {
      title: t("Brand"),
      minWidth: 120,
      field: "brand_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Brand Code"),
      minWidth: 120,
      field: "brand_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("OE Code"),
      minWidth: 120,
      field: "oe_code",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Description"),
      minWidth: 200,
      field: "description",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Qty"),
      minWidth: 80,
      field: "qty",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Unit Price"),
      minWidth: 100,
      field: "unit_price",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Line Amount"),
      minWidth: 120,
      field: "line_total",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Arrival Time"),
      minWidth: 120,
      field: "arrival_time",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Additional Note"),
      minWidth: 200,
      field: "additional_note",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Status"),
      minWidth: 100,
      field: "status_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
  ]);

  const handleExport = (format) => {
    // Export functionality will be implemented here
    console.log(`Exporting as ${format}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    // Reset functionality
    window.location.reload();
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    if (companyId && companiesData?.data?.data) {
      const company = companiesData.data.data.find(c => c.id == companyId);
      setSelectedCompanyData(company);
    } else {
      setSelectedCompanyData(null);
    }
  };

  if (orderLoading || detailsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIcon icon="tail-spin" className="w-8 h-8" />
      </div>
    );
  }

  const order = orderData?.data;
  const orderDetails = orderDetailsData?.data?.data || [];

  return (
    <div className="p-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Company Profile Selection */}
          <div>
            <FormLabel className="text-sm font-medium text-white">{t("Select Company info")}</FormLabel>
            <FormSelect
              value={selectedCompany}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-48 text-white bg-white border-white"
              style={{ color: 'black' }}
            >
              <option value="" style={{ color: 'black' }}>{t("Select Company")}</option>
              {companiesData?.data?.data?.map((company) => (
                <option key={company.id} value={company.id} style={{ color: 'black' }}>
                  {company.company_name}
                </option>
              )) || []}
            </FormSelect>
          </div>

          {/* Language Selection */}
          <div>
            <FormLabel className="text-sm font-medium text-white">{t("Language")}</FormLabel>
            <FormSelect
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-32 text-white bg-transparent border-white"
            >
              <option value="English">English</option>
              <option value="Russian">Russian</option>
              <option value="Chinese">Chinese</option>
            </FormSelect>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline-primary"
            onClick={handlePrint}
            className="flex items-center text-white border-white hover:bg-white hover:text-blue-600"
          >
            <Lucide icon="Printer" className="w-4 h-4 mr-2" />
            {t("Print")}
          </Button>

          <Button
            variant="primary"
            onClick={() => handleExport('pdf')}
            className="flex items-center text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
          >
            <Lucide icon="FileText" className="w-4 h-4 mr-2" />
            {t("PDF")}
          </Button>

          <Button
            variant="success"
            onClick={() => handleExport('xlsx')}
            className="flex items-center"
          >
            <Lucide icon="FileSpreadsheet" className="w-4 h-4 mr-2" />
            {t("Excel")}
          </Button>
        </div>
      </div>

      {/* Customer Information Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">{selectedCompanyData?.company_name || t("Company Name")}</h3>
            <div className="space-y-2">
              <div><strong>{t("Customer Name")}:</strong> {order?.customer_name || '-'}</div>
              <div><strong>{t("Invoice Number")}:</strong> {order?.invoice_no || '-'}</div>
              <div><strong>{t("Shipping Mark")}:</strong> {order?.shipping_mark || '-'}</div>
              <div><strong>{t("Order Date")}:</strong> {order?.order_date || '-'}</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("Company Details")}</h3>
            <div className="space-y-2">
              <div><strong>{t("Company Address")}:</strong> {selectedCompanyData?.address || '-'}</div>
              <div><strong>{t("Company Phone")}:</strong> {selectedCompanyData?.phone || '-'}</div>
              <div><strong>{t("Company Email")}:</strong> {selectedCompanyData?.email || '-'}</div>
              <div><strong>{t("Tax Number")}:</strong> {selectedCompanyData?.tax_number || '-'}</div>
              <div><strong>{t("Website")}:</strong> {selectedCompanyData?.website || '-'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">{t("Order Details")}</h3>
        </div>
        <div className="p-4">
          <TableComponent
            data={orderDetailsColumns}
            apiEndpoint={`${app_url}/api/orderdetails`}
            searchColumns={['brand_name', 'brand_code', 'oe_code', 'description', 'qty', 'unit_price', 'line_total', 'arrival_time', 'additional_note', 'status_name']}
            filters={[{ field: 'order_id', type: '=', value: orderId }]}
            showAddButton={false}
            showActions={false}
            permission="orderdetail-list"
            show_create={false}
            disabled={true}
          />
        </div>
      </div>

      {/* Financial Summary Footer */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">{t("Financial Summary")}</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span><strong>{t("Total Qty")}:</strong></span>
              <span>{order?.total_qty || 0}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>{t("Total Amount")}:</strong></span>
              <span>{order?.total_amount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>{t("Discount")}:</strong></span>
              <span>{order?.discount || 0}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span><strong>{t("Deposit")}:</strong></span>
              <span>{order?.deposit || 0}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>{t("Extra Expenses")}:</strong></span>
              <span>{order?.extra_expenses || 0}</span>
            </div>
            <div className="flex justify-between">
              <span><strong>{t("Customer Debt")}:</strong></span>
              <span>{order?.customer_debt || 0}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span><strong>{t("Final Balance")}:</strong></span>
              <span className="font-bold">{order?.balance || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attach File Button at Bottom Right */}
      <div className="flex justify-end mt-6">
        <Button
          variant="primary"
          onClick={() => setShowAttachModal(true)}
          className="flex items-center text-white bg-blue-600 border-blue-600 hover:bg-blue-700"
        >
          <Lucide icon="Paperclip" className="w-4 h-4 mr-2" />
          {t("Attach file")}
        </Button>
      </div>

      {/* Attach File Modal */}
      {showAttachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">{t("Attach File")}</h3>
            <div className="mb-4">
              <FormInput
                type="file"
                className="w-full"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline-secondary"
                onClick={() => setShowAttachModal(false)}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Handle file upload
                  setShowAttachModal(false);
                }}
              >
                {t("Upload")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderView;
