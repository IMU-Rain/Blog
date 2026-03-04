import axios from "axios";
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL + "api/",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
