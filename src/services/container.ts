import ajax from "../utils/ajax";

export const getCtList = (id: String) => {
  return ajax(`/api/namespaces/${id}/containers`);
};
export const getCtConfig = (nsId: String, ctId: String) => {
  return ajax(`/api/namespaces/${nsId}/containers/${ctId}`);
};
