# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.0] - 2023-05-02

### Fixed

- Fixed an issue on iOS and Web where initiating play-out without a source would start a session.

## [0.9.0] - 2023-04-24

### Added

- Added a workaround on iOS to detect video playback failures, propagate an error to the THEOplayer and report the error to conviva.
- Added `useConviva` hook to create and initialize a Conviva connector. See README.md for usage.

### Fixed

- Fixed an issue on Web where the `Framework version` would be incorrectly reported.

## [0.8.0] - 2023-04-18

### Fixed

- Fixed an issue on Android where the playback state and metadata were not correctly reported after `stopAndStartNewSession` on Android.

## [0.7.0] - 2023-04-17

### Changed

- Ensured on Web and Android that metadata property `duration` is never passed as `Infinity` or `NaN`, and passed as `-1` when a playback error is reported.

## [0.6.0] - 2023-04-07

### Added

- Added support for Android 5.0.0 player SDK.

## [0.5.0] - 2023-04-05

### Changed

- Updated iOS connector dependency to `~> 4.6`.

## [0.4.0] - 2023-03-31

### Changed

- Lower Android API level to 31.

## [0.3.0] - 2023-03-30

### Fixed

### Changed

- Updated Android connector to v4.11.0-2
- Updated Web connector to v1.1.0
- Updated iOS connector

### Added

- Added `stopAndStartNewSession` to enable explicitly stopping the current session and starting a new one.

## [0.2.2] - 2023-03-06

### Changed

- Updated Web connector to v0.1.3.
- Updated Android connector to v4.9.0-2

## [0.2.1] - 2023-03-02

### Fixed

- Removed @testable import that caused problems while compiling this library in `release` mode.

## [0.2.0] - 2023-03-02

### Added

- tvOS support for iOS


## [0.1.0] - 2023-02-24

Initial release
