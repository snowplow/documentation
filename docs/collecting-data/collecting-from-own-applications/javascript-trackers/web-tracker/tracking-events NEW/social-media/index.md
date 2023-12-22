---
title: "Social media"
sidebar_position: 140
---

# Social media tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Social tracking will be used to track the way users interact with Facebook, Twitter and Google + widgets, e.g. to capture "like this" or "tweet this" events.

#### `trackSocialInteraction`

The `trackSocialInteraction` method takes three parameters:

| **Parameter** | **Description**                                               | **Required?** | **Example value**     |
|---------------|---------------------------------------------------------------|---------------|-----------------------|
| `action`      | Social action performed                                       | Yes           | 'like', 'retweet'     |
| `network`     | Social network                                                | Yes           | 'facebook', 'twitter' |
| `target`      | Object social action is performed on e.g. page ID, product ID | No            | '19.99'               |

The method is executed in as:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
snowplow('trackSocialInteraction', {
  action: string,
  network: string,
  target: string
});

```

For example:

```javascript
snowplow('trackSocialInteraction', {
  action: 'like',
  network: 'facebook',
  target: 'pbz00123'
});
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

This is part of the `@snowplow/browser-plugin-site-tracking` plugin. You need to install it with your favorite package manager: `npm install @snowplow/browser-plugin-site-tracking` and then initialize it:

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
