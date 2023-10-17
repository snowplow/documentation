---
title: "Privacy Sandbox"
sidebar_position: 14500
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

The plugin allows for adding Privacy Sandbox related data to your Snowplow tracking. To learn more about the Privacy Sandbox you can visit the official [website](https://www.privacysandbox.com/). As more and more APIs become available or further refined, we will be upgrading the plugin with more capabilities and options as more APIs are added to the Privacy Sandbox.

Currently supported APIs:
- [Topics API](https://developer.chrome.com/docs/privacy-sandbox/topics/overview/)

__Note:__ Some of the APIs and data will not be available by default in all users. This is commonly due to these APIs being dependent on browser support, user privacy preferences, browser feature-flags or ad-blocking software. The plugin will not modify or request access explicitly to any of these features if not available by default.

:::note
The plugin is available since version 3.14 of the tracker.
:::

## Installation

- `npm install @snowplow/browser-plugin-privacy-sandbox`
- `yarn add @snowplow/browser-plugin-privacy-sandbox`
- `pnpm add @snowplow/browser-plugin-privacy-sandbox`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { PrivacySandboxPlugin } from '@snowplow/browser-plugin-privacy-sandbox';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ PrivacySandboxPlugin() ],
});
```

### Context

Adding this plugin will automatically capture the following context:

| Context |
| --- |
| [iglu:com.google.privacysandbox/topics/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.google.privacysandbox/topics/jsonschema/1-0-0) |
