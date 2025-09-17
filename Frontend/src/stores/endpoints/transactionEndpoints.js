export const transactionEndpoints = (builder) => ({
  getAllTransactions: builder.query({
    query: (params) => {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page);
      if (params?.size) queryParams.append('size', params.size);
      if (params?.sort) queryParams.append('sort', JSON.stringify(params.sort));
      if (params?.filter) queryParams.append('filter', JSON.stringify(params.filter));
      
      return {
        url: `transactions?${queryParams.toString()}`,
        method: 'GET',
      };
    },
    providesTags: ['Transaction'],
  }),
  
  getTransactionStatistics: builder.query({
    query: () => ({
      url: 'transactions/statistics',
      method: 'GET',
    }),
    providesTags: ['TransactionStats'],
  }),
});
