import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormSelect } from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import Table from "@/components/Base/Table";

function CustomersTab() {
  const { t } = useTranslation();
  
  // State for global filters
  const [metric, setMetric] = useState("all");
  const [countries, setCountries] = useState("all");
  const [customers, setCustomers] = useState("all");

  // State for invoice customers filters
  const [invoiceCountries, setInvoiceCountries] = useState("all");
  const [calendar, setCalendar] = useState("date-to-date");
  const [bySupplier, setBySupplier] = useState("all");

  // Dummy data for product list tablet
  const productListData = [
    { brand: "Bosch", brandCode: "BOS001", description: "Brake Pad Set", minQty: 10, price: 150.00 },
    { brand: "Continental", brandCode: "CON002", description: "Air Filter", minQty: 25, price: 45.00 },
    { brand: "Valeo", brandCode: "VAL003", description: "Clutch Kit", minQty: 5, price: 320.00 },
    { brand: "Mann", brandCode: "MAN004", description: "Oil Filter", minQty: 50, price: 12.00 },
    { brand: "Febi", brandCode: "FEB005", description: "Timing Belt", minQty: 8, price: 85.00 },
  ];

  // Dummy data for invoice customers
  const invoiceCustomersData = [
    {
      customer: "AKIF Auto Parts",
      sales: 25000,
      purchase: 18000,
      profit: 7000,
      weight: 1250.5,
      volume: 850.2,
      ctn: 45,
      payment: "Paid",
      balance: 0,
      basket: 12
    },
    {
      customer: "Euro Motors Ltd",
      sales: 18500,
      purchase: 14200,
      profit: 4300,
      weight: 980.3,
      volume: 650.8,
      ctn: 32,
      payment: "Pending",
      balance: 2500,
      basket: 8
    },
    {
      customer: "Asia Parts Co.",
      sales: 32000,
      purchase: 24000,
      profit: 8000,
      weight: 1650.7,
      volume: 1120.5,
      ctn: 58,
      payment: "Paid",
      balance: 0,
      basket: 15
    },
    {
      customer: "Global Auto Supply",
      sales: 15200,
      purchase: 11800,
      profit: 3400,
      weight: 750.2,
      volume: 520.3,
      ctn: 28,
      payment: "Overdue",
      balance: 3200,
      basket: 6
    },
    {
      customer: "Premium Motors",
      sales: 28000,
      purchase: 21000,
      profit: 7000,
      weight: 1420.8,
      volume: 980.7,
      ctn: 52,
      payment: "Paid",
      balance: 0,
      basket: 18
    }
  ];

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Global Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Metric
          </label>
          <FormSelect
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="all">All</option>
            <option value="sold">Sold</option>
            <option value="not-sold">Not Sold</option>
          </FormSelect>
          {metric === "not-sold" && (
            <p className="text-xs text-gray-500 mt-1">
              (On future we will get this information by quotations page)
            </p>
          )}
        </div>

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
            Customers
          </label>
          <FormSelect
            value={customers}
            onChange={(e) => setCustomers(e.target.value)}
          >
            <option value="all">All (+quantity)</option>
            <option value="akif">AKIF Auto Parts</option>
            <option value="euro">Euro Motors Ltd</option>
            <option value="asia">Asia Parts Co.</option>
            <option value="global">Global Auto Supply</option>
          </FormSelect>
        </div>
      </div>

      {/* Product list Tablet Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-800">Product list Tablet</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Print</Button>
            <Button variant="outline" size="sm">PDF</Button>
            <Button variant="outline" size="sm">Excel</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-2 text-left">Brand</Table.Th>
                <Table.Th className="border-b-2 text-left">Brand Code</Table.Th>
                <Table.Th className="border-b-2 text-left">Description</Table.Th>
                <Table.Th className="border-b-2 text-left">Min. Qty</Table.Th>
                <Table.Th className="border-b-2 text-left">Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {productListData.map((product, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="border-b py-3">{product.brand}</Table.Td>
                  <Table.Td className="border-b py-3">{product.brandCode}</Table.Td>
                  <Table.Td className="border-b py-3">{product.description}</Table.Td>
                  <Table.Td className="border-b py-3">{product.minQty}</Table.Td>
                  <Table.Td className="border-b py-3">${product.price.toFixed(2)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Statistic of Invoices Customers Section */}
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-800">Statistic of Invoices Customers</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Print</Button>
            <Button variant="outline" size="sm">PDF</Button>
            <Button variant="outline" size="sm">Excel</Button>
          </div>
        </div>

        {/* Invoice Customers Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Countries
            </label>
            <FormSelect
              value={invoiceCountries}
              onChange={(e) => setInvoiceCountries(e.target.value)}
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
        </div>

        {/* Invoice Customers Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-2 text-left bg-white">Customer</Table.Th>
                <Table.Th className="border-b-2 text-center bg-green-100 text-green-800">Sales</Table.Th>
                <Table.Th className="border-b-2 text-center bg-orange-100 text-orange-800">Purchase</Table.Th>
                <Table.Th className="border-b-2 text-center bg-blue-100 text-blue-800">Profit</Table.Th>
                <Table.Th className="border-b-2 text-center bg-amber-100 text-amber-800">Weight</Table.Th>
                <Table.Th className="border-b-2 text-center bg-orange-50 text-orange-700">Volume</Table.Th>
                <Table.Th className="border-b-2 text-center bg-green-50 text-green-700">Ctn</Table.Th>
                <Table.Th className="border-b-2 text-center bg-yellow-100 text-yellow-800">Payment</Table.Th>
                <Table.Th className="border-b-2 text-center bg-yellow-100 text-yellow-800">Balance</Table.Th>
                <Table.Th className="border-b-2 text-center bg-yellow-100 text-yellow-800">Basket</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {invoiceCustomersData.map((customer, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="border-b py-3 font-medium">{customer.customer}</Table.Td>
                  <Table.Td className="border-b py-3 text-center">${customer.sales.toLocaleString()}</Table.Td>
                  <Table.Td className="border-b py-3 text-center">${customer.purchase.toLocaleString()}</Table.Td>
                  <Table.Td className="border-b py-3 text-center">${customer.profit.toLocaleString()}</Table.Td>
                  <Table.Td className="border-b py-3 text-center">{customer.weight} kg</Table.Td>
                  <Table.Td className="border-b py-3 text-center">{customer.volume} m³</Table.Td>
                  <Table.Td className="border-b py-3 text-center">{customer.ctn}</Table.Td>
                  <Table.Td className="border-b py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(customer.payment)}`}>
                      {customer.payment}
                    </span>
                  </Table.Td>
                  <Table.Td className="border-b py-3 text-center">
                    {customer.balance > 0 ? `$${customer.balance.toLocaleString()}` : '-'}
                  </Table.Td>
                  <Table.Td className="border-b py-3 text-center">{customer.basket}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="text-center text-sm text-gray-500 mt-8">
        © 1995 - 2025 Komiparts Auto Spare Parts Co., Ltd.
      </div>
    </div>
  );
}

export default CustomersTab;