
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

      // New Dashboard Endpoints
      getDashboardData: builder.query({
        query: () => `/dashboard/data`,
      }),
      getNotifications: builder.query({
        query: ({ limit = 20, unread_only = false } = {}) => 
          `/dashboard/notifications?limit=${limit}&unread_only=${unread_only}`,
      }),
      markNotificationsAsRead: builder.mutation({
        query: (notificationIds = []) => ({
          url: `/dashboard/notifications/mark-read`,
          method: 'POST',
          body: { notification_ids: notificationIds },
        }),
      }),
      getFilteredProducts: builder.query({
        query: (filters = {}) => {
          const params = new URLSearchParams();
          Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
              if (Array.isArray(filters[key])) {
                params.append(key, filters[key].join(','));
              } else {
                params.append(key, filters[key]);
              }
            }
          });
          return `/dashboard/products/filtered?${params.toString()}`;
        },
      }),
      getTopCars: builder.query({
        query: ({ limit = 1000 } = {}) => `/dashboard/top-cars?limit=${limit}`,
      }),
      getTopProducts: builder.query({
        query: ({ limit = 100 } = {}) => `/dashboard/top-products?limit=${limit}`,
      }),
  });