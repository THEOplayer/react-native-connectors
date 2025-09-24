package com.theoplayer.reactnative.adobe.edge.api

/**
 * Error details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/errordetails.schema.md">Adobe XDM ErrorDetails Schema</a>
 */
data class AdobeErrorDetails(
  // The error ID.
  val name: String,
  // The error source.
  val source: ErrorSource
)

enum class ErrorSource {
  PLAYER,
  EXTERNAL
}
