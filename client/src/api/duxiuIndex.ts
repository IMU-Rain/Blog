
import axios from "./axios";

export const getDuxiuIndex = () => {
  return axios.get("/duxiuindex").then((res) => res.data.data);
};
