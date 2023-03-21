# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
