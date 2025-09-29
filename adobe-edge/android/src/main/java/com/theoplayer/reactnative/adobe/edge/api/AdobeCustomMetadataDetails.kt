package com.theoplayer.reactnative.adobe.edge.api

/**
 * Custom metadata details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/custommetadatadetails.schema.md">Adobe XDM CustomMetadataDetails Schema</a>
 */
data class AdobeCustomMetadataDetails(
  // The name of the custom field.
  val name: String? = null,
  // The value of the custom field.
  val value: String? = null
)

