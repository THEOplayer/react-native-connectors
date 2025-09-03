package com.theoplayer.reactnative.adobe.edge.api

/**
 * Chapter details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/chapterdetails.schema.md">Adobe XDM ChapterDetails Schema</a>
 */
data class AdobeChapterDetails(
  // The ID of the chapter.
  val id: String? = null,
  // The friendly name of the chapter.
  val friendlyName: String? = null,
  // The position (index, integer) of the chapter inside the content.
  val index: Int,
  // Chapter is completed.
  val isCompleted: Boolean? = null,
  // Chapter is started.
  val isStarted: Boolean? = null,
  // The length of the chapter, in seconds.
  val length: Int,
  // The offset of the chapter inside the content (in seconds) from the start.
  val offset: Int,
  // The time spent on the chapter, in seconds.
  val timePlayed: Int? = null
)
