import axios from "./axios";

export const getDuxiuIndex = () => {
  return axios.get("/duxiuindex").then((res) => res.data.data);
};
export const updateNewDuxiuIndex = (
  data:
    | {
        year: number;
        month: number;
        income: number;
        expense: number;
      }
    | undefined
) => {
  return axios.post("/duxiuindex", data).then((res) => res.data.data);
};
