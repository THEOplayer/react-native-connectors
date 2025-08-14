#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Gemius Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(GemiusModule, THEOplayerGemiusRCTGemiusAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  gemiusConfig:(NSDictionary)gemiusConfig)

RCT_EXTERN_METHOD(update:(nonnull NSNumber *)node
                  programId:(nonnull NSString *)programId
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
