import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";

const fetch = keanuFetch();
const baseURL = getBackendURL();

export function getMsgs() {
    const url = new URL(`/api/message`, baseURL).href; //https://api.keanu.plus/api/message/list
    return fetch
        .get(url);
}

export function delMsg(issue_update_id) {
    const url = new URL(`/api/message/issue_update/${issue_update_id}`, baseURL).href; //https://api.keanu.plus/api/message/issue_update/${issue_update_id}
    return fetch
        .delete(url);
}

export function postMsg(receiver, messageObj) {
    const url = new URL(`/api/message`, baseURL).href; //https://api.keanu.plus/api/message/inbox_message
    return fetch
        .post(url, {
            receiver,
            messageObj
        });
}

export function getContacts() {
    const url = new URL(`/api/message/contacts`, baseURL).href; //https://api.keanu.plus/api/message/list
    return fetch
        .get(url);
}

export function getMsgWithContact(contact_id, skip, take) {
    const url = new URL(`/api/message/${contact_id}`, baseURL); //https://api.keanu.plus/api/message/contact
    url.searchParams.set('skip', skip);
    url.searchParams.set('take', take);
    return fetch.get(url);
}