
  export const addressbookEndpoints = (builder) => ({
      createAddressbook: builder.mutation({
          query: (data) => ({
              url: `addressbook`,
              method: "POST",
              body: data,
          }),
      }),
      editAddressbook: builder.mutation({
          query: (data) => ({
              url: `addressbook/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getAddressbooks: builder.query({
        query: () => `addressbook`,
      }),
      getAddressbookDetail: builder.query({
          query: (id) => `addressbook/${id}`,
      }),
      deleteAddressbook: builder.mutation({
          query: (id) => ({
              url: `addressbook/${id}`,
              method: "DELETE",
          }),
      }),
  });