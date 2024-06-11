# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2024-06-11

### Fixed

- Fixed an issue where the player would jump to a different time stamp as result of a test left-over.

## [1.4.0] - 2024-04-10

### Added

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## [1.3.0] - 2024-01-08

### Added

- Added optional `deviceType` property to `AgamaConfiguration` to overwrite the physical device type. By default, the `deviceType` is derived from the platform.

## [1.2.1] - 2023-10-05

### Changed

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## [1.2.0] - 2023-10-05

### Added

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## [1.1.1] - 2023-10-04

### Added

- Added `SourceConfiguration` and `AgamaConfiguration` types to package exports.

### Fixed

- Fixed the location of `manifest.json` in order to make it discoverable for web platforms.

## [1.1.0] - 2023-09-14

### Changed

- Set upper boundary on THEOplayer's Android SDK version.

## [1.0.3] - 2023-09-14

### Fixed

- Fixed an issue where creating a build manifest would fail due to a missing dependency.

## [1.0.2] - 2023-09-14

### Fixed

- Fixed an issue where creating a build manifest would fail due to a missing dependency.

## [1.0.1] - 2023-09-14

### Fixed

- Fixed the keywords list in `package.json`.
- Fixed missing `manifest` script in npm package.

## [1.0.0] - 2023-09-12

Initial release
