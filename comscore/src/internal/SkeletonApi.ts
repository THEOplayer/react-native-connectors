/**
 * Interface to Comscore SkeletonAPI for RAI
 */
export interface RaiSkeletonAPI {
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
   *  MOCK implementation for Skeleton API for RAI
   */
  export class ComscoreSkeletonMock implements RaiSkeletonAPI {
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
   *  Simple Javascript implementation for Skeleton API for RAI
   *  Initialised values from the constru ctor are returned
   */
  export class ComscoreSkeletonWeb implements RaiSkeletonAPI {
    private dm = 'Default deviceModel';
    private pid = 'Default publisherUniqueDeviceId';
    private cid = 'Default crossPublisherUniqueDeviceId';
    private rn = 'Default runTimeName';
    private rv = 'Default runTimeVersion';
  
    /**
     * Constructor
     * @param deviceModel device model as a string
     * @param crossPublsherDeviceId   crossPublisherUniqueDeviceId
     * @param publisherDeviceId  publisherSpecificDeviceId
     * @param runTimeName  device runtime name
     * @param runTimeVersion  device runtime version
     */
    constructor(
      deviceModel: string,
      crossPublsherDeviceId: string,
      publisherDeviceId: string,
      runTimeName: string,
      runTimeVersion: string
    ) {
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
  
//   declare let ComscoreSkeletonAndroidBridge: RaiSkeletonAPI;
//   /**
//    *  JS Bridge for Android implementation for Skeleton API for RAI
//    *  Requires a Native Implementation with the  RaiSkeletonAPI interface
//    *  where the all interface methods are annotated with the  android.webkit.JavascriptInterface
//    *  annotation.
//    *
//    *  The Android android app needs to enable javascript on the webview through
//    *  WebView::getSettings.setJavaScriptEnabled(true);
//    *  And the bridge interface needs to be declared on the WebViewClient
//    *  WebViewClient::addJavascriptInterface( YOUR_CLASS_INSTNACE , "ComscoreSkeletonAndroidBridge");
//    */
//   export class ComscoreSkeletonAndroid extends ComscoreSkeletonWeb {
//     constructor(successCallback, errorCallback) {
//       if (!ComscoreSkeletonAndroidBridge)
//         throw new Error(
//           'RaiAndroidSkeleton is missing ComscoreSkeletonAndroidBridge context'
//         );
  
//       super(
//         ComscoreSkeletonAndroidBridge.getDeviceModel(),
//         ComscoreSkeletonAndroidBridge.getCrossPublisherUniqueDeviceId(),
//         ComscoreSkeletonAndroidBridge.getPublisherSpecificUniqueDeviceId(),
//         ComscoreSkeletonAndroidBridge.getRuntimeName(),
//         ComscoreSkeletonAndroidBridge.getRuntimeVersion()
//       );
//     }
//   }
  