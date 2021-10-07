# Change Log

This repository adheres to semantic versioning and follows the conventions of [keepachangelog.com](http://keepachangelog.com).

## Unreleased
### Added
- Initial implementation of twilio runtime serverless functions
- New shared library in `src/assets/shared.private.js`
  - `withAccessToken` wrapper for serverless function handlers to manage Spoke access token
  - `httpResponse` manages callback response from handler functions with correct HTTP headers
- Helper functions for Spoke Directory API
  - `getExtension` queries API by extension and returns matching response if there is one.
  - `listDirectory` lists the directory, passing through response payload including paging token
- Implemented first tests using `mocha`, `chai`, `sinon` and `istanbul`
- Circle CI build config (no deploy, run tests only)
