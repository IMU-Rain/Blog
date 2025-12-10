import axios from "./axios";

export const getAllPhotos = () => {
  return axios.get("/photos").then((res) => res.data.data);
};
export const delPhoto = (id:string) => {
  return axios.delete(`/photos/${id}`);
};
