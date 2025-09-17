export const catalogEndpoints = (builder) => ({
  getCatalogProducts: builder.query({
    query: ({ page = 1, size = 8, search = '', category = '', carModel = '', crossCode = '' }) => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      // Add filters if they exist
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (carModel) params.set('car_model', carModel);
      if (crossCode) params.set('cross_code', crossCode);

      return `catalog/products?${params}`;
    },
    providesTags: ['CatalogProducts'],
  }),

  getProductDetails: builder.query({
    query: (productId) => ({
      url: `catalog/product/${productId}`,
      method: 'GET',
    }),
    providesTags: (result, error, productId) => [{ type: 'ProductDetails', id: productId }],
  }),

  getProductSpecifications: builder.query({
    query: (productId) => ({
      url: `catalog/product/${productId}/specifications`,
      method: 'GET',
    }),
    providesTags: (result, error, productId) => [{ type: 'ProductSpecifications', id: productId }],
  }),

  getProductCrossCars: builder.query({
    query: (productId) => ({
      url: `catalog/product/${productId}/cross-cars`,
      method: 'GET',
    }),
    providesTags: (result, error, productId) => [{ type: 'ProductCrossCars', id: productId }],
  }),

  getProductCrossCodes: builder.query({
    query: (productId) => ({
      url: `catalog/product/${productId}/cross-codes`,
      method: 'GET',
    }),
    providesTags: (result, error, productId) => [{ type: 'ProductCrossCodes', id: productId }],
  }),

  exportCatalogPdf: builder.mutation({
    query: (filters = {}) => {
      const params = new URLSearchParams();
      
      // Add current filters to PDF export
      if (filters.search) params.set('search', filters.search);
      if (filters.category) params.set('category', filters.category);
      if (filters.car_model) params.set('car_model', filters.car_model);
      if (filters.cross_code) params.set('cross_code', filters.cross_code);
      
      return {
        url: `catalog/export-pdf?${params}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      };
    },
  }),
});
