
  export const basketfileEndpoints = (builder) => ({
      createBasketfile: builder.mutation({
          query: (data) => ({
              url: `basketfile`,
              method: "POST",
              body: data,
          }),
      }),
      editBasketfile: builder.mutation({
          query: (data) => ({
              url: `basketfile/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getBasketfiles: builder.query({
        query: () => `basketfile`,
      }),
      getBasketfileDetail: builder.query({
          query: (id) => `basketfile/${id}`,
      }),
      deleteBasketfile: builder.mutation({
          query: (id) => ({
              url: `basketfile/${id}`,
              method: "DELETE",
          }),
      }),
  });