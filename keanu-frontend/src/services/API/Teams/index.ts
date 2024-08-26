

import { getTimeMeasureUtils } from "@reduxjs/toolkit/dist/utils";
import keanuFetch from "../../../utils/keanuFetch";
import {getBackendURL} from "../../../utils/reader";


const baseURL = getBackendURL();

const fetch = keanuFetch();
export type Team = {
    teamName : string;
    teamFounders : string;
    teamFoundersAvatar: string;
    teamContact : string;
    teamIntro : string;
    teamMatchInfo : string;
    teamLogo : string;
    teamRegion: string;
    teamLanguage: string;
    projectId: number;
    projectName : string;
    projectIntro : string;
    financialSituation : string;
    engine: string;
    jobs: string;
}

export type Teams = {
    teams : Team[]
}

export function getTeams() : Promise<Teams>{
    const url = new URL(`/teams}`,baseURL).href;
    return fetch
    .get(url);
}
export function getTeam() : Promise<Team>{
  const url = new URL(`/team`,baseURL).href;
    return fetch
    .get(url);
}