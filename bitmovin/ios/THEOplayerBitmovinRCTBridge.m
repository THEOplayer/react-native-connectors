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

RCT_EXTERN_METHOD(updateSourceMetadata:(nonnull NSNumber *)node
                  sourceMetadata:(nonnull NSDictionary *)sourceMetadata)

RCT_EXTERN_METHOD(updateCustomData:(nonnull NSNumber *)node
                  customData:(nonnull NSDictionary *)customData)

RCT_EXTERN_METHOD(programChange:(nonnull NSNumber *)node
                  sourceMetadata:(nonnull NSDictionary *)sourceMetadata)

RCT_EXTERN_METHOD(sendCustomDataEvent:(nonnull NSNumber *)node
                  customData:(nonnull NSDictionary *)customData)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

// SSAI
RCT_EXTERN_METHOD(adBreakStart:(nonnull NSNumber *)node
                  adBreakMetadata:(nonnull NSDictionary *)adBreakMetadata)

RCT_EXTERN_METHOD(adStart:(nonnull NSNumber *)node
                  adMetadata:(nonnull NSDictionary *)adMetadata)

RCT_EXTERN_METHOD(adQuartileFinished:(nonnull NSNumber *)node
                  adQuartile:(nonnull NSString *)adMetadata
                  adQuartileMetadata:(nonnull NSDictionary *)adQuartileMetadata)

RCT_EXTERN_METHOD(adBreakEnd:(nonnull NSNumber *)node)

@end
