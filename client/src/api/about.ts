import axios from "./axios";
const getAbout = () => {
  return axios.get("/about").then((res) => res.data.data);
};
export default getAbout;
