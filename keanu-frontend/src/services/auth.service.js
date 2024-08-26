import keanuFetch from "../utils/keanuFetch";
import {getBackendURL} from "../utils/reader";

const baseURL = getBackendURL();
const API_URL = `${getBackendURL()}/api`;

const fetch = keanuFetch();

const login = (email = null, password, username = null) =>
    fetch.post(`${API_URL}/auth/login`, {email, password, username})
        .then((res) => {
            const {profile, loginToken, username} = res.value;
            localStorage.setItem("user", JSON.stringify({profile, loginToken, username}));
            return Promise.resolve(res);
        });

//TODO: should logout in server side
const logout = (loginToken) => {
    return fetch.get(`${API_URL}/auth/logout/${loginToken}`)
        .then((res) => {
            localStorage.removeItem("user");
            return Promise.resolve(res);
        });
};

const profile = (sub) => fetch.get(`${API_URL}/auth/google?code=${sub}`);

export default {login, logout, profile};