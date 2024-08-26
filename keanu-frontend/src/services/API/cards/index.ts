import keanuFetch from "../../../utils/keanuFetch";

import { getComments } from "../comments";
import {getBackendURL} from "../../../utils/reader";
const baseURL = getBackendURL();
const fetch = keanuFetch();

export type Card = {
  issuePic: string;
  avatar: string;
  user: {
    username: string,
    avatar: null
  },
  create_time: string;
  title: string;
  ProjectIssueHasTag: string[];
  content:string;
  id:number;
  reactions: number;
  comments: number;
};
type fetchCardResult = {
  cards: Card[];
  totalPage:number;
}
export type FilterObject = {
  filterType: string;
  param?: string;
  orderBy? :string;
}

//TODO: data.page backend, reaction calculate
function fetchCardsFilteredBy(filterObject:FilterObject): Promise<fetchCardResult>{
  const url = new URL(
    "/api/fetchCardsFilteredBy/?filter=" +
    filterObject.filterType +
      (filterObject.param ? "&param=" + filterObject.param : "") + (filterObject.orderBy? "&orderBy" + filterObject.orderBy : ""),
    baseURL
  );
  return fetch.get(url)
  .then((data: any) => {
    if (filterObject.filterType == "tag"){
      data.result = data.result[0].ProjectIssueHasTag.map((ProjectIssueHasTag)=>{return ProjectIssueHasTag.issue})
    }
      for (let i = 0; i <  data.result.length; i++) {
        data.result[i].comments = 0
        data.result[i].reactions = 0
        getComments(data.result[i].project_id).then((result)=>{
          data.result[i].comments = result.comments.length
        })
    }
    console.log(data)

    return {cards:data.result,totalPage:0}
  }).then((response: any) => {
    return Promise.resolve(response);
  }).catch((err: any) => {
    return Promise.reject(err);
  }
  );

};
export { fetchCardsFilteredBy }
