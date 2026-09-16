---
title: "Snowplow JavaScript trackers v4.5.0 released"
description: "We’re happy to announce a new release for JavaScript tracker."
date: "2025-04-04"
category:
  - "Release notes"
components:
  - "Trackers"
---
We’re happy to announce a new [release](https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/4.5.0) for JavaScript tracker.

This release avoids the error `ResiezObserver loop completed with undelivered notifications` being generated under certain circumstances.

It also makes it possible to provide a custom event store implementation in the React Native tracker and use a different provider than `@react-native-async-storage/async-storage`.

Finally, the release adds a configurable default label (`(empty)`) for automatic button click tracking to prevent validation failures for buttons that are missing a label. It also fixes disabling button click tracking for specific trackers.

NOTE: The `@react-native-async-storage/async-storage` dependency has been moved to peer dependencies for the React Native tracker. We expect that users already had this dependency listed under the app dependencies due to it providing native bindings that needed to be installed separately. Make sure your app has this dependency when upgrading the tracker.

**Enhancements**

* Allow configuring a custom event store in React Native tracker ([#1413](https://github.com/snowplow/snowplow-javascript-tracker/issues/1413)) thanks to [@valeriobelli](https://github.com/valeriobelli)
* Add a configurable default label in button click tracking and fix disabling for specific trackers (close [#1397](https://github.com/snowplow/snowplow-javascript-tracker/issues/1397) and [#1421](https://github.com/snowplow/snowplow-javascript-tracker/issues/1421))

**Bug fixes**

* Avoid undelivered notifications error ([#1335](https://github.com/snowplow/snowplow-javascript-tracker/pull/1335)) thanks to [@AngusMorton](https://github.com/AngusMorton)
