#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// AdScript Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(AdScriptModule, THEOplayerAdScriptRCTAdScriptAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  implementationId:(nonnull NSString *)implementationId
                  contentMetadata:(nonnull NSString *)contentMetadata
                  debug:(BOOL)debug)

RCT_EXTERN_METHOD(updateMetadata:(nonnull NSNumber *)node
                  metadata:(NSDictionary)metadata)

RCT_EXTERN_METHOD(updateUser:(nonnull NSNumber *)node
                  user:(NSArray)user)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
