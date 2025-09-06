import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authenticationEndpoints } from './endpoints/authenticationEndpoints.js'
import { employeeEndpoints } from "./endpoints/employeeEndpoints"
import { communicationEndpoints } from "./endpoints/communicationEndpoints"
import { userEndpoints } from "./endpoints/userEndpoints"
import { roleEndpoints } from "./endpoints/roleEndpoints.js"
import { dashboardEndpoints } from "./endpoints/dashboardEndpoints.js";
import { publicEndpoints } from "./endpoints/PublicEndpoints"
import { RootState } from './store';
import { customerEndpoints } from "./endpoints/customerEndpoints"
import { supplierEndpoints } from "./endpoints/supplierEndpoints"
import { categorEndpoints } from "./endpoints/categorEndpoints"
import { productnameEndpoints } from "./endpoints/productnameEndpoints"
import { carmodelEndpoints } from "./endpoints/carmodelEndpoints"
import { brandnameEndpoints } from "./endpoints/brandnameEndpoints"
import { specificationheadnameEndpoints } from "./endpoints/specificationheadnameEndpoints"
import { boxeEndpoints } from "./endpoints/boxeEndpoints"
import { labelEndpoints } from "./endpoints/labelEndpoints"
import { unitEndpoints } from "./endpoints/unitEndpoints"
import { productinformationEndpoints } from "./endpoints/productinformationEndpoints"
import { productEndpoints } from "./endpoints/productEndpoints"
import { productimageEndpoints } from "./endpoints/productimageEndpoints"
import { crosscodeEndpoints } from "./endpoints/crosscodeEndpoints"
import { crosscarEndpoints } from "./endpoints/crosscarEndpoints"
import { productspecificationEndpoints } from "./endpoints/productspecificationEndpoints"
import { exchangerateEndpoints } from "./endpoints/exchangerateEndpoints"
import { companEndpoints } from "./endpoints/companEndpoints"
//import here
export const apiSlice = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
      baseUrl: "http://localhost:8000/api/",
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const csrf_token = state.auth.csrf_token;
        headers.set("X-Tenant", state.auth.tenant);
        headers.set("X-CSRF-TOKEN", csrf_token);
        headers.set("Accept-Language", state.auth.lang);
        if(state.auth.isAuthenticated){
          const token = state.auth.token;
          headers.set("Authorization", `Bearer ${token}`);
          return headers;
        }
        return headers;
      },
    }),
    endpoints: (builder) => ({
        ...authenticationEndpoints(builder),   
        ...employeeEndpoints(builder),
        ...userEndpoints(builder),
        ...roleEndpoints(builder),
        ...dashboardEndpoints(builder),
        ...communicationEndpoints(builder),
        ...publicEndpoints(builder),
...customerEndpoints(builder),
...supplierEndpoints(builder),
...categorEndpoints(builder),
...productnameEndpoints(builder),
...carmodelEndpoints(builder),
...brandnameEndpoints(builder),
...specificationheadnameEndpoints(builder),
...boxeEndpoints(builder),
...labelEndpoints(builder),
...unitEndpoints(builder),
...productinformationEndpoints(builder),
...productEndpoints(builder),
...productimageEndpoints(builder),
...crosscodeEndpoints(builder),
...crosscarEndpoints(builder),
...productspecificationEndpoints(builder),
...exchangerateEndpoints(builder),
...companEndpoints(builder),
        //disperse here
    }),
});


export const {
    //Authentication Section
    useLoginUserMutation,
    useSignUpUserMutation,
    useLogoutUserMutation,
    useGetAuthenticatedUserQuery,
    useGetPasswordResetPinMutation,
    useGetResendPasswordResetPinMutation,
    useResetPasswordMutation,
    useGetCsrfTokenQuery,
    useChangePasswordMutation,
    
    useCreateEmployeeMutation,
    useEditEmployeeMutation,
    useGetEmployeeDetailQuery,
    useLazyGetEmployeeDetailQuery,
    useDeleteEmployeeMutation,
    useGetEmployeesQuery,
    useTerminateEmployeeMutation,
    useActivateEmployeeAccountMutation,
    
    useCreateUserMutation,
    useEditUserMutation,
    useGetUserDetailQuery,
    useLazyGetUserDetailQuery,
    useDeleteUserMutation,
    useGetUsersQuery,
    useResetUserPasswordMutation,

    useCreateRoleMutation,
    useEditRoleMutation,
    useGetRoleDetailQuery,
    useLazyGetRoleDetailQuery,
    useDeleteRoleMutation,
    useGetRolesQuery,

    useGetGeneralDashboardDataQuery,
    useGetCustomerReportQuery,
    useGetCustomerDetailReportQuery,
    useGetExpenseReportQuery,
    useGetPaymentReportQuery,
    useGetProfitReportQuery,
    useGetSupplierReportQuery, 
    useGetWarehouseReportQuery,
    useGetShopReportQuery,
    useGetSalesReportQuery,
    useSendTestNotificationQuery,

    
    useGetNotificationsQuery,
    useMarkAsReadMutation,

    useCreateCustomerMutation,
    useEditCustomerMutation,
    useGetCustomerDetailQuery,
    useLazyGetCustomerDetailQuery,
    useDeleteCustomerMutation,
    useGetCustomersQuery,
    useSearchCustomerQuery,


    useCreateSupplierMutation,
    useEditSupplierMutation,
    useGetSupplierDetailQuery,
    useLazyGetSupplierDetailQuery,
    useDeleteSupplierMutation,
    useGetSuppliersQuery,


    useCreateCategorMutation,
    useEditCategorMutation,
    useGetCategorDetailQuery,
    useLazyGetCategorDetailQuery,
    useDeleteCategorMutation,
    useGetCategorsQuery,


    useCreateProductnameMutation,
    useEditProductnameMutation,
    useGetProductnameDetailQuery,
    useLazyGetProductnameDetailQuery,
    useDeleteProductnameMutation,
    useGetProductnamesQuery,


    useCreateCarmodelMutation,
    useEditCarmodelMutation,
    useGetCarmodelDetailQuery,
    useLazyGetCarmodelDetailQuery,
    useDeleteCarmodelMutation,
    useGetCarmodelsQuery,


    useCreateBrandnameMutation,
    useEditBrandnameMutation,
    useGetBrandnameDetailQuery,
    useLazyGetBrandnameDetailQuery,
    useDeleteBrandnameMutation,
    useGetBrandnamesQuery,


    useCreateSpecificationheadnameMutation,
    useEditSpecificationheadnameMutation,
    useGetSpecificationheadnameDetailQuery,
    useLazyGetSpecificationheadnameDetailQuery,
    useDeleteSpecificationheadnameMutation,
    useGetSpecificationheadnamesQuery,


    useCreateBoxeMutation,
    useEditBoxeMutation,
    useGetBoxeDetailQuery,
    useLazyGetBoxeDetailQuery,
    useDeleteBoxeMutation,
    useGetBoxesQuery,


    useCreateLabelMutation,
    useEditLabelMutation,
    useGetLabelDetailQuery,
    useLazyGetLabelDetailQuery,
    useDeleteLabelMutation,
    useGetLabelsQuery,


    useCreateUnitMutation,
    useEditUnitMutation,
    useGetUnitDetailQuery,
    useLazyGetUnitDetailQuery,
    useDeleteUnitMutation,
    useGetUnitsQuery,


    useCreateProductinformationMutation,
    useEditProductinformationMutation,
    useGetProductinformationDetailQuery,
    useLazyGetProductinformationDetailQuery,
    useDeleteProductinformationMutation,
    useGetProductinformationsQuery,


    useCreateProductMutation,
    useEditProductMutation,
    useGetProductDetailQuery,
    useLazyGetProductDetailQuery,
    useDeleteProductMutation,
    useGetProductsQuery,


    useCreateProductimageMutation,
    useEditProductimageMutation,
    useGetProductimageDetailQuery,
    useLazyGetProductimageDetailQuery,
    useDeleteProductimageMutation,
    useGetProductimagesQuery,


    useCreateCrosscodeMutation,
    useEditCrosscodeMutation,
    useGetCrosscodeDetailQuery,
    useLazyGetCrosscodeDetailQuery,
    useDeleteCrosscodeMutation,
    useGetCrosscodesQuery,


    useCreateCrosscarMutation,
    useEditCrosscarMutation,
    useGetCrosscarDetailQuery,
    useLazyGetCrosscarDetailQuery,
    useDeleteCrosscarMutation,
    useGetCrosscarsQuery,


    useCreateProductspecificationMutation,
    useEditProductspecificationMutation,
    useGetProductspecificationDetailQuery,
    useLazyGetProductspecificationDetailQuery,
    useDeleteProductspecificationMutation,
    useGetProductspecificationsQuery,


    useCreateExchangerateMutation,
    useEditExchangerateMutation,
    useGetExchangerateDetailQuery,
    useLazyGetExchangerateDetailQuery,
    useDeleteExchangerateMutation,
    useGetExchangeratesQuery,


    useCreateCompanMutation,
    useEditCompanMutation,
    useGetCompanDetailQuery,
    useLazyGetCompanDetailQuery,
    useDeleteCompanMutation,
    useGetCompansQuery,

    //add here
} = apiSlice