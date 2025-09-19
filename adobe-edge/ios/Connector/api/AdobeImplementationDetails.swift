//  AdobeImplementationDetails.swift

/// Details about the SDK, library, or service used in an application or web page implementation of a service.
///
/// - SeeAlso: [Adobe XDM ImplementationDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/implementationdetails.schema.md)
struct AdobeImplementationDetails: Codable {
    /// The environment of the implementation
    let environment: AdobeEnvironment?

    /// SDK or endpoint identifier. All SDKs or endpoints are identified through a URI, including extensions.
    let name: String?

    /// The version identifier of the API, e.g h.18.
    let version: String?
}

/// The environment of the implementation.
enum AdobeEnvironment: String, Codable {
    case browser = "BROWSER"
    case app = "APP"
    case server = "SERVER"
    case iot = "IOT"
}
