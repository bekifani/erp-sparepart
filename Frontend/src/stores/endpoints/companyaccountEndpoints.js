
  export const companyaccountEndpoints = (builder) => ({
      createCompanyaccount: builder.mutation({
          query: (data) => ({
              url: `companyaccount`,
              method: "POST",
              body: data,
          }),
      }),
      editCompanyaccount: builder.mutation({
          query: (data) => ({
              url: `companyaccount/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCompanyaccounts: builder.query({
        query: () => `companyaccount`,
      }),
      getCompanyaccountDetail: builder.query({
          query: (id) => `companyaccount/${id}`,
      }),
      deleteCompanyaccount: builder.mutation({
          query: (id) => ({
              url: `companyaccount/${id}`,
              method: "DELETE",
          }),
      }),
  });