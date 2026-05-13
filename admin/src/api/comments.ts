import useReuest from "../utils/useRequest";

export function getCommentList() {
  return useReuest("get", "/comments/admin");
}

export function deleteComment(id: string) {
  return useReuest("delete", `/comments/${id}`);
}
