---
title: "Installing the tracker"
date: "2021-03-31"
sidebar_position: -10
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

There are two distributions of the JavaScript Tracker:

- `sp.js` is fully featured and is bundled with the majority of the available plugins.
- `sp.lite.js` is a smaller distribution with no bundled plugins. Included is Page View, Self Describing and Structured Event tracking as well as Activity Tracking and Anonymous Tracking. All other features can be loaded as separate [plugins](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/index.md).

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

## Using plugins

You can extend the tracker by installing plugins. 

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

The Browser Tracker is based around a plugin architecture which allows new functionality to be added to the tracker. These plugins can be installed from npm or you can write your own in your codebase and then they are passed into the tracker.

There are a number of Snowplow maintained plugins, however you are also free to build your own or leverage community plugins too.

The UMD files (which work in the browser) can be downloaded from [GitHub releases](https://github.com/snowplow/snowplow-javascript-tracker/releases) or they are available via [third party CDNs](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/hosting-the-javascript-tracker/third-party-cdn-hosting/index.md).

For other combinations of plugins not covered by `sp.js` or `sp.lite.js`, try [bundling a custom selection](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/configuring-tracker-plugins/javascript/index.md) and self hosting the tracker.

| Plugin              | `sp.js` | `sp.lite.js` |
|---------------------|---------|--------------|
| Ad Tracking         | ✅       | ❌            |
| Browser Features    | ❌       | ❌            |
| Client Hints        | ✅       | ❌            |
| Consent             | ✅       | ❌            |
| Debugger            | ❌       | ❌            |
| Ecommerce           | ✅       | ❌            |
| Enhanced Consent    | ❌       | ❌            |
| Enhanced Ecommerce  | ✅       | ❌            |
| Error Tracking      | ✅       | ❌            |
| Form Tracking       | ✅       | ❌            |
| GA Cookies          | ✅       | ❌            |
| Geolocation         | ✅       | ❌            |
| Link Click Tracking | ✅       | ❌            |
| Media Tracking      | ❌       | ❌            |
| Optimizely          | ❌       | ❌            |
| Optimizely X        | ✅       | ❌            |
| Performance Timing  | ✅       | ❌            |
| Site Tracking       | ✅       | ❌            |
| Snowplow Ecommerce  | ❌       | ❌            |
| Timezone            | ✅       | ❌            |
| YouTube Tracking    | ❌       | ❌            |
  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

Lets say you wanted to use the Form Tracking plugin, you first need to install the package:
    - `npm install @snowplow/browser-plugin-form-tracking`
    - `yarn add @snowplow/browser-plugin-form-tracking`
    - `pnpm add @snowplow/browser-plugin-form-tracking`

- You can then import the form tracking library:

```javascript
import { FormTrackingPlugin, enableFormTracking } from '@snowplow/browser-plugin-form-tracking';
```

- Update your tracker initialization code so the tracker knows this plugin exists:

```javascript
newTracker('sp1', '{{collector_url}}', { 
  appId: 'my-app-id', 
  plugins: [ FormTrackingPlugin() ],
});
```

- And then use the new functions which this plugin includes:

```javascript
enableFormTracking();
```

There are lots of plugins already available! You can find them all [here](https://github.com/snowplow/snowplow-javascript-tracker/tree/master/plugins) and also search for them on [npmjs.com](https://www.npmjs.com/).
  </TabItem>
</Tabs>

