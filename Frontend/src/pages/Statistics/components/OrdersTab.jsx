import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Chart from "react-apexcharts";

function OrdersTab() {
  const { t } = useTranslation();
  
  // Dummy data for filters
  const [orderStatus, setOrderStatus] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Dummy data for donut chart
  const donutChartData = {
    series: [44, 55, 13, 43, 22],
    options: {
      chart: {
        type: 'donut',
        height: 300,
      },
      labels: ['Completed', 'Processing', 'Pending', 'Cancelled', 'Shipped'],
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
      legend: {
        position: 'bottom',
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%"
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  // Dummy data for table
  const tableData = [
    {
      orderId: "ORD-001",
      customerName: "AKIF Auto Parts",
      orderDate: "2024-01-15",
      status: "Completed",
      totalAmount: 2500.00,
      items: 5,
      paymentStatus: "Paid",
    },
    {
      orderId: "ORD-002",
      customerName: "Euro Motors",
      orderDate: "2024-01-14",
      status: "Processing",
      totalAmount: 1800.00,
      items: 3,
      paymentStatus: "Pending",
    },
    {
      orderId: "ORD-003",
      customerName: "Asia Parts Co.",
      orderDate: "2024-01-13",
      status: "Shipped",
      totalAmount: 3200.00,
      items: 8,
      paymentStatus: "Paid",
    },
    {
      orderId: "ORD-004",
      customerName: "Global Auto",
      orderDate: "2024-01-12",
      status: "Pending",
      totalAmount: 950.00,
      items: 2,
      paymentStatus: "Pending",
    },
    {
      orderId: "ORD-005",
      customerName: "Premium Motors",
      orderDate: "2024-01-11",
      status: "Completed",
      totalAmount: 4200.00,
      items: 12,
      paymentStatus: "Paid",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Status
          </label>
          <FormSelect
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="shipped">Shipped</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer
          </label>
          <FormSelect
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          >
            <option value="all">All Customers</option>
            <option value="akif">AKIF Auto Parts</option>
            <option value="euro">Euro Motors</option>
            <option value="asia">Asia Parts Co.</option>
            <option value="global">Global Auto</option>
            <option value="premium">Premium Motors</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <FormSelect
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </FormSelect>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Orders Overview
          </h3>
          <div className="h-80">
            <Chart
              options={donutChartData.options}
              series={donutChartData.series}
              type="donut"
              height={300}
            />
          </div>
        </div>

        {/* Right Side - Orders Table */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Orders Statistics</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Print
              </Button>
              <Button variant="outline" size="sm">
                PDF
              </Button>
              <Button variant="outline" size="sm">
                Excel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-2">Order ID</Table.Th>
                  <Table.Th className="border-b-2">Customer</Table.Th>
                  <Table.Th className="border-b-2">Order Date</Table.Th>
                  <Table.Th className="border-b-2">Status</Table.Th>
                  <Table.Th className="border-b-2">Total Amount</Table.Th>
                  <Table.Th className="border-b-2">Items</Table.Th>
                  <Table.Th className="border-b-2">Payment</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tableData.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border-b font-medium">{row.orderId}</Table.Td>
                    <Table.Td className="border-b">{row.customerName}</Table.Td>
                    <Table.Td className="border-b">{row.orderDate}</Table.Td>
                    <Table.Td className="border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </Table.Td>
                    <Table.Td className="border-b">${row.totalAmount.toFixed(2)}</Table.Td>
                    <Table.Td className="border-b">{row.items}</Table.Td>
                    <Table.Td className="border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(row.paymentStatus)}`}>
                        {row.paymentStatus}
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

export default OrdersTab;
