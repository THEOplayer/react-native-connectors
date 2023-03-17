#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Nielsen Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(NielsenModule, THEOplayerNielsenRCTNielsenAPI, NSObject)

//func initialize(_ node: NSNumber, appId: String, instanceName: String, nielsenOptions: NSDictionary) -> Void {
RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  appId:(NSString)appId
                  instanceName:(NSString)instanceName
                  nielsenOptions:(NSDictionary)nielsenOptions)

RCT_EXTERN_METHOD(setContentInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setAdInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
