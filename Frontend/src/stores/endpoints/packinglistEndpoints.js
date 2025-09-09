
  export const packinglistEndpoints = (builder) => ({
      createPackinglist: builder.mutation({
          query: (data) => ({
              url: `packinglist`,
              method: "POST",
              body: data,
          }),
      }),
      editPackinglist: builder.mutation({
          query: (data) => ({
              url: `packinglist/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPackinglists: builder.query({
        query: () => `packinglist`,
      }),
      getPackinglistDetail: builder.query({
          query: (id) => `packinglist/${id}`,
      }),
      deletePackinglist: builder.mutation({
          query: (id) => ({
              url: `packinglist/${id}`,
              method: "DELETE",
          }),
      }),
  });