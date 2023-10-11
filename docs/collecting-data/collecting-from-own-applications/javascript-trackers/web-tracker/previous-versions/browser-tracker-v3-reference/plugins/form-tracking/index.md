---
title: "Form Tracking"
date: "2021-04-07"
sidebar_position: 9000
---

```mdx-code-block
import ReleaseBadge from '@site/docs/reusable/javascript-tracker-release-badge-v3/_index.md'

<ReleaseBadge/>
```

Snowplow automatic form tracking detects three event types: `change_form`, `submit_form` and `focus_form`. To enable automatic form tracking, use the `enableFormTracking` method. This will add event listeners to all form elements and to all interactive elements inside forms (that is, all `input`, `textarea`, and `select` elements).

**Note:** that events on password fields will not be tracked.

## Installation

- `npm install @snowplow/browser-plugin-form-tracking`
- `yarn add @snowplow/browser-plugin-form-tracking`
- `pnpm add @snowplow/browser-plugin-form-tracking`

## Initialization

```javascript
import { newTracker, trackPageView } from '@snowplow/browser-tracker';
import { FormTrackingPlugin, enableFormTracking } from '@snowplow/browser-plugin-form-tracking';

newTracker('sp1', '{{collector_url}}', { 
   appId: 'my-app-id', 
   plugins: [ FormTrackingPlugin() ],
});

enableFormTracking();
```

### Functions

<table class="has-fixed-layout"><tbody><tr><td><code>enableFormTracking</code></td><td><a href="/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/previous-versions/browser-tracker-v3-reference/tracking-events/#enableFormTracking">Documentation</a></td></tr></tbody></table>

### Context

This plugin does not add any additional data to context of an event.
