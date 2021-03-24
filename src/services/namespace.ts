import ajax from "../utils/ajax";

export const getNsList = (args: any) => {
  return ajax.get("/api/namespaces", { params: { ...args } });
};

export const getPairList = (ns: String, args: any) => {
  return ajax.get(`/api/namespaces/${ns}/pairs`, { params: { ...args } });
};

export const postCreateNs = (key: String) => {
  return ajax.post(`/api/namespaces/${key}`);
};
