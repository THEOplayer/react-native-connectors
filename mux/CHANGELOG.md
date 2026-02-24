# @theoplayer/react-native-analytics-mux

## 1.12.0

### ✨ Features

- Updated Mux SDK to support OptiView player v10.

## 1.11.0

### ✨ Features

- Changed license to BSD 3-Cause Clear. See [LICENSE](./LICENSE) file for more information.

## 1.10.0

### ✨ Features

- Updated Android's target SDK version to 36.

## 1.9.1

### 🐛 Issues

- Fixed an issue where the native connector would not be properly destroyed in case the player's native handle would become unavailable.

## 1.9.0

### ✨ Features

- Add support for THEOplayer v10 and React Native THEOplayer v10.

## 1.8.0

### 📦 Dependency Updates

- Updated iOS Mux dependency to v0.13.

## 1.7.0

### ✨ Features

- Added support for THEOplayer 9.0.

## 1.6.3

### 📦 Dependency Updates

- Updated dependencies on Android, allowing THEOplayer v8 and using latest Mux connector version.

## 1.6.2

### 🐛 Issues

- Fixed an issue on iOS where the podspec files did not contain all references when not using the New Architecture.

## 1.6.1

### 🐛 Issues

- Fixed an issue on iOS where the project would not build when used in a project that has New Architecture enabled.

## 1.6.0

### ✨ Features

- Added sdkVersions API to Nielsen, Mux, Conviva, Comscore, Adobe and Engage connectors

## 1.5.0

### 📦 Dependency Updates

- Updated the mux connector on Android to be compatible with THEOplayer v8 versions.

### 🐛 Issues

- Changed the `useMux` hook to allow the `MuxOptions` to be passed with the initialize instead of directly passing it into the hook itself.
- Fixed an issue on iOS where an incorrect THEOplayer version would be passed.

## 1.4.1

### 🐛 Issues

- Deleted dependency on the removed ad module for Android.

## 1.4.0

### ✨ Features

- Fixed a issue where the connector would crash when using Mux-Stats-THEOplayer 0.7 in combination with recent react-native-theoplayer releases.

## 1.3.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## 1.2.0

### 🐛 Issues

- Fixed and issue on Android where Mux's Maven repository was not included in the root repository list.

## 1.1.1

### 📦 Dependency Updates

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.1.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.0.0

### ✨ Features

- Initial release
