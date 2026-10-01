---
'@theoplayer/react-native-analytics-adscript': patch
'@theoplayer/react-native-analytics-agama': patch
'@theoplayer/react-native-analytics-bitmovin': patch
'@theoplayer/react-native-analytics-comscore': patch
'@theoplayer/react-native-analytics-conviva': patch
'@theoplayer/react-native-engage': patch
'@theoplayer/react-native-analytics-gemius': patch
'@theoplayer/react-native-analytics-mux': patch
'@theoplayer/react-native-analytics-nielsen': patch
'@theoplayer/react-native-yospace': patch
'@theoplayer/react-native-analytics-youbora': patch
---

- Fixed an Android build failure with Android Gradle Plugin 9 and its built-in Kotlin support. The connector now only applies the `kotlin-android` plugin when AGP has not already registered the `kotlin` extension.
