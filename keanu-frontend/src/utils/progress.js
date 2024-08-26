import {$readPath} from "./reader.js";

// sum the loadingSize of all the file to represent current progress
export const calcCurrentProgress = (data) => {
    const dataArr = data.flat().filter(ele => ele instanceof File);
    return dataArr.reduce(((acc, cur) => acc += cur.loadingSize), 0);
}

export const getTotalSize = (data) => {
    return data.reduce(((acc, cur) => acc += cur[1].size), 0);
}

export const checkFailure = (data,type) => {
    // judge if the data is complete
    debugger;
    const cover = !!(data.media.cover && data.media.cover.length),
        // resource = !!(data.media.resource && data.media.resource.length),
        title = !!data.title,
        topbanner = !!((type === 'project') ? true : data.media.topbanner && data.media.topbanner.length);

    const result = cover && title && topbanner;

    // get the name of the missing data
    const errs = [{cover}, {title}, {topbanner}]
        .map(ele => Object.entries(ele)[0])
        .filter(([, value]) => !value)
        .map(([key]) => key);

    return {result, errs};
}

