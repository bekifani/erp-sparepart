
  export const exchangerateEndpoints = (builder) => ({
      createExchangerate: builder.mutation({
          query: (data) => ({
              url: `exchangerate`,
              method: "POST",
              body: data,
          }),
      }),
      editExchangerate: builder.mutation({
          query: (data) => ({
              url: `exchangerate/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getExchangerates: builder.query({
        query: () => `exchangerate`,
      }),
      getExchangerateDetail: builder.query({
          query: (id) => `exchangerate/${id}`,
      }),
      deleteExchangerate: builder.mutation({
          query: (id) => ({
              url: `exchangerate/${id}`,
              method: "DELETE",
          }),
      }),
  });