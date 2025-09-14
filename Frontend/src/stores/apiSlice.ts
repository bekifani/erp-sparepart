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
import { basketEndpoints } from "./endpoints/basketEndpoints"
import { basketfileEndpoints } from "./endpoints/basketfileEndpoints"
import { basketitemEndpoints } from "./endpoints/basketitemEndpoints"
import { orderEndpoints } from "./endpoints/orderEndpoints"
import { orderdetailEndpoints } from "./endpoints/orderdetailEndpoints"
import { supplierorderEndpoints } from "./endpoints/supplierorderEndpoints"
import { supplierorderdetailEndpoints } from "./endpoints/supplierorderdetailEndpoints"
import { packaginEndpoints } from "./endpoints/packaginEndpoints"
import { packinglistEndpoints } from "./endpoints/packinglistEndpoints"
import { packinglistboxEndpoints } from "./endpoints/packinglistboxEndpoints"
import { packinglistboxitemEndpoints } from "./endpoints/packinglistboxitemEndpoints"
import { attachmentEndpoints } from "./endpoints/attachmentEndpoints"
import { problemEndpoints } from "./endpoints/problemEndpoints"
import { problemitemEndpoints } from "./endpoints/problemitemEndpoints"
import { productstatusEndpoints } from "./endpoints/productstatusEndpoints"
import { customerinvoiceEndpoints } from "./endpoints/customerinvoiceEndpoints"
import { warehouseEndpoints } from "./endpoints/warehouseEndpoints"
import { customerinvoiceitemEndpoints } from "./endpoints/customerinvoiceitemEndpoints"
import { supplierinvoiceEndpoints } from "./endpoints/supplierinvoiceEndpoints"
import { supplierinvoiceitemEndpoints } from "./endpoints/supplierinvoiceitemEndpoints"
import { accounttypeEndpoints } from "./endpoints/accounttypeEndpoints"
import { paymentnoteEndpoints } from "./endpoints/paymentnoteEndpoints"
import { productruleEndpoints } from "./endpoints/productruleEndpoints"
import { packagingproblemEndpoints } from "./endpoints/packagingproblemEndpoints"
import { searchresultEndpoints } from "./endpoints/searchresultEndpoints"
import { fileoperationEndpoints } from "./endpoints/fileoperationEndpoints"
import { customerbrandvisibilitEndpoints } from "./endpoints/customerbrandvisibilitEndpoints"
import { customerproductvisibilitEndpoints } from "./endpoints/customerproductvisibilitEndpoints"
import { supplierpricingruleEndpoints } from "./endpoints/supplierpricingruleEndpoints"
import { supplierpricingrulecustomerEndpoints } from "./endpoints/supplierpricingrulecustomerEndpoints"
import { supplierproductEndpoints } from "./endpoints/supplierproductEndpoints"
import { customeraccountEndpoints } from "./endpoints/customeraccountEndpoints"
import { companyaccountEndpoints } from "./endpoints/companyaccountEndpoints"
import { warehouseaccountEndpoints } from "./endpoints/warehouseaccountEndpoints"
import { supplieraccountEndpoints } from "./endpoints/supplieraccountEndpoints"
import { producthistorEndpoints } from "./endpoints/producthistorEndpoints"
import { catalogEndpoints } from "./endpoints/catalogEndpoints"
//import here
export const apiSlice = createApi({
    reducerPath: "user",
    baseQuery: fetchBaseQuery({
      baseUrl: "https://erp-backend.learnica.net/api/",
      // baseUrl: "http://localhost:8000/api/",
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
...basketEndpoints(builder),
...basketfileEndpoints(builder),
...basketitemEndpoints(builder),
...orderEndpoints(builder),
...orderdetailEndpoints(builder),
...supplierorderEndpoints(builder),
...supplierorderdetailEndpoints(builder),
...packaginEndpoints(builder),
...packinglistEndpoints(builder),
...packinglistboxEndpoints(builder),
...packinglistboxitemEndpoints(builder),
...attachmentEndpoints(builder),
...problemEndpoints(builder),
...problemitemEndpoints(builder),
...productstatusEndpoints(builder),
...customerinvoiceEndpoints(builder),
...warehouseEndpoints(builder),
...customerinvoiceitemEndpoints(builder),
...supplierinvoiceEndpoints(builder),
...supplierinvoiceitemEndpoints(builder),
...accounttypeEndpoints(builder),
...paymentnoteEndpoints(builder),
...productruleEndpoints(builder),
...packagingproblemEndpoints(builder),
...searchresultEndpoints(builder),
...fileoperationEndpoints(builder),
...customerbrandvisibilitEndpoints(builder),
...customerproductvisibilitEndpoints(builder),
...supplierpricingruleEndpoints(builder),
...supplierpricingrulecustomerEndpoints(builder),
...supplierproductEndpoints(builder),
...customeraccountEndpoints(builder),
...companyaccountEndpoints(builder),
...warehouseaccountEndpoints(builder),
...supplieraccountEndpoints(builder),
...producthistorEndpoints(builder),
...catalogEndpoints(builder),
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
    useMergeSpecificationheadnamesMutation,


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


    useCreateBasketMutation,
    useEditBasketMutation,
    useGetBasketDetailQuery,
    useLazyGetBasketDetailQuery,
    useDeleteBasketMutation,
    useGetBasketsQuery,


    useCreateBasketfileMutation,
    useEditBasketfileMutation,
    useGetBasketfileDetailQuery,
    useLazyGetBasketfileDetailQuery,
    useDeleteBasketfileMutation,
    useGetBasketfilesQuery,


    useCreateBasketitemMutation,
    useEditBasketitemMutation,
    useGetBasketitemDetailQuery,
    useLazyGetBasketitemDetailQuery,
    useDeleteBasketitemMutation,
    useGetBasketitemsQuery,


    useCreateOrderMutation,
    useEditOrderMutation,
    useGetOrderDetailQuery,
    useLazyGetOrderDetailQuery,
    useDeleteOrderMutation,
    useGetOrdersQuery,


    useCreateOrderdetailMutation,
    useEditOrderdetailMutation,
    useGetOrderdetailDetailQuery,
    useLazyGetOrderdetailDetailQuery,
    useDeleteOrderdetailMutation,
    useGetOrderdetailsQuery,


    useCreateSupplierorderMutation,
    useEditSupplierorderMutation,
    useGetSupplierorderDetailQuery,
    useLazyGetSupplierorderDetailQuery,
    useDeleteSupplierorderMutation,
    useGetSupplierordersQuery,


    useCreateSupplierorderdetailMutation,
    useEditSupplierorderdetailMutation,
    useGetSupplierorderdetailDetailQuery,
    useLazyGetSupplierorderdetailDetailQuery,
    useDeleteSupplierorderdetailMutation,
    useGetSupplierorderdetailsQuery,


    useCreatePackaginMutation,
    useEditPackaginMutation,
    useGetPackaginDetailQuery,
    useLazyGetPackaginDetailQuery,
    useDeletePackaginMutation,
    useGetPackaginsQuery,


    useCreatePackinglistMutation,
    useEditPackinglistMutation,
    useGetPackinglistDetailQuery,
    useLazyGetPackinglistDetailQuery,
    useDeletePackinglistMutation,
    useGetPackinglistsQuery,


    useCreatePackinglistboxMutation,
    useEditPackinglistboxMutation,
    useGetPackinglistboxDetailQuery,
    useLazyGetPackinglistboxDetailQuery,
    useDeletePackinglistboxMutation,
    useGetPackinglistboxsQuery,


    useCreatePackinglistboxitemMutation,
    useEditPackinglistboxitemMutation,
    useGetPackinglistboxitemDetailQuery,
    useLazyGetPackinglistboxitemDetailQuery,
    useDeletePackinglistboxitemMutation,
    useGetPackinglistboxitemsQuery,


    useCreateAttachmentMutation,
    useEditAttachmentMutation,
    useGetAttachmentDetailQuery,
    useLazyGetAttachmentDetailQuery,
    useDeleteAttachmentMutation,
    useGetAttachmentsQuery,


    useCreateProblemMutation,
    useEditProblemMutation,
    useGetProblemDetailQuery,
    useLazyGetProblemDetailQuery,
    useDeleteProblemMutation,
    useGetProblemsQuery,


    useCreateProblemitemMutation,
    useEditProblemitemMutation,
    useGetProblemitemDetailQuery,
    useLazyGetProblemitemDetailQuery,
    useDeleteProblemitemMutation,
    useGetProblemitemsQuery,


    useCreateProductstatusMutation,
    useEditProductstatusMutation,
    useGetProductstatusDetailQuery,
    useLazyGetProductstatusDetailQuery,
    useDeleteProductstatusMutation,
    useGetProductstatussQuery,


    useCreateCustomerinvoiceMutation,
    useEditCustomerinvoiceMutation,
    useGetCustomerinvoiceDetailQuery,
    useLazyGetCustomerinvoiceDetailQuery,
    useDeleteCustomerinvoiceMutation,
    useGetCustomerinvoicesQuery,


    useCreateWarehouseMutation,
    useEditWarehouseMutation,
    useGetWarehouseDetailQuery,
    useLazyGetWarehouseDetailQuery,
    useDeleteWarehouseMutation,
    useGetWarehousesQuery,


    useCreateCustomerinvoiceitemMutation,
    useEditCustomerinvoiceitemMutation,
    useGetCustomerinvoiceitemDetailQuery,
    useLazyGetCustomerinvoiceitemDetailQuery,
    useDeleteCustomerinvoiceitemMutation,
    useGetCustomerinvoiceitemsQuery,


    useCreateSupplierinvoiceMutation,
    useEditSupplierinvoiceMutation,
    useGetSupplierinvoiceDetailQuery,
    useLazyGetSupplierinvoiceDetailQuery,
    useDeleteSupplierinvoiceMutation,
    useGetSupplierinvoicesQuery,


    useCreateSupplierinvoiceitemMutation,
    useEditSupplierinvoiceitemMutation,
    useGetSupplierinvoiceitemDetailQuery,
    useLazyGetSupplierinvoiceitemDetailQuery,
    useDeleteSupplierinvoiceitemMutation,
    useGetSupplierinvoiceitemsQuery,


    useCreateAccounttypeMutation,
    useEditAccounttypeMutation,
    useGetAccounttypeDetailQuery,
    useLazyGetAccounttypeDetailQuery,
    useDeleteAccounttypeMutation,
    useGetAccounttypesQuery,


    useCreatePaymentnoteMutation,
    useEditPaymentnoteMutation,
    useGetPaymentnoteDetailQuery,
    useLazyGetPaymentnoteDetailQuery,
    useDeletePaymentnoteMutation,
    useGetPaymentnotesQuery,


    useCreateProductruleMutation,
    useEditProductruleMutation,
    useGetProductruleDetailQuery,
    useLazyGetProductruleDetailQuery,
    useDeleteProductruleMutation,
    useGetProductrulesQuery,
    useGetProductrulesByProductQuery,
    // New hook to get rules filtered by product_id


    useCreatePackagingproblemMutation,
    useEditPackagingproblemMutation,
    useGetPackagingproblemDetailQuery,
    useLazyGetPackagingproblemDetailQuery,
    useDeletePackagingproblemMutation,
    useGetPackagingproblemsQuery,


    useCreateSearchresultMutation,
    useEditSearchresultMutation,
    useGetSearchresultDetailQuery,
    useLazyGetSearchresultDetailQuery,
    useDeleteSearchresultMutation,
    useGetSearchresultsQuery,


    useCreateFileoperationMutation,
    useEditFileoperationMutation,
    useGetFileoperationDetailQuery,
    useLazyGetFileoperationDetailQuery,
    useDeleteFileoperationMutation,
    useGetFileoperationsQuery,


    useCreateCustomerbrandvisibilitMutation,
    useEditCustomerbrandvisibilitMutation,
    useGetCustomerbrandvisibilitDetailQuery,
    useLazyGetCustomerbrandvisibilitDetailQuery,
    useDeleteCustomerbrandvisibilitMutation,
    useGetCustomerbrandvisibilitsQuery,


    useCreateCustomerproductvisibilitMutation,
    useEditCustomerproductvisibilitMutation,
    useGetCustomerproductvisibilitDetailQuery,
    useLazyGetCustomerproductvisibilitDetailQuery,
    useDeleteCustomerproductvisibilitMutation,
    useGetCustomerproductvisibilitsQuery,


    useCreateSupplierpricingruleMutation,
    useEditSupplierpricingruleMutation,
    useGetSupplierpricingruleDetailQuery,
    useLazyGetSupplierpricingruleDetailQuery,
    useDeleteSupplierpricingruleMutation,
    useGetSupplierpricingrulesQuery,


    useCreateSupplierpricingrulecustomerMutation,
    useEditSupplierpricingrulecustomerMutation,
    useGetSupplierpricingrulecustomerDetailQuery,
    useLazyGetSupplierpricingrulecustomerDetailQuery,
    useDeleteSupplierpricingrulecustomerMutation,
    useGetSupplierpricingrulecustomersQuery,


    useCreateSupplierproductMutation,
    useEditSupplierproductMutation,
    useGetSupplierproductDetailQuery,
    useLazyGetSupplierproductDetailQuery,
    useDeleteSupplierproductMutation,
    useGetSupplierproductsQuery,


    useCreateCustomeraccountMutation,
    useEditCustomeraccountMutation,
    useGetCustomeraccountDetailQuery,
    useLazyGetCustomeraccountDetailQuery,
    useDeleteCustomeraccountMutation,
    useGetCustomeraccountsQuery,


    useCreateCompanyaccountMutation,
    useEditCompanyaccountMutation,
    useGetCompanyaccountDetailQuery,
    useLazyGetCompanyaccountDetailQuery,
    useDeleteCompanyaccountMutation,
    useGetCompanyaccountsQuery,


    useCreateWarehouseaccountMutation,
    useEditWarehouseaccountMutation,
    useGetWarehouseaccountDetailQuery,
    useLazyGetWarehouseaccountDetailQuery,
    useDeleteWarehouseaccountMutation,
    useGetWarehouseaccountsQuery,


    useCreateSupplieraccountMutation,
    useEditSupplieraccountMutation,
    useGetSupplieraccountDetailQuery,
    useLazyGetSupplieraccountDetailQuery,
    useDeleteSupplieraccountMutation,
    useGetSupplieraccountsQuery,


    useCreateProducthistorMutation,
    useEditProducthistorMutation,
    useGetProducthistorDetailQuery,
    useLazyGetProducthistorDetailQuery,
    useDeleteProducthistorMutation,
    useGetProducthistorsQuery,

    // Catalog endpoints
    useGetCatalogProductsQuery,
    useGetProductDetailsQuery,
    useExportCatalogPdfMutation,

    //add here
} = apiSlice