#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Bitmovin Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(BitmovinModule, THEOplayerBitmovinRCTBitmovinAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  bitmovinConfig:(NSDictionary)bitmovinConfig)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node metadata:(nonnull NSDictionary *)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
