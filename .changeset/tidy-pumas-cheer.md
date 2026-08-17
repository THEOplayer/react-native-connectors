---
'@theoplayer/react-native-analytics-adobe-edge': patch
---

Fixed an issue where the Adobe VA Edge API would reject media events such as `adStart` and `adComplete` with a 400 Bad Request ("Playhead must be in range [0, 86400] seconds") during live playback on platforms that report the playhead as an absolute presentation timestamp (e.g. Samsung Tizen). The playhead is now always clamped to the range accepted by the API.
