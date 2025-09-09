
  export const searchresultEndpoints = (builder) => ({
      createSearchresult: builder.mutation({
          query: (data) => ({
              url: `searchresult`,
              method: "POST",
              body: data,
          }),
      }),
      editSearchresult: builder.mutation({
          query: (data) => ({
              url: `searchresult/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSearchresults: builder.query({
        query: () => `searchresult`,
      }),
      getSearchresultDetail: builder.query({
          query: (id) => `searchresult/${id}`,
      }),
      deleteSearchresult: builder.mutation({
          query: (id) => ({
              url: `searchresult/${id}`,
              method: "DELETE",
          }),
      }),
  });