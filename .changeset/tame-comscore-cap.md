---
'@theoplayer/react-native-analytics-comscore': patch
---

Fixed Android builds failing with `Dependency 'com.comscore:android-analytics:6.16.0' requires ... compile against version 37 or later of the Android APIs` on apps compiled against android-36. The connector's floating `6.+` dependency now defaults to `6.15.+`, staying below the version that declares `minCompileSdk=37`, which is unsupported by current Android Gradle plugin releases. Apps that already target a newer compileSdk can still override via `THEOplayerComscore_comscoreVersion`.
