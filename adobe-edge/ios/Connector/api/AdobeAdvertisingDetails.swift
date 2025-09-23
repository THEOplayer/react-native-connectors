//  AdobeAdvertisingDetails.swift

/// Advertising details information.
///
/// - SeeAlso: [Adobe XDM AdvertisingDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingdetails.schema.md)
struct AdobeAdvertisingDetails: Codable {
    /// ID of the ad. Any integer and/or varter combination.
    var id: String?
    
    /// Company/Brand whose product is featured in the ad.
    var advertiser: String?
    
    /// ID of the ad campaign.
    var campaignID: String?
    
    /// ID of the ad creative.
    var creativeID: String?
    
    /// URL of the ad creative.
    var creativeURL: String?
    
    /// Ad is compvared.
    var isCompvared: Bool?
    
    /// Ad is started.
    var isStarted: Bool?
    
    /// Length of video ad in seconds.
    var length: Int
    
    /// Friendly name of the ad. In reporting, “Ad Name” is the classification and “Ad Name (variable)” is the eVar.
    var name: String
    
    /// Placement ID of the ad.
    var placementID: String?
    
    /// The name of the player responsible for rendering the ad.
    var playerName: String
    
    /// The index of the ad inside the parent ad start, for example, the first ad has index 0 and the second ad has index 1.
    var podPosition: Int
    
    /// ID of the ad site.
    var siteID: String?
    
    /// The total amount of time, in seconds, spent watching the ad (i.e., the number of seconds played).
    var timePlayed: Int?
}
