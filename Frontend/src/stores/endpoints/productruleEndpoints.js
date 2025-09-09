export const productruleEndpoints = (builder) => ({
  createProductrule: builder.mutation({
    query: (data) => {
      console.log('Sending to API:', JSON.stringify(data, null, 2));
      return {
        url: `productrule`,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };
    },
    transformResponse: (response, meta, arg) => {
      try {
        return response;
      } catch (e) {
        console.error('Error parsing response:', e);
        return response;
      }
    },
    transformErrorResponse: (response, meta, arg) => {
      console.error('API Error:', response);
      return response;
    },
  }),
  editProductrule: builder.mutation({
    query: (data) => ({
      url: `productrule/${data.id}`,
      method: "PUT",
      body: data,
    }),
  }),
  getProductrules: builder.query({
    query: () => `productrule`,
  }),
  getProductruleDetail: builder.query({
    query: (id) => `productrule/${id}`,
  }),
  deleteProductrule: builder.mutation({
    query: (id) => ({
      url: `productrule/${id}`,
      method: "DELETE",
    }),
  }),
  // New: fetch rules for a specific product using filter params
  getProductrulesByProduct: builder.query({
    query: (productId) => {
      const params = new URLSearchParams();
      params.set('filter[0][field]', 'product_id');
      params.set('filter[0][type]', '=');
      params.set('filter[0][value]', productId);
      params.set('size', '100');
      return `productrule?${params.toString()}`;
    },
  }),
});