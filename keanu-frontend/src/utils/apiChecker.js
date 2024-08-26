import {createAlert} from "/src/redux/reducers/AlertSlice";
import {getS3} from "/src/utils/reader.js";

export function apiCatcher(dispatch, fnc, ...params) {
    //console.log(fnc,params);
    return fnc(...params)
        .then(data => {
            if (data["result"] === "success")
                return Promise.resolve(data.value);
            else {
                console.error(data)
                dispatch(createAlert({
                    type: 'error',
                    message: `${fnc.name} failed: ${JSON.stringify(data.error)}`,
                }))
                return Promise.reject(data.error);
            }
        })
}

export function s3Catcher(dispatch, methodName, ...params) {
    const s3 = getS3();
    return s3[methodName](...params).catch((error) => {
        // todo: createAlert seems not working,so I use console.error
        console.error(`s3 failed: ${JSON.stringify(error)}`)
        dispatch(createAlert({
            type: 'error',
            message: `s3 failed: ${JSON.stringify(error)}`,
        }))
        return Promise.reject(error);
    })
}

export function assertChecker(dispatch, condition, msg) {
    if (condition === true) return;

    debugger;
    dispatch(createAlert({
        type: 'error',
        message: msg,
    }));
}