# @theoplayer/react-native-analytics-gemius

## 1.6.0

### ✨ Features

- Added Swift Package Manager support for iOS using the official Gemius SDK packages. tvOS apps should keep using CocoaPods until `react-native-tvos` supports React Native's SPM tooling.

### 🐛 Issues

- Fixed a memory leak on Android where a destroyed connector and its player stayed in memory, which happened because the native module never removed the connector from its internal map.
- Fixed Apple connector teardown not detaching its player event listeners.
- Fixed Apple quality and ad callbacks remaining registered after connector teardown.

## 1.5.2

### 🐛 Issues

- Fixed a Gradle configuration failure on Android Gradle Plugin 9, where the connector's explicit `kotlin-android` plugin collided with AGP's built-in Kotlin support and failed with `Cannot add extension with name 'kotlin'`. The plugin is now applied only when nothing has registered the `kotlin` extension yet, so AGP 8 is unaffected.

## 1.5.1

### 🐛 Issues

- Fixed a compilation error on iOS with THEOplayer SDK 11, where the `Ad.adBreak` property became optional.

## 1.5.0

### ✨ Features

- - Restricted the supported OptiView (THEOplayer) player versions to v10 and v11. On Android, the default `THEOplayer_sdk` version range is now `[10.0.0, 12.0.0)` for every connector.

## 1.4.0

### ✨ Features

- Added support for THEOplayer v11 and React Native THEOplayer v11.

## 1.3.0

### ✨ Features

- Changed license to BSD 3-Cause Clear. See [LICENSE](./LICENSE) file for more information.

## 1.2.0

### ✨ Features

- Updated Android's target SDK version to 36.

## 1.1.1

### 🐛 Issues

- Fixed an issue where the native connector would not be properly destroyed in case the player's native handle would become unavailable.

## 1.1.0

### ✨ Features

- Added support for THEOplayer v10 and React Native THEOplayer v10.

## 1.0.0

### ✨ Features

- Initial release
