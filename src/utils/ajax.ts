import axios from "axios";
import { message } from "ant-design-vue";

let instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    if (res.data.errcode === 0) {
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }
  },
  (err) => {
    console.log(err.response);
    message.error({
      content: err.response.data.errmsg || err.errmsg || err.message,
    });
  }
);

export default instance;
