import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1/index.jsx";
// Authentication Routes
import Login from '@/views/Login/index.jsx'
// import Register from '@/views/Register'
import ForgotPassword from '@/views/ForgotPassword/index.jsx'
import ResetPassword from '@/views/ResetPassword/index.jsx'
import Layout from "../themes/index.tsx";
import Landingpage from "@/views/PublicPage/landingpage.jsx"
import Employee  from '@/views/Employee'
import User  from '@/views/User'
import Activities from '@/views/Activities'
import Role  from '@/views/Role'
import Customer  from '@/views/ERP/Customer'
import Supplier  from '@/views/ERP/Supplier'
import Categor  from '@/views/ERP/Categor'
import Productname  from '@/views/ERP/Productname'
import Carmodel  from '@/views/ERP/Carmodel'
import Brandname  from '@/views/ERP/Brandname'
import Specificationheadname  from '@/views/ERP/Specificationheadname'
import Boxe  from '@/views/ERP/Boxe'
import Label  from '@/views/ERP/Label'
import Unit  from '@/views/ERP/Unit'
import Productinformation  from '@/views/ERP/Productinformation'
import Product  from '@/views/ERP/Product'
import Productimage  from '@/views/ERP/Productimage'
import Crosscode  from '@/views/ERP/Crosscode'
import Crosscar  from '@/views/ERP/Crosscar'
import Productspecification  from '@/views/ERP/Productspecification'
import Exchangerate  from '@/views/ERP/Exchangerate'
import Compan  from '@/views/ERP/Compan'
import Basket  from '@/views/ERP/Basket'
import Basketfile  from '@/views/ERP/Basketfile'
import Basketitem  from '@/views/ERP/Basketitem'
import Order  from '@/views/ERP/Order'
import Orderdetail  from '@/views/ERP/Orderdetail'
import Supplierorder  from '@/views/ERP/Supplierorder'
import Supplierorderdetail  from '@/views/ERP/Supplierorderdetail'
import Packagin  from '@/views/ERP/Packagin'
import Packinglist  from '@/views/ERP/Packinglist'
import Packinglistbox  from '@/views/ERP/Packinglistbox'
import Packinglistboxitem  from '@/views/ERP/Packinglistboxitem'
import Attachment  from '@/views/ERP/Attachment'
import Problem  from '@/views/ERP/Problem'
import Problemitem  from '@/views/ERP/Problemitem'
import Productstatus  from '@/views/ERP/Productstatus'
import Customerinvoice  from '@/views/ERP/Customerinvoice'
import Warehouse  from '@/views/ERP/Warehouse'
import Customerinvoiceitem  from '@/views/ERP/Customerinvoiceitem'
import Supplierinvoice  from '@/views/ERP/Supplierinvoice'
import Supplierinvoiceitem  from '@/views/ERP/Supplierinvoiceitem'
import Accounttype  from '@/views/ERP/Accounttype'
import Paymentnote  from '@/views/ERP/Paymentnote'
import Productrule  from '@/views/ERP/Productrule'
import Packagingproblem  from '@/views/ERP/Packagingproblem'
import Searchresult  from '@/views/ERP/Searchresult'
import Fileoperation  from '@/views/ERP/Fileoperation'
import Customerbrandvisibilit  from '@/views/ERP/Customerbrandvisibilit'
import Customerproductvisibilit  from '@/views/ERP/Customerproductvisibilit'
import Supplierpricingrule  from '@/views/ERP/Supplierpricingrule'
import Supplierpricingrulecustomer  from '@/views/ERP/Supplierpricingrulecustomer'
import Supplierproduct  from '@/views/ERP/Supplierproduct'
import Customeraccount  from '@/views/ERP/Customeraccount'
import Companyaccount  from '@/views/ERP/Companyaccount'
import Warehouseaccount  from '@/views/ERP/Warehouseaccount'
import Supplieraccount  from '@/views/ERP/Supplieraccount'
import Producthistor  from '@/views/ERP/Producthistor'
import Catalog  from '@/views/ERP/Catalog'
//add file here 

function Router() {
  const routes = [
    {
      path: "",
      element: <Landingpage />,
    },
    
    {
    path: "menu",
    element: <Layout />,
      children: [
      {
        path: "employee",
        element: <Employee />,
      }, 
      {
        path: "user",
        element: <User />,
      }, 
      {
        path: "activities",
        element: <Activities />,
      }, 
      {
        path: "role",
        element: <Role />,
      }, 
 
  
  {
    path: "customer",
    element: <Customer />,
  }, 
  {
    path: "supplier",
    element: <Supplier />,
  }, 
  {
    path: "categor",
    element: <Categor />,
  }, 
  {
    path: "productname",
    element: <Productname />,
  }, 
  {
    path: "carmodel",
    element: <Carmodel />,
  }, 
  {
    path: "brandname",
    element: <Brandname />,
  }, 
  {
    path: "specificationheadname",
    element: <Specificationheadname />,
  }, 
  {
    path: "boxe",
    element: <Boxe />,
  }, 
  {
    path: "label",
    element: <Label />,
  }, 
  {
    path: "unit",
    element: <Unit />,
  }, 
  {
    path: "ProductInformation",
    element: <Productinformation />,
  }, 
  {
    path: "product",
    element: <Product />,
  }, 
  {
    path: "productimage",
    element: <Productimage />,
  }, 
  {
    path: "crosscode",
    element: <Crosscode />,
  }, 
  {
    path: "crosscar",
    element: <Crosscar />,
  }, 
  {
    path: "productspecification",
    element: <Productspecification />,
  }, 
  {
    path: "exchangerate",
    element: <Exchangerate />,
  }, 
  {
    path: "compan",
    element: <Compan />,
  }, 
  {
    path: "basket",
    element: <Basket />,
  }, 
  {
    path: "basketfile",
    element: <Basketfile />,
  }, 
  {
    path: "basketitem",
    element: <Basketitem />,
  }, 
  {
    path: "order",
    element: <Order />,
  }, 
  {
    path: "orderdetail",
    element: <Orderdetail />,
  }, 
  {
    path: "supplierorder",
    element: <Supplierorder />,
  }, 
  {
    path: "supplierorderdetail",
    element: <Supplierorderdetail />,
  }, 
  {
    path: "packagin",
    element: <Packagin />,
  }, 
  {
    path: "packinglist",
    element: <Packinglist />,
  }, 
  {
    path: "packinglistbox",
    element: <Packinglistbox />,
  }, 
  {
    path: "packinglistboxitem",
    element: <Packinglistboxitem />,
  }, 
  {
    path: "attachment",
    element: <Attachment />,
  }, 
  {
    path: "problem",
    element: <Problem />,
  }, 
  {
    path: "problemitem",
    element: <Problemitem />,
  }, 
  {
    path: "productstatus",
    element: <Productstatus />,
  }, 
  {
    path: "customerinvoice",
    element: <Customerinvoice />,
  }, 
  {
    path: "warehouse",
    element: <Warehouse />,
  }, 
  {
    path: "customerinvoiceitem",
    element: <Customerinvoiceitem />,
  }, 
  {
    path: "supplierinvoice",
    element: <Supplierinvoice />,
  }, 
  {
    path: "supplierinvoiceitem",
    element: <Supplierinvoiceitem />,
  }, 
  {
    path: "accounttype",
    element: <Accounttype />,
  }, 
  {
    path: "paymentnote",
    element: <Paymentnote />,
  }, 
  {
    path: "productrule",
    element: <Productrule />,
  }, 
  {
    path: "packagingproblem",
    element: <Packagingproblem />,
  }, 
  {
    path: "searchresult",
    element: <Searchresult />,
  }, 
  {
    path: "fileoperation",
    element: <Fileoperation />,
  }, 
  {
    path: "customerbrandvisibilit",
    element: <Customerbrandvisibilit />,
  }, 
  {
    path: "customerproductvisibilit",
    element: <Customerproductvisibilit />,
  }, 
  {
    path: "supplierpricingrule",
    element: <Supplierpricingrule />,
  }, 
  {
    path: "supplierpricingrulecustomer",
    element: <Supplierpricingrulecustomer />,
  }, 
  {
    path: "supplierproduct",
    element: <Supplierproduct />,
  }, 
  {
    path: "customeraccount",
    element: <Customeraccount />,
  }, 
  {
    path: "companyaccount",
    element: <Companyaccount />,
  }, 
  {
    path: "warehouseaccount",
    element: <Warehouseaccount />,
  }, 
  {
    path: "supplieraccount",
    element: <Supplieraccount />,
  }, 
  {
    path: "producthistor",
    element: <Producthistor />,
  }, 
  {
    path: "catalog",
    element: <Catalog />,
  }, 
       // add routes here
      {
        path: "dashboard",
        element: <DashboardOverview1 />,
      },
        
      ],
    },
    
    {
      path: "login",
      element: <Login />,
    },
    // {
    //   path: "register",
    //   element: <Register />,
    // },
    {
      path: "reset-pin",
      element: <ResetPassword/>
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    }
  ];

  return useRoutes(routes);
}

export default Router;
