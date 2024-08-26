const initialState = { resource: {}, cover: {}, topbanner: {} };

export default function file (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case "FILE_UPLOAD":
            return {
                ...state,
                [payload.key]: payload.value
            };
        default:
            return state;
    }
};