//  AdobeCustomMetadataDetails.swift

/// Custom metadata details information.
///
/// - SeeAlso: [Adobe XDM CustomMetadataDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/custommetadatadetails.schema.md)
struct AdobeCustomMetadataDetails: Codable {
    /// The name of the custom field.
    let name: String?
    
    /// The value of the custom field.
    let value: String?
}
