
  export const paymentnoteEndpoints = (builder) => ({
      createPaymentnote: builder.mutation({
          query: (data) => ({
              url: `paymentnote`,
              method: "POST",
              body: data,
          }),
      }),
      editPaymentnote: builder.mutation({
          query: (data) => ({
              url: `paymentnote/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPaymentnotes: builder.query({
        query: () => `paymentnote`,
      }),
      getPaymentnoteDetail: builder.query({
          query: (id) => `paymentnote/${id}`,
      }),
      deletePaymentnote: builder.mutation({
          query: (id) => ({
              url: `paymentnote/${id}`,
              method: "DELETE",
          }),
      }),
  });