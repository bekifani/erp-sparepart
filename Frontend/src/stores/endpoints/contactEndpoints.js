
  export const contactEndpoints = (builder) => ({
      createContact: builder.mutation({
          query: (data) => ({
              url: `contact`,
              method: "POST",
              body: data,
          }),
      }),
      editContact: builder.mutation({
          query: (data) => ({
              url: `contact/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getContacts: builder.query({
        query: () => `contact`,
      }),
      getContactDetail: builder.query({
          query: (id) => `contact/${id}`,
      }),
      deleteContact: builder.mutation({
          query: (id) => ({
              url: `contact/${id}`,
              method: "DELETE",
          }),
      }),
  });