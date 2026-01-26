---
title: "Remove the React Native tracker at runtime"
sidebar_label: "Removing trackers at runtime"
date: "2021-08-09"
sidebar_position: 40
description: "Remove individual trackers by namespace or remove all trackers at runtime using the React Native tracker API."
keywords: ["react native remove tracker", "tracker cleanup", "runtime removal"]
---

The React Native tracker provides two functions that allow you to remove a tracker (or all of them) at runtime.

### removeTracker

As each tracker is identified by its namespace, in order to remove a tracker at runtime, you need to pass its namespace to the `removeTracker` function.

For example, assuming an existing tracker with namespace `sp1` :

```javascript
import { newTracker, removeTracker } from '@snowplow/react-native-tracker';

// ...

removeTracker('sp1');
```

### removeAllTrackers

The function removeAllTrackers, which accepts no arguments, will remove all trackers created in your app.

```javascript
import { removeAllTrackers } from '@snowplow/react-native-tracker';

removeAllTrackers();
```
