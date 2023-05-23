---
title: "Kantar FocalMeter"
sidebar_position: 12000
---

```mdx-code-block
import Block5966 from "@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md"
import FocalMeter from "@site/docs/reusable/focalmeter-js-tracker/_index.md"

<Block5966/>
```

This plugin will add integration with the [Kantar FocalMeter](https://www.virtualmeter.co.uk/focalmeter) to your Snowplow tracking.
The plugin sends requests with the domain user ID to a Kantar endpoint used with the FocalMeter system.
A request is made when the first event with a new user ID is tracked.

:::note
The plugin is available since version 3.9 of the tracker.
:::

## Installation

- `npm install @snowplow/browser-plugin-focalmeter`
- `yarn add @snowplow/browser-plugin-focalmeter`
- `pnpm add @snowplow/browser-plugin-focalmeter`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { FocalMeterPlugin, enableFocalMeterIntegration } from '@snowplow/browser-plugin-focalmeter';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ FocalMeterPlugin() ],
});

enableFocalMeterIntegration({
  kantarEndpoint: '{{kantar_url}}',
  useLocalStorage: false // optional, defaults to false
});
```

```mdx-code-block
<FocalMeter tracker="js-browser"/>
```
