#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Mux Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(MuxModule, THEOplayerMuxRCTMuxAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  muxOptions:(nonnull NSDictionary *)muxOptions)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
