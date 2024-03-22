# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2024-03-22

### Fixed

- Fixed an issue where the `media.length` would be wrong when starting a session for a stream with a pre-roll ad.

## [1.2.1] - 2023-10-05

### Changed

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## [1.2.0] - 2023-10-05

### Added

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## [1.1.0] - 2023-05-08

### Added

- Added a `userAgent` property to the connector's constructor to allow setting a custom `User-Agent` header value when doing requests.

### Changed

- Changed the default `User-Agent` header value on Android to custom value that contains `Mozilla/5.0 (Linux; U; ${operatingSystem}; ${localeString}; ${deviceName} Build/${deviceBuildId})`.
- Changed the default `User-Agent` header value on iOS to custom value that contains `Mozilla/5.0 (${model}; CPU OS ${osVersion} like Mac OS X; ${localeIdentifier})`.

## [1.0.0] - 2023-05-03

### Added

- Added `useAdobe` hook to create and initialize an Adobe connector. See README.md for usage.

## [0.7.0] - 2023-04-14

### Fixed

- Fixed sending play/pause on program boundaries.
- Fixed sending ad ping events if a program boundary occurs mid ad.

## [0.6.0] - 2023-04-05

### Added

- Add `media.name` to `sessionStart` request if `player.source.metadata.title` is set.
- Add functionality to stop the current session and start a new one.

## [0.5.0] - 2023-03-21

### Changed

- Removed numeric separators for constants.

## [0.4.0] - 2023-03-21

### Added

- Optional metadata field to the constructor.

## [0.3.0] - 2023-03-20

### Fixed

- Fixed correctly passing the `playHead` property.
- Fixed correctly passing custom metadata to the session request.
- Fixed an issue where the `chapterStart` parameters would be missing.
- Fixed some http issues during `sendEventRequest`.

### Changed

- Improved sending error event.
- Improved property typing.

## [0.2.0] - 2023-03-16

### Fixed

- Removed a `postinstall` script from package.json.
- Fixed an issue where the session would not be ended when destroying the connector.

## [0.1.0] - 2023-03-16

Initial release
