# @theoplayer/react-native-analytics-comscore

## 1.6.0

### 📦 Dependency Updates

- Removed setup for Mux connector on tvOS. The Mux pod is only available for iOS.
- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## 1.5.0

### 🐛 Issues

- Fixed an issue on Android where `notifyPlay()` was not called when the player would resume play-out.
- Fixed an issue on Android where the user consent variables were not properly passed.
- Fixed an issue on Web where the player position is reported as a decimal value instead of an integer.

### ✨ Features

- Added the `usagePropertiesAutoUpdateMode` option to `ComscoreConfiguration` to indicate whether background playback is supported.

## 1.4.1

### ✨ Features

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.4.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.3.0

### 🐛 Issues

- Fixed an issue on Web where some `duration` and `currentTime` values were reported wrong.

## 1.2.0

### 🐛 Issues

- Fixed an issue on Android where the usage properties would not update when the app transitions to the background.

## 1.1.0

### 📦 Dependency Updates

- Updated Web dependency to Comscore SDK v7.7.0

## 1.0.0

### ✨ Features

- Initial release
