---
title: "Geolocation"
date: "2021-04-07"
sidebar_position: 11000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

If this plugin is enabled, the tracker will attempt to create a context from the visitor’s geolocation information. If the visitor has not already given or denied the website permission to use their geolocation information, a prompt will appear. If they give permission, then all events from that moment on will include their geolocation information.

## Installation

- `npm install @snowplow/browser-plugin-geolocation`
- ``yarn add @snowplow/browser-plugin-`geolocation` ``
- ``pnpm add @snowplow/browser-plugin-`geolocation` ``

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GeolocationPlugin, enableGeolocationContext } from '@snowplow/browser-plugin-geolocation';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ GeolocationPlugin() ],
});

enableGeolocationContext();
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>enableGeolocationContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracker-setup/initialization-options/index.md">Documentation</a></td></tr></tbody></table>

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                                                                       | Example                                           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| [iglu:com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/geolocation_context/jsonschema/1-1-0) | ![](images/Screenshot-2021-03-30-at-22.25.13.png) |
