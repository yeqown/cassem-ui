// const MappingDT = {
//     1: "Integer",
//     2: "Float",
//     3: "String",
//     4: "Boolean",
//     5: "List",
//     6: "Dict",
// }

import { vModelCheckbox } from "@vue/runtime-dom";
import { List } from "ant-design-vue";

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

interface Pair {
    key: string
    value: {
        pairKey: string
        value: any
    }
}

interface FieldFromAPI {
    fieldType: Number
    key: string
    value: any
}

interface fieldVO {
    fieldType: Number
    key: string
    pairs: pairVO[]
}

interface pairVO {
    key: string
    pairKey: any
}

// transformField transform field.value from "pair + pair list + pair dictionary" into
// []pairVO
export const transformField = (f: FieldFromAPI): fieldVO => {
    let arr: pairVO[] = [];
    if (f.fieldType === 1) {
        //  KV
        let v: Pair = f.value;
        arr.push({ key: "-", pairKey: v.key })
        return {
            fieldType: f.fieldType,
            key: f.key,
            pairs: arr,
        }
    }

    if (f.fieldType === 2) {
        //  LIST
        let v: Pair[] = f.value;
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
    let v: Record<string, Pair> = f.value;
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