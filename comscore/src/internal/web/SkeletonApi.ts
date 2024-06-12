/**
 * Interface to Comscore SkeletonAPI for some customers
 */
export interface CustomSkeletonAPI {
  /**
   * should return the device model
   */
  getDeviceModel(): string | undefined;

  /**
   * should return Cross Publisher unique device id
   */
  getCrossPublisherUniqueDeviceId(): string | undefined;

  /**
   * should return the Publisher specific unique device id
   */
  getPublisherSpecificUniqueDeviceId(): string | undefined;

  /**
   * should return the device runtime name
   */
  getRuntimeName(): string | undefined;

  /**
   * should return the device runtime version
   */
  getRuntimeVersion(): string | undefined;
}

/**
 *  MOCK implementation for Skeleton API for some customers
 */
export class ComscoreSkeletonMock implements CustomSkeletonAPI {
  getDeviceModel(): string {
    return 'MOCK::getDeviceModel';
  }

  getCrossPublisherUniqueDeviceId(): string {
    return 'MOCK::getCrossPublisherUniqueDeviceId';
  }

  getPublisherSpecificUniqueDeviceId(): string {
    return 'MOCK::getPublisherSpecificUniqueDeviceId';
  }

  getRuntimeName(): string {
    return 'MOCK::getRuntimeName';
  }

  getRuntimeVersion(): string {
    return 'MOCK::getRuntimeVersion';
  }
}

/**
 *  Simple Javascript implementation for Skeleton API for some customers
 *  Initialised values from the constru ctor are returned
 */
export class ComscoreSkeletonWeb implements CustomSkeletonAPI {
  private readonly dm: string = 'Default deviceModel';
  private readonly pid: string = 'Default publisherUniqueDeviceId';
  private readonly cid: string = 'Default crossPublisherUniqueDeviceId';
  private readonly rn: string = 'Default runTimeName';
  private readonly rv: string = 'Default runTimeVersion';

  /**
   * Constructor
   * @param deviceModel device model as a string
   * @param crossPublsherDeviceId   crossPublisherUniqueDeviceId
   * @param publisherDeviceId  publisherSpecificDeviceId
   * @param runTimeName  device runtime name
   * @param runTimeVersion  device runtime version
   */
  constructor(deviceModel: string, crossPublsherDeviceId: string, publisherDeviceId: string, runTimeName: string, runTimeVersion: string) {
    this.dm = deviceModel;
    this.cid = crossPublsherDeviceId;
    this.pid = publisherDeviceId;
    this.rn = runTimeName;
    this.rv = runTimeVersion;
  }

  getDeviceModel = (): string => {
    return this.dm;
  };
  getCrossPublisherUniqueDeviceId = (): string => {
    return this.cid;
  };
  getPublisherSpecificUniqueDeviceId = (): string => {
    return this.pid;
  };
  getRuntimeName = (): string => {
    return this.rn;
  };
  getRuntimeVersion = (): string => {
    return this.rv;
  };
}
