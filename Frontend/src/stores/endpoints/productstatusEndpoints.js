export const productstatusEndpoints = (builder) => ({
    // Main Product Status Endpoints
    createProductstatus: builder.mutation({
        query: (data) => ({
            url: `productstatus`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: ['ProductStatus'],
    }),
    editProductstatus: builder.mutation({
        query: (data) => ({
            url: `productstatus/${data.id}`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ['ProductStatus'],
    }),
    getProductstatuss: builder.query({
        query: (params = {}) => {
            const queryParams = new URLSearchParams();
            if (params.type) queryParams.append('type', params.type);
            if (params.search) queryParams.append('search', params.search);
            return `productstatus?${queryParams.toString()}`;
        },
        providesTags: ['ProductStatus'],
    }),
    getProductstatusDetail: builder.query({
        query: (id) => `productstatus/${id}`,
        providesTags: (result, error, id) => [{ type: 'ProductStatus', id }],
    }),
    deleteProductstatus: builder.mutation({
        query: (id) => ({
            url: `productstatus/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ['ProductStatus'],
    }),

    // Sub-Status Endpoints
    getSubStatuses: builder.query({
        query: (parentId) => `productstatus/${parentId}/sub-statuses`,
        providesTags: (result, error, parentId) => [
            { type: 'SubStatus', parentId },
            'SubStatus'
        ],
    }),
    createSubStatus: builder.mutation({
        query: (data) => ({
            url: `productstatus`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: ['SubStatus', 'ProductStatus'],
    }),
    updateSubStatus: builder.mutation({
        query: (data) => ({
            url: `sub-status/${data.id}`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags: ['SubStatus', 'ProductStatus'],
    }),
    deleteSubStatus: builder.mutation({
        query: (id) => ({
            url: `sub-status/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ['SubStatus', 'ProductStatus'],
    }),

    // Workflow Endpoints
    getStatusWorkflow: builder.query({
        query: (statusId) => `productstatus/${statusId}/workflow`,
        providesTags: (result, error, statusId) => [
            { type: 'StatusWorkflow', statusId }
        ],
    }),

    // Core Status Endpoints (for system management)
    getCoreStatuses: builder.query({
        query: () => `productstatus?type=core`,
        providesTags: ['CoreStatus'],
    }),
    getCustomStatuses: builder.query({
        query: () => `productstatus?type=custom`,
        providesTags: ['CustomStatus'],
    }),

    // Legacy compatibility endpoints
    getAllProductstatuss: builder.query({
        query: () => `all_productstatuss`,
        providesTags: ['ProductStatus'],
    }),
});