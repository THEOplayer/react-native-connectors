---
'@theoplayer/react-native-analytics-adobe': patch
---

Fixed an issue where player API was used on the wrong thread, resulting in a crash due to concurrent access of player internals.
