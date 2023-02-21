#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Nielsen Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(NielsenModule, THEOplayerNielsenRCTNielsenAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  NielsenMetadata:(NSDictionary)NielsenMetadata
                  NielsenConfig:(NSDictionary)NielsenConfig)

RCT_EXTERN_METHOD(setContentInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(setAdInfo:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
