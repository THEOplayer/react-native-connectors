---
'@theoplayer/react-native-analytics-adobe-edge': patch
---

- Fixed an issue on Web where media events (e.g. `media.bitrateChange`) would fail with "Session ID is not available for playerId" when the media session start was not yet confirmed by the edge network. The session is now only marked as started after confirmation, failed session starts are retried, and tracker promise rejections no longer surface as unhandled promise rejections.
- Fixed an issue on Web where a playback session would not be tracked at all if the player's `loadedmetadata` event fired before the Adobe media tracker was initialized.
