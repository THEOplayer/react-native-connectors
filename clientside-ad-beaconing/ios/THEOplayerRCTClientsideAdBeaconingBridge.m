#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

// ----------------------------------------------------------------------------
// Clientside Ad Beaconing Module
// ----------------------------------------------------------------------------
@interface RCT_EXTERN_REMAP_MODULE(ClientsideAdBeaconingModule, THEOplayerRCTClientsideAdBeaconingAPI, NSObject)

RCT_EXTERN_METHOD(initialize:(nonnull NSNumber *)node)

@end
