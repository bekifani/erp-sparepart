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
