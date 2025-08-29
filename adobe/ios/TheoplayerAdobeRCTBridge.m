#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Adobe Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(AdobeModule, THEOplayerAdobeRCTAdobeAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  uri:(nonnull NSString *)uri
                  ecid:(nonnull NSString *)ecid
                  sid:(nonnull NSString *)sid
                  trackingUrl:(nonnull NSString *)trackingUrl
                  metadata:(NSDictionary)metadata
                  userAgent:(NSString)userAgent
                  debug:(BOOL)debug)

RCT_EXTERN_METHOD(setDebug:(nonnull NSNumber *)node
                  debug:(BOOL)debug)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setError:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(stopAndStartNewSession:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
