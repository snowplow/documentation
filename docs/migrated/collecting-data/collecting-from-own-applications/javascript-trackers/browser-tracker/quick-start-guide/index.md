---
title: "Quick start guide"
date: "2021-03-24"
sidebar_position: 100
---

Getting started with sending events using the Browser Tracker will be familiar for anyone who is used to installing npm packages into their web apps and is designed to work with frameworks such as React, Angular and Vue.

The process involves the following high level steps:

- Install the `@snowplow/browser-tracker` package using your preferred package manager
    - `npm install @snowplow/browser-tracker`
    - `yarn add @snowplow/browser-tracker`
    - `pnpm add @snowplow/browser-tracker`

- You can then import this library into your application

```
import { newTracker, trackPageView } from "@snowplow/browser-tracker";
```

- Configure an instance of the tracker by calling `newTracker(...)` with your desired properties. This will create a module level instance of your tracker. You don't need to keep a reference to it.

```
newTracker('sp1', '{{collector_url}}', { 
  appId: 'my-app-id', 
  plugins: [ ],
})
```

- Then you can use the track methods to send some events. You can send a Page View event to all initialised trackers with just:

```
trackPageView();
```

- You can read more about the other tracking functions which are available in the [Browser Tracker and associated Plugins](/docs/migrated/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/).
