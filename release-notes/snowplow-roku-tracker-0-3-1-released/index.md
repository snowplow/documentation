---
title: "Snowplow Roku tracker 0.3.1 released"
description: "This is a patch release fixing issues in the v0.3.0 release."
date: "2025-07-31"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
This is a patch release fixing issues in the v0.3.0 release.

## New Features

* Add support for automatically tracking the `application_install` event, similar to the mobile SDKs

## Fixed Issues

* Fix the top-level `snowplow` interface not dispatching `trackMediaEvent` calls to tracker instances
* Fix an error where specifying `adBreak` for `trackMediaEvent` calls would reference an invalid property when finding its schema
* Fix an error where the `error_event` and `quality_change_event` payloads lower-cased their property names, producing schema-violating events
* Fix an issue where defining your own `domainUserId` would cause it to be used for `domainSessionId`
* Allow consistent Network User ID values within a tracker's lifetime/session
* Fix an error when adding media-global custom entities via `enableMediaTracking`
* Make `data` optional for SDE payloads (default to empty object)

The BrightScript package is published on NPM as [@snowplow/roku-tracker](https://www.npmjs.com/package/@snowplow/roku-tracker) and can be used with [ropm](https://github.com/rokucommunity/ropm). It may also be included in BrightScript apps directly using releases [published on Github](https://github.com/snowplow-incubator/snowplow-roku-tracker).
