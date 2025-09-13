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
          icon: "Shield",
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
          icon: "User",
          pathname: "/menu/user",
          title: "User",
          permission:"user-list",
        },

        {
          icon: "Activity",
          pathname: "/menu/activities",
          title: "Activities",
          permission:"activity-list",
        },

        
      ],
    },
// "Order Management",

    {
      icon: "ShoppingCart",
      title: "Order Management",
      permission: "view-hr-menu",
      subMenu: [
        {
          icon: "UserCheck",
          pathname: "/menu/customer",
          title: "Customer",
          permission: "customer-list"
        },
        {
          icon: "ShoppingBasket",
          title: "Baskets",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "ShoppingBasket",
              pathname: "/menu/basket",
              title: "Basket",
              permission: "basket-list"
            },
            {
              icon: "FileText",
              pathname: "/menu/basketfile",
              title: "Basket File",
              permission: "basketfile-list"
            },
            {
              icon: "Package2",
              pathname: "/menu/basketitem",
              title: "Basket Item",
              permission: "basketitem-list"
            }
          ]
        },
        {
          icon: "ClipboardList",
          title: "Orders",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "ClipboardList",
              pathname: "/menu/order",
              title: "Order",
              permission: "order-list"
            },
            {
              icon: "FileText",
              pathname: "/menu/orderdetail",
              title: "Order Details",
              permission: "orderdetail-list"
            }
          ]
        },
        {
          icon: "Truck",
          title: "Orders from Suppliers",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "Truck",
              pathname: "/menu/supplierorder",
              title: "Supplier Order",
              permission: "supplierorder-list"
            },
            {
              icon: "FileText",
              pathname: "/menu/supplierorderdetail",
              title: "Supplier Order Details",
              permission: "supplierorderdetail-list"
            }
          ]
        },
        {
          icon: "Package",
          title: "Packaging",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "Package",
              pathname: "/menu/packagin",
              title: "Packaging",
              permission: "packagin-list"
            },
            {
              icon: "Clipboard",
              pathname: "/menu/packinglist",
              title: "Packing List",
              permission: "packinglist-list"
            },
            {
              icon: "Box",
              pathname: "/menu/packinglistbox",
              title: "Packing List Box",
              permission: "packinglistbox-list"
            },
            {
              icon: "Package2",
              pathname: "/menu/packinglistboxitem",
              title: "Packing List Box Item",
              permission: "packinglistboxitem-list"
            },
            {
              icon: "AlertTriangle",
              pathname: "/menu/packagingproblem",
              title: "Packaging Problem",
              permission: "packagingproblem-list"
            }
          ]
        },
        {
          icon: "Receipt",
          title: "Customer Invoices",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "Receipt",
              pathname: "/menu/customerinvoice",
              title: "Customer Invoice",
              permission: "customerinvoice-list"
            },
            {
              icon: "FileText",
              pathname: "/menu/customerinvoiceitem",
              title: "Customer Invoice Item",
              permission: "customerinvoiceitem-list"
            },
            {
              icon: "Paperclip",
              pathname: "/menu/attachment",
              title: "Attachment",
              permission: "attachment-list"
            },
          ]
        },
        {
          icon: "FileText",
          title: "Supplier Invoices",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "FileText",
              pathname: "/menu/supplierinvoice",
              title: "Supplier Invoice",
              permission: "supplierinvoice-list"
            },
            {
              icon: "List",
              pathname: "/menu/supplierinvoiceitem",
              title: "Supplier Invoice Item",
              permission: "supplierinvoiceitem-list"
            },
            {
              icon: "AlertTriangle",
              pathname: "/menu/problem",
              title: "Problem",
              permission: "problem-list"
            },
            {
              icon: "List",
              pathname: "/menu/problemitem",
              title: "Problem Item",
              permission: "problemitem-list"
            },
          ]
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
          title: "Information",
          permission: "productinformation-list"
        }
      ],
    },
// "Product Portifiolio",
       {
      icon: "Briefcase",
      title: "Product Portfolio",
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
      title: "Images",
      permission: "view-hr-menu",
      subMenu: [
        {
          icon: "Camera",
          pathname: "/menu/productpictures",
          title: "Product Pictures",
          permission: "productinformation-list"
        },
        {
          icon: "FileImage",
          pathname: "/menu/technicalimages",
          title: "Technical Images",
          permission: "productinformation-list"
        },
        {
          icon: "Package",
          pathname: "/menu/boximages",
          title: "Boxes",
          permission: "boxe-list"
        },
        {
          icon: "Tag",
          pathname: "/menu/labelimages",
          title: "Labels",
          permission: "label-list"
        },
        {
          icon: "FolderOpen",
          pathname: "/menu/otherimages",
          title: "Others",
          permission: "view-hr-menu"
        }
      ]
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
      icon: "FileText",
      title: "Specifications",
      permission: "view-hr-menu",
      subMenu: [
          {
      icon: "Heading",
      pathname: "/menu/specificationheadname",
      title: "Specification Headname",
      permission: "specificationheadname-list"
    },
    
        {
      icon: "Clipboard",
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
    // "Report",

    {
      icon: "BarChart3",
      title: "Report",
      permission: "view-hr-menu",
      subMenu: [
        {
          icon: "Wallet",
          title: "Cashier",
          permission: "view-hr-menu",
          subMenu: [
            {
              icon: "CreditCard",
              pathname: "/menu/accounttype",
              title: "Account Type",
              permission: "accounttype-list"
            },
            {
              icon: "FileText",
              pathname: "/menu/paymentnote",
              title: "Payment Note",
              permission: "paymentnote-list"
            },
            {
              icon: "User",
              pathname: "/menu/customeraccount",
              title: "Customer Account",
              permission: "customeraccount-list"
            },
            {
              icon: "Truck",
              pathname: "/menu/supplieraccount",
              title: "Supplier Account",
              permission: "supplieraccount-list"
            },
            {
              icon: "Building",
              pathname: "/menu/companyaccount",
              title: "Company Account",
              permission: "companyaccount-list"
            },
            {
              icon: "Warehouse",
              pathname: "/menu/warehouseaccount",
              title: "Warehouse Account",
              permission: "warehouseaccount-list"
            }
          ]
        },
        {
          icon: "Warehouse",
          pathname: "/menu/warehouse",
          title: "Warehouse",
          permission: "warehouse-list"
        },
        {
          icon: "TrendingUp",
          pathname: "/menu/productstatus",
          title: "Product Statuses",
          permission: "productstatus-list"
        }
      ]
    },
// "Reference Book",
    {
      icon: "BookOpen",
      title: "Reference Book",
      permission: "view-hr-menu",
      subMenu: [
        
    {
      icon: "TrendingUp",
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
    
    {
      icon: "FolderOpen",
      pathname: "/menu/fileoperation",
      title: "File Operations",
      permission: "fileoperation-list"
    },
    
    {
      icon: "Search",
      pathname: "/menu/searchresult",
      title: "Search Results",
      permission: "searchresult-list"
    },
        
      ],
    },


    
    // {
    //   icon: "Settings",
    //   pathname: "/menu/productrule",
    //   title: "Product Rule",
    //   permission: "productrule-list"
    // },
    

    

    

    // {
    //   icon: "Eye",
    //   pathname: "/menu/customerbrandvisibilit",
    //   title: "Customer Brand Visibility",
    //   permission: "customerbrandvisibilit-list"
    // },
    

    // {
    //   icon: "EyeOff",
    //   pathname: "/menu/customerproductvisibilit",
    //   title: "Customer Product Visibility",
    //   permission: "customerproductvisibilit-list"
    // },
    

    // {
    //   icon: "PiggyBank",
    //   pathname: "/menu/supplierpricingrule",
    //   title: "Supplier Pricing Rule",
    //   permission: "supplierpricingrule-list"
    // },
    

    // {
    //   icon: "Calculator",
    //   pathname: "/menu/supplierpricingrulecustomer",
    //   title: "Supplier Pricing Rule Customer",
    //   permission: "supplierpricingrulecustomer-list"
    // },
    

    // {
    //   icon: "Package2",
    //   pathname: "/menu/supplierproduct",
    //   title: "Supplier Product",
    //   permission: "supplierproduct-list"
    // },
    

    

    // {
    //   icon: "History",
    //   pathname: "/menu/producthistor",
    //   title: "Product History",
    //   permission: "producthistor-list"
    // },
    
    
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
