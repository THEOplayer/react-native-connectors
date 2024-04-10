# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2024-04-10

### Changed

- Remove setup fo Mux connector on tvOS. The Mux pod is only available for iOS.

### Added

- Added support for `react-native-theoplayer` v7.0.0 and native player SDK v7.0.0.

## [1.5.0] - 2023-11-17

### Fixed

- Fixed an issue on Android where `notifyPlay()` was not called when the player would resume play-out.
- Fixed an issue on Android where the user consent variables were not properly passed.
- Fixed an issue on Web where the player position is reported as a decimal value instead of an integer.

### Added

- Added the `usagePropertiesAutoUpdateMode` option to `ComscoreConfiguration` to indicate whether background playback is supported.

## [1.4.1] - 2023-10-05

### Changed

- Relax restriction on `react-native-theoplayer` peer dependency versions.

## [1.4.0] - 2023-10-05

### Added

- Added support for `react-native-theoplayer` v3.0 and THEOplayer 6.0.

## [1.3.0] - 2023-08-29

### Fixed

- Fixed an issue on Web where some `duration` and `currentTime` values were reported wrong.

## [1.2.0] - 2023-08-23

### Fixed

- Fixed an issue on Android where the usage properties would not update when the app transitions to the background.

## [1.1.0] - 2023-07-28

### Changed

- Updated Web dependency to Comscore SDK v7.7.0

## [1.0.0] - 2023-05-10

- Initial release
