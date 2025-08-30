
  export const sponsorEndpoints = (builder) => ({
      createSponsor: builder.mutation({
          query: (data) => ({
              url: `sponsor`,
              method: "POST",
              body: data,
          }),
      }),
      editSponsor: builder.mutation({
          query: (data) => ({
              url: `sponsor/${data.id}`,
              method: "PUT",
              body: data,
          }),
      }),
      getSponsors: builder.query({
        query: () => `sponsor`,
      }),
      getSponsorDetail: builder.query({
          query: (id) => `sponsor/${id}`,
      }),
      deleteSponsor: builder.mutation({
          query: (id) => ({
              url: `sponsor/${id}`,
              method: "DELETE",
          }),
      }),
  });