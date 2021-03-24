import ajax from "../utils/ajax";

export const pagingContainers = (ns: string, args: any) => {
  return ajax(`/api/namespaces/${ns}/containers`, { params: { ...args } });
};

export const getCtConfig = (ns: string, containerKey: string) => {
  return ajax(`/api/namespaces/${ns}/containers/${containerKey}`);
};
