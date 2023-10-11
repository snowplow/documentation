---
title: "Consent"
date: "2021-04-07"
sidebar_position: 4000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

## Installation

- `npm install @snowplow/browser-plugin-consent`
- `yarn add @snowplow/browser-plugin-consent`
- `pnpm add @snowplow/browser-plugin-consent`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { ConsentPlugin } from '@snowplow/browser-plugin-consent';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ ConsentPlugin() ],
});
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>enableGdprContext</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#gdpr-context">Documentation</a></td></tr><tr><td><code>trackConsentGranted</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackConsentGranted">Documentation</a></td></tr><tr><td><code>trackConsentWithdrawn</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#trackConsentWithdrawn">Documentation</a></td></tr></tbody></table>

### Context

Adding this plugin will automatically capture the following context:

| Context                                                                                                                                                                                                 | Example                                           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| [iglu:com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/consent_document/jsonschema/1-0-0) | ![](images/Screenshot-2021-03-28-at-20.04.43.png) |
