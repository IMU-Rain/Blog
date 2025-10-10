import axios from "./axios";
const getAbout = () => {
  return axios.get("/about");
};
export default getAbout;
