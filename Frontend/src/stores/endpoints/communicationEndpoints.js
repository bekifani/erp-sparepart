
  export const communicationEndpoints = (builder) => ({
      createCommunication: builder.mutation({
          query: (data) => ({
              url: `communication`,
              method: "POST",
              body: data,
          }),
      }),
      editCommunication: builder.mutation({
          query: (data) => ({
              url: `communication/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getCommunications: builder.query({
        query: () => `communication`,
      }),
      sendTestNotification: builder.query({
        query: () => `send_test_notification`,
      }),
      getCommunicationDetail: builder.query({
          query: (id) => `communication/${id}`,
      }),
      deleteCommunication: builder.mutation({
          query: (id) => ({
              url: `communication/${id}`,
              method: "DELETE",
          }),
      }),
      getNotifications: builder.query({
        query: () => `notifications`
      }),
      markAsRead: builder.query({
        query: () => `notifications/mark-as-read`
      }),
      communicateUsers: builder.mutation({
        query: (data) => ({
            url: `send_message`,
            method: "POST",
            body: data,
        }),
      }),
  });