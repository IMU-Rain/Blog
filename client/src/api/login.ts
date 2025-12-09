import axios from "./axios";
interface LoginData {
  username: string;
  password: string;
}
export function login(loginData: LoginData | undefined) {
  return axios
    .post("/login", JSON.stringify(loginData), { withCredentials: true })
    .then((res) => res.data);
}
export function getUserInfo() {
  return axios.get("/login", { withCredentials: true }).then((res)=>res.data.data);
}
