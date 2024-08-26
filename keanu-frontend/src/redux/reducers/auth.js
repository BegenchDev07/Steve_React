import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
} from "../constants/userConstants.js";

const user = JSON.parse(localStorage.getItem("user")?? "null");
const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
      };
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
      };
    case USER_REGISTER_FAIL:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
      };
    case USER_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        isLoggedIn: false,
        user: null,
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        user: null,
      }

    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoggedIn: true,
        user: payload.user,
      };
    case USER_LOGOUT:
      return {
        ...state,
        loading: false,
        isLoggedIn: false,
        user: null,
      }
    default:
      return state;
  }
}