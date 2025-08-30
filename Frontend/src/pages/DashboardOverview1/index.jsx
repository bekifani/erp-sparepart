import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import TinySlider from "@/components/Base/TinySlider";
import { getColor } from "@/utils/colors";
import ReportLineChart from "@/components/ReportLineChart/withProp";
import ReportDonutChart3 from "@/components/ReportDonutChart3/withProps";
import Pagination from "@/components/Base/Pagination";
import { FormSelect } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import eCommerce from "@/fakers/e-commerce";
import transactions from "@/fakers/transactions";
import Button from "@/components/Base/Button";
import Litepicker from "@/components/Base/Litepicker";
import Table from "@/components/Base/Table";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { useGetGeneralDashboardDataQuery, useSendTestNotificationQuery } from "@/stores/apiSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Can from "@/helpers/PermissionChecker";

function Main() {
  const [reportData, setReportData] = useState(null);
  const { data: fetchedData, isLoading: loading } = useGetGeneralDashboardDataQuery();
  const { t } = useTranslation();

  useEffect(() => {
    if (fetchedData) {
      setReportData(fetchedData.data);
    }
  }, [fetchedData]);

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <Can permission={`view-general-dashboard`}>
        <div className="col-span-12">
          <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
            <div className="text-base font-medium group-[.mode--light]:text-white">
              {t('General Report')}
            </div>
          </div>

          {reportData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <div className="p-5 box box--stacked">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 border rounded-full border-primary/10 bg-primary/10">
                      <Lucide icon="Building2" className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium">{reportData.total_compan}</div>
                      <div className="text-slate-500">{t('Total Companies')}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 box box--stacked">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 border rounded-full border-success/10 bg-success/10">
                      <Lucide icon="Users" className="w-6 h-6 text-success" />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium">{reportData.total_contact}</div>
                      <div className="text-slate-500">{t('Total Contacts')}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 box box--stacked">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 border rounded-full border-warning/10 bg-warning/10">
                      <Lucide icon="UserPlus" className="w-6 h-6 text-warning" />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium">{reportData.total_employee}</div>
                      <div className="text-slate-500">{t('Total Employees')}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 box box--stacked">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 border rounded-full border-pending/10 bg-pending/10">
                      <Lucide icon="BookOpen" className="w-6 h-6 text-pending" />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium">{reportData.total_addressbook}</div>
                      <div className="text-slate-500">{t('Total Addressbooks')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                <div className="p-5 box box--stacked">
                  <div className="text-lg font-medium mb-3">{t('Ads by Sector')}</div>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="border-b-2">{t('Sector')}</th>
                          <th className="border-b-2 text-right">{t('Total Ads')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.ads_count_per_sector.map((item, index) => (
                          <tr key={index}>
                            <td className="border-b">{item.name}</td>
                            <td className="border-b text-right">{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-5 box box--stacked">
                  <div className="text-lg font-medium mb-3">{t('Companies by Sector')}</div>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="border-b-2">{t('Sector')}</th>
                          <th className="border-b-2 text-right">{t('Total Companies')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.compnay_count_per_sector.map((item, index) => (
                          <tr key={index}>
                            <td className="border-b">{item.sector_name}</td>
                            <td className="border-b text-right">{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Can>
    </div>
  );
}

export default Main;
