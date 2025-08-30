
  export const adEndpoints = (builder) => ({
      createAd: builder.mutation({
          query: (data) => ({
              url: `ad`,
              method: "POST",
              body: data,
          }),
      }),
      editAd: builder.mutation({
          query: (data) => ({
              url: `ad/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getAds: builder.query({
        query: () => `ad`,
      }),
      getAdDetail: builder.query({
          query: (id) => `ad/${id}`,
      }),
      deleteAd: builder.mutation({
          query: (id) => ({
              url: `ad/${id}`,
              method: "DELETE",
          }),
      }),
      updateCompanyAds: builder.mutation({
        query: ({ companyId, ads }) => ({
            url: `/company/${companyId}/update-ads`,
            method: 'POST',
            body: { ads }
          }),
      })
  });