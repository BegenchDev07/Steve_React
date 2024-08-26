import keanuFetch from "../../../utils/keanuFetch";
import { getBackendURL } from "../../../utils/reader";
const baseURL = getBackendURL();
const fetch = keanuFetch();


export const getTransactionHistory = () => {
    const url = new URL('api/product/transaction',baseURL)
    return fetch.get(url);
}