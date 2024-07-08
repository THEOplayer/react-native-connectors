package com.theoplayer.engage.adapter

import com.google.android.engage.common.datamodel.SignInCardEntity
import com.theoplayer.engage.adapter.Constants.PROP_ACTION_TEXT
import com.theoplayer.engage.adapter.Constants.PROP_ACTION_URI
import com.theoplayer.engage.adapter.ParseUtils.getArray
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.Constants.PROP_ID
import com.theoplayer.engage.adapter.Constants.PROP_NAME
import com.theoplayer.engage.adapter.Constants.PROP_POSTERS
import com.theoplayer.engage.adapter.Constants.PROP_SUBTITLE
import com.theoplayer.engage.adapter.EntityAdapter.convertImages
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONObject

object SignInAdapter {
  /**
   * Create a SignInCardEntity from bridge data.
   */
  fun convert(signIn: JSONObject): SignInCardEntity {
    val builder = SignInCardEntity.Builder()
    getString(signIn, PROP_NAME)?.let {
      builder.setTitle(it)
    }
    getString(signIn, PROP_SUBTITLE)?.let {
      builder.setSubtitle(it)
    }
    getString(signIn, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(signIn, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getString(signIn, PROP_ACTION_TEXT)?.let {
      builder.setActionText(it)
    }
    getUri(signIn, PROP_ACTION_URI)?.let {
      builder.setActionUri(it)
    }
    return builder.build()
  }
}

