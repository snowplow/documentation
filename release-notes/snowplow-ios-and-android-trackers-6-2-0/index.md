---
title: "Snowplow iOS and Android trackers 6.2.0"
description: "This release adds an option to continue the previously persisted session when the app restarts."
date: "2025-02-14"
update_type:
  - "Release notes"
components:
  - "Trackers"
---
This release adds an option to continue the previously persisted session when the app restarts.

The default behaviour is to always start a new session when a new tracker is created (i.e., when the app restarts) regardless of whether the previous one timed out or not.

With the option enabled, every session update is persisted to the UserDefaults storage. This includes the current event index in the session and a timestamp of the last update of the session. In case it's disabled, only session changes are persisted to UserDefaults.

The option can be configured using SessionConfiguration:

```
val sessionConfig = SessionConfiguration()
   .continueSessionOnRestart(true)
```

**Enhancements**

* Add an option to continue previously persisted session when the app restarts rather than starting a new one ( [#340](https://github.com/snowplow/snowplow-android-tracker/issues/340))
* iOS only: Make SelfDescribingJson class open to allow for inheritance ([#906](https://github.com/snowplow/snowplow-ios-tracker/pull/906)) thanks to [@TwoDollarsEsq](https://github.com/TwoDollarsEsq)
