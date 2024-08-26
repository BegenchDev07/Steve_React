import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";

const fetch = keanuFetch();
const baseURL = getBackendURL();

export type User = {
  id: number;
  username: string;
  avatar: string;
};

export type Comment = {
  id: number;
  owner: User;
  content: string;
  created_at: Date;
  likes: number;
  dislikes: number;
  extra: object;
};
export type Comments = {
  comments: Comment[];
};


export function getComments(uuid: string) {//
  const url = new URL(`/api/resource/comment/${encodeURIComponent(uuid)}`, baseURL).href;//
  return fetch
    .get(url);
}

export function postComments(uuid: string, resource_uuid: string, link:string) {//
  const url = new URL(`/api/resource/comment`, baseURL).href; //
  return fetch
      .post(url, {uuid,resource_uuid, link});
}


export function deleteComment(commentId: number) {

}

export function subIssue( link:string, method ='subscribe') {
  const url = new URL(`/api/resource/subscribe/${encodeURIComponent(link)}`, baseURL).href;
  return fetch
    .post(url, {method});
}

///api/${projectId}/issues/${issueNumber}/comments
export function checkSub(link: string) {
  const url = new URL(`/api/resource/check/${encodeURIComponent(link)}`, baseURL).href;
  return fetch
    .get(url);
}
