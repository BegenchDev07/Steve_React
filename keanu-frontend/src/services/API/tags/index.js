import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";

const baseURL = getBackendURL();

const fetch = keanuFetch();

// export type Tag = {
//   id?: number;
//   name;
//   // create_at;
//   style;
//   // check_passed: number;
//   // deleted: number;
//   // extra: JSON;
// };

export function getTags() {
    const url = new URL("/api/tags", baseURL).href;
    return fetch
        .get(url);
}

export function getHotTags(num=4) {
    const url = new URL(`/api/tag/items/${num}`, baseURL);
    return fetch.get(url);
}

export function createTag(name, style) {
    const url = new URL("/api/tags", baseURL).href;
    return fetch
        .post(url, {
            name,
            style,
        });
}

export function editTag(name, style) {
    const url = new URL("/api/tags", baseURL).href;
    return fetch
        .put(url, {
            name,
            style,
        });
}

export function deleteTag(name, style) {
}
