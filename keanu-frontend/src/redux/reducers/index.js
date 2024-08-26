import {combineReducers} from "@reduxjs/toolkit";
import auth from "./auth";
import {AlertSlice} from "./AlertSlice";
import menu from "./menu";
// import file from "./file";
import notification from "./notification";

export default combineReducers({
    auth,
    alerts: AlertSlice.reducer,
    menu,
    // file,
    notification
});