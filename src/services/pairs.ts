import ajax from "../utils/ajax";

export const pagingPairs = (ns: string, args: any) => {
    console.log(args);
    return ajax.get(`/api/namespaces/${ns}/pairs`, { params: { ...args } });
};

export const getPairDetail = (ns: string, key: string) => {
    return ajax.get(`/api/namespaces/${ns}/pairs/${key}`);
}

interface pair {
    key: string
    value: any
    datatype: number
}

export const savePair = (ns: string, pair: pair) => {
    let data = {
        datatype: pair.datatype,
        value: pair.value,
    };

    return ajax.post(`/api/namespaces/${ns}/pairs/${pair.key}`, data);
}