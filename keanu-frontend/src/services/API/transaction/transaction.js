import keanuFetch from "../../../utils/keanuFetch";
import { getBackendURL } from "../../../utils/reader";

const baseURL = getBackendURL();
const fetch = keanuFetch();

export function refreshTransactionStatus (uuid) {
    // debugger;
    const url = new URL('api/product/refresh/transaction',baseURL)
    return fetch.post(url,{transaction_uuid:uuid})
}