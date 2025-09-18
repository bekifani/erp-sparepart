import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";

function ProductsTab() {
  const { t } = useTranslation();
  
  // State for filters
  const [countries, setCountries] = useState("all");
  const [calendar, setCalendar] = useState("date-to-date");
  const [byCustomer, setByCustomer] = useState("all");
  const [bySupplier, setBySupplier] = useState("all");
  const [metric, setMetric] = useState("all");
  const [statisticBy, setStatisticBy] = useState("by-car-models");

  // Dummy data for car models with statistics
  const carModelsData = [
    {
      name: "INFINITI G37 CONVERTIBLE [HV36] 2009-2016",
      salesPercentage: 85,
      purchasePercentage: 70,
      profitPercentage: 15
    },
    {
      name: "INFINITI M35/M45 [Y50] 2004-2010",
      salesPercentage: 75,
      purchasePercentage: 65,
      profitPercentage: 10
    },
    {
      name: "INFINITI QX60/JX [L50] 2012-",
      salesPercentage: 90,
      purchasePercentage: 80,
      profitPercentage: 10
    },
    {
      name: "NISSAN ALMERA [N16] 2000-2001",
      salesPercentage: 60,
      purchasePercentage: 55,
      profitPercentage: 5
    },
    {
      name: "NISSAN ALMERA [N16E] 2000-2006",
      salesPercentage: 65,
      purchasePercentage: 60,
      profitPercentage: 5
    },
    {
      name: "NISSAN ALTIMA [L32] 2006-2013",
      salesPercentage: 80,
      purchasePercentage: 70,
      profitPercentage: 10
    },
    {
      name: "NISSAN ALTIMA [L33] 2012-2018",
      salesPercentage: 85,
      purchasePercentage: 75,
      profitPercentage: 10
    },
    {
      name: "NISSAN ALTIMA COUPE [CL32] 2007-2013",
      salesPercentage: 70,
      purchasePercentage: 65,
      profitPercentage: 5
    },
    {
      name: "NISSAN ALTIMA HYBRID [L32HV] 2006-2011",
      salesPercentage: 55,
      purchasePercentage: 50,
      profitPercentage: 5
    }
  ];

  const statisticByOptions = [
    { value: "by-car-models", label: "By Car Models (Top 100)" },
    { value: "by-category", label: "By Category" },
    { value: "by-description", label: "By Description (Top 100)" },
    { value: "by-brand-code", label: "By Brand Code (Top 100)" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Countries
          </label>
          <FormSelect
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
          >
            <option value="all">All (+quantity)</option>
            <option value="usa">USA</option>
            <option value="germany">Germany</option>
            <option value="japan">Japan</option>
            <option value="korea">Korea</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calendar
          </label>
          <FormSelect
            value={calendar}
            onChange={(e) => setCalendar(e.target.value)}
          >
            <option value="date-to-date">(date to date)</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="this-year">This Year</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            By Customer
          </label>
          <FormSelect
            value={byCustomer}
            onChange={(e) => setByCustomer(e.target.value)}
          >
            <option value="all">All</option>
            <option value="customer1">Customer 1</option>
            <option value="customer2">Customer 2</option>
            <option value="customer3">Customer 3</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            By Supplier
          </label>
          <FormSelect
            value={bySupplier}
            onChange={(e) => setBySupplier(e.target.value)}
          >
            <option value="all">All</option>
            <option value="supplier1">Supplier 1</option>
            <option value="supplier2">Supplier 2</option>
            <option value="supplier3">Supplier 3</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric
          </label>
          <FormSelect
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="all">All</option>
            <option value="sold">Sold (qty code)</option>
            <option value="not-sold">Not Sold (qty code)</option>
          </FormSelect>
        </div>
      </div>

      {/* Export Options - Top Right */}
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" size="sm">Print</Button>
        <Button variant="outline" size="sm">PDF</Button>
        <Button variant="outline" size="sm">Excel</Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Statistic By Section */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Statistic By
            </h3>
            <div className="space-y-2">
              {statisticByOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    statisticBy === option.value
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setStatisticBy(option.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{option.label}</span>
                    {statisticBy === option.value && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Main Data Display */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-2 text-left">Statistic</Table.Th>
                    <Table.Th className="border-b-2 text-center bg-green-100 text-green-800">Sales (%)</Table.Th>
                    <Table.Th className="border-b-2 text-center bg-orange-100 text-orange-800">Purchase (%)</Table.Th>
                    <Table.Th className="border-b-2 text-center bg-blue-100 text-blue-800">Profit (%)</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {carModelsData.map((car, index) => (
                    <Table.Tr key={index}>
                      <Table.Td className="border-b py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.name}
                        </div>
                      </Table.Td>
                      <Table.Td className="border-b py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-green-500 h-4 rounded-full" 
                                style={{ width: `${car.salesPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">{car.salesPercentage}</span>
                        </div>
                      </Table.Td>
                      <Table.Td className="border-b py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-orange-500 h-4 rounded-full" 
                                style={{ width: `${car.purchasePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">{car.purchasePercentage}</span>
                        </div>
                      </Table.Td>
                      <Table.Td className="border-b py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-4">
                              <div 
                                className="bg-blue-500 h-4 rounded-full" 
                                style={{ width: `${car.profitPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">{car.profitPercentage}</span>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        © 1995 - 2025 Komiparts Auto Spare Parts Co., Ltd.
      </div>
    </div>
  );
}

export default ProductsTab;