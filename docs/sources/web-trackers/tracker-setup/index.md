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
```

<ReleaseBadge/>

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

There are two distributions of the JavaScript Tracker:

| Distribution | Size (minified + gzipped) | Default distribution | Best for                                        | Plugins included? |
| ------------ | ------------------------- | -------------------- | ----------------------------------------------- | ----------------- |
| `sp.js`      | ~25 KB                    | ✅                    | Quick start with a wide range of functionality  | ✅                 |
| `sp.lite.js` | ~18 KB                    | ❌                    | Minimizing tracker size, focus on core tracking | ❌                 |

The `sp.js` distribution doesn't include all available plugins. See the [plugins](/docs/sources/web-trackers/plugins/index.md) page for full details on which are included.

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
