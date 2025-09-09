
  export const packinglistboxEndpoints = (builder) => ({
      createPackinglistbox: builder.mutation({
          query: (data) => ({
              url: `packinglistbox`,
              method: "POST",
              body: data,
          }),
      }),
      editPackinglistbox: builder.mutation({
          query: (data) => ({
              url: `packinglistbox/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getPackinglistboxs: builder.query({
        query: () => `packinglistbox`,
      }),
      getPackinglistboxDetail: builder.query({
          query: (id) => `packinglistbox/${id}`,
      }),
      deletePackinglistbox: builder.mutation({
          query: (id) => ({
              url: `packinglistbox/${id}`,
              method: "DELETE",
          }),
      }),
  });