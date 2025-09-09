
  export const attachmentEndpoints = (builder) => ({
      createAttachment: builder.mutation({
          query: (data) => ({
              url: `attachment`,
              method: "POST",
              body: data,
          }),
      }),
      editAttachment: builder.mutation({
          query: (data) => ({
              url: `attachment/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getAttachments: builder.query({
        query: () => `attachment`,
      }),
      getAttachmentDetail: builder.query({
          query: (id) => `attachment/${id}`,
      }),
      deleteAttachment: builder.mutation({
          query: (id) => ({
              url: `attachment/${id}`,
              method: "DELETE",
          }),
      }),
  });