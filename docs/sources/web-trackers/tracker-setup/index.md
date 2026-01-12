---
title: "Set up the web trackers"
sidebar_label: "Tracker setup"
description: "Install and initialize the JavaScript or Browser tracker with customizable configuration options."
keywords: ["tracker setup", "initialization", "newtracker", "sp.js", "npm package"]
date: "2021-03-31"
sidebar_position: 1000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'
import DocCardList from '@theme/DocCardList';
```

<ReleaseBadge/>

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

There are two distributions of the JavaScript Tracker:

- `sp.js` is fully featured and is bundled with the majority of the available plugins.
- `sp.lite.js` is a smaller distribution with no bundled plugins. Included is Page View, Self Describing and Structured Event tracking as well as Activity Tracking and Anonymous Tracking. All other features can be loaded as separate [plugins](/docs/sources/web-trackers/plugins/index.md).

```mdx-code-block
import LoadWithTag from "@site/docs/reusable/javascript-tracker-load-with-tag/_index.md"

<LoadWithTag/>
```

Once the tracker is loaded via the tag, you can move on to initializing the tracker.

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Getting started with sending events using the Browser Tracker will be familiar for anyone who is used to installing npm packages into their web apps and is designed to work with frameworks such as React, Angular and Vue.

- Install the `@snowplow/browser-tracker` package using your preferred package manager
    - `npm install @snowplow/browser-tracker`
    - `yarn add @snowplow/browser-tracker`
    - `pnpm add @snowplow/browser-tracker`

- You can then import this library into your application

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
```

- Configure an instance of the tracker by calling `newTracker(...)` with your desired properties. This will create a module level instance of your tracker. You don't need to keep a reference to it.

```javascript
newTracker('sp1', '{{collector_url}}', {
  appId: 'my-app-id',
  plugins: [ ],
});
```

- Then you can use the track methods to send some events. You can send a Page View event to all initialised trackers with just:

```javascript
trackPageView();
```

  </TabItem>
</Tabs>

<DocCardList/>
