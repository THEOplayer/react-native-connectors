#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Adobe Edge Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(AdobeEdgeModule, THEOplayerAdobeEdgeRCTAdobeEdgeAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  config:(NSDictionary)config
                  customIdentityMap:(NSDictionary *)customIdentityMap)

RCT_EXTERN_METHOD(setDebug:(nonnull NSNumber *)node
                  debug:(BOOL)debug)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node
                  metadata:(NSDictionary *)metadata)

RCT_EXTERN_METHOD(setCustomIdentityMap:(nonnull NSNumber *)node
                  customIdentityMap:(NSDictionary *)customIdentityMap)

RCT_EXTERN_METHOD(setError:(nonnull NSNumber *)node
                  errorId:(NSString *)errorId)

RCT_EXTERN_METHOD(stopAndStartNewSession:(nonnull NSNumber *)node
                  customMetadataDetails:(NSDictionary *)customMetadataDetails)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
