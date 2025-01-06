# @theoplayer/react-native-analytics-adobe

## 1.8.0

### ✨ Features

- Added sdkVersions API to Nielsen, Mux, Conviva, Comscore, Adobe and Engage connectors

## 1.7.1

### 🐛 Issues

- Fixed a build issue where the `Settings` object would not be found when using the connector with react-native-web.

## 1.7.0

### ✨ Features

- Dropped usage of the NativeModules import to make the connector ready for the new architecture

### 🐛 Issues

- ### 📦 Dependency Updates

  react-native-device-info@>=10.0.0 <14.0.0

## 1.6.0

### ✨ Features

- Added support for THEOplayer 8.0

## 1.5.0

### 🐛 Issues

- Fixed an issue on Web where an asset with a pre-roll ad would report an invalid media duration.

### ✨ Features

- Added `debug` flag for extra logging.

## 1.4.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## 1.3.1

### 🐛 Issues

- Fixed an issue where the `media.length` would be not be correctly converted to seconds for VOD and Live streams.

## 1.3.0

### 🐛 Issues

- Fixed an issue where the `media.length` would be wrong when starting a session for a stream with a pre-roll ad.

## 1.2.1

### 📦 Dependency Updates

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## 1.2.0

### 📦 Dependency Updates

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## 1.1.0

### ✨ Features

- Added a `userAgent` property to the connector's constructor to allow setting a custom `User-Agent` header value when doing requests.
- Changed the default `User-Agent` header value on Android to custom value that contains `Mozilla/5.0 (Linux; U; ${operatingSystem}; ${localeString}; ${deviceName} Build/${deviceBuildId})`.
- Changed the default `User-Agent` header value on iOS to custom value that contains `Mozilla/5.0 (${model}; CPU OS ${osVersion} like Mac OS X; ${localeIdentifier})`.

## 1.0.0

### ✨ Features

- Added `useAdobe` hook to create and initialize an Adobe connector. See README.md for usage.

## 0.7.0

### 🐛 Issues

- Fixed sending play/pause on program boundaries.
- Fixed sending ad ping events if a program boundary occurs mid ad.

## 0.6.0

### ✨ Features

- Add `media.name` to `sessionStart` request if `player.source.metadata.title` is set.
- Add functionality to stop the current session and start a new one.

## 0.5.0

### ✨ Features

- Removed numeric separators for constants.

## 0.4.0

### ✨ Features

- Optional metadata field to the constructor.

## 0.3.0

### 🐛 Issues

- Fixed correctly passing the `playHead` property.
- Fixed correctly passing custom metadata to the session request.
- Fixed an issue where the `chapterStart` parameters would be missing.
- Fixed some http issues during `sendEventRequest`.

### ✨ Features

- Improved sending error event.
- Improved property typing.

## 0.2.0

### 🐛 Issues

- Removed a `postinstall` script from package.json.
- Fixed an issue where the session would not be ended when destroying the connector.

## 0.1.0

### ✨ Features

- Initial release
