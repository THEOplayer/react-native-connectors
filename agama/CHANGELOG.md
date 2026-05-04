# @theoplayer/react-native-analytics-agama

## 1.12.1

### 🐛 Issues

- Fixed an issue where the measuring network interceptor would cause ABR to break and make the player stall during play-out.

## 1.12.0

### ✨ Features

- Added support for THEOplayer v11 and React Native THEOplayer v11.

## 1.11.0

### ✨ Features

- Changed license to BSD 3-Cause Clear. See [LICENSE](./LICENSE) file for more information.

## 1.10.0

### ✨ Features

- Updated Android's target SDK version to 36.

## 1.9.0

### ✨ Features

- Added support for THEOplayer v10 and React Native THEOplayer v10.

## 1.8.0

### ✨ Features

- Bumped dependency on react-native-device-info

## 1.7.0

### ✨ Features

- Added support for THEOplayer 9.0.

## 1.6.1

### 📦 Dependency Updates

- Updated dependency `react-native-device-info` to version `>=10.0.0 <14.0.0`.

## 1.6.0

### ✨ Features

- Added support for THEOplayer 8.0

## 1.5.0

### 🐛 Issues

- Fixed an issue where the player would jump to a different time stamp as result of a test left-over.

## 1.4.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## 1.3.0

### ✨ Features

- Added optional `deviceType` property to `AgamaConfiguration` to overwrite the physical device type. By default, the `deviceType` is derived from the platform.

## 1.2.1

### 📦 Dependency Updates

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.2.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.1.1

### ✨ Features

- Added `SourceConfiguration` and `AgamaConfiguration` types to package exports.

### 🐛 Issues

- Fixed the location of `manifest.json` in order to make it discoverable for web platforms.

## 1.1.0

### 📦 Dependency Updates

- Set upper boundary on THEOplayer's Android SDK version.

## 1.0.3

### 🐛 Issues

- Fixed an issue where creating a build manifest would fail due to a missing dependency.

## 1.0.2

### 🐛 Issues

- Fixed an issue where creating a build manifest would fail due to a missing dependency.

## 1.0.1

### 🐛 Issues

- Fixed the keywords list in `package.json`.
- Fixed missing `manifest` script in npm package.

## 1.0.0

### ✨ Features

- Initial release
