import {top250} from "./fontImport"

export const fontFindHelper = (data) => {
    const some = top250.find(x => x.family === data.family)
    return top250.indexOf(some)
}