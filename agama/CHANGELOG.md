# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed

- Simplified pre-install step in podFile to setup THEOplayer dependency for Youbora connector
- Updated docs on Youbora connector setup

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
