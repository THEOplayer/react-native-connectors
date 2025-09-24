#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Adobe Edge Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(AdobeEdgeModule, THEOplayerAdobeEdgeRCTAdobeEdgeAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  baseUrl:(nonnull NSString *)baseUrl
                  configId:(nonnull NSString *)configId
                  userAgent:(nullable NSString*)userAgent
                  debug:(BOOL)debug
                  debugSessionId:(nullable NSString*)debugSessionId
                  )

RCT_EXTERN_METHOD(setDebug:(nonnull NSNumber *)node
                  debug:(BOOL)debug)

RCT_EXTERN_METHOD(setDebugSessionId:(nonnull NSNumber *)node
                  debugSessionId:(nullable NSString*)debugSessionId)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node
                  metadata:(NSArray *)metadata)

RCT_EXTERN_METHOD(setError:(nonnull NSNumber *)node
                  errorDetails:(NSDictionary *)errorDetails)

RCT_EXTERN_METHOD(stopAndStartNewSession:(nonnull NSNumber *)node
                  customMetadataDetails:(NSArray *)customMetadataDetails)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
