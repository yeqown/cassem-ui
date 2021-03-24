import ajax from "../utils/ajax";

export const pagingPairs = (ns: string, args: any) => {
    return ajax.get(`/api/namespaces/${ns}/pairs`, { params: { ...args } });
};
