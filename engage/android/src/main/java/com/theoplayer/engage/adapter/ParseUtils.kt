package com.theoplayer.engage.adapter

import android.net.Uri
import android.util.Log
import com.google.android.engage.common.datamodel.ImageTheme
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import kotlin.reflect.KClass

private const val TAG = "BridgeUtils"

private const val VAL_THEME_DARK = "dark"
private const val VAL_THEME_LIGHT = "light"

object ParseUtils {
  fun <T : Any> getNonNullTypedOrWarning(obj: JSONObject, key: String, type: KClass<T>): T? {
    if (!obj.has(key)) {
      Log.w(TAG, "No value for key `$key` provided.")
      return null
    }
    return getTypedOrWarning(obj, key, type)
  }

  fun <T : Any> getTypedOrWarning(obj: JSONObject, key: String, type: KClass<T>): T? {
    try {
      when {
        type == Boolean::class -> return obj.optBoolean(key) as T?
        type == String::class -> return obj.optString(key) as T?
        type == JSONObject::class -> return obj.optJSONObject(key) as T?
        type == Double::class -> return obj.optDouble(key) as T?
        type == Int::class -> return obj.optInt(key) as T?
        type == Long::class -> return obj.optLong(key) as T?
        type == JSONArray::class -> return obj.optJSONArray(key) as T?
        else -> {
          Log.w(TAG, "Unknown property type for $key: ${obj.get(key)}.")
        }
      }
      Log.w(TAG, "Property $key has wrong type: expected $type.")
    } catch (_: JSONException) {
      // key doesn't exist.
    }
    return null
  }

  fun getString(obj: JSONObject, key: String): String? {
    return getTypedOrWarning(obj, key, String::class)
  }

  fun getNonNullString(obj: JSONObject, key: String): String? {
    return getNonNullTypedOrWarning(obj, key, String::class)
  }

  fun getInt(obj: JSONObject, key: String): Int? {
    return getTypedOrWarning(obj, key, Int::class)
  }

  fun getLong(obj: JSONObject, key: String): Long? {
    return getTypedOrWarning(obj, key, Long::class)
  }

  fun getBool(obj: JSONObject, key: String): Boolean? {
    return getTypedOrWarning(obj, key, Boolean::class)
  }

  fun getArray(obj: JSONObject, key: String): JSONArray? {
    return getTypedOrWarning(obj, key, JSONArray::class)
  }

  fun getObject(obj: JSONObject, key: String): JSONObject? {
    return getTypedOrWarning(obj, key, JSONObject::class)
  }

  fun getUri(obj: JSONObject, key: String): Uri? {
    return try {
      Uri.parse(getTypedOrWarning(obj, key, String::class))
    } catch (e: Exception) {
      null
    }
  }

  fun parseImageTheme(value: String?): Int {
    return when (value) {
      VAL_THEME_DARK -> ImageTheme.IMAGE_THEME_DARK
      VAL_THEME_LIGHT -> ImageTheme.IMAGE_THEME_LIGHT
      else -> ImageTheme.IMAGE_THEME_UNSPECIFIED
    }
  }
}
