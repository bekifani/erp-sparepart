import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Chart from "react-apexcharts";

function BasketTab() {
  const { t } = useTranslation();
  
  // Dummy data for filters
  const [suppliers, setSuppliers] = useState("all");
  const [customers, setCustomers] = useState("all");
  const [description, setDescription] = useState("all");
  const [selectedColumns, setSelectedColumns] = useState(5);

  // Dummy data for pie chart - matching the image format
  const pieChartData = {
    series: [35, 25, 40], // Suppliers Amount, Customers Amount, Profit Amount
    options: {
      chart: {
        type: 'pie',
        height: 300,
      },
      labels: ['Suppliers Amount', 'Customers Amount', 'Profit Amount'],
      colors: ['#3B82F6', '#10B981', '#F59E0B'],
      legend: {
        position: 'bottom',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '0%',
          }
        }
      }
    }
  };

  // Dummy data for table
  const tableData = [
    {
      brand: "Bosch",
      brandCode: "BOS001",
      description: "Brake Pad Set",
      qty: 50,
      purchaseAmount: 2500.00,
      salesAmount: 3500.00,
      profitAmount: 1000.00,
    },
    {
      brand: "Continental",
      brandCode: "CON002",
      description: "Air Filter",
      qty: 75,
      purchaseAmount: 1500.00,
      salesAmount: 2250.00,
      profitAmount: 750.00,
    },
    {
      brand: "Valeo",
      brandCode: "VAL003",
      description: "Clutch Kit",
      qty: 30,
      purchaseAmount: 3000.00,
      salesAmount: 4500.00,
      profitAmount: 1500.00,
    },
    {
      brand: "Mann",
      brandCode: "MAN004",
      description: "Oil Filter",
      qty: 100,
      purchaseAmount: 800.00,
      salesAmount: 1200.00,
      profitAmount: 400.00,
    },
    {
      brand: "Febi",
      brandCode: "FEB005",
      description: "Timing Belt",
      qty: 25,
      purchaseAmount: 1250.00,
      salesAmount: 1875.00,
      profitAmount: 625.00,
    },
  ];

  const columns = [
    "Brand",
    "Brand Code", 
    "Description",
    "Qty",
    "Purchase Amount",
    "Sales Amount",
    "Profit Amount"
  ];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
        {/* Suppliers Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suppliers
          </label>
          <FormSelect
            value={suppliers}
            onChange={(e) => setSuppliers(e.target.value)}
            className="mb-2"
          >
            <option value="all">All</option>
            <option value="manufactur-2">Manufactur-2</option>
            <option value="supplier-1">Supplier-1</option>
            <option value="supplier-2">Supplier-2</option>
          </FormSelect>
          <div className="text-sm text-gray-600 bg-white p-2 rounded border">
            Manufactur-2 (8)
          </div>
          <input
            type="text"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="8 customer added manufactur-2 goods"
            defaultValue="8 customer added manufactur-2 goods"
          />
        </div>

        {/* Customers Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customers
          </label>
          <FormSelect
            value={customers}
            onChange={(e) => setCustomers(e.target.value)}
            className="mb-2"
          >
            <option value="all">All</option>
            <option value="akif">AKIF</option>
            <option value="customer-1">Customer-1</option>
            <option value="customer-2">Customer-2</option>
          </FormSelect>
          <div className="text-sm text-gray-600 bg-white p-2 rounded border">
            AKIF (5)
          </div>
          <input
            type="text"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="this customer added 5 suppliers goods"
            defaultValue="this customer added 5 suppliers goods"
          />
        </div>

        {/* Description Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <FormSelect
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          >
            <option value="all">All</option>
            <option value="brake">Brake Parts</option>
            <option value="engine">Engine Parts</option>
            <option value="electrical">Electrical Parts</option>
          </FormSelect>
        </div>
      </div>

      {/* Export Options - Top Right */}
      <div className="flex justify-end space-x-2 mb-4">
        <Button variant="outline" size="sm">Print</Button>
        <Button variant="outline" size="sm">PDF</Button>
        <Button variant="outline" size="sm">Excel</Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Totals and Pie Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="text-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Text : Totals</h3>
            <p className="text-sm text-gray-600">Pie Chart</p>
          </div>
          <div className="h-80 flex items-center justify-center">
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="pie"
              height={300}
            />
          </div>
        </div>

        {/* Right Side - Tablet */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Tablet</h3>
          </div>

          <div className="mb-4">
            <FormSelect
              value={selectedColumns}
              onChange={(e) => setSelectedColumns(e.target.value)}
              className="w-48"
            >
              <option value={5}>5 columns selected</option>
              <option value={6}>6 columns selected</option>
              <option value={7}>7 columns selected</option>
            </FormSelect>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  {columns.slice(0, selectedColumns).map((column, index) => (
                    <Table.Th key={index} className="border-b-2">
                      {column}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tableData.map((row, index) => (
                  <Table.Tr key={index}>
                    {selectedColumns >= 1 && (
                      <Table.Td className="border-b">{row.brand}</Table.Td>
                    )}
                    {selectedColumns >= 2 && (
                      <Table.Td className="border-b">{row.brandCode}</Table.Td>
                    )}
                    {selectedColumns >= 3 && (
                      <Table.Td className="border-b">{row.description}</Table.Td>
                    )}
                    {selectedColumns >= 4 && (
                      <Table.Td className="border-b">{row.qty}</Table.Td>
                    )}
                    {selectedColumns >= 5 && (
                      <Table.Td className="border-b">${row.purchaseAmount.toFixed(2)}</Table.Td>
                    )}
                    {selectedColumns >= 6 && (
                      <Table.Td className="border-b">${row.salesAmount.toFixed(2)}</Table.Td>
                    )}
                    {selectedColumns >= 7 && (
                      <Table.Td className="border-b">${row.profitAmount.toFixed(2)}</Table.Td>
                    )}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
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

export default BasketTab;
