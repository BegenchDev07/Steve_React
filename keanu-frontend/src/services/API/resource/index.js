import keanuFetch from "../../../utils/keanuFetch";
import {$assert, getBackendURL,$isNumber} from "../../../utils/reader";

const baseURL = getBackendURL();

const fetch = keanuFetch();


export function getResource (uuid,type) {
    $assert(type === 'post'|type === 'product'|type === 'project');
    const url = new URL(`/api/${type}/item/${uuid}`,baseURL)
    return fetch.get(url)
}

export function createProject({uuid,type,cover,description,tags,is_private,title, data_link}){
    debugger;
    const url = new URL(`/api/project/item`, baseURL);
    return fetch.post(url, {uuid,type,cover,description,tags,is_private,title, data_link})
}

// export function createResource( parmas) {
//     const url = new URL(`/api/resource/items`, baseURL);
//     return fetch.post(url, parmas)
// }

export function  createPost(params){
    debugger;
    const url = new URL(`/api/post/item`, baseURL);
    return fetch.post(url, params);
}


export function  createProduct(params){
    debugger;
    const url = new URL(`/api/product/item`, baseURL);
    return fetch.post(url, params);
}


//Obsolete left for reference
// export function updateResource(uuid,title,tags) {
//     const url = new URL(`/api/resource/item`, baseURL); //update the resource resource
//     return fetch.put(url, {
//         uuid,title,tags
//     });
// }


export function updatePost({uuid,type,cover,description,tags,is_private,title,totalSize,topbanner}) {
    debugger
    const url = new URL(`/api/post/item`, baseURL); //update the post/resource
    return fetch.put(url, {uuid,type,cover,description,tags,is_private,title,totalSize});
}


export function updateProduct({uuid,type,cover,description,tags,is_private,title,product_item_arr,totalSize,topbanner}) {
    debugger
    const url = new URL(`/api/product/item`, baseURL); //update the resource/product
    return fetch.put(url, {uuid,type,cover,description,tags,is_private,title,product_item_arr,totalSize});
}


export function deletePost(uuid) {
    const url = new URL(`/api/resource/item`, baseURL); //update the resource resource
    return fetch.delete(url, {uuid});
}


export function listResourceItemsByUsr(username, skip=0, take=9) {
    $assert($isNumber(skip)&&$isNumber(take));
    const url = new URL(`/api/resource/item/@${username}`, baseURL);
    url.searchParams.set('skip', skip);
    url.searchParams.set('take', take);
    return fetch.get(url);
}

export function listResourceItemsByTag(type,tags, skip=0,take=2) {
    //http://localhost:3000/api/resource/items/post?tag=detective&tag=brainstorm&skip=1&take=1
    const tagCondition = tags.map(tag=>`tag=${tag}`).join('&');
    const url = new URL(`/api/resource/item/${type}?${tagCondition}`, baseURL);
    url.searchParams.set('skip', skip);
    url.searchParams.set('take', take);
    return fetch.get(url);
}
export function listProductNeedCheckIn() {
    const url = new URL(`/api/product/product-item/pending/check`, baseURL);
    return fetch.get(url);
}

export function checkInProuctItem(uuid){
    const url = new URL(`/api/product/product-item/checkin`, baseURL);
    return fetch.post(url, {uuid});
}
