---
title: "Snowplow JavaScript tracker 4.10.0"
description: "This release focuses on webview and single-page app tracking."
date: "2026-07-27"
category:
  - "Release notes"
components:
  - "Trackers"
---
This release focuses on webview and single-page app tracking. A new opt-in webview plugin is available as a build-time feature flag, along with an option to disable session context inside webviews so that hybrid apps don't emit conflicting session data. SPA tracking also gets a `preserveOriginalReferrer` option for holding on to the original referrer across route changes, plus a startup performance fix that removes a forced layout read during tracker initialization.

**New features**

* `disableSessionContextWithinWebView`option ([#1494](https://github.com/snowplow/snowplow-javascript-tracker/pull/1494))

* Webview plugin as an opt-in build-time feature flag ([#1493](https://github.com/snowplow/snowplow-javascript-tracker/pull/1493))

* `preserveOriginalReferrer`option for SPA referrer tracking ([#1491](https://github.com/snowplow/snowplow-javascript-tracker/pull/1491))

**Bug fixes**

* Removed forced layout read from tracker initialization ([#1490](https://github.com/snowplow/snowplow-javascript-tracker/pull/1490))
