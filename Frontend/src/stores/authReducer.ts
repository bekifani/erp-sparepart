import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for the state and user
interface User {
  id: string;
  name: string;
  email: string;
  token: string;
  permissions: [],
  shops: [] | null, 
  warehouses: [] | null,
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  notifications: string[];
  csrf_token: string;
  app_url: string;
  media_url: string;
  lang: string;
  tenant: string;
}

// Initialize state from localStorage
const initializeUser = (): User | null => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("user-info");
    return item ? (JSON.parse(item) as User) : null;
  }
  return null;
};

const initializeAuthenticated = (): boolean => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("user-info");
    return item ? true : false;
  }
  return false;
};

const initializeToken = (): string | null => {
  if (typeof window !== "undefined") {
    const item = window?.localStorage.getItem("token");
    return item ? item : null;
  }
  return null;
};

// Create the auth slice
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initializeToken(),
    isAuthenticated: initializeAuthenticated(),
    user: initializeUser(),
    notifications: [] as string[],
    csrf_token: "",
  

    front_url: "http://localhost:5173",
    media_url: "http://localhost:8000/storage/uploads/",
    app_url: "http://localhost:8000",
    upload_url: "http://localhost:8000/api/uploadFile",

    // front_url: "https://erp.learnica.net",
    // media_url: "https://erp-backend.learnica.net/storage/uploads/",
    // app_url: "https://erp-backend.learnica.net",
    // upload_url: "https://erp-backend.learnica.net/api/uploadFile",

    lang: "en",
    tenant: "test",
  } as AuthState,
  reducers: {
    authenticateUser: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      window?.localStorage.setItem("user-info", JSON.stringify(state.user));
      window?.localStorage.setItem("token", state.token);
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      window?.localStorage.removeItem("user-info");
      window?.localStorage.removeItem("token");
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
    socialAuthenticate: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
    },
    setCSRFToken: (state, action: PayloadAction<string>) => {
      state.csrf_token = action.payload;
    },
    pushNotification: (state, action: PayloadAction<string>) => {
      state.notifications.push(action.payload);
    },
    removeNotifications: (state) => {
      state.notifications = [];
    },
  },
});

// Export actions and reducer
export const {
  authenticateUser,
  logoutUser,
  socialAuthenticate,
  setCSRFToken,
  setUser,
  pushNotification,
  removeNotifications,
  setLanguage
} = authSlice.actions;

export default authSlice.reducer;
