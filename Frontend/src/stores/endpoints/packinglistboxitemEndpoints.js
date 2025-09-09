
  export const packinglistboxitemEndpoints = (builder) => ({
      createPackinglistboxitem: builder.mutation({
          query: (data) => ({
              url: `packinglistboxitem`,
              method: "POST",
              body: data,
          }),
      }),
      editPackinglistboxitem: builder.mutation({
          query: (data) => ({
              url: `packinglistboxitem/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPackinglistboxitems: builder.query({
        query: () => `packinglistboxitem`,
      }),
      getPackinglistboxitemDetail: builder.query({
          query: (id) => `packinglistboxitem/${id}`,
      }),
      deletePackinglistboxitem: builder.mutation({
          query: (id) => ({
              url: `packinglistboxitem/${id}`,
              method: "DELETE",
          }),
      }),
  });