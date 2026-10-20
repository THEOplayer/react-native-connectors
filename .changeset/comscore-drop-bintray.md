---
'@theoplayer/react-native-analytics-comscore': patch
---

Fixed Android builds failing with `Could not resolve com.theoplayer.theoplayer-sdk-android:core` and `Repository ... is disabled due to earlier error` with recent Gradle releases such as 8.14.6. The connector still declared the defunct `comscore.bintray.com` Maven repository, whose SSL failure newer Gradle versions no longer ignore; the Comscore SDK is resolved from Maven Central.
