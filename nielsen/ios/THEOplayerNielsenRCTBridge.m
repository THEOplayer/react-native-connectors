#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Nielsen Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(NielsenModule, THEOplayerNielsenRCTNielsenAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  appId:(NSString)appId
                  instanceName:(NSString)instanceName
                  nielsenOptions:(NSDictionary)nielsenOptions)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node metadata:(nonnull NSDictionary *)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
