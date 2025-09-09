
  export const basketitemEndpoints = (builder) => ({
      createBasketitem: builder.mutation({
          query: (data) => ({
              url: `basketitem`,
              method: "POST",
              body: data,
          }),
      }),
      editBasketitem: builder.mutation({
          query: (data) => ({
              url: `basketitem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getBasketitems: builder.query({
        query: () => `basketitem`,
      }),
      getBasketitemDetail: builder.query({
          query: (id) => `basketitem/${id}`,
      }),
      deleteBasketitem: builder.mutation({
          query: (id) => ({
              url: `basketitem/${id}`,
              method: "DELETE",
          }),
      }),
  });