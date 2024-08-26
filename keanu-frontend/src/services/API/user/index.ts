import keanuFetch from "../../../utils/keanuFetch";
import {Project} from "../project";
import {getBackendURL, getS3} from "../../../utils/reader";
import {s3Catcher} from "../../../utils/apiChecker";

const baseURL = getBackendURL();

const fetch = keanuFetch();

/**
 * @param {string} username
 * @param {boolean} exist
 * @returns {Promise}
 * @description check if username is available and return {availiability} = true when exist is false, otherwise check and return username that is available
 * /api/check-username
 * */
export function checkUserName(username: string) {
    return fetch.get(new URL(`/api/user/check/@${username}`, baseURL));
}

export function createUser(username: string, email: string, password: string, platform: string | null, openid: string | null = null, invitationCode: string) {
    const url = new URL("/api/user", baseURL); //https://api.keanu.plus/api/create-user
    return fetch.post(url, {
        username,
        email,
        password,
        platform,
        openid,
        invitationCode
    });
}

export function getUserProfile(username: string) {
    const url = new URL(`/api/user/profile/@${username}`, baseURL)
    return fetch.get(url)
}

export function updateUserProfile(username: string, map:any) {
    const url = new URL(`/api/user/profile/@${username}`, baseURL);    
    return fetch.put(url, Object.fromEntries(map))
}

export function checkForUser(username: string) {
    const url = new URL(`/api/user/check/${username}`, baseURL)
    return fetch.get(url)
}

// because we put the avatar and topbanner in the specific folder, so we don't need to query the path , just use the username
export function getUserAvatar(username: string) {
    return new Promise(resolve=>
        getS3()['downloadProfile'](`${username}/.profile/avatar.png`)
            .then(res=>resolve(res))
            .catch(err=>resolve(null)))

}

export function getUserTopBanner(username: string) {
    return new Promise(resolve=>
        getS3()['downloadProfile'](`${username}/.profile/topbanner.png`)
            .then(res=>resolve(res))
            .catch(err=>resolve(null)))
}


export type Author = {
    username: string;
    avatar: string;
    topbanner: string;
    biography: string;
    // followers: Author[];
    // following: Author[];
    website: string;
    projects: {
        resources: {
            project: Project[];
        };
        collaborates: {
            project: Project[];
        };
        following: {
            project: Project[];
        };
    };
};

export type Projects = {
    resources: Project[];
    collaborates: Project[];
    followers: Project[];
};

export type Authors = {
    authors: Author[];
};

