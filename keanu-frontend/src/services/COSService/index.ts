import COS from "cos-js-sdk-v5";
import keanuFetch from "../../utils/keanuFetch";

const fetch = keanuFetch();

interface COSConfig {
    Bucket: string;
    Region: string;
}

const COSConfig: COSConfig = {
    Bucket: "keanu-1302931958",
    Region: "ap-beijing",
};

const stsURL = document.baseURI.includes("localhost")
    ? "http://localhost:3000/api/sts"
    : "https://api.keanu.plus/api/sts";

class COSService {
    private cos: any;
    private projectID: string;

    constructor(projectID: string) {
        this.cos = null;
        this.projectID = projectID;
    }

    async init() {
        const {cos, error} = await COSService.build(this.projectID);
        if (error) {
            return {cos: null, error: error};
        }
        this.cos = cos;
        return {cos: cos, error: null};
    }

    static async build(projectId: string) {
        const data = await fetch.post(stsURL, {
            projectId,
        });

        if (data.error) {
            return {cos: null, error: data.error};
        }

        return {
            cos: new COS({
                getAuthorization: (options, callback) =>
                    callback({
                        TmpSecretId: data.Credentials.TmpSecretId,
                        TmpSecretKey: data.Credentials.TmpSecretKey,
                        XCosSecurityToken: data.Credentials.Token,
                        StartTime: data.startTime,
                        ExpiredTime: data.ExpiredTime,
                    }),
                UploadCheckContentMd5: true,
            }),
            error: null,
        };
    }

    listProject(projectID: string) {
        return new Promise((resolve, reject) => {

            this.cos.getBucket(
                {
                    Bucket: COSConfig.Bucket,
                    Region: COSConfig.Region,
                    Prefix: projectID,
                },
                (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Contents);
                    }
                }
            );
        });
    }

    listFiles(prefix: string) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: COSConfig.Bucket,
                Region: COSConfig.Region,
                Prefix: prefix + '/', // like 'a/', ends up with slash
            };

            this.cos.getBucket(params, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    let files: string[] = [];
                    data.Contents.forEach((file: any) => {
                        if (!file.Key.endsWith("/")) {
                            files.push(file);
                        }
                    });
                    resolve(files);
                }
            });
        });
    }

    uploadFile(
        filePath: string,
        fileBlob: Blob,
        callback: (err: any, data: any) => void
    ) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: COSConfig.Bucket,
                Region: COSConfig.Region,
                Key: filePath,
                Body: fileBlob,
                ContentType: fileBlob.type,
                onProgress: (progressData: any) => {
                    if (callback) {
                        callback(null, progressData);
                    } else {
                        console.log(JSON.stringify(progressData));
                    }
                },
            };

            this.cos.putObject(params, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    downloadFile(
        filePath: string,
        callback: (err: any, progressData: any) => void
    ) {
        return new Promise((resolve, reject) => {
            const params = {
                Bucket: COSConfig.Bucket,
                Region: COSConfig.Region,
                Key: filePath,
                onProgress: (progressData: any) => {
                    if (callback) {
                        callback(null, progressData);
                    } else {
                        console.log(JSON.stringify(progressData));
                    }
                },
            };

            this.cos.getObject(params, (err: any, data: Blob) => {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }

    move(srcPath: string, destPath: string, validName: string) {
        return new Promise(async (resolve, reject) => {
            if (destPath.includes("."))
                reject(new Error("Invalid destPath, destPath must be a directory"));
            let src = srcPath.startsWith("/") ? srcPath.substring(1) : srcPath;
            let dest = destPath.startsWith("/") ? destPath.substring(1) : destPath;

            if (src.includes(".")) {
                return this.moveFile(src, dest, "");
            } else {
                this.listFiles(src)
                    .then((files: any) => {
                        const promises: any[] = [];
                        files.forEach((file: any) => {
                            promises.push(this.moveFile(file.Key, dest, validName));
                        });

                        return Promise.all(promises);
                    })
                    .then((_) => {
                        this.cos.deleteObject(
                            {
                                Bucket: COSConfig.Bucket,
                                Region: COSConfig.Region,
                                Key: src + "/",
                            },
                            (err: any, result: any) => {
                                if (err) reject(err);
                                else {
                                    resolve(result);
                                }
                            }
                        );
                    });
            }
        });
    }

    moveFile(srcPath: string, destPath: string, validName: string) {
        return new Promise((resolve, reject) => {
            let src = srcPath.startsWith("/") ? srcPath.substring(1) : srcPath;
            let dest =
                destPath.startsWith("/") && destPath.length > 1
                    ? destPath.substring(1)
                    : destPath;

            let newKey = dest + "/" + src.substring(src.lastIndexOf("/") + 1);

            if (destPath === "/") {
                newKey = srcPath.replace(/^.*[\\\/]/, "");
            }

            newKey = validName
                ? newKey.substring(0, newKey.lastIndexOf("/")) + "/" + validName
                : newKey;

            let params = {
                Bucket: COSConfig.Bucket,
                Region: COSConfig.Region,
                Key: newKey,
            };

            this.cos.putObjectCopy(params, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    let deleteParams = {
                        Bucket: COSConfig.Bucket,
                        Region: COSConfig.Region,
                        Key: src,
                    };

                    this.cos.deleteObject(deleteParams, (err: any, data: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }
            });
        });
    }

    rename(oldName: string, newName: string) {
        return new Promise(async (resolve, reject) => {
            oldName = oldName.substring(1);
            newName = newName.substring(1);
            if (oldName.includes(".")) {
                this.renameFile(oldName, newName);
            } else if (oldName.endsWith("/") && newName.endsWith("/")) {
                let files: any = await this.listFiles(oldName);
                files.forEach(async (file: any) => {
                    if (file.Key.endsWith("/") && file.Key === oldName) {
                        await this.renameFile(file.Key, newName);
                    } else {
                        await this.renameFile(file.Key, file.Key.replace(oldName, newName));
                    }
                });
            }
        });
    }

    renameFile(oldName: string, newName: string) {
        return new Promise((resolve, reject) => {
            if (oldName === newName) return;
            let params = {
                Bucket: COSConfig.Bucket,
                Region: COSConfig.Region,
                Key: newName,
            };

            this.cos.putObjectCopy(params, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    let deleteParams = {
                        Bucket: COSConfig.Bucket,
                        Region: COSConfig.Region,
                        Key: oldName,
                    };

                    this.cos.deleteObject(deleteParams, (err: any, data: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }
            });
        });
    }

    deleteFile(filePath: string, versionId: string) {
        return new Promise(async (resolve, reject) => {
            let fileName = filePath.substring(1);
            if (fileName.includes(".")) {
                let params: any = {
                    Bucket: COSConfig.Bucket,
                    Region: COSConfig.Region,
                    Key: fileName,
                };

                if (versionId) {
                    params["VersionId"] = versionId;
                }

                this.cos.deleteObject(params, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            } else {
                // delete directory
                let files: any = await this.listFiles(fileName);
                let deleteObjects = files.map((file: any) => {
                    return {
                        Key: file.Key,
                    };
                });

                let params = {
                    Bucket: COSConfig.Bucket,
                    Region: COSConfig.Region,
                    Objects: deleteObjects,
                    Quiet: false,
                };

                this.cos.deleteMultipleObject(params, (err: any, data: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            }
        });
    }
}

export default COSService;
