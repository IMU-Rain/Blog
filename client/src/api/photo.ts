import axios from "./axios";

const getAllPhotos = () => {
  return axios.get("/photos");
};
export default { getAllPhotos };
