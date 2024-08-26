import {deleteFileStartsWith} from "./dexie/operation.js";

export const save = (uuid, key, value) => {
    const data = JSON.parse(localStorage.getItem(uuid) || '{}');
    localStorage.setItem(uuid, JSON.stringify({...data, [key]: value}));
}

export const load = (uuid, key) => {
    const data = JSON.parse(localStorage.getItem(uuid) || '{}');
    return data.hasOwnProperty(key) ? data[key] : undefined;
}


export const del = (uuid, key) => {
    const data = JSON.parse(localStorage.getItem(uuid) || '{}');
    delete data[key];
    localStorage.setItem(uuid, JSON.stringify({...data}));
    return true;
}


function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

export const saveObjectArray = (id, value) => {
    let data = JSON.parse(localStorage.getItem(id) || '[]');
    const isDuplicate = data.some(item => isEqual(item, value));
    if (!isDuplicate) {
        data.push(value);
        localStorage.setItem(id, JSON.stringify(data));
    }
}

export const loadObjectArray = (id) => {
    return JSON.parse(localStorage.getItem(id) || '[]');
}

// check if object with specific uuid exists in array
export const checkObjectArray = (id, uuid) => {
    const data = loadObjectArray(id);
    return data.some(item => item.uuid===uuid);
}

export const getObjectArrayState = (id, uuid) => {
    const data = loadObjectArray(id);
    return data.find(item => item.uuid===uuid).state;
}

// remove object that owns specific uuid from array
export const removeObjectArray = (id, uuid) => {
    let data = loadObjectArray(id);
    data = data.filter(item => item.uuid!==uuid);
    localStorage.setItem(id, JSON.stringify(data));
    localStorage.removeItem(uuid);
    // todo: need to remove file in indexeddb
    // id is like "test-resource" here
    const username = id.slice(0,-9); //TODO id.split('-')[0]
    return deleteFileStartsWith(`${username}/.profile/${uuid}`);
}

