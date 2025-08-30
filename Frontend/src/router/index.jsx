import { useRoutes } from "react-router-dom";
import DashboardOverview1 from "../pages/DashboardOverview1/index.jsx";
// Authentication Routes
import Login from '@/views/Login/index.jsx'
import Register from '@/views/Register'
import ForgotPassword from '@/views/ForgotPassword/index.jsx'
import ResetPassword from '@/views/ResetPassword/index.jsx'
import Layout from "../themes/index.tsx";
import Landingpage from "@/views/PublicPage/landingpage.jsx"
import Employee  from '@/views/Employee'
import User  from '@/views/User'
import Activities from '@/views/Activities'
import Role  from '@/views/Role'
//add file here 

function Router() {
  const routes = [
    {
      path: "/",
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
    {
      path: "register",
      element: <Register />,
    },
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
