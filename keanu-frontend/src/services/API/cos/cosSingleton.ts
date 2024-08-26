// import COSService from "../../COSService";
import COS from "cos-js-sdk-v5";
import keanuFetch from "../../../utils/keanuFetch";

const COS_CONFIG = {
  Region: "ap-beijing",
  Bucket: "keanu-1302931958",
};
//TEST:
// uploadFile
// const obj = { hello: "world" };
// const blob = new Blob([JSON.stringify(obj, null, 2)], {
//   type: "application/json",
// });
// CosSingleton.uploadFile(projectId,projectId+'/a/b/c.md',blob);
//
//
//
// const cosService = new COSService(projectId);
// await cosService.init();
//
//
// cosService.uploadFile(projectId+'/a/b/c.md',blob,_=>{});


const fetch = keanuFetch(),
      cosInstances = new Map();


      
class CosSingleton {

  static async getInstance(projectId) {
    if(cosInstances.has(projectId))
      return cosInstances.get(projectId);

    const STS_API_URL = document.baseURI.includes("localhost")
        ? "http://localhost:3000/api/sts"
        : "https://api.keanu.plus/api/sts";

    const { error, ...data } = await fetch.post(STS_API_URL, { projectId });

    if (error) {
      return { cos: null, error };
    }

    const { Credentials, startTime, ExpiredTime } = data;

    const cosInstance = new COS({
      getAuthorization: (options, callback) =>
          callback({
            TmpSecretId: Credentials.TmpSecretId,
            TmpSecretKey: Credentials.TmpSecretKey,
            XCosSecurityToken: Credentials.Token,
            StartTime: startTime,
            ExpiredTime: ExpiredTime,
          }),
      UploadCheckContentMd5: true,
    });

    cosInstances.set(projectId, cosInstance);
    return cosInstance;
  }

  static async listProject(projectId: string) {
    return CosSingleton.getInstance(projectId)
    .then(cos=>{
      const params = {
        Bucket: COS_CONFIG.Bucket,
        Region: COS_CONFIG.Region,
        Prefix: projectId,
      };
      return cos.getBucket(params)
    }).then(({Contents})=>Promise.resolve(Contents));
  }


  static async listFiles(projectId: string,prefix: string) {
    return CosSingleton.getInstance(projectId)
    .then(cos=>{
      const params = {
        Bucket: COS_CONFIG.Bucket,
        Region: COS_CONFIG.Region,
        Prefix: `${projectId}/${prefix}`,
      };
      return cos.getBucket(params)
    }).then(({Contents})=>Promise.resolve(
      //'jimmy/.doc/autoBr.png'.substring('jimmy/.doc/'.length) = autoBr.png
      //"asf".split('/') = [asf]
      //"/asf".split('/') = ['', 'asf']
        Contents.filter(file=>file.Key.substring(`${projectId}/${prefix}`.length).split('/')<3)
                      .map(file=>file.Key.substring(`${projectId}/${prefix}`.length).split('/').pop())
    ));
  }

  

  static async uploadFile(
    projectId: any,
    path: string,
    blob: Blob,
    callback?: (err, data) => void
  ) {
    return CosSingleton.getInstance(projectId)
    .then(cos=>{
      const params = {
        Bucket: COS_CONFIG.Bucket,
        Region: COS_CONFIG.Region,
        Key: path,
        Body: blob,
        SliceSize: 5 * 1024 * 1024, // slice size is 5MB
        // ContentType: blob.type,
        onProgress: (progressData) => {
          if (callback) {
            callback(null, progressData);
          } else {
            console.log(JSON.stringify(progressData));
          }
        },
      };
      return cos.putObject(params);
    })

    
  }

  static async downloadFile(
    projectId: string,
    path: string,
    callback?: (err, progressData) => void
  ) {
    return CosSingleton.getInstance(projectId)
    .then(cos=>{
      const params = {
        Bucket: COS_CONFIG.Bucket,
        Region: COS_CONFIG.Region,
        Key: path,
        onProgress: (progressData) => {
          if (callback) {
            callback(null, progressData);
          } else {
            console.log(JSON.stringify(progressData));
          }
        },
      };
  
      return cos.getObject(params);
    });
   
  }
}

export default CosSingleton;
