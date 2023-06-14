#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Youbora Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(YouboraModule, THEOplayerYouboraRCTYouboraAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  appId:(NSString)appId
                  instanceName:(NSString)instanceName
                  youboraOptions:(NSDictionary)youboraOptions)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node metadata:(nonnull NSDictionary *)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
