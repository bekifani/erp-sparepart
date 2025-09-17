import "@/assets/css/vendors/tabulator.css";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import React, { useRef, useState } from "react";
import Notification from "@/components/Base/Notification";
import TableComponent from "@/helpers/ui/TableComponent.jsx";
import { FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import { stringToHTML } from "@/utils/helper";
import Can from "@/helpers/PermissionChecker/index.js";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function SearchResultAnalysis() {
  const { t } = useTranslation();
  const app_url = useSelector((state) => state.auth.app_url);
  const [toastMessage, setToastMessage] = useState("");
  const basicStickyNotification = useRef();
  const user = useSelector((state) => state.auth.user);
  
  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [searchTypeFilter, setSearchTypeFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  const hasPermission = (permission) => {
    return user.permissions.includes(permission);
  };

  // Table column configuration for search result analysis
  const [data, setData] = useState([
    {
      title: t("Date & Time"),
      minWidth: 180,
      responsive: 0,
      field: "date_time",
      vertAlign: "middle",
      print: true,
      download: true,
      sorter: "datetime",
      sorterParams: {
        format: "YYYY-MM-DD HH:mm:ss"
      }
    },
    {
      title: t("User"),
      minWidth: 150,
      field: "user_display",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const data = cell.getData();
        const userType = data.user_type;
        let iconClass = "";
        let textClass = "";
        
        switch(userType) {
          case 'guest':
            iconClass = "text-gray-500";
            textClass = "text-gray-600";
            break;
          case 'customer':
            iconClass = "text-blue-500";
            textClass = "text-blue-700";
            break;
          case 'employee':
            iconClass = "text-green-500";
            textClass = "text-green-700";
            break;
        }
        
        return `<div class="flex items-center">
          <i data-lucide="user" class="w-4 h-4 mr-2 ${iconClass}"></i>
          <span class="${textClass}">${cell.getValue()}</span>
        </div>`;
      }
    },
    {
      title: t("Search Type"),
      minWidth: 200,
      field: "search_type_display",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const searchType = cell.getData().search_type;
        let iconClass = "";
        
        switch(searchType) {
          case 'category':
            iconClass = "folder";
            break;
          case 'car_model':
            iconClass = "truck";
            break;
          case 'description':
            iconClass = "file-text";
            break;
          case 'code':
            iconClass = "hash";
            break;
          default:
            iconClass = "search";
        }
        
        return `<div class="flex items-center">
          <i data-lucide="${iconClass}" class="w-4 h-4 mr-2 text-slate-500"></i>
          <span>${cell.getValue()}</span>
        </div>`;
      }
    },
    {
      title: t("Search Query"),
      minWidth: 200,
      field: "search_query",
      hozAlign: "left",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const query = cell.getValue();
        return `<div class="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
          ${query}
        </div>`;
      }
    },
    {
      title: t("Result"),
      minWidth: 100,
      field: "result_display",
      hozAlign: "center",
      headerHozAlign: "center",
      vertAlign: "middle",
      print: true,
      download: true,
      formatter(cell) {
        const result = cell.getValue();
        const resultFound = cell.getData().result_found;
        
        if (resultFound) {
          return `<div class="flex items-center justify-center">
            <i data-lucide="check-circle" class="w-4 h-4 mr-1 text-green-500"></i>
            <span class="text-green-700 font-medium">Yes</span>
          </div>`;
        } else {
          return `<div class="flex items-center justify-center">
            <i data-lucide="x" class="w-4 h-4 mr-1 text-red-500"></i>
            <span class="text-red-700 font-bold">No</span>
          </div>`;
        }
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
        const data = cell.getData();
        const element = stringToHTML(
          `<div class="flex items-center justify-center">
            <button class="view-btn flex items-center text-primary hover:text-primary-dark mr-2" title="View Details">
              <i data-lucide="eye" class="w-3.5 h-3.5 stroke-[1.7]"></i>
            </button>
          </div>`
        );
        
        const viewBtn = element.querySelector('.view-btn');
        viewBtn.addEventListener("click", function () {
          showSearchDetails(data);
        });
        
        return element;
      },
    },
  ]);

  // Search columns for filtering
  const [searchColumns, setSearchColumns] = useState([
    'date_time', 
    'user_display', 
    'search_type_display', 
    'search_query', 
    'result_display'
  ]);

  const [refetch, setRefetch] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Function to show search details modal
  const showSearchDetails = (data) => {
    const details = `
      <div class="space-y-3">
        <div><strong>Date & Time:</strong> ${data.date_time}</div>
        <div><strong>User:</strong> ${data.user_display} (${data.user_type})</div>
        <div><strong>Search Type:</strong> ${data.search_type_display}</div>
        <div><strong>Search Query:</strong> <code class="bg-gray-100 px-2 py-1 rounded">${data.search_query}</code></div>
        <div><strong>Result Found:</strong> <span class="${data.result_found ? 'text-green-600' : 'text-red-600'}">${data.result_display}</span></div>
        ${data.entity_type ? `<div><strong>Entity Type:</strong> ${data.entity_type}</div>` : ''}
        ${data.entity_id ? `<div><strong>Entity ID:</strong> ${data.entity_id}</div>` : ''}
      </div>
    `;
    
    setToastMessage(`Search Result Details: ${details}`);
    basicStickyNotification.current?.showToast();
  };

  // Filter functions
  const applyFilters = () => {
    const filters = [];
    
    if (dateFrom) {
      filters.push({
        field: 'date_time',
        type: '>=',
        value: dateFrom + ' 00:00:00'
      });
    }
    
    if (dateTo) {
      filters.push({
        field: 'date_time', 
        type: '<=',
        value: dateTo + ' 23:59:59'
      });
    }
    
    if (userTypeFilter) {
      filters.push({
        field: 'user_type',
        type: '=',
        value: userTypeFilter
      });
    }
    
    if (searchTypeFilter) {
      filters.push({
        field: 'search_type',
        type: '=', 
        value: searchTypeFilter
      });
    }
    
    if (resultFilter) {
      filters.push({
        field: 'result_found',
        type: '=',
        value: resultFilter === 'yes' ? 1 : 0
      });
    }
    
    // Apply filters to table
    setAppliedFilters(filters);
    setRefetch(true);
  };

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setUserTypeFilter("");
    setSearchTypeFilter("");
    setResultFilter("");
    setAppliedFilters([]);
    setRefetch(true);
  };

  return (
    <div>
      {/* Filter Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Lucide icon="Filter" className="w-5 h-5 mr-2" />
            {t("Search Activity Filters")}
          </h3>
          <div className="flex space-x-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearFilters}
              className="flex items-center"
            >
              <Lucide icon="X" className="w-4 h-4 mr-1" />
              {t("Clear")}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={applyFilters}
              className="flex items-center"
            >
              <Lucide icon="Search" className="w-4 h-4 mr-1" />
              {t("Apply Filters")}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date Range */}
          <div>
            <FormLabel className="text-sm font-medium text-gray-700">
              {t("Date From")}
            </FormLabel>
            <FormInput
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <FormLabel className="text-sm font-medium text-gray-700">
              {t("Date To")}
            </FormLabel>
            <FormInput
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* User Type Filter */}
          <div>
            <FormLabel className="text-sm font-medium text-gray-700">
              {t("User Type")}
            </FormLabel>
            <FormSelect
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              className="mt-1"
            >
              <option value="">{t("All Users")}</option>
              <option value="guest">{t("Guest")}</option>
              <option value="customer">{t("Customer")}</option>
              <option value="employee">{t("Employee")}</option>
            </FormSelect>
          </div>
          
          {/* Search Type Filter */}
          <div>
            <FormLabel className="text-sm font-medium text-gray-700">
              {t("Search Type")}
            </FormLabel>
            <FormSelect
              value={searchTypeFilter}
              onChange={(e) => setSearchTypeFilter(e.target.value)}
              className="mt-1"
            >
              <option value="">{t("All Types")}</option>
              <option value="category">{t("By Category")}</option>
              <option value="car_model">{t("By Car Model")}</option>
              <option value="description">{t("By Description")}</option>
              <option value="code">{t("By Code")}</option>
            </FormSelect>
          </div>
          
          {/* Result Filter */}
          <div>
            <FormLabel className="text-sm font-medium text-gray-700">
              {t("Result")}
            </FormLabel>
            <FormSelect
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="mt-1"
            >
              <option value="">{t("All Results")}</option>
              <option value="yes">{t("Found (Yes)")}</option>
              <option value="no">{t("Not Found (No)")}</option>
            </FormSelect>
          </div>
        </div>
      </div>

      {/* Analysis Insights Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Lucide icon="Lightbulb" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              {t("Search Analysis Insights")}
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• {t("Monitor search activity from both website and accounting application")}</p>
              <p>• {t("High number of 'No' results indicates potential gaps in product catalog")}</p>
              <p>• {t("Failed searches help identify missing products, cross codes, or car models")}</p>
              <p>• {t("Use this data to improve search term mapping and add synonyms")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Notification
        getRef={(el) => {
          basicStickyNotification.current = el;
        }}
        className="flex flex-col sm:flex-row"
      >
        <div className="font-medium" dangerouslySetInnerHTML={{ __html: toastMessage }} />
      </Notification>

      {/* Search Results Table */}
      <Can permission="searchresult-list">
        <TableComponent
          endpoint={app_url + "/api/searchresult"}
          data={data}
          searchColumns={searchColumns}
          refetch={refetch}
          setRefetch={setRefetch}
          permission={"Searchresult"}
          show_create={false} // Hide create button for analysis interface
          title={t("Search Activity Log")}
          subtitle={t("Monitor and analyze all search queries performed on the website and accounting application")}
          customFilters={appliedFilters}
        />
      </Can>
    </div>
  );
}

export default SearchResultAnalysis;
