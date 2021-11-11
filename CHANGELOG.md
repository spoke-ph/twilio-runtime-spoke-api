# Change Log

This repository adheres to semantic versioning and follows the conventions of [keepachangelog.com](http://keepachangelog.com).

## [Unreleased]

## [1.1.0] - 2021-11-11
### Added
- New `studio_flow_examples` folder
  - Includes `Basic Spoke IVR Flow` example
  - Updated readme with instructions/details for using the flow with the Spoke functions.

## [1.0.1] - 2021-10-13
### Added
- Github templates for issues and pull requests

## 1.0.0 - 2021-10-12
### Added
- Initial implementation of twilio runtime serverless functions
- New shared library in `src/assets/shared.private.js`
  - `withAccessToken` wrapper for serverless function handlers to manage Spoke access token
  - `httpResponse` manages callback response from handler functions with correct HTTP headers
- Helper functions for Spoke Directory API
  - `getExtension` queries API by extension and returns matching response if there is one.
  - `listDirectory` lists the directory, passing through response payload including paging token
- Implemented first tests using `mocha`, `chai`, `sinon` and `istanbul`
- Circle CI build config
  - Lint & test, github release tagging when merging non-SNAPSHOT versions to `main`

[Unreleased]: https://github.com/spoke-ph/twilio-runtime-spoke-api/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/spoke-ph/twilio-runtime-spoke-api/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/spoke-ph/twilio-runtime-spoke-api/compare/v1.0.0...v1.0.1
