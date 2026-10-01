---
'@theoplayer/react-native-analytics-adobe': patch
'@theoplayer/react-native-analytics-adobe-edge': patch
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

Fixed a Gradle configuration failure on Android Gradle Plugin 9, where the connector's explicit `kotlin-android` plugin collided with AGP's built-in Kotlin support and failed with `Cannot add extension with name 'kotlin'`. The plugin is now applied only when nothing has registered the `kotlin` extension yet, so AGP 8 is unaffected.
