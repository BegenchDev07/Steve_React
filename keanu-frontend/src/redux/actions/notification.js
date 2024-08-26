/*
 * https://redux.js.org/tutorials/essentials/part-1-overview-concepts
 * The type of action should like "domain/eventName"
 */
import {
    MESSAGE_RECV
} from '../constants/notificationConstants';
import AISTATUS from "../../../../share/AISTATUS.mjs";

export const inferStart = (uuid, userId) => ({
    type: AISTATUS.inferStart,
    payload: {uuid: uuid, value: 0, userId: userId}
});

export const inferUpdateProgress = (uuid, userId, value) => ({
    type: AISTATUS.inferUpdateProgress,
    payload: {uuid: uuid, value: value, userId: userId}
});

// show image in generating
export const inferUpdateDetail = (uuid, userId, value) => ({
    type: AISTATUS.inferUpdateDetail,
    payload: {uuid: uuid, value: value, userId: userId}
});

// the inference is done
export const inferEnd = (uuid, userId) => ({
    type: AISTATUS.inferEnd,
    payload: {uuid: uuid, value: 1, userId: userId}
});

// the image is uploaded to S3
export const uploadEnd = (uuid, userId, value) => ({
    type: AISTATUS.uploadEnd,
    payload: {uuid: uuid, value: value, userId: userId}
});

// ERROR means the inference is failed
export const inferError = (uuid, userId, value) => ({
    type: AISTATUS.inferError,
    payload: {uuid: uuid, value: value, userId: userId}
});

export const messageRecv = (sender_id,content,msg_type) => ({
    type: MESSAGE_RECV,
    payload: {sender_id: sender_id, content: content,type:msg_type}
});