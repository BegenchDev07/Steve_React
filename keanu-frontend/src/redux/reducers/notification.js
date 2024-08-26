/**
 * https://redux.js.org/tutorials/essentials/part-1-overview-concepts#reducers
 */
import {
    MESSAGE_RECV
} from "../constants/notificationConstants";
import AISTATUS from "../../../../share/AISTATUS.mjs";

const initialState = {
    uuid: '',
    status: '',
    value: 0,
    userId: '',
    type: ''
};

export default function notification(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case AISTATUS.inferStart:
            return {
                ...state,
                uuid: payload.uuid,
                status: payload.status,
                value: payload.value,
                userId: payload.userId,
                type: type
            };
        case AISTATUS.inferUpdateProgress:
            return {
                ...state,
                status: payload.status,
                value: payload.value,
                type: type
            };
        case AISTATUS.inferUpdateDetail:
            return {
                ...state,
                status: payload.status,
                value: payload.value,
                type: type
            };
        case AISTATUS.inferEnd:
            return {
                ...state,
                status: payload.status,
                value: payload.value,
                type: type
            };
        case AISTATUS.uploadEnd:
            return {
                ...state,
                status: payload.status,
                value: payload.value,
                type: type
            };
        case AISTATUS.inferError:
            return {
                ...state,
                status: payload.status,
                value: payload.value,
                type: type
            };
        case MESSAGE_RECV:
            return {
                ...state,
                type: payload.type,
                sender_id: payload.sender_id,
                content: payload.content
            }
        default:
            return state;
    }
};