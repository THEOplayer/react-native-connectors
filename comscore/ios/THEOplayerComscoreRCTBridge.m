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

RCT_EXTERN_METHOD(update:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setPersistentLabel:(nonnull NSNumber *)node
                  label:(NSString)label
                  value:(NSString)value)

RCT_EXTERN_METHOD(setPersistentLabels:(nonnull NSNumber *)node
                  labels:(NSDictionary)labels)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
