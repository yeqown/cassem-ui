import ajax from "../utils/ajax";

export const pagingContainers = (ns: string, args: any) => {
  return ajax(`/api/namespaces/${ns}/containers`, { params: { ...args } });
};

export const getContainerDetail = (ns: string, containerKey: string) => {
  return ajax(`/api/namespaces/${ns}/containers/${containerKey}`);
};

export const delContainer = (ns: string, key: string) => {
  return ajax.delete(`/api/namespaces/${ns}/containers/${key}`);
}
