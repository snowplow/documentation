---
title: "Site search"
sidebar_position: 120
---

# Site search tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Use the `trackSiteSearch` method to track users searching your website. Here are its arguments:

| **Name**       | **Required?** | **Description**                 | **Type** |
|----------------|---------------|---------------------------------|----------|
| `terms`        | Yes           | Search terms                    | array    |
| `filters`      | No            | Search filters                  | JSON     |
| `totalResults` | No            | Results found                   | number   |
| `pageResults`  | No            | Results displayed on first page | number   |

An example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSiteSearch', {
    terms: ['unified', 'log'],
    filters: {'category': 'books', 'sub-category': 'non-fiction'},
    totalResults: 14,
    pageResults: 8
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { trackSiteSearch } from '@snowplow/browser-plugin-site-tracking';

trackSiteSearch({
    terms: ['unified', 'log'],
    filters: {'category': 'books', 'sub-category': 'non-fiction'},
    totalResults: 14,
    pageResults: 8
});
```

  </TabItem>
</Tabs>

Site search events are implemented as Snowplow self describing events. [Here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/site_search/jsonschema/1-0-0) is the schema for a `site_search` event.

`trackSiteSearch` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.

This is part of the `@snowplow/browser-plugin-site-tracking` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-site-tracking` and then initialize it:
TODO

```javascript
import { newTracker } from '@snowplow/browser-tracker';
import { SiteTrackingPlugin } from '@snowplow/browser-plugin-site-tracking';

newTracker('sp', '{{collector_url_here}}', {
  appId: 'my-app-id',
  plugins: [ SiteTrackingPlugin() ]
});
```

Definition:
```javascript
import { trackSocialInteraction } from '@snowplow/browser-plugin-site-tracking';

trackSocialInteraction({
  action: string,
  network: string,
  target: string
});
```

For example:

```javascript
import { trackSocialInteraction } from '@snowplow/browser-plugin-site-tracking';

trackSocialInteraction({
  action: 'like',
  network: 'facebook',
  target: 'pbz00123'
});
```
  </TabItem>
</Tabs>

`trackSocialInteraction` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information.
