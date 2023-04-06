# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2023-04-05

### Changed

- Updated iOS connector dependency to `~> 4.6`.
- Only show logs in DEBUG builds on iOS.
- Removed length reporting on Android.

## [0.3.0] - 2023-03-31

### Changed

- Removed `setPlayheadPosition` for iOS and Android.
- Lowered Android API level to 31.
- Added version constraint `~> 4.5.1` for iOS connector.

## [0.2.0] - 2023-03-22

### Changed

- Removed @testable import in iOS bridge
- Add tvOS platform to podspec

### Fixed

- Fixed event type typo in web implementation

## [0.1.0] - 2023-03-17

Initial release
