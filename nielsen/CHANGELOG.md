# @theoplayer/react-native-analytics-nielsen

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

- Added support for THEOplayer v10 and React Native THEOplayer v10.

## 1.8.1

### 🐛 Issues

- Fixed an issue where the connector would output a `HashMap` conversion build error for Android platforms.

## 1.8.0

### ✨ Features

- Added support for THEOplayer 9.0.

## 1.7.3

### 🐛 Issues

- Fixed an issue where the `NielsenOptions` type would not be properly provided by the package.

### ✨ Features

- Added the option on Android to allow setting a different connector version using `THEOplayerName_connectorVersion`.

## 1.7.2

### 🐛 Issues

- Fixed an issue on iOS where the podspec files did not contain all references when not using the New Architecture.

## 1.7.1

### 🐛 Issues

- Fixed an issue on iOS where the project would not build when used in a project that has New Architecture enabled.

## 1.7.0

### ✨ Features

- Added sdkVersions API to Nielsen, Mux, Conviva, Comscore, Adobe and Engage connectors

## 1.6.0

### ✨ Features

- Apply correct update mechanism for nielsen options dictionary

## 1.5.1

### 🐛 Issues

- Deleted dependency on the removed ad module for Android.

## 1.5.0

### ✨ Features

- Added support for THEOplayer 8.0

## 1.4.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## 1.3.0

### 📦 Dependency Updates

- Upgraded Nielsen Android SDK to v9.2.0.0.
- Depend on latest Nielsen Android connector from Maven repository.
- Upgraded Nielsen web connector to v1.1.2.

## 1.2.0

### ✨ Features

- Removed any existing connector from the player on Android before attaching a new instance, avoiding duplicates.

## 1.1.1

### 📦 Dependency Updates

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.1.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.0.0

### ✨ Features

- Initial release
