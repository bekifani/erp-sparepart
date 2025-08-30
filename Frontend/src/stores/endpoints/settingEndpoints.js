
  export const settingEndpoints = (builder) => ({
      createSetting: builder.mutation({
          query: (data) => ({
              url: `setting`,
              method: "POST",
              body: data,
          }),
      }),
      editSetting: builder.mutation({
          query: (data) => ({
              url: `setting/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSettings: builder.query({
        query: () => `setting`,
      }),
      getSettingDetail: builder.query({
          query: (id) => `setting/${id}`,
      }),
      deleteSetting: builder.mutation({
          query: (id) => ({
              url: `setting/${id}`,
              method: "DELETE",
          }),
      }),
  });