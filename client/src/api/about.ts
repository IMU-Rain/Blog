import axios from "./axios";
export const getAbout = () => {
  return axios.get("/about").then((res) => res.data.data);
};
export const updateAbout = (content?: string) => {
  return axios.put("/about", { content }).then((res) => res.data.data);
};
