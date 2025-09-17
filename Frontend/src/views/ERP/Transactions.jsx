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
import { FormCheck, FormTextarea, FormInput, FormLabel } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import {
  useGetAllTransactionsQuery,
} from "@/stores/apiSlice";
import clsx from "clsx";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import LoadingIcon from "@/components/Base/LoadingIcon/index.tsx";
import { useSelector } from "react-redux";

function Transactions() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const media_url = useSelector((state) => state.auth.media_url);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state) => state.auth.user);
  
  const hasPermission = (permission) => {
    return user.permissions.includes(permission);
  };

  const [data, setData] = useState([
    {
      title: t("Date"),
      minWidth: 120,
      field: "transaction_date",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const date = new Date(cell.getValue());
        return date.toLocaleDateString();
      }
    },
    {
      title: t("Transaction #"),
      minWidth: 150,
      field: "trans_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Account Page"),
      minWidth: 120,
      field: "account_source",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const source = cell.getValue();
        const badges = {
          'customer': '<span class="badge bg-blue-100 text-blue-800">Customer</span>',
          'supplier': '<span class="badge bg-green-100 text-green-800">Supplier</span>',
          'company': '<span class="badge bg-purple-100 text-purple-800">Company</span>',
          'warehouse': '<span class="badge bg-orange-100 text-orange-800">Warehouse</span>'
        };
        return badges[source] || source;
      }
    },
    {
      title: t("User"),
      minWidth: 120,
      field: "user_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Customer"),
      minWidth: 150,
      field: "customer_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Supplier"),
      minWidth: 150,
      field: "supplier_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Amount"),
      minWidth: 120,
      field: "amount",
      hozAlign: "right",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const amount = parseFloat(cell.getValue() || 0);
        const paymentStatus = cell.getRow().getData().payment_status;
        const color = paymentStatus === 'income' ? 'text-green-600' : 'text-red-600';
        const sign = paymentStatus === 'income' ? '+' : '-';
        return `<span class="${color} font-semibold">${sign}$${amount.toFixed(2)}</span>`;
      }
    },
    {
      title: t("Invoice #"),
      minWidth: 120,
      field: "invoice_number",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Payment Status"),
      minWidth: 120,
      field: "payment_status",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const status = cell.getValue();
        if (status === 'income') {
          return '<span class="badge bg-green-100 text-green-800">Income (+)</span>';
        } else if (status === 'expense') {
          return '<span class="badge bg-red-100 text-red-800">Expense (-)</span>';
        }
        return status;
      }
    },
    {
      title: t("Account Type"),
      minWidth: 150,
      field: "account_type_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Payment Note"),
      minWidth: 150,
      field: "payment_note_name",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
    },
    {
      title: t("Running Balance"),
      minWidth: 150,
      field: "company_running_balance",
      hozAlign: "right",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter: (cell) => {
        const balance = parseFloat(cell.getValue() || 0);
        const color = balance >= 0 ? 'text-green-600' : 'text-red-600';
        return `<span class="${color} font-bold">$${balance.toFixed(2)}</span>`;
      }
    },
    {
      title: t("Actions"),
      minWidth: 120,
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
        const viewBtn = stringToHTML(`
          <a class="view-btn flex items-center mr-3 text-primary" href="javascript:;">
            <i data-lucide="eye" class="w-3.5 h-3.5 stroke-[1.7] mr-1.5"></i> View
          </a>
        `);
        
        viewBtn.addEventListener("click", function () {
          const data = cell.getData();
          setSelectedTransaction(data);
          setShowViewModal(true);
        });
        
        element.append(viewBtn);
        return element;
      },
    },
  ]);

  const [searchColumns, setSearchColumns] = useState([
    'trans_number', 'customer_name', 'supplier_name', 'invoice_number', 
    'payment_status', 'account_type_name', 'payment_note_name'
  ]);

  const [refetch, setRefetch] = useState(false);

  return (
    <div>
      {/* View Transaction Modal */}
      <Slideover
        size="xl"
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedTransaction(null);
        }}
      >
        <Slideover.Panel className="text-center">
          <Slideover.Title>
            <h2 className="mr-auto text-base font-medium">{t("Transaction Details")}</h2>
          </Slideover.Title>
          <Slideover.Description className="relative overflow-y-auto max-h-[calc(100vh-200px)]">
            {selectedTransaction && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Date")}:</label>
                    <p className="text-gray-900">{new Date(selectedTransaction.transaction_date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Transaction #")}:</label>
                    <p className="text-gray-900">{selectedTransaction.trans_number}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Account Source")}:</label>
                    <p className="text-gray-900 capitalize">{selectedTransaction.account_source}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Amount")}:</label>
                    <p className={`font-bold ${selectedTransaction.payment_status === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedTransaction.payment_status === 'income' ? '+' : '-'}${parseFloat(selectedTransaction.amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Customer")}:</label>
                    <p className="text-gray-900">{selectedTransaction.customer_name || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Supplier")}:</label>
                    <p className="text-gray-900">{selectedTransaction.supplier_name || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Invoice #")}:</label>
                    <p className="text-gray-900">{selectedTransaction.invoice_number || 'N/A'}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Payment Status")}:</label>
                    <p className={`font-semibold ${selectedTransaction.payment_status === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedTransaction.payment_status === 'income' ? 'Income (+)' : 'Expense (-)'}
                    </p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Account Type")}:</label>
                    <p className="text-gray-900">{selectedTransaction.account_type_name}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Payment Note")}:</label>
                    <p className="text-gray-900">{selectedTransaction.payment_note_name}</p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Running Balance")}:</label>
                    <p className={`font-bold ${parseFloat(selectedTransaction.company_running_balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${parseFloat(selectedTransaction.company_running_balance || 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("User")}:</label>
                    <p className="text-gray-900">{selectedTransaction.user_name}</p>
                  </div>
                </div>
                {selectedTransaction.additional_note && (
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Additional Note")}:</label>
                    <p className="text-gray-900 mt-1">{selectedTransaction.additional_note}</p>
                  </div>
                )}
                {selectedTransaction.picture_url && (
                  <div className="text-left">
                    <label className="font-semibold text-gray-700">{t("Attachment")}:</label>
                    <div className="mt-2">
                      <img 
                        src={media_url + selectedTransaction.picture_url} 
                        alt="Transaction attachment" 
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>

      {/* Main Content */}
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-medium mr-auto">
          {t("Transactions (General Journal)")}
        </h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-600">
            {t("Master audit trail for all accounting activity")}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lucide icon="TrendingUp" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t("Total Income")}</p>
              <p className="text-lg font-semibold text-green-600">$0.00</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lucide icon="TrendingDown" className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t("Total Expenses")}</p>
              <p className="text-lg font-semibold text-red-600">$0.00</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lucide icon="DollarSign" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t("Net Balance")}</p>
              <p className="text-lg font-semibold text-blue-600">$0.00</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lucide icon="Activity" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{t("Total Transactions")}</p>
              <p className="text-lg font-semibold text-purple-600">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow">
        <TableComponent
          data={data}
          searchColumns={searchColumns}
          apiUrl={`${app_url}/api/transactions`}
          refetch={refetch}
          setRefetch={setRefetch}
          permission="transaction"
        />
      </div>

      {/* Toast Notification */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">{toastMessage}</div>
        </div>
      </Notification>
    </div>
  );
}

export default Transactions;
