import useReuest from "../utils/useRequest";
type loginData = {
  username: string;
  password: string;
};
export function login(data: loginData) {
  return useReuest("post", "/login", data);
}

export function getLoginUser() {
  return useReuest("get", "/login");
}

export function logout() {
  return useReuest("post", "/login/logout");
}
