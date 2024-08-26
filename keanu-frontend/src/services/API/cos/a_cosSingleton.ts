import COSService from "../../COSService";

class CosSingleton {
  private projectId: string;
  public cos: COSService|null = null;

  constructor(projectId: string) {
    this.projectId = projectId;
    // this.initialize();
  }

  async initialize() {
    this.cos = await this.initCOS(this.projectId)
  }

  async initCOS(projectId: string): Promise<COSService> {
    return new Promise(async (resolve, reject) => {
      const cs = new COSService(projectId);
      const { cos, error } = await cs.init();
      if (error) {
        reject(error);
      } else {
        resolve(cs);
      }
    });
  }
}

const instancePool: { [key: string]: CosSingleton } = {};

async function getCosSingleton(projectId: string): Promise<CosSingleton> {
  if (!instancePool[projectId]) {
    instancePool[projectId] = new CosSingleton(projectId);
    await instancePool[projectId].initialize();
  }
  return instancePool[projectId];
}

export { CosSingleton, getCosSingleton };
