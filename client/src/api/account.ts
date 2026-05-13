import axios from "./axios";
import type { AuthResponse, user } from "../types/user";

interface LoginPayload {
  username: string;
  password: string;
}

interface RegisterPayload extends LoginPayload {
  nickname?: string;
}

export const login = (data: LoginPayload) => {
  return axios.post("/login", data).then((res) => res.data.data as AuthResponse);
};

export const register = (data: RegisterPayload) => {
  return axios
    .post("/login/register", data)
    .then((res) => res.data.data as AuthResponse);
};

export const getCurrentUser = () => {
  return axios.get("/login").then((res) => res.data.data as user);
};

export const logout = () => {
  return axios.post("/login/logout").then((res) => res.data);
};
