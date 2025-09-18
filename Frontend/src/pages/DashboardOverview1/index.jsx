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
import { useGetDashboardDataQuery, useGetFilteredProductsQuery, useGetTopCarsQuery, useGetTopProductsQuery } from "@/stores/apiSlice";

function Main() {
  const { t } = useTranslation();
  
  // State for filters
  const [filters, setFilters] = useState({
    metric: 'all',
    country: 'all',
    customer: 'all',
    description: 'all',
    columns: ['country', 'customer', 'brand', 'brand_code', 'description', 'category', 'min_qty', 'price']
  });

  // API queries
  const { data: dashboardData, isLoading: dashboardLoading } = useGetDashboardDataQuery();
  const { data: filteredProducts, isLoading: productsLoading } = useGetFilteredProductsQuery(filters);
  const { data: topCars, isLoading: carsLoading } = useGetTopCarsQuery();
  const { data: topProducts, isLoading: topProductsLoading } = useGetTopProductsQuery();

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleColumnToggle = (column) => {
    setFilters(prev => ({
      ...prev,
      columns: prev.columns.includes(column)
        ? prev.columns.filter(c => c !== column)
        : [...prev.columns, column]
    }));
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Notifications Card */}
          <div className="p-5 box box--stacked border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">{t('notifications')}</h3>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Lucide icon="Eye" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3">
              {dashboardLoading ? (
                <div className="text-center py-4">Loading notifications...</div>
              ) : dashboardData?.notifications?.length > 0 ? (
                dashboardData.notifications.map((notification, index) => (
                  <div key={notification.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">{notification.data?.message || 'Notification'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No notifications</div>
              )}
            </div>
          </div>

          {/* Product List Tablet Card */}
          <div className="p-5 box box--stacked border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">{t('product_list_tablet')}</h3>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Lucide icon="Eye" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('metric')}</label>
                <FormSelect
                  value={filters.metric}
                  onChange={(e) => handleFilterChange('metric', e.target.value)}
                >
                  <option value="all">{t('all')}</option>
                  <option value="sold">{t('sold')}</option>
                  <option value="not_sold">{t('not_sold')}</option>
                </FormSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('countries')}</label>
                <FormSelect
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="all">{t('all')} (quantity)</option>
                  {filteredProducts?.filter_options?.countries?.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('customers')}</label>
                <FormSelect
                  value={filters.customer}
                  onChange={(e) => handleFilterChange('customer', e.target.value)}
                >
                  <option value="all">{t('all')} (quantity)</option>
                  {filteredProducts?.filter_options?.customers?.map((customer, index) => (
                    <option key={index} value={customer.id}>{customer.name}</option>
                  ))}
                </FormSelect>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                <FormSelect
                  value={filters.description}
                  onChange={(e) => handleFilterChange('description', e.target.value)}
                >
                  <option value="all">{t('all')}</option>
                </FormSelect>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 mb-3">
              {filters.columns.length} {t('columns_selected')}
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    {filters.columns.includes('country') && <th className="border-b-2">{t('country')}</th>}
                    {filters.columns.includes('customer') && <th className="border-b-2">{t('customer')}</th>}
                    {filters.columns.includes('brand') && <th className="border-b-2">{t('brand')}</th>}
                    {filters.columns.includes('brand_code') && <th className="border-b-2">{t('brand_code')}</th>}
                    {filters.columns.includes('description') && <th className="border-b-2">{t('description')}</th>}
                    {filters.columns.includes('category') && <th className="border-b-2">{t('category')}</th>}
                    {filters.columns.includes('min_qty') && <th className="border-b-2">{t('min_qty')}</th>}
                    {filters.columns.includes('price') && <th className="border-b-2">{t('price')}</th>}
                    <th className="border-b-2 text-right">
                      <Button variant="outline" size="sm">{t('excel')}</Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr>
                      <td colSpan={filters.columns.length + 1} className="text-center py-4">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts?.products?.length > 0 ? (
                    filteredProducts.products.map((product, index) => (
                      <tr key={index}>
                        {filters.columns.includes('country') && <td className="border-b">{product.country}</td>}
                        {filters.columns.includes('customer') && <td className="border-b">{product.customer_name}</td>}
                        {filters.columns.includes('brand') && <td className="border-b">{product.brand?.name}</td>}
                        {filters.columns.includes('brand_code') && <td className="border-b">{product.brand_code}</td>}
                        {filters.columns.includes('description') && <td className="border-b">{product.description}</td>}
                        {filters.columns.includes('category') && <td className="border-b">{product.productname?.name}</td>}
                        {filters.columns.includes('min_qty') && <td className="border-b">{product.min_qty}</td>}
                        {filters.columns.includes('price') && <td className="border-b">{product.selling_price}</td>}
                        <td className="border-b"></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={filters.columns.length + 1} className="text-center py-4 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 1000 Cars Card */}
          <div className="p-5 box box--stacked border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">{t('top_1000_cars_catalog')}</h3>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Lucide icon="Eye" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3">
              {carsLoading ? (
                <div className="text-center py-4">Loading cars data...</div>
              ) : topCars?.length > 0 ? (
                topCars.slice(0, 10).map((car, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">{car.car_name}</div>
                    <div className="text-sm font-medium text-blue-600">{car.product_count}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No cars data available</div>
              )}
            </div>
          </div>

          {/* Top 100 Products Card */}
          <div className="p-5 box box--stacked border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">{t('top_100_product_name')}</h3>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Lucide icon="Eye" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-3">
              {topProductsLoading ? (
                <div className="text-center py-4">Loading products data...</div>
              ) : topProducts?.length > 0 ? (
                topProducts.slice(0, 10).map((product, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">{product.name}</div>
                    <div className="text-sm font-medium text-blue-600">{product.product_count}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">No products data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          © 1995 - 2025 Komiparts Auto Spare Parts Co., Ltd.
        </div>
      </div>
    </div>
  );
}

export default Main;
