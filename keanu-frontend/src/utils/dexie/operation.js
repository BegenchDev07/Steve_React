import {db} from "/src/utils/dexie/db";

function generateMimeType(blob) {
    // Get the first few bytes of the blob.
    return new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.onloadend = function (e) {
            const arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            let header = "";
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            // Check the header against a list of known MIME types.
            const mimeTypes = {
                "89504e47": "image/png",
                "47494638": "image/gif",
                "ffd8ffe0": "image/jpeg",
                "52494646": "audio/wav",
                "00000020": "text/plain",
            };

            if (mimeTypes[header])
                return resolve(mimeTypes[header]);

            return resolve("application/octet-stream");

        };
        fileReader.readAsArrayBuffer(blob);
    })
}

export async function fetchFileFromLocal(loadList) {
    try {
        return Promise.all(loadList.map(url => db.images.get(url)))
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

export async function checkFileByUrl(prefix) {
    try {
        debugger;
        return db.images.where('url').startsWith(prefix).primaryKeys()
            .then(_ => {
                debugger;
            })

    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

export async function getFileByUrl(url) {
    try {
        const image = await db.images.get(url);
        return image.file;
    } catch (error) {
        console.error("Error fetching files:", error);
    }
}

export function listFiles(prefix) {
    return db.images.where('url').startsWith(prefix).primaryKeys();
}

export function getFilesStartsWith(prefix) {
    return db.images.where('url').startsWith(prefix).toArray();
}

export function deleteFileStartsWith(prefix) {
    return db.images.where('url').startsWith(prefix).primaryKeys()
        .then(keys => db.images.bulkDelete(keys));
}

export function deleteFileByUrl(url) {
    return db.images.delete(url);
}