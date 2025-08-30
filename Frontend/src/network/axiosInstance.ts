import axios from "axios";

const instance = axios.create({
  baseURL: "https://frontend.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;