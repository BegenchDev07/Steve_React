import keanuFetch from "./keanuFetch";
import { getBackendURL } from "./reader";

const fetch = keanuFetch();
const baseURL = getBackendURL();


export function updatePassword (email,token,password) {    
    const url = new URL(`/api/user/reset/password/`,baseURL)
    return fetch.post(url,{
        email,
        password,
        token
    })
}

export function sendEmail (email) {
    const url = new URL(`/api/user/reset/password/${email}`,baseURL)    
    return fetch.get(url)
}


export function updateEmail (email) {
    const url = new URL(`/api/user/reset/email/`,baseURL)    
    debugger;
    return fetch.post(url,{email})
}