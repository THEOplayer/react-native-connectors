# @theoplayer/react-native-analytics-adobe-edge

## Unreleased

### 🐛 Issues

- Fixed an issue on Web where media events (e.g. `media.bitrateChange`) would fail with "Session ID is not available for playerId" when the media session start was not yet confirmed by the edge network. The session is now only marked as started after confirmation, failed session starts are retried, and tracker promise rejections no longer surface as unhandled promise rejections.
- Fixed an issue on Web where a playback session would not be tracked at all if the player's `loadedmetadata` event fired before the Adobe media tracker was initialized.

## 1.3.0

### ✨ Features

- - Restricted the supported OptiView (THEOplayer) player versions to v10 and v11. On Android, the default `THEOplayer_sdk` version range is now `[10.0.0, 12.0.0)` for every connector.

## 1.2.1

### 🐛 Issues

- Bumped @adobe/alloy dependency to v2.34.1.

## 1.2.0

### ✨ Features

- Added support for THEOplayer v11 and React Native THEOplayer v11.

## 1.1.1

### 🐛 Issues

- Fixed an issue on Web where the `bitRate` property would not be passed as an integer value.
- Fixed an issue where the metadata set with `updateMetadata` would not be passed when starting a session.

## 1.1.0

### ✨ Features

- Changed license to BSD 3-Cause Clear. See [LICENSE](./LICENSE) file for more information.

## 1.0.0

### 💥 Breaking Changes

- Updated the connector to use the latest Adobe Experience Platform Mobile and Web SDKs.

## 0.7.0

### ✨ Features

- Added optional native connector implementations for iOS and Android.

## 0.6.0

### ✨ Features

- Added support for THEOplayer v10 and React Native THEOplayer v10.

## 0.5.0

### ✨ Features

- Bumped dependency on react-native-device-info

## 0.4.0

### ✨ Features

- Added support for THEOplayer 9.0.

## 0.3.2

### 🐛 Issues

- Fixed a build issue where the `Settings` object would not be found when using the connector with react-native-web.

## 0.3.1

### 📦 Dependency Updates

- Updated dependency `react-native-device-info` to version `>=10.0.0 <14.0.0`.

## 0.3.0

### ✨ Features

- Added support for THEOplayer 8.0

## 0.2.0

### ✨ Features

- Fixed an issue where ad duration was reported as a floating-point value instead of an integer.

## 0.1.0

### ✨ Features

- Initial release
