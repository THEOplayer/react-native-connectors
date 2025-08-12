#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Gemius Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ConvivaModule, THEOplayerConvivaRCTConvivaAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  convivaConfig:(NSDictionary)convivaConfig)

RCT_EXTERN_METHOD(update:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
