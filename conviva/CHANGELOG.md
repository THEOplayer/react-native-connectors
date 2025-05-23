# @theoplayer/react-native-analytics-conviva

## 1.9.1

### 🐛 Issues

- Fixed an issue where the connector would output a `HashMap` conversion build error for Android platforms.

## 1.9.0

### ✨ Features

- Added support for THEOplayer 9.0.

### 🐛 Issues

- Fixed an issue on Android where an app would crash when accessing the connector's `stopAndStartNewSession` method.

## 1.8.3

### 🐛 Issues

- Fixed an issue on Android where the optional `debug` property in `ConvivaConfiguration` was treated as being required.

### ✨ Features

- Added the option on Android to allow setting a different connector version using `THEOplayerName_connectorVersion`.

## 1.8.2

### 🐛 Issues

- Fixed an issue on iOS where the podspec files did not contain all references when not using the New Architecture.

## 1.8.1

### 🐛 Issues

- Fixed an issue on iOS where the project would not build when used in a project that has New Architecture enabled.

## 1.8.0

### ✨ Features

- Added sdkVersions API to Nielsen, Mux, Conviva, Comscore, Adobe and Engage connectors

## 1.7.1

### 🐛 Issues

- Deleted dependency on the removed ad module for Android.

## 1.7.0

### ✨ Features

- Added support for THEOplayer 8.0

## 1.6.0

### ✨ Features

- Added support for broadcasted ad events.

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

### 🐛 Issues

- Fixed an issue where on iOS (^17.2) bitrate reporting was broken due to a deprecated iOS notification name.

## 1.5.1

### 📦 Dependency Updates

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.5.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.4.0

### 📦 Dependency Updates

- Upgraded connector for Web to 1.2.0.

## 1.3.0

### 📦 Dependency Updates

- Upgraded connector for Android to 5.10.0-1 with dependency on Conviva sdk 4.0.33.
- Upgraded Android compileSdk and targetSdk versions to 33.

### ✨ Features

- Updated example app to use @theoplayer/react-native-ui.

## 1.2.1

### 📦 Dependency Updates

- Updated connector for Web to v1.1.7.

## 1.2.0

### 📦 Dependency Updates

- Updated connector for Web to v1.1.6.
- Updated connector for Android to v5.6.0-1.

## 1.1.0

### 🐛 Issues

- Fixed an issue on iOS where the bitrate was not reported after a stop and start new session action.

## 1.0.0

### ✨ Features

- Initial release
