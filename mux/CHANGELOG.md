# @theoplayer/react-native-analytics-mux

## 1.5.0

### ✨ Features

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
