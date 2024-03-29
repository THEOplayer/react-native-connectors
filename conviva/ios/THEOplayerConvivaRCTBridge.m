#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Conviva Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ConvivaModule, THEOplayerConvivaRCTConvivaAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  convivaMetadata:(NSDictionary)convivaMetadata
                  convivaConfig:(NSDictionary)convivaConfig)

RCT_EXTERN_METHOD(setContentInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setAdInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(stopAndStartNewSession:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(reportPlaybackFailed:(nonnull NSNumber *)node
                  errorDescription:(NSString)errorDescription)

RCT_EXTERN_METHOD(reportPlaybackEvent:(nonnull NSNumber *)node
                  eventType:(NSString)eventType
                  eventDetail:(NSDictionary)eventDetail)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
