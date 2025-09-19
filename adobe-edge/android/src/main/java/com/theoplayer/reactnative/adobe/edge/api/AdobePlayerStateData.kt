package com.theoplayer.reactnative.adobe.edge.api

/**
 * Player state data information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/components/datatypes/playerstatedata.schema.json">Adobe XDM PlayerStateData Schema</a>
 */
data class AdobePlayerStateData(
  // The name of the player state.
  val name: String,
  // Whether or not the player state is set on that state.
  val isSet: Boolean? = null,
  // The number of times that player state was set on the stream.
  val count: Int? = null,
  // The total duration of that player state.
  val time: Int? = null
)
