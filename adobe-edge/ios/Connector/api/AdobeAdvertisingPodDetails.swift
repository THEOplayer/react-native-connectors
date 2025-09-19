//  AdobeAdvertisingPodDetails.swift

/// Advertising Pod details information.
///
/// - SeeAlso: [Adobe XDM AdvertisingPodDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingpoddetails.schema.md)
struct AdobeAdvertisingPodDetails: Codable {
  /// The ID of the ad break.
  var id: String?
  
  /// The friendly name of the Ad Break.
  var friendlyName: String?
  
  /// The index of the ad inside the parent ad break start, for example, the first ad has index 0 and the second ad has index 1.
  var index: Int
  
  /// The offset of the ad break inside the content, in seconds.
  var offset: Int
}
