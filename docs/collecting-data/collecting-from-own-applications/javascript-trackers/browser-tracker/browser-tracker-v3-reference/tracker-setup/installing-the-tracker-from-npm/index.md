---
title: "Installing the tracker from npm"
date: "2021-03-31"
sidebar_position: -10
---

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

## Using Plugins

- You can extend the tracker by installing plugins. Lets say you wanted to use the Form Tracking plugin, you first need to install the package:
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
