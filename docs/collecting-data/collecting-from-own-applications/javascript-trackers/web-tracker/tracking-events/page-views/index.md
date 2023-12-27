---
title: "Page views"
sidebar_position: 20
---

# Page view tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Page view events are tracked using the `trackPageView` method. This is generally part of the first Snowplow tag to fire, or first method to be called, on a particular web page. As a result, the `trackPageView` method is usually deployed straight after the tag that also invokes the Snowplow JavaScript (sp.js).

## Tracking a page view

Page view events must be **manually tracked**.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript runnable
snowplow('trackPageView');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import { trackPageView } from '@snowplow/browser-tracker';

trackPageView();
```
  </TabItem>
</Tabs>

This method automatically captures the URL, referrer and page title (inferred from the `<title>` tag).

If you wish, you can override the title with a custom value:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

```javascript runnable
snowplow('trackPageView', { title: 'my custom page title' });
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import { trackPageView } from '@snowplow/browser-tracker';

trackPageView({ title: 'my custom page title' });
```
  </TabItem>
</Tabs>

## Context callback

As with all `trackX` methods, `trackPageView` can be passed an array of [custom context entities](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/custom-tracking-using-schemas/index.md) as an additional parameter.

Additionally, you can pass a function which returns an array of zero or more context entities to `trackPageView`. For the page view and for all subsequent [page pings](docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracking-events/activity-page-pings/index.md), the function will be called and the context entities it returns will be added to the event.

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Turn on page pings every 10 seconds
snowplow('enableActivityTracking', {
  minimumVisitLength: 10,
  heartbeatDelay: 10
});

snowplow('trackPageView', {
  // The usual array of static context entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context entities
  // Gets called once per page view / page ping
  contextCallback: function() {
    return [{
      schema: 'iglu:com.acme/dynamic_context/jsonschema/1-0-0',
      data: {
        dynamicValue: new Date().toString()
      }
    }];
  }
});
```

</TabItem>
<TabItem value="browser" label="Browser (npm)">

```javascript
import {
  enableActivityTracking,
  trackPageView
} from '@snowplow/browser-tracker';

// Turn on page pings every 10 seconds
enableActivityTracking({
  minimumVisitLength: 10,
  heartbeatDelay: 10
});

trackPageView({
  // The usual array of static context entities
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context entities
  // Gets called once per page view / page ping
  contextCallback: function() {
    return [{
      schema: 'iglu:com.acme/dynamic_context/jsonschema/1-0-0',
      data: {
        dynamicValue: new Date().toString()
      }
    }];
  }
});
```
  </TabItem>
</Tabs>

In this example, the tracked page view and every subsequent page ping will have both a static_context and a dynamic_context attached. The static_contexts will all have the same staticValue, but the dynamic_contexts will have different dynamicValues since a new context is created for every event.
