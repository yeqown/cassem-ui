import axios from "axios";
import { message } from "ant-design-vue";

let instance = axios.create({
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    message.success("Request OK");
    if (res.data.errcode === 0) {
      if (res.data.data) {
        return res.data.data;
      }
      return res.data;
    }
  },
  (err) => {
    console.error(err);
    message.error({
      content: err.errmsg || err.message,
    });
  }
);

export default instance;
