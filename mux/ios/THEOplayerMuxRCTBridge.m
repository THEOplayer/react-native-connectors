#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Mux Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(MuxModule, THEOplayerMuxRCTMuxAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  muxMetadata:(NSDictionary)muxMetadata
                  muxConfig:(NSDictionary)muxConfig)

RCT_EXTERN_METHOD(setContentInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setAdInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(stopAndStartNewSession:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(reportPlaybackFailed:(nonnull NSNumber *)node
                  errorDescription:(NSString)errorDescription)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
