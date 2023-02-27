#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Comscore Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ComscoreModule, THEOplayerComscoreRCTComscoreAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  ComscoreMetadata:(NSDictionary)ComscoreMetadata
                  ComscoreConfig:(NSDictionary)ComscoreConfig)

RCT_EXTERN_METHOD(setContentInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setAdInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
