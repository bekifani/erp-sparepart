
  export const dashboardEndpoints = (builder) => ({
      getGeneralDashboardData: builder.query({
        query: () => `/general_report`,
      }),
      getCustomerReport: builder.query({
        query: ({inactive_period , top_limit}) => `customer_report/${inactive_period}/${top_limit}`,
      }),
      getCustomerDetailReport: builder.query({
        query: ({id}) => `customer_detail_report/${id}`,
      }),
      getExpenseReport: builder.query({
        query: ({start_date , end_date}) => `expense_report/${start_date}/${end_date}`,
      }),
      getPaymentReport: builder.query({
        query: ({start_date , end_date}) => `Payment_report/${start_date}/${end_date}`,
      }),
      getProfitReport: builder.query({
        query: ({start_date = null , end_date = null}) => `profit_report/${start_date}/${end_date}`,
      }), 
      getSupplierReport: builder.query({
        query: ({start_date = null , end_date = null}) => `supplier_report?start_date=${start_date}&end_date=${end_date}`,
      }),
      getWarehouseReport: builder.query({
        query: () => `warehouse_report`,
      }),   
      getShopReport: builder.query({
        query: ({start_date = null , end_date = null}) => `shop_report?start_date=${start_date}&end_date=${end_date}`,
      }),  
      getSalesReport: builder.query({
        query: ({start_date = null , end_date = null}) => `sales_report?start_date=${start_date}&end_date=${end_date}`,
      }), 
      getProdcutReport: builder.query({
        query: () => `product_report`,
      }),   
  });