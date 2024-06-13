#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Yospace Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(YospaceModule, THEOplayerYospaceRCTYospaceAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  yospaceMetadata:(NSDictionary)yospaceMetadata
                  yospaceConfig:(NSDictionary)yospaceConfig)

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
