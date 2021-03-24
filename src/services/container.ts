import ajax from "../utils/ajax";
import { fieldFromAPI } from './mapping';

export const pagingContainers = (ns: string, args: any) => {
  return ajax(`/api/namespaces/${ns}/containers`, { params: { ...args } });
};

export const getContainerDetail = (ns: string, containerKey: string) => {
  return ajax(`/api/namespaces/${ns}/containers/${containerKey}`);
};

export const delContainer = (ns: string, key: string) => {
  return ajax.delete(`/api/namespaces/${ns}/containers/${key}`);
}

export const saveContainer = (ns: string, key: string, fields: fieldFromAPI[]) => {
  // let body = JSON.stringify({
  //   fields: fields,
  // })
  let body = {
    fields: fields,
  }

  return ajax.post(`/api/namespaces/${ns}/containers/${key}`, body)
}