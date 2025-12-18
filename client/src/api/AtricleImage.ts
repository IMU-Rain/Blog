import axios from "./axios";
interface resInterFace {
  originalname: string;
  detail: {
    url: string;
    id: string;
  };
}
export const ArticleImageSendApi = (files: [File]) => {
  const potots = new FormData();
  files.forEach((file) => {
    potots.append("image", file);
  });
  return axios
    .post("/articleimg", potots, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res.data.data);
      res.data.data.forEach((item: resInterFace) => {
        const baseURL = `${axios.defaults.baseURL?.slice(
          0,
          axios.defaults.baseURL.length - 3
        )}`;
        item.detail.url = `${baseURL}${item.detail.url}`;
      });
      return res.data.data;
    });
};
