---
title: "Migrating from v2 to v4"
sidebar_position: 90
---


## Configuration

- User anonymization not available
- GDPR configuration not available
- No autotracked application context
- No geoLocationContext
- No exceptionAutotracking
- No diagnosticAutotracking
- No screen view autotracking
- No `logLevel`
- Platform context - less autotracked information
- `newTracker` instead fo `createTracker`
  - Rename `method` to `eventMethod`
  - Rename `requestHeaders` to `customHeaders`
  - Rename `base64Encoding` to `encodeBase64`
  - Global contexts moved from configuration
