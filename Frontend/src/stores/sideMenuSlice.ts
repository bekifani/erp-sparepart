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
      icon: "ShoppingCart",
      title: "Order Management",
      permission: "view-hr-menu",
      subMenu: [
        {
      icon: "UserCheck",
      pathname: "/menu/customer",
      title: "Customers",
      permission: "customer-list"
        },

        {
      icon: "Truck",
      pathname: "/menu/supplier",
      title: "Suppliers",
      permission: "supplier-list"
      },

         {
      icon: "ListOrdered",
      pathname: "/menu/product",
      title: "Products",
      permission: "product-list"
    },

        {
      icon: "Info",
      pathname: "/menu/productinformation",
      title: "Product Information",
      permission: "productinformation-list"
    },
    
        
      ],
    },

       {
      icon: "Briefcase",
      title: "Product Portifolio",
      permission: "view-hr-menu",
      subMenu: [
    {
      icon: "List",
      pathname: "/menu/categor",
      title: "Categories",
      permission: "categor-list"
    },

    {
      icon: "Tag",
      pathname: "/menu/productname",
      title: "Product Name",
      permission: "productname-list"
    },
    

    {
      icon: "Image",
      pathname: "/menu/productimage",
      title: "Product Images",
      permission: "productimage-list"
    },
    {
      icon: "Package",
      pathname: "/menu/boxe",
      title: "Boxes",
      permission: "boxe-list"
    },

    {
      icon: "Bookmark",
      pathname: "/menu/label",
      title: "Labels",
      permission: "label-list"
    },

        {
      icon: "GitBranch",
      pathname: "/menu/crosscode",
      title: "Crosscode",
      permission: "crosscode-list"
    },
    

    {
      icon: "Gauge",
      pathname: "/menu/crosscar",
      title: "Crosscars",
      permission: "crosscar-list"
    },
    
       {
      icon: "ShoppingCart",
      title: "Specifications",
      permission: "view-hr-menu",
      subMenu: [
          {
      icon: "FileText",
      pathname: "/menu/specificationheadname",
      title: "Specification Headname",
      permission: "specificationheadname-list"
    },
    
        {
      icon: "ClipboardList",
      pathname: "/menu/productspecification",
      title: "Product Specification",
      permission: "productspecification-list"
    },
        
      ],
    },

    {
      icon: "Car",
      pathname: "/menu/carmodel",
      title: "Car Models",
      permission: "carmodel-list"
    },
    
       {
      icon: "Award",
      pathname: "/menu/brandname",
      title: "Brand Names",
      permission: "brandname-list"
    },
    
     
      ],
    },

    

    
    {
      icon: "Users",
      title: "Reference Book",
      permission: "view-hr-menu",
      subMenu: [
        
    {
      icon: "DollarSign",
      pathname: "/menu/exchangerate",
      title: "Exchange Rates",
      permission: "exchangerate-list"
    },
    
    
    {
      icon: "Ruler",
      pathname: "/menu/unit",
      title: "Unit Type",
      permission: "unit-list"
    },
    
    {
      icon: "Building",
      pathname: "/menu/compan",
      title: "Company Profiles",
      permission: "compan-list"
    },
    
        
      ],
    },

    









    

    


  


    





    





    {
      icon: "BookMarked",
      pathname: "/basket",
      title: "Basket",
      permission: "basket-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/basketfile",
      title: "Basketfile",
      permission: "basketfile-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/basketitem",
      title: "Basketitem",
      permission: "basketitem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/order",
      title: "Order",
      permission: "order-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/orderdetail",
      title: "Orderdetail",
      permission: "orderdetail-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierorder",
      title: "Supplierorder",
      permission: "supplierorder-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierorderdetail",
      title: "Supplierorderdetail",
      permission: "supplierorderdetail-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/packagin",
      title: "Packagin",
      permission: "packagin-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/packinglist",
      title: "Packinglist",
      permission: "packinglist-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/packinglistbox",
      title: "Packinglistbox",
      permission: "packinglistbox-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/packinglistboxitem",
      title: "Packinglistboxitem",
      permission: "packinglistboxitem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/attachment",
      title: "Attachment",
      permission: "attachment-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/problem",
      title: "Problem",
      permission: "problem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/problemitem",
      title: "Problemitem",
      permission: "problemitem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/productstatus",
      title: "Productstatus",
      permission: "productstatus-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/customerinvoice",
      title: "Customerinvoice",
      permission: "customerinvoice-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/warehouse",
      title: "Warehouse",
      permission: "warehouse-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/customerinvoiceitem",
      title: "Customerinvoiceitem",
      permission: "customerinvoiceitem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierinvoice",
      title: "Supplierinvoice",
      permission: "supplierinvoice-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierinvoiceitem",
      title: "Supplierinvoiceitem",
      permission: "supplierinvoiceitem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/accounttype",
      title: "Accounttype",
      permission: "accounttype-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/paymentnote",
      title: "Paymentnote",
      permission: "paymentnote-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/productrule",
      title: "Productrule",
      permission: "productrule-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/packagingproblem",
      title: "Packagingproblem",
      permission: "packagingproblem-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/searchresult",
      title: "Searchresult",
      permission: "searchresult-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/fileoperation",
      title: "Fileoperation",
      permission: "fileoperation-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/customerbrandvisibilit",
      title: "Customerbrandvisibilit",
      permission: "customerbrandvisibilit-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/customerproductvisibilit",
      title: "Customerproductvisibilit",
      permission: "customerproductvisibilit-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierpricingrule",
      title: "Supplierpricingrule",
      permission: "supplierpricingrule-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierpricingrulecustomer",
      title: "Supplierpricingrulecustomer",
      permission: "supplierpricingrulecustomer-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplierproduct",
      title: "Supplierproduct",
      permission: "supplierproduct-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/customeraccount",
      title: "Customeraccount",
      permission: "customeraccount-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/companyaccount",
      title: "Companyaccount",
      permission: "companyaccount-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/warehouseaccount",
      title: "Warehouseaccount",
      permission: "warehouseaccount-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/supplieraccount",
      title: "Supplieraccount",
      permission: "supplieraccount-list"
    },
    

    {
      icon: "BookMarked",
      pathname: "/producthistor",
      title: "Producthistor",
      permission: "producthistor-list"
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
