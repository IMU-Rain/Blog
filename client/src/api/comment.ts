import axios from "./axios";
import type { CommentItem, CommentQuery, CreateCommentPayload } from "../types/comment";

export const getComments = (params: CommentQuery) => {
  return axios.get("/comments", { params }).then((res) => res.data.data as CommentItem[]);
};

export const createComment = (payload: CreateCommentPayload) => {
  return axios.post("/comments", payload).then((res) => res.data.data as CommentItem);
};
