import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
} from "../constants/userConstants.js";
import AuthService from "../../services/auth.service.js";
import {apiCatcher} from "../../utils/apiChecker";

export const emailLogin =
    (email = null, password, username = null) => (dispatch) => {
        return apiCatcher(dispatch, AuthService.login, email, password, username)
            .then(({profile, loginToken, username}) => {
                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: {user: {profile, loginToken, username}},
                });
                return Promise.resolve();
            })
            .catch((error) => {
                dispatch({
                    type: USER_LOGIN_FAIL,
                });
                return Promise.reject();
            });
    };

export const googleLogin =
    (sub) => (dispatch) =>
        apiCatcher(dispatch, AuthService.profile, sub)
            .then((data) => {
                if (data.loginToken) {
                    localStorage.setItem("user", JSON.stringify(data));
                    dispatch({
                        type: USER_LOGIN_SUCCESS,
                        payload: {user: data},
                    });
                }
                return Promise.resolve(data);
            })

export const logout = (loginToken) => (dispatch) => {
    return apiCatcher(dispatch, AuthService.logout, loginToken)
        .then(_ => {
            dispatch({
                type: USER_LOGOUT,
                payload: {},
            });
            return Promise.resolve();
        })
        .catch((error) => {
            // todo: we should dispatch something here
            return Promise.reject();
        });
};