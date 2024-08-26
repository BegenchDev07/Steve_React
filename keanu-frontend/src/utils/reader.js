import {lock} from "/src/utils/locker.js";
import S3Singleton from "/src/services/s3Singleton.js";
import {createAlert} from "/src/redux/reducers/AlertSlice";

const _reader = new FileReader();

export function $assert(condition) {
    if (!condition) {
        debugger;
    }
}

export function $readPath(path) {
    $assert(path && path.startsWith);

    const
        paths = path.split('/'),
        file = paths.pop(),
        [, fileNm, fileExt] = file.match(/(.+)\.([^.]*)$/) ?? [, file, null];
    return {folder: paths.join('/'), fileNm, fileExt, file};
}

export function readAsDataURL(blob) {
    return new Promise(async (resolve, reject) => {

        const release = await lock(`reader.lock`);
        _reader.readAsDataURL(blob);
        _reader.onload = function () {
            release();
            resolve(_reader.result);
        }

    });

}

export function Img2DataURL(src) {
    return new Promise(resolve => {

        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas'),
                context = canvas.getContext('2d');
            canvas.height = image.naturalHeight;
            canvas.width = image.naturalWidth;
            context.drawImage(image, 0, 0);
            const dataURL = canvas.toDataURL('image/jpeg');
            resolve(dataURL);
        };
        image.src = src;
    })
}

export function readAsImage(blob) {
    if (!(blob instanceof Blob)) {
        throw new TypeError("Parameter must be a Blob object");
    }

    return new Promise(async (resolve, reject) => {
        const release = await lock(`reader.lock`);
        _reader.readAsDataURL(blob);
        _reader.onload = function () {
            const img = new Image();
            img.src = _reader.result;
            img.onload = _ => resolve(img);

            release();
        }

    });

}

export function $checkPreviewImage(fileMimeType) {
    const types = ['image/png', 'image/gif', 'image/jpeg'];
    return types.includes(fileMimeType);
}

export function $base64ToFileBlob(base64, name = '', type = '') {
    return new Promise(resolve => {
        const req = new XMLHttpRequest();
        const dataURL = base64.split(',').length === 2 ? base64 : `data:application/octet;base64,${base64}`;
        req.open('GET', dataURL);
        req.responseType = 'arraybuffer';
        req.onload = e => {
            const blob = new Blob([new Uint8Array(e.target.response)])
            const file = new File([blob], name, {type});
            return resolve(file);
        }
        req.send();
    });
}

export function $blob2Img(blob) {
    return new Promise(resolve => {
        const result = new Image();
        result.src = URL.createObjectURL(blob);
        result.onload = _ => {
            URL.revokeObjectURL(result.src);
            return resolve(result);
        };
    });
}

export function $clipImage(img, dWidth, dHeight) {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        width = img.width,
        height = width / (dWidth / dHeight);
    canvas.width = dWidth;
    canvas.height = dHeight;
    ctx.drawImage(img, 0, 0, width, height, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}

//from regex 101
export const $match = (regex, str = 'asdfasdfasdfsdf') => {
    let m, result = [];
    while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        m.forEach((match, groupIndex) => result.push(match));
    }


    return result;
}

export const $mdlink2title = link => {
    const buff = $match(/(.+)\/(.+)\.md/g, link);
    if (!buff[2]) return null;
    return decodeURI(buff[2]);
}

export function readAsText(blob) {

    return new Promise(async (resolve, reject) => {

        const release = await lock(`reader.lock`);
        _reader.readAsText(blob);
        _reader.onload = function () {

            release();
            resolve(_reader.result);
        }
    });

}

export function readAsArrayBuffer(blob) {

    return new Promise(async (resolve, reject) => {
        const release = await lock(`reader.lock`);
        _reader.readAsArrayBuffer(blob);
        _reader.onload = function () {
            release();
            resolve(_reader.result);
        }


    });

}

export const $genUploadingArr = (fileList, onProgress, onSkip) => {
    const paramArr = [];
    const updateProgress = (path, percentage) => {
        if (onSkip(path)) return;

        const curFile = paramArr.find(([curUrl]) => curUrl === path)[1];
        curFile.loadingSize = curFile.size * percentage / 100;
        const loadedSize = calcCurrentProgress(paramArr);
        onProgress(loadedSize);
    };
    // debugger;
    fileList.forEach(({url, file}) => {
        // fileCB(url,file)
        file['loadingSize'] = 0;
        // file['url'] = genURL(flag, file.name);
        paramArr.push([url, file, updateProgress]);
    });


    const calcCurrentProgress = (paramArr) => {
        return paramArr.reduce((acc, curVal) => {
            if (curVal[1] instanceof File) {
                return acc + curVal[1].loadingSize;
            } else {
                return acc + 0
            }
        }, 0);
    };

    return paramArr;
};
export const $exeSequential = (fnc, tasks) => {
    const result = [];
    return tasks.reduce((prev, curTask, i) => {
        return prev
            .then(_ => {
                if (Array.isArray(curTask))
                    return fnc(...curTask);

                return fnc(curTask);
            })
            .then(res => {
                result[i] = res;
                return Promise.resolve(result);
            })
    }, Promise.resolve());
};

export async function $read4MarkDoc(currentUrl, data, download) {
    const projectId = currentUrl.split('/').slice(0, 2).join('-');
    const refUrl = currentUrl.split('/')
    refUrl.pop();

    const cosPrefix =
        `${refUrl.join('/')}/`;

    const buffer = $match(/\!\[(.+)?\]\((.+)\)/g, data);
    const linkMap = [];
    for (let i = 0; i < buffer.length; i += 3) {
        const altName = buffer[i + 1] ?? "",
            link = cosPrefix + buffer[i + 2].slice(2);
        linkMap.push({origin: buffer[i], altName, link});

    }

    // console.log(data);

    for (const value of linkMap)
        value.presignedLink = await download(projectId, value.link);

    let result = data;
    for (const {origin, altName, link, presignedLink} of linkMap)
        result = result.replace(origin, `![${altName}](${presignedLink})`);


    return result;
}

export function $fetch(url, callback) {
    const param = {length: 0, loaded: 0};
    return fetch(url)
        .then(response => {
            if (!response.ok) {        //fetch cannot throw Error unless connection lost
                throw new Error(url);
            }
            const LENGTH = response.headers.get("Content-Length");
            if (!LENGTH)
                console.warn(url, 'header "Content-Length" is missing');
            param.length = Number(response.headers.get("content-length"));
            return Promise.resolve(response);
        })
        .then(response => response.body)
        .then(body => {
            const reader = body.getReader();
            return new ReadableStream({
                start(controller) {
                    return pump();

                    function pump() {
                        return reader.read().then(({done, value}) => {
                            if (done) {// When no more data needs to be consumed, close the stream
                                controller.close();
                                return;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                            param.loaded += value.length;
                            if (callback) {
                                callback(param.length ? param.loaded / param.length : param.loaded);
                                // console.log(param.length?param.loaded/param.length:param.loaded);
                            }

                            return pump();
                        });
                    }
                }
            });
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())

}


const testData = ``;


function _genID(node) {

    node.id = node.id ?? node.title;

    for (const child of node.children ?? []) {
        child.id = `${node.id}|${child.title}`;
        _genID(child);
    }

}

const _addRoot = (project, data) => [project, ...(data ?? "").split('\n').map(ele => `    ${ele}`)].join('\n');

export const $createDocTree = (data = testData, project = null) => {
    if (project)
        data = _addRoot(project, data);
    const lines = data.split('\n').filter(ele => !/^[ \t\r\n]*$/.test(ele)),
        pool = [];
    for (const index in lines) {
        const line = lines[index];
        const hasPath = /\{(.+)\}/.test(line);
        let title, path = null;
        if (hasPath) {
            [, title, path] = $match(/(\S+)\s?\{(.+)\}/mg, line);
        } else
            [, title] = $match(/(\S+)/mg, line);
        const depth = $match(/(\s\s\s\s)/mg, line).length / 2;
        let parentIndex = null;
        for (const ele of pool.slice().reverse()) {
            if (depth > ele.depth) {
                parentIndex = ele.index;
                break;
            }
        }
        pool.push({index, title, path, depth, parentIndex});
    }


    const p = pool.slice().reverse();
    while (p.length) {
        const child = p.pop(),
            {title, path} = child,
            {parentIndex} = child;
        if (parentIndex != null) {
            const parent = pool.find(({index}) => index === parentIndex);
            parent.children = parent.children ?? [];
            parent.children.push(child);
        }
    }

    const root = pool[0];
    _genID(root);
    return root;
}

function _getAllDocs(out, curNode) {
    out.push(curNode);
    if (curNode.children)
        for (const child of curNode.children)
            _getAllDocs(out, child)
}

export const $getDocsNodes = (root = {children: []}) => {
    const docs = [];
    _getAllDocs(docs, root);
    // debugger;
    return docs;
}

export const $changeId = (parentId, data) => {
    data.id = `${parentId}|${data.title}`;
    if (data.children)
        for (const child of data.children)
            $changeId(data.id, child);
}

export const fetchImageDataURL = (s3, imageLink) => {

    return s3
        .downloadProfile(imageLink)
        .then((blob) => readAsDataURL(blob))
    // .then(img=>{
    //     const [,code] = img.split('base64');
    //     const header =  /\.gif$/.test(imageLink)?`data:image/gif;`:`data:image;`
    //     const res =  [header, 'base64',code].join('');
    //     debugger;
    //     return res;
    // })
};

export function $isNumber(input) {
    return input != null && (Number(input) || Number(input) == 0) ? true : false;
};

export const fetchImage = (s3, imagePath) => {
    return s3
        .downloadProfile(imagePath)
};

export const fetchInferImage = (s3, imageS3Link) => {
    return s3
        .downloadAIFile(imageS3Link)
        .then((blob) => readAsDataURL(blob))
        .then((img) => {
            // imageLink is ready to show
            return img;
        });
};

export const fetchImages = async (s3, imgGrp) => {
    const res = []
    for (let imgLink of imgGrp) {
        await s3
            .downloadProfile(imgLink)
            .then((blob) => readAsDataURL(blob))
            .then((img) => {
                // use imgURL for rendering
                // setTopBannerLink(img);
                console.log(img)
                res.push(img);
            });
    }

    return res
};

export function getBackendURL(port = 3000) {
    // return "http://34.202.215.177:3000"
    if (typeof document !== 'undefined') { //for browser
        const isLocal = document.baseURI.includes("localhost") || document.baseURI.includes("192");
        return isLocal
            ? `${location.protocol}//${location.hostname}:${port}` //rewrite to 3000
            // : "http://api.gamehub.cloud";
            : "https://api.gamehub.cloud";

        // return `${location.protocol}//api.gamehub.cloud`;
        // return `http://api.gamehub.cloud`;
        // return "http://d1fdockpi0w84h.cloudfront.net";
    } else
        return "http://localhost:3000/api/sts"; //for nodejs
}

export function getRedirectURL(port = 3000) {
    // return "http://34.202.215.177:3000"
    if (typeof document !== 'undefined') { //for browser
        const isLocal = document.baseURI.includes("localhost") || document.baseURI.includes("192");
        return isLocal
            ? `${location.protocol}//${location.hostname}:${port}` //rewrite to 3000
            // : "http://api.gamehub.cloud";
            : "https://www.gamehub.cloud";

        // return `${location.protocol}//api.gamehub.cloud`;
        // return `http://api.gamehub.cloud`;
        // return "http://d1fdockpi0w84h.cloudfront.net";
    } else
        return "http://localhost:3000/api/sts"; //for nodejs
}

export function genUUID() {
    if (window.crypto.randomUUID)
        return window.crypto.randomUUID();

    let id = '';

    for (let i = 0; i < 36; i++)
        id += parseInt(Math.random() * 10);
    return id;

}


export const fetchSettings = (link) => {
    const s3 = getS3()
    return s3
        .downloadProfile(link)
        .then((blob) => readAsText(blob))
        .then((data) => {
            return JSON.parse(data)
        })
        .catch((error) => {
            console.error(`encounter error while fetching project ${link}`, error)
        });
};

export const fetchIndexJson = (s3, username, uuid) => {
    return s3
        .downloadProfile(`${username}/.profile/${uuid}/index.json`)
        .then((blob) => readAsText(blob))
        .then((data) => {
            return JSON.parse(data)
        })
        .catch((error) => {
            console.error(`encounter error while fetching project ${uuid}`, error)
        });
}

function s3Catcher(dispatch, methodName, ...params) {
    const s3 = getS3();

    return s3[methodName](...params).catch((error) => {
        dispatch(createAlert({
            type: 'error',
            message: `s3 failed: ${JSON.stringify(error)}`,
        }))
        return Promise.reject(error);
    })
}

export const $fetchDocument = (dispatch, projID, link, onProgress) => {
    return s3Catcher(dispatch, 'getSignedUrl', projID, link)
        .then(url => $fetch(url, onProgress))
        .then((blob) => readAsText(blob))
}

const BUCKET = "gamehub-test-bucket",
    REGION = "us-east-1";
let __s3 = null;

export function getS3() {
    if (__s3 === null)
        __s3 = new S3Singleton({
            Bucket: BUCKET,
            Region: REGION,
            mode: S3Singleton.MODE.frontend,
            url: `${getBackendURL()}/api/sts`
        });
    return __s3;
}

export function clip2Cover(img, dWidth, dHeight) {
    const canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        width = img.width,
        height = width / (dWidth / dHeight);
    canvas.width = dWidth;
    canvas.height = dHeight;
    ctx.drawImage(img, 0, 0, width, height, 0, 0, dWidth, dHeight);
    return canvas;
}

export function $getStackLocationByIndex(level = -1) { // -1 is parent, -2 parent's parent
    const stackTrace = new Error().stack,
        isChrome = stackTrace.startsWith("Error"),
        isSafari = /(.+)@(.+)[\n]*/.test(stackTrace);
    $assert(isChrome || isSafari);
    let stack;
    if (isSafari)
        stack = stackTrace.split('\n');
    else
        stack = stackTrace.match(/at(.+)/g);
    stack.shift();

    while (level++ < 0) {
        stack.shift();
    }

    const source = stack[0];//isSafari?stack[1]:stack[0];
    $assert(source);
    //stack[0] = asyncFunctionResume@[native code]
    let data;

    if (/(file:\/\/[^ ]*\.js):(\d+):(\d+)/.test(source))
        data = source.match(/(file:\/\/[^ ]*\.js):(\d+):(\d+)/);

    if (/(https?:\/\/[^ ]*\.js):(\d+):(\d+)/.test(stack[0]))
        data = source.match(/(https?:\/\/[^ ]*\.js):(\d+):(\d+)/);

    const
        [, url, lineNum, colNum] = data;
    return {url, lineNum, colNum};
}

let debounceStore = {};

export function $debounce(fnc, delay, key) {
    const fncLocale = key ?? JSON.stringify($getStackLocationByIndex(-1));
    let job = () => {
        fnc();
        delete debounceStore[fncLocale];
    }

    if (debounceStore[fncLocale]) {
        const curJob = debounceStore[fncLocale],
            now = Date.now(),
            timeDiff = now - curJob.time;
        clearTimeout(curJob.interval);

        if (timeDiff < delay) {
            curJob.interval = setTimeout(job, delay - timeDiff);
            curJob.time = now;
        } else {
            job();
        }
    } else {
        debounceStore[fncLocale] = {time: Date.now(), interval: setTimeout(job, delay)};
    }
}

// return a function, has a timer, if the function is called again before the timer is up, the timer will be reset
export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const SYS_FLAG = {Desktop: 1, Mobile: 2, IOS: 4, OSX: 8, Windows: 16, Linux: 32, Android: 64, Intel: 128};

const system = {
    SYS_FLAG,
    SYS_INFO: {
        'Macintosh; Intel Mac OS X': SYS_FLAG.OSX | SYS_FLAG.Desktop | SYS_FLAG.Intel,
        'Windows NT': SYS_FLAG.Windows | SYS_FLAG.Desktop,
        'Android': SYS_FLAG.Linux | SYS_FLAG.Android | SYS_FLAG.Mobile,
        'CPU iPhone OS': SYS_FLAG.IOS | SYS_FLAG.Mobile,
        'CPU OS': SYS_FLAG.IOS | SYS_FLAG.Mobile
    },
    BROWSER_FLAG: {
        wechatdevtools: 1,
        Chrome: 2,
        Safari: 4,
        Firefox: 8,
        MQQBrowser: 16,
        MicroMessenger: 32,
        MiuiBrowser: 64,
        QQBrowser: 128,
        Edg: 256
    }
}

if (typeof window != 'undefined') {
    // const isIPAD = parseURL(window.location.href).params.ipad??false;
    let params = new URLSearchParams(window.location.href);
    let isIPAD = params.get("ipad") ?? false; // is the string "Jonathan"
    if (isIPAD)
        system.SYS_INFO['Macintosh; Intel Mac OS X'] = SYS_FLAG.OSX | SYS_FLAG.Mobile | SYS_FLAG.Intel;
}

export class UserAgent {
    system = '';
    sysVersion = '';
    browser = '';
    browserFlag = 0;
    sysFlag = 0;

    constructor() {
        this.initialize();
    }

    initialize(ua = navigator.userAgent,
               SYSFLAG = system.SYS_FLAG,
               SYS = system.SYS_INFO,
               BROWSERFLAG = system.BROWSER_FLAG) {

        this.system = '';
        this.sysVersion = '';
        this.browser = '';
        // this.browserFlag  = 0;
        this.sysFlag = 0;

        const buffer = $match(/\(([^)]+)\)/g, ua);

        $assert(buffer[1]);
        const core = buffer[1];

        //$match sys
        for (var key in SYS) {
            if (new RegExp(key).test(core)) {
                this.system = key;
                this.sysFlag = SYS[key];
                break;
            }
        }

        //$match sysVersion
        const [sysVersion] = $match(/((\d+[_.]*)+)/g, core);
        this.sysVersion = sysVersion.replace(/_/g, '.');

        if (/Build/.test(core)) //Linux; Android 9; SM-G973U Build/PPR1.180610.011
            //deviceInfo: SM-G973U
            this.deviceInfo = $match(/([^;\s]+)[\s]+Build/g, core)[1];
        else //if(/iPhone/.test(core))
            this.deviceInfo = core.split(';')[0];

        //sysStr = buffer[0] = '(Macintosh; Intel Mac OS X 10_15_7)'
        const sysStr = buffer[0],
            browserStr = ua.split(sysStr)[1],
            info = $match(/([A-Za-z]+)\/([\d|\.]+)/gm, browserStr);

        this.browserVersion = info.pop();
        this.browser = info.pop();

        const browserInfo = Object.entries(BROWSERFLAG).find(([key, value]) => key === this.browser);
        $assert(browserInfo);
        this.browserFlag |= browserInfo[1];
    }
}