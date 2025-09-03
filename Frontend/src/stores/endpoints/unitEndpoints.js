
export const unitEndpoints = (builder) => ({
  createUnit: builder.mutation({
    query: (data) => ({
      url: "unit",
      method: "POST",
      body: data,
    }),
  }),
  editUnit: builder.mutation({
    query: (data) => ({
      url: `unit/${data.id}`,
      method: "PUT",
      body: data,
    }),
  }),
  getUnits: builder.query({
    query: () => `unit`,
  }),
  getUnitDetail: builder.query({
    query: (id) => `unit/${id}`,
  }),
  searchUnit: builder.query({
    query: (searchTerm) => ({
      url: `/search_unit/${searchTerm}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
        "X-Tenant-ID": getState().auth.user.tenant_id,
      },
    }),
  }),
});

export const {
  useCreateUnitMutation,
  useEditUnitMutation,
  useGetUnitsQuery,
  useGetUnitDetailQuery,
  useSearchUnitQuery,
} = unitEndpoints;