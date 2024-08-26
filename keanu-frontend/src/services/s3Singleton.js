import {GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {lock} from "./locker.js";
import MyHttpHandler from "./s3ExtProgessing.js";

function $fetch(url, callback) {
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

const
    BUCKET = process.env.AWS_S3_BUCKET,
    REGION = process.env.AWS_S3_REGION;

export const STS_MODE = {profile: 'profile', project: 'project', product: 'product'};

const
    _s3Instances = new Map(),
    MODE = {test: 1, backend: 2, frontend: 4};

let __Bucket = null, __s3Client = null, __Region = null;

const __UPLOAD_CALLBACKS = {};

export default class S3Singleton {
    static MODE = MODE;
    mode = 0;
    url = null;

    constructor(params = {mode: MODE.test | MODE.frontend}) {
        this.mode = params.mode ?? MODE.test | MODE.frontend;
        this.url = params.url; //((this.mode & MODE.test) ? STS_TEST_API:STS_API_URL);

        __Bucket = params.Bucket ?? BUCKET;
        __Region = params.Region ?? REGION;

        if (!this.url && (this.mode & MODE.frontend)) throw new Error('sts url is missing');
        if (__Bucket && !(this.mode & MODE.frontend)) {
            this.mode = MODE.backend;
            __s3Client = new S3Client({
                region: __Region,
                credentials: {
                    accessKeyId: process.env.AWS_KEY_ID,
                    secretAccessKey: process.env.AWS_KEY_SECRET
                }
            });
        }
    }

    getInstance(mode, uuid) {//value = project:uuid, product:item uuid
        //eu: this.mode is not equal to mode, I believe there is a better name,maybe type?

        if (this.mode & MODE.backend)
            return Promise.resolve(__s3Client);
        return lock(`s3.download.lock`)
            .then(release => {
                if (_s3Instances.has(uuid)) {
                    release();
                    return Promise.resolve(_s3Instances.get(uuid));
                }

                let headers;

                if (this.mode & MODE.test)
                    headers = {
                        "Authorization": "XXX",
                        "Content-Type": "application/json"
                    };
                else if (localStorage !== undefined) {
                    const user = JSON.parse(localStorage.getItem("user") || "{}");
                    headers = {
                        "Authorization": `${user.loginToken ?? ''}`,
                        "Content-Type": "application/json"
                    }
                } else
                    throw new Error('s3Singleton needs login-token');

                console.log('post sts', this.url, JSON.stringify({uuid}));

                // call sts and check
                return fetch(this.url, {
                    headers,
                    method: 'POST',
                    body: JSON.stringify({uuid, mode})
                })
                    .then(response => response.json())
                    .then(res => {
                        release();
                        if (res.result === 'fail') {
                            console.error(this.url, res);
                            throw new Error('STS error');
                        }
                        const myHttpHandler = new MyHttpHandler();
                        myHttpHandler.onProgress = (path, evt) => {
                            const percentComplete = evt.loaded / evt.total * 100;
                            const baseURL = decodeURIComponent(path.split('?')[0].slice(1));
                            if(typeof __UPLOAD_CALLBACKS[baseURL] == 'function')  __UPLOAD_CALLBACKS[baseURL](baseURL,percentComplete);
                        };

                        const {Credentials, FederatedUser} = res.value,
                            {AccessKeyId, SecretAccessKey, SessionToken} = Credentials,
                            s3Instance = new S3Client({
                                region: __Region,
                                credentials: {
                                    accessKeyId: AccessKeyId,
                                    secretAccessKey: SecretAccessKey,
                                    sessionToken: SessionToken,
                                },
                                requestHandler: myHttpHandler
                            });

                        _s3Instances.set(uuid, s3Instance);

                        return Promise.resolve(s3Instance);
                    });
            })
    }

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-s3/Class/ListObjectsV2Command/
    listFiles(projectId, prefix = projectId.split('-').join('/')) {
        return this.getInstance(projectId)
            .then(s3Client => s3Client.send(new ListObjectsV2Command({ // ListObjectsRequest
                Bucket: __Bucket, // required
                // Key:'jimmy/.doc/autoBr.png'
                // Delimiter:'/',
                Prefix: prefix,
            })))
            .then(({Contents}) => Promise.resolve(Contents))
    }

    getSignedUrl(projectId, {path, version}) {
        return this.getInstance(projectId)
            .then(s3Client => getSignedUrl(s3Client, new GetObjectCommand({
                Bucket: __Bucket, // required
                Key: path,
                VersionId: version
            })))
    }

    // deprecated: we find a better way so we don't use this anymore
    // downloadFile(projectId, path) {
    //     if(typeof path === undefined){
    //         path = projectId;
    //         projectId = null;
    //     }
    //         return this.getInstance(projectId)
    //         .then(s3Client=>s3Client.send(new GetObjectCommand({
    //             Bucket:__Bucket, // required
    //             Key:path})))
    //         // .then(steam=>callback?_monitorSteam(steam):steam)
    //         // .then(res=>_convert2(res))
    //
    //         .then(res=>res.Body.transformToByteArray())
    //         .then(uint8=>new Blob([uint8]))
    //         .catch((error)=>{
    //             return Promise.reject(error.message)
    //         })
    // }

    //euds: we seems use project_uuid rather than projectId anymore
    downloadFile(projectId, {path, version}, progress = null) {
        return this.getSignedUrl(projectId, {path, version})
            .then(url => $fetch(url, progress))
    }

    //TODO: Handle large files: https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_Scenario_UsingLargeFiles_section.html
    uploadFile(projectId, path, file, onProgress = null) {
        if (onProgress)
            __UPLOAD_CALLBACKS[path] = onProgress;

        // if(typeof projectId === 'object'){
        //     const params = projectId;
        //     path = params.Key.startsWith('/')?params.Key.substring(1):params.Key;
        //     file = params.Body;
        //     projectId = null;
        // }
        return this.getInstance(projectId)
            .then(s3Client => s3Client.send(new PutObjectCommand({
                Body: Buffer.isBuffer(file) ? file : JSON.stringify(file),
                Bucket: __Bucket, // required
                Key: path,
            })));
    }

    copyFile(projectId, path, dstPath) {
        if (typeof dstPath === undefined) {
            dstPath = path;
            path = projectId;
            projectId = null;
        }
        return this.getInstance(projectId)
            .then(s3Client => s3Client.send(new CopyObjectCommand({
                Bucket: __Bucket, Key: dstPath,
                CopySource: __Bucket + '/' + path
            })));
    }

    listProfile(path) {//test/.profile
        return this.getInstance(null)
            .then(s3Client => s3Client.send(new ListObjectsV2Command({ // ListObjectsRequest
                Bucket: __Bucket, // required
                // Key:'jimmy/.doc/autoBr.png'
                // Delimiter:'/',
                Prefix: path,
            })))
            .then(({Contents}) => Promise.resolve(Contents))
    }

    // todo: we can remove this function, so that we can just use downloadFile
    downloadProfile(path) { //example: test/.profile/avatar.png
        return this.getInstance(STS_MODE.profile, null)
            .then(s3Client => s3Client.send(new GetObjectCommand({
                Bucket: __Bucket, // required
                Key: path
            })))
            .then(res => res.Body.transformToByteArray())
            .then(uint8 => new Blob([uint8]))
    }
    downloadAIFile(path) { //example: test/.profile/avatar.png
        return this.getInstance(STS_MODE.profile, null)
            .then(s3Client => s3Client.send(new GetObjectCommand({
                Bucket:'gh-ai-inferrer', // required
                Key: path
            })))
            .then(res => res.Body.transformToByteArray())
            .then(uint8 => new Blob([uint8]))
    }
    uploadProfile(path, file, onProgress = (path, percentage) => {
        return (path, 'onProgress', percentage)
    }) {
        if (onProgress)
            __UPLOAD_CALLBACKS[path] = onProgress;
        return this.getInstance(STS_MODE.profile, null).then(s3Client => s3Client.send(
            new PutObjectCommand({
                Body: file,
                Bucket: __Bucket, // required
                Key: path,
            })))
    }
}