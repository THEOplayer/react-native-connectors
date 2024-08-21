package com.theoplayer.engage.adapter

enum class ClusterType(val type: String) {
  Continuation("continuation"),
  Featured("featured"),
  Recommendation("recommendation");

  override fun toString(): String {
    return type
  }

  companion object {
    fun fromString(type: String?): ClusterType? {
      return entries.find { it.type == type }
    }
  }
}
