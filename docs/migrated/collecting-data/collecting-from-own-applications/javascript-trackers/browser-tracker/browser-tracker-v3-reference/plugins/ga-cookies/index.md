---
title: "GA Cookies"
date: "2021-04-07"
sidebar_position: 10000
---

If this plugin is used, the tracker will look for Google Analytics cookies (specifically the “\_\_utma”, “\_\_utmb”, “\_\_utmc”, “\_\_utmv”, “\_\_utmz”, and “\_ga” cookies) and combine their values into an event context which gets sent with every event.

## Installation

- `npm install @snowplow/browser-plugin-ga-cookies`
- `yarn add @snowplow/browser-plugin-ga-cookies`
- `pnpm add @snowplow/browser-plugin-ga-cookies`

## Initialization

```
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { GaCookiesPlugin } from '@snowplow/browser-plugin-ga-cookies';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ GaCookiesPlugin() ],
});
```

### Context

Adding this plugin will automatically capture the following context:

| Context | Example |
| --- | --- |
| [iglu:com.google.analytics/cookies/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.google.analytics/cookies/jsonschema/1-0-0) | ![](images/Screenshot-2021-03-30-at-22.12.03.png) |
