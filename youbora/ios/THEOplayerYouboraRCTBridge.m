#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Youbora Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(YouboraModule, THEOplayerYouboraRCTYouboraAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  youboraOptions:(nonnull NSDictionary*)youboraOptions
                  logLevel:(nonnull NSNumber *)logLevel)

RCT_EXTERN_METHOD(setDebugLevel:(nonnull NSNumber *)logLevel)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
