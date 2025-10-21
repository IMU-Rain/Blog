import axios from "./axios";

export const getAllPhotos = () => {
  return axios.get("/photos").then((res) => res.data.data);
};
