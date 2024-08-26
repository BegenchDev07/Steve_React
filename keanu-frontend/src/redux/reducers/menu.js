import {MENU_LOADING_PROGRESS, MENU_NAVI, MENU_RESOURCE_FEEDBACK} from "../constants/menuConstants";

const initialState = {status: 'init'};

export default function menu(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case MENU_RESOURCE_FEEDBACK:
            return {
                type: MENU_RESOURCE_FEEDBACK,
                ...state,
                feedback: payload.feedback
            };
        case MENU_LOADING_PROGRESS:
            return {
                type: MENU_LOADING_PROGRESS,
                ...state,
                status: payload.status,
                progress: payload.progress,
            };
        case MENU_NAVI:
            return {
                type: MENU_NAVI,
                ...state,
                value: payload.value,
            };
        default:
            return state;
    }
};