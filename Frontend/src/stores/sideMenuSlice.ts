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
