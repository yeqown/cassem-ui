export const mappingDT = {
    1: "Integer",
    2: "String",
    3: "Float",
    4: "Boolean",
    5: "List",
    6: "Dict",
};

export const mappingFT = {
    1: "KV",
    2: "Array",
    3: "Dictionary",
}

interface pairFromAPI {
    key: string
    datatype: number
    value: {
        pairKey: string
        value: any
    }
}

export interface fieldFromAPI {
    fieldType: Number
    key: string
    value: any
}

export interface fieldVO {
    fieldType: Number
    key: string
    pairs: fieldPairVO[]
}

interface fieldPairVO {
    key: string
    pairKey: any
}

// transformField transform field.value from "pair + pair list + pair dictionary" into
// []fieldPairVO
export const transformField = (f: fieldFromAPI): fieldVO => {
    let arr: fieldPairVO[] = [];
    if (f.fieldType === 1) {
        //  KV
        let v: pairFromAPI = f.value;
        arr.push({ key: "-", pairKey: v.key })
        return {
            fieldType: f.fieldType,
            key: f.key,
            pairs: arr,
        }
    }

    if (f.fieldType === 2) {
        //  LIST
        let v: pairFromAPI[] = f.value;
        v.forEach((pair, idx) => {
            arr.push({ key: "-", pairKey: pair.key })
        })
        return {
            fieldType: f.fieldType,
            key: f.key,
            pairs: arr,
        }
    }

    //  DICT
    let v: Record<string, pairFromAPI> = f.value;
    for (const key in v) {
        let pair = v[key]
        arr.push({ key, pairKey: pair.key })
    }
    return {
        fieldType: f.fieldType,
        key: f.key,
        pairs: arr,
    }
}

// transformIntoField
export const transformIntoField = (f: fieldVO): fieldFromAPI => {
    let v: any = null;
    switch (f.fieldType) {
        case 1:
            //  KV
            v = f.pairs[0].pairKey;
            break;
        case 2:
            //  LIST
            v = [];
            f.pairs.forEach((item, idx) => {
                v.push(item.pairKey);
            })
            break
        case 3:
            //  DICT
            v = {};
            f.pairs.forEach((item, idx) => {
                v[item.key] = item.pairKey
            })
            break
    }

    return {
        fieldType: f.fieldType,
        key: f.key,
        value: v,
    }
}

interface editForm {
    key: string
    datatype: number
    value: any
    listValue: any[],
    dictValue: Record<string, any>[],
}

// transformIntoPair
// TODO(@yeqown): convert from form model into API request body.
export const transformIntoPair = (p: editForm): any => {
    let v: any = null;

    switch (p.datatype) {
        case 5:
            v = p.listValue;
            break;
        case 6:
            v = p.dictValue;
            break;
        default:
            v = p.value;
            break;
    }

    return {
        key: p.key,
        datatype: p.datatype,
        value: v,
    }
}