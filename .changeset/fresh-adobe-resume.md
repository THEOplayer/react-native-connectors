---
'@theoplayer/react-native-analytics-adobe-edge': patch
---

On web, retire potentially stale Adobe media sessions after prolonged suspension and restart tracking when content playback resumes. Preserve custom metadata, discard stale queued events, and ignore late confirmations from retired sessions. Keep Alloy's automatic tracking API; reliable cancellation of its retired-session pings requires the paired Alloy cleanup fix.
