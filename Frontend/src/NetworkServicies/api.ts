import axios, { AxiosInstance } from "axios";

// Create an Axios instance with a defined type
const instance: AxiosInstance = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;