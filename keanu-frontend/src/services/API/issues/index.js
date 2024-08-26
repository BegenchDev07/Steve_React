
import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";
const fetch = keanuFetch();
const baseURL = getBackendURL();
export function newIssue(projectId, link, tagIds, title) {
  const url = new URL("/api/issues", baseURL).href;

  return fetch.post(url, {
    projectId,
    link,
    tagIds,
    title
  })
}

export function listIssues(projectId) {
  const url = new URL(`/api/${projectId}/issues`, baseURL).href; //https://api.keanu.plus/api/issues
  return fetch
    .get(url)
}

export function getIssue(projectId, issueId){
  const url = new URL(`/api/${projectId}/issues/${issueId}`, baseURL).href; //https://api.keanu.plus/api/issues/1
  return fetch.get(url)
}

