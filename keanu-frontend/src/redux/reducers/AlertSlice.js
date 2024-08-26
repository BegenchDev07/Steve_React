import {createSlice} from "@reduxjs/toolkit";

export const ALERT_TYPE = {success:'success', error:'error', warning:'warning'};

export const AlertSlice = createSlice(
    {
        name: "alert",
        initialState: {
            alerts: []
        },
        reducers: {
            createAlert: (state, action) => {
                state.alerts.push({
                    // id: action.payload.id,
                    message: action.payload.message,
                    type: action.payload.type,
                });
            },
            showProgress: (state, action) => {


            }
        }
    }
);

export const {createAlert} = AlertSlice.actions;

export default AlertSlice