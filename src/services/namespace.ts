import ajax from "../utils/ajax";

export const getNsList = (args: any) => {
  return ajax.get("/api/namespaces", { params: { ...args } });
};

export const postCreateNs = (key: string) => {
  return ajax.post(`/api/namespaces/${key}`);
};
