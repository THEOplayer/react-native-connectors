# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2024-04-10

### Added

- Added support for broadcasted ad events.
- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

### Fixed

- Fixed an issue where on iOS (^17.2) bitrate reporting was broken due to a deprecated iOS notification name.

## [1.5.1] - 2023-10-05

### Changed

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## [1.5.0] - 2023-10-05

### Added

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## [1.4.0] - 2023-09-15

### Changed

- Upgraded connector for Web to 1.2.0.

## [1.3.0] - 2023-08-31

### Changed

- Upgraded connector for Android to 5.10.0-1 with dependency on Conviva sdk 4.0.33.
- Upgraded Android compileSdk and targetSdk versions to 33.
- Updated example app to use @theoplayer/react-native-ui.

## [1.2.1] - 2023-08-09

### Changed

- Updated connector for Web to v1.1.7.

## [1.2.0] - 2023-07-28

### Changed

- Updated connector for Web to v1.1.6.
- Updated connector for Android to v5.6.0-1.

## [1.1.0] - 2023-06-29

### Fixed

- Fixed an issue on iOS where the bitrate was not reported after a stop and start new session action.

## [1.0.0] - 2023-05-02

Initial release
