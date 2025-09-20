# Changelog

All notable changes to the BlueScope Alfred Workflow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-20

### Added
- Initial release of BlueScope workflow
- Device management functionality via `btd` keyword
  - View all paired Bluetooth devices
  - Toggle device connection status (connect/disconnect)
  - Real-time status updates with 0.5s refresh
  - Visual indicators: color icons for connected, grayscale for disconnected
- Bluetooth power control via `btt` keyword
  - Turn Bluetooth on/off system-wide
  - Current power state display
- Configurable keywords through Alfred workflow settings
  - Device Toggle Keyword (default: `btd`)
  - Bluetooth Power Keyword (default: `btt`)
- Comprehensive error handling and user feedback
  - blueutil dependency detection
  - Bluetooth permission checks
  - Clear error messages with actionable solutions
- Built-in documentation with usage instructions
- Dependency on blueutil for Bluetooth functionality
