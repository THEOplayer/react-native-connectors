#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// ReactNativeTHEOplayerConnector Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ReactNativeTHEOplayerConnectorModule, ReactNativeTHEOplayerConnectorRCTAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node
                  config:(NSDictionary)config)

RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)node)

@end
