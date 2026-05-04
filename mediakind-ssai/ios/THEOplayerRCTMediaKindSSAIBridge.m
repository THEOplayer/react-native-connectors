#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// MediaKind SSAI Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(MediaKindSSAIModule, THEOplayerRCTMediaKindSSAIAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node)

@end
