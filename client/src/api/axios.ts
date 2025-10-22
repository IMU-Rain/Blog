import axios from "axios";
const instance = axios.create({
  baseURL: "http://39.97.52.142:3000/api",
  // baseURL: "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
export default instance;
