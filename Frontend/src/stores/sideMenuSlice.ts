import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/components/Base/Lucide";
import { useSelector } from "react-redux";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  badge?: number;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  permission: any
}

export interface SideMenuState {
  menu: Array<Menu | string>;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      pathname: "/",
      title: "Home",
      permission: "view-my-account"
    },
    {
      icon: "LayoutDashboard",
      pathname: "/menu/dashboard",
      title: "Dashboard",
      permission: "view-general-dashboard"
    },
    // "HUMAN RESOURCE",
    {
      icon: "Users",
      title: "Human Resource",
      permission: "view-hr-menu",
      subMenu: [
        
        {
          icon: "BookMarked",
          pathname: "/menu/role",
          title: "Role",
          permission:"role-list",
        },
    
        {
          icon: "Users",
          pathname: "/menu/employee",
          title: "Employee",
          permission:"employee-list",
        },
    
        {
          icon: "Pocket",
          pathname: "/menu/user",
          title: "User",
          permission:"user-list",
        },

        {
          icon: "Pocket",
          pathname: "/menu/activities",
          title: "Activities",
          permission:"activity-list",
        },

        
      ],
    },

   
    

    {
      icon: "BookMarked",
      pathname: "/menu/customer",
      title: "Customer",
      permission: "customer-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/supplier",
      title: "Supplier",
      permission: "supplier-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/categor",
      title: "Categor",
      permission: "categor-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/productname",
      title: "Productname",
      permission: "productname-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/carmodel",
      title: "Carmodel",
      permission: "carmodel-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/brandname",
      title: "Brandname",
      permission: "brandname-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/specificationheadname",
      title: "Specificationheadname",
      permission: "specificationheadname-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/boxe",
      title: "Boxe",
      permission: "boxe-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/label",
      title: "Label",
      permission: "label-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/unit",
      title: "Unit",
      permission: "unit-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/productinformation",
      title: "Productinformation",
      permission: "productinformation-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/product",
      title: "Product",
      permission: "product-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/productimage",
      title: "Productimage",
      permission: "productimage-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/crosscode",
      title: "Crosscode",
      permission: "crosscode-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/crosscar",
      title: "Crosscar",
      permission: "crosscar-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/productspecification",
      title: "Productspecification",
      permission: "productspecification-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/exchangerate",
      title: "Exchangerate",
      permission: "exchangerate-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/menu/compan",
      title: "Compan",
      permission: "compan-list"
    },
    
    //addhere 
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
