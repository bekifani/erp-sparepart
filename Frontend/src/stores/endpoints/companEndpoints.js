
  export const companEndpoints = (builder) => ({
      createCompan: builder.mutation({
          query: (data) => ({
              url: `compan`,
              method: "POST",
              body: data,
          }),
      }),
      editCompan: builder.mutation({
          query: (data) => ({
              url: `compan/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCompans: builder.query({
        query: () => `compan`,
      }),
      getCompanDetail: builder.query({
          query: (id) => `compan/${id}`,
      }),
      deleteCompan: builder.mutation({
          query: (id) => ({
              url: `compan/${id}`,
              method: "DELETE",
          }),
      }),
      getMyCompany: builder.query({
        query: () => `my_company`,
        }),
  });