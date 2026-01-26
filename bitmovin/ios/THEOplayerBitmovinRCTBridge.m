#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Bitmovin Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(BitmovinModule, THEOplayerBitmovinRCTBitmovinAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  bitmovinConfig:(nonnull NSDictionary *)bitmovinConfig
                  defaultMetadata:(nullable NSDictionary *)defaultMetadata)

RCT_EXTERN_METHOD(updateSourceMetadata:(nonnull NSNumber *)node metadata:(nonnull NSDictionary *)metadata)

RCT_EXTERN_METHOD(updateCustomMetadata:(nonnull NSNumber *)node customData:(nonnull NSDictionary *)customData)

RCT_EXTERN_METHOD(sendCustomDataEvent:(nonnull NSNumber *)node customData:(nonnull NSDictionary *)customData)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
