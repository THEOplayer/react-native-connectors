package com.theoplayer.reactnative.adobe.edge.api

/**
 * Details about the SDK, library, or service used in an application or web page implementation of a service.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/implementationdetails.schema.md">Adobe XDM ImplementationDetails Schema</a>
 */
data class AdobeImplementationDetails(
  // The environment of the implementation
  val environment: AdobeEnvironment? = null,
  // SDK or endpoint identifier. All SDKs or endpoints are identified through a URI, including extensions.
  val name: String? = null,
  // The version identifier of the API, e.g h.18.
  val version: String? = null
)

/**
 * The environment of the implementation.
 */
enum class AdobeEnvironment {
  BROWSER,
  APP,
  SERVER,
  IOT
}
