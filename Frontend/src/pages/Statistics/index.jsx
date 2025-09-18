import { useState } from "react";
import { useTranslation } from "react-i18next";
import Lucide from "@/components/Base/Lucide";
import Button from "@/components/Base/Button";
import { FormSelect } from "@/components/Base/Form";
import clsx from "clsx";

// Import tab components
import BasketTab from "./components/BasketTab";
import ProductsTab from "./components/ProductsTab";
import CustomersTab from "./components/CustomersTab";
import SuppliersTab from "./components/SuppliersTab";
import OrdersTab from "./components/OrdersTab";
import CashierTab from "./components/CashierTab";

function Statistics() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("basket");

  const tabs = [
    { id: "basket", label: "Basket", icon: "ShoppingBasket" },
    { id: "products", label: "Products", icon: "Package" },
    { id: "customers", label: "Customers", icon: "Users" },
    { id: "suppliers", label: "Suppliers", icon: "Truck" },
    { id: "orders", label: "Orders", icon: "ClipboardList" },
    { id: "cashier", label: "Cashier", icon: "CreditCard" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "basket":
        return <BasketTab />;
      case "products":
        return <ProductsTab />;
      case "customers":
        return <CustomersTab />;
      case "suppliers":
        return <SuppliersTab />;
      case "orders":
        return <OrdersTab />;
      case "cashier":
        return <CashierTab />;
      default:
        return <BasketTab />;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Header */}
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div className="text-base font-medium group-[.mode--light]:text-white">
            {t('Statistics')}
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mt-5">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx([
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                ])}
              >
                <Lucide icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          © 1995 - 2025 Komiparts Auto Spare Parts Co., Ltd.
        </div>
      </div>
    </div>
  );
}

export default Statistics;
