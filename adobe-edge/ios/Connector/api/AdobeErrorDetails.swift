//  AdobeErrorDetails.swift

/// Error details information.
///
/// - SeeAlso: [Adobe XDM ErrorDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/errordetails.schema.md)
struct AdobeErrorDetails: Codable {
    /// The error ID.
    let name: String

    /// The error source.
    let source: ErrorSource
}

enum ErrorSource: String, Codable {
    case player = "player"
    case external = "external"
}
