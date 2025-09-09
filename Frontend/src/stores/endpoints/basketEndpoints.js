
  export const basketEndpoints = (builder) => ({
      createBasket: builder.mutation({
          query: (data) => ({
              url: `basket`,
              method: "POST",
              body: data,
          }),
      }),
      editBasket: builder.mutation({
          query: (data) => ({
              url: `basket/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getBaskets: builder.query({
        query: () => `basket`,
      }),
      getBasketDetail: builder.query({
          query: (id) => `basket/${id}`,
      }),
      deleteBasket: builder.mutation({
          query: (id) => ({
              url: `basket/${id}`,
              method: "DELETE",
          }),
      }),
  });