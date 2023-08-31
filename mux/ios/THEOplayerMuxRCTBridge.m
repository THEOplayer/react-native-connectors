#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Mux Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(MuxModule, THEOplayerMuxRCTMuxAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  muxOptions:(nonnull NSDictionary *)muxOptions)

RCT_EXTERN_METHOD(changeVideo:(nonnull NSNumber *)node
                  data:(nonnull NSDictionary *)data)

RCT_EXTERN_METHOD(changeProgram:(nonnull NSNumber *)node
                  data:(nonnull NSDictionary *)data)

RCT_EXTERN_METHOD(notifyError:(nonnull NSNumber *)node
                  code:(nonnull NSNumber *)code
                  message:(nonnull NSString *)message
                  context:(nonnull NSString *)context)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
