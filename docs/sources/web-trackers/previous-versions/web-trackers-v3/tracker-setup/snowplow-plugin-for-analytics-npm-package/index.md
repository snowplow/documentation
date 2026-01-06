---
title: "Snowplow Plugin for getanalytics.io"
date: "2020-08-10"
sidebar_position: 4000
---

The Snowplow JavaScript tracker can now be deployed directly into your web and node applications using the `analytics` and `@analytics/snowplow` NPM packages.

:::note
Snowplow recommends using the official Snowplow Browser Tracker or Node.js Tracker instead of this package as you will receive updates faster and install a smaller dependency into your application, unless you wish to send your events to multiple providers which is where the @analytics packages are particularly useful.
:::

### Quick Start

```bash
npm install analytics
npm install @analytics/snowplow
```

Initialise the plugin:

```javascript
import Analytics from 'analytics'
import snowplowPlugin from '@analytics/snowplow'

const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    // Minimal recommended configuration
    snowplowPlugin({
      name: 'snowplow',
      collectorUrl: 'collector.mysite.com',
      trackerSettings: {
        appId: 'myApp',
        contexts: {
          webPage: true
        }
      }
    })
  ]
})
```

Then track a page view event:

```javascript
analytics.page()
```

### Full documentation

[Snowplow Plugin documentation](https://getanalytics.io/plugins/snowplow/) (getanalytics.io)

[Analytics package documentation](https://getanalytics.io/) (getanalytics.io)
