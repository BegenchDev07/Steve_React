import keanuFetch from "../../../utils/keanuFetch";

import {readAsDataURL, Img2DataURL, getBackendURL,getS3} from "../../../utils/reader.js";

const baseURL = getBackendURL();

const fetch = keanuFetch();

export type ProjectMeta = {
    name: string;
    description: string;
    website:string;
    isPrivate: boolean;
};

export type ProjectData = {
    id: number;
    projectID: string;
    name: string;
    owner: string;
    isPrivate: boolean;
    projectMeta: ProjectMeta;
    createdAt: Date;
};

export type ProjectInfo = {

    project_id: string;
    project_cover: string;
    contributor: string;
    createdAt: Date;
    policy: number;
    projectData: ProjectData;
};

export type Project = {
    projectId: number;
    projectName: string;
    projectCoverImage: string;
    userAvatar: string;
    userName: string;
    createdAt: Date;
    likes: number;
    comments: number;
};

export type Projects = {
    projects: Project[];
};

export function checkProject(projectName: string): Promise<any> {
    const url = new URL("/api/project/check-proj", baseURL);
    return fetch.post(url, {projectName});
}

export function createProject(projectMeta: ProjectMeta): Promise<any> {
    const url = new URL("/api/project/create", baseURL);

    const {name, isPrivate} = projectMeta;

    return fetch.post(url, {
        name,
        isPrivate,
    });
}

// export function getProjects(): Promise<ProjectInfo[]> {
//   const url = new URL("/api/projects", baseURL); //https://api.keanu.plus/api/projects

//   return fetch
//     .get(url)
//     .then((data: any) => apiChecker(data));
// }
const src = "https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/default-cover.png";


let coverURL = src;//Img2DataURL(src);
export function getUserProjects(username: string) {
    const url = new URL(`/api/project/items/${username}`, baseURL);
    return fetch.get(url);
}

export const getDefaultCoverURL = () => {
    return Promise.resolve(coverURL)
};

export const getProjectCoverURL = (projectId, projects) =>
    new Promise((resolve) => {
        const
            file = ".setting/cover.png",

            s3 = getS3();

        const buff = projectId.split("-");
        buff.push(file);
        const filePath = buff.join("/");

        let result = null;
        return s3
            .downloadFile(projectId, filePath)
            .then((blob) => Promise.resolve(readAsDataURL(blob)))
            .then(dataURL => result = dataURL)
            .catch(_ => {
                console.warn(`cannot download ${filePath}`)
            })
            .finally(_ => {
                const project = projects.find(({project_id}) => project_id == projectId);
                if (result != null)
                    project['project_cover'] = result;
                return resolve(projects);
            });
    });


export function getCommunityProjects(): Promise<Projects> {
    const url = new URL("/api/project/list-all", baseURL).href;
    return fetch.get(url);
}


export function getProject(projectId: string): Promise<ProjectInfo> {
    const url = new URL(`/api/project/${projectId}`, baseURL);

    return fetch.get(url);
}

export function updateProject(
    projectId: string,
    projectMeta: ProjectMeta
): Promise<ProjectInfo> {
    const url = new URL(`/api/project/update/${projectId}`, baseURL);
    const {name, description, website, isPrivate} = projectMeta;

    return fetch.put(url, {
        name,
        description,
        website,
        isPrivate,
    });
}

export function deleteProject(projectId: string): Promise<ProjectInfo> {
    const url = new URL(`/api/project/${projectId}`, baseURL);

    return fetch.delete(url);
}

export function getSearchedUsers(name: string) {
    const url = new URL(`/api/user/search/@${name}`, baseURL);
    return fetch.get(url);
}

export function inviteCollaborator(projectId: string, invitee: string) {
    const url = new URL(`/api/project/invite/${projectId}`, baseURL);
    return fetch.post(url, {
        invitee
    });
}

export function getInvitations(projectId: string) {
    const url = new URL(`/api/project/invite/${projectId}`, baseURL);
    return fetch.get(url);
}

export function  genSDImage(projectId,uuid,params) {
    const url = new URL(`/api/project/SD-inferrer/${projectId}`, baseURL);
    return fetch.post(url,{
        uuid,
        params
    });
}
