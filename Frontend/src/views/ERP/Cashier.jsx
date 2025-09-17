import React, { useState } from "react";
import { Tab } from "@/components/Base/Headless";
import { useTranslation } from "react-i18next";
import Customeraccount from "./Customeraccount";
import Supplieraccount from "./Supplieraccount";
import Companyaccount from "./Companyaccount";
import Warehouseaccount from "./Warehouseaccount";
import Accounttype from "./Accounttype";
import Paymentnote from "./Paymentnote";
import Transactions from "./Transactions";

function Cashier() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      title: "Customer Account",
      component: <Customeraccount />
    },
    {
      id: 1,
      title: "Supplier Account", 
      component: <Supplieraccount />
    },
    {
      id: 2,
      title: "Company Account",
      component: <Companyaccount />
    },
    {
      id: 3,
      title: "Warehouse Account",
      component: <Warehouseaccount />
    },
    {
      id: 4,
      title: "Transactions",
      component: <Transactions />
    },
    {
      id: 5,
      title: "Account type",
      component: <Accounttype />
    },
    {
      id: 6,
      title: "Payment note",
      component: <Paymentnote />
    }
  ];

  return (
    <div className="cashier-container">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h2 className="text-lg font-medium mr-auto">
          {t("Cashier / Account type")}
        </h2>
      </div>

      {/* Tab Navigation */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="nav nav-boxed-tabs mb-6">
          {tabs.map((tab) => (
            <Tab key={tab.id} className="nav-item">
              <Tab.Button className="nav-link">
                {t(tab.title)}
              </Tab.Button>
            </Tab>
          ))}
        </Tab.List>

        {/* Tab Content */}
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id}>
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default Cashier;
