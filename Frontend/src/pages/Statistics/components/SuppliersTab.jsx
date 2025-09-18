import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Chart from "react-apexcharts";

function SuppliersTab() {
  const { t } = useTranslation();
  
  // Dummy data for filters
  const [country, setCountry] = useState("all");
  const [supplierType, setSupplierType] = useState("all");
  const [rating, setRating] = useState("all");

  // Dummy data for area chart
  const areaChartData = {
    series: [{
      name: 'Purchase Orders',
      data: [31, 40, 28, 51, 42, 109, 100, 120, 95, 110, 125, 130]
    }, {
      name: 'Deliveries',
      data: [28, 35, 25, 48, 38, 95, 90, 105, 85, 95, 110, 115]
    }],
    options: {
      chart: {
        type: 'area',
        height: 300,
        stacked: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yaxis: {
        title: {
          text: 'Number of Orders'
        }
      },
      colors: ['#3B82F6', '#10B981'],
      legend: {
        position: 'top',
      },
    }
  };

  // Dummy data for table
  const tableData = [
    {
      supplierName: "Manufactur-2",
      country: "Germany",
      type: "Manufacturer",
      products: 150,
      orders: 25,
      totalValue: 250000.00,
      rating: 4.8,
      status: "Active",
    },
    {
      supplierName: "Auto Parts Global",
      country: "USA",
      type: "Distributor",
      products: 200,
      orders: 18,
      totalValue: 180000.00,
      rating: 4.5,
      status: "Active",
    },
    {
      supplierName: "European Motors",
      country: "France",
      type: "Manufacturer",
      products: 120,
      orders: 22,
      totalValue: 220000.00,
      rating: 4.7,
      status: "Active",
    },
    {
      supplierName: "Asia Supply Co.",
      country: "China",
      type: "Manufacturer",
      products: 300,
      orders: 15,
      totalValue: 150000.00,
      rating: 4.2,
      status: "Active",
    },
    {
      supplierName: "Premium Parts",
      country: "Japan",
      type: "Distributor",
      products: 180,
      orders: 20,
      totalValue: 200000.00,
      rating: 4.9,
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <FormSelect
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="all">All Countries</option>
            <option value="germany">Germany</option>
            <option value="usa">USA</option>
            <option value="france">France</option>
            <option value="china">China</option>
            <option value="japan">Japan</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier Type
          </label>
          <FormSelect
            value={supplierType}
            onChange={(e) => setSupplierType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="distributor">Distributor</option>
            <option value="wholesaler">Wholesaler</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <FormSelect
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </FormSelect>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Supplier Performance
          </h3>
          <div className="h-80">
            <Chart
              options={areaChartData.options}
              series={areaChartData.series}
              type="area"
              height={300}
            />
          </div>
        </div>

        {/* Right Side - Suppliers Table */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Supplier Statistics</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-2">Supplier Name</Table.Th>
                  <Table.Th className="border-b-2">Country</Table.Th>
                  <Table.Th className="border-b-2">Type</Table.Th>
                  <Table.Th className="border-b-2">Products</Table.Th>
                  <Table.Th className="border-b-2">Orders</Table.Th>
                  <Table.Th className="border-b-2">Total Value</Table.Th>
                  <Table.Th className="border-b-2">Rating</Table.Th>
                  <Table.Th className="border-b-2">Status</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tableData.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border-b">{row.supplierName}</Table.Td>
                    <Table.Td className="border-b">{row.country}</Table.Td>
                    <Table.Td className="border-b">{row.type}</Table.Td>
                    <Table.Td className="border-b">{row.products}</Table.Td>
                    <Table.Td className="border-b">{row.orders}</Table.Td>
                    <Table.Td className="border-b">${row.totalValue.toFixed(2)}</Table.Td>
                    <Table.Td className="border-b">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1">{row.rating}</span>
                      </div>
                    </Table.Td>
                    <Table.Td className="border-b">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {row.status}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuppliersTab;
