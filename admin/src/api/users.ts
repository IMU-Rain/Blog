import useReuest from "../utils/useRequest";

export function getUserList() {
  return useReuest("get", "/users/admin");
}

export function deleteUser(id: string) {
  return useReuest("delete", `/users/${id}`);
}
