
  export const addresstypeEndpoints = (builder) => ({
      createAddresstype: builder.mutation({
          query: (data) => ({
              url: `addresstype`,
              method: "POST",
              body: data,
          }),
      }),
      editAddresstype: builder.mutation({
          query: (data) => ({
              url: `addresstype/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getAddresstypes: builder.query({
        query: () => `addresstype`,
      }),
      getAddresstypeDetail: builder.query({
          query: (id) => `addresstype/${id}`,
      }),
      deleteAddresstype: builder.mutation({
          query: (id) => ({
              url: `addresstype/${id}`,
              method: "DELETE",
          }),
      }),
  });