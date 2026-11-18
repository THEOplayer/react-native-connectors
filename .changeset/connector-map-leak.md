---
'@theoplayer/react-native-analytics-adobe': patch
'@theoplayer/react-native-analytics-adobe-edge': patch
'@theoplayer/react-native-analytics-adscript': patch
'@theoplayer/react-native-analytics-bitmovin': patch
'@theoplayer/react-native-analytics-nielsen': patch
---

Fixed a memory leak on Android, and on iOS for Adobe Edge, where a destroyed connector and its player stayed in memory, which happened because the native module never removed the connector from its internal map.
