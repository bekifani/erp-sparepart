import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";
import Chart from "react-apexcharts";

function CashierTab() {
  const { t } = useTranslation();
  
  // Dummy data for filters
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [transactionType, setTransactionType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  // Dummy data for mixed chart (line + column)
  const mixedChartData = {
    series: [{
      name: 'Revenue',
      type: 'column',
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45]
    }, {
      name: 'Transactions',
      type: 'line',
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51]
    }],
    options: {
      chart: {
        height: 300,
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      xaxis: {
        type: 'category'
      },
      yaxis: [{
        title: {
          text: 'Revenue ($)',
        },
      }, {
        opposite: true,
        title: {
          text: 'Number of Transactions'
        }
      }],
      colors: ['#3B82F6', '#10B981'],
      legend: {
        position: 'top',
      },
    }
  };

  // Dummy data for table
  const tableData = [
    {
      transactionId: "TXN-001",
      customerName: "AKIF Auto Parts",
      paymentMethod: "Credit Card",
      amount: 2500.00,
      transactionDate: "2024-01-15",
      status: "Completed",
      reference: "ORD-001",
      fees: 75.00,
    },
    {
      transactionId: "TXN-002",
      customerName: "Euro Motors",
      paymentMethod: "Bank Transfer",
      amount: 1800.00,
      transactionDate: "2024-01-14",
      status: "Completed",
      reference: "ORD-002",
      fees: 0.00,
    },
    {
      transactionId: "TXN-003",
      customerName: "Asia Parts Co.",
      paymentMethod: "PayPal",
      amount: 3200.00,
      transactionDate: "2024-01-13",
      status: "Pending",
      reference: "ORD-003",
      fees: 96.00,
    },
    {
      transactionId: "TXN-004",
      customerName: "Global Auto",
      paymentMethod: "Cash",
      amount: 950.00,
      transactionDate: "2024-01-12",
      status: "Completed",
      reference: "ORD-004",
      fees: 0.00,
    },
    {
      transactionId: "TXN-005",
      customerName: "Premium Motors",
      paymentMethod: "Credit Card",
      amount: 4200.00,
      transactionDate: "2024-01-11",
      status: "Completed",
      reference: "ORD-005",
      fees: 126.00,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method) => {
    switch (method) {
      case 'Credit Card':
        return 'bg-blue-100 text-blue-800';
      case 'Bank Transfer':
        return 'bg-green-100 text-green-800';
      case 'PayPal':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cash':
        return 'bg-gray-100 text-gray-800';
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
            Payment Method
          </label>
          <FormSelect
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="credit-card">Credit Card</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
          </FormSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <FormSelect
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="sale">Sale</option>
            <option value="refund">Refund</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">$12,650.00</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">156</div>
          <div className="text-sm text-gray-600">Total Transactions</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">$297.00</div>
          <div className="text-sm text-gray-600">Total Fees</div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">$12,353.00</div>
          <div className="text-sm text-gray-600">Net Revenue</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Chart */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Revenue & Transactions
          </h3>
          <div className="h-80">
            <Chart
              options={mixedChartData.options}
              series={mixedChartData.series}
              type="line"
              height={300}
            />
          </div>
        </div>

        {/* Right Side - Transactions Table */}
        <div className="p-6 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">Recent Transactions</h3>
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
                  <Table.Th className="border-b-2">Transaction ID</Table.Th>
                  <Table.Th className="border-b-2">Customer</Table.Th>
                  <Table.Th className="border-b-2">Method</Table.Th>
                  <Table.Th className="border-b-2">Amount</Table.Th>
                  <Table.Th className="border-b-2">Date</Table.Th>
                  <Table.Th className="border-b-2">Status</Table.Th>
                  <Table.Th className="border-b-2">Fees</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tableData.map((row, index) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border-b font-medium">{row.transactionId}</Table.Td>
                    <Table.Td className="border-b">{row.customerName}</Table.Td>
                    <Table.Td className="border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentMethodColor(row.paymentMethod)}`}>
                        {row.paymentMethod}
                      </span>
                    </Table.Td>
                    <Table.Td className="border-b">${row.amount.toFixed(2)}</Table.Td>
                    <Table.Td className="border-b">{row.transactionDate}</Table.Td>
                    <Table.Td className="border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </Table.Td>
                    <Table.Td className="border-b">${row.fees.toFixed(2)}</Table.Td>
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

export default CashierTab;
