import ajax from "../utils/ajax";

export const pagingPairs = (ns: string, args: any) => {
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
        value: pair.value, // TODO(@yeqown): should convert into corret type rather than string.
    };

    return ajax.post(`/api/namespaces/${ns}/pairs/${pair.key}`, data);
}