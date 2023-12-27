---
title: "Page views"
sidebar_position: 20
---

# Page view tracking

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

Page views are tracked using the `trackPageView` method. This is generally part of the first Snowplow tag to fire on a particular web page. As a result, the `trackPageView` method is usually deployed straight after the tag that also invokes the Snowplow JavaScript (sp.js) e.g.

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)">

  ```javascript
  <!-- Snowplow starts plowing -->
  <script type="text/javascript">
  ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
  p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
  };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
  n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","{{URL to sp.js}}","snowplow"));

  snowplow('newTracker', 'sp', '{{collector_url_here}}', {
      appId: 'my-app-id',
  });

  snowplow('enableActivityTracking', {
    minimumVisitLength: 30,
    heartbeatDelay: 10
  });
  snowplow('trackPageView');

  </script>
  <!-- Snowplow stops plowing -->
  ```
  </TabItem>
  <TabItem value="browser" label="Browser (npm)" default>

```javascript
import {
  newTracker,
  enableActivityTracking,
  trackPageView
} from '@snowplow/browser-tracker';

newTracker('sp', '{{collector_url_here}}', {
    appId: 'my-app-id',
});

enableActivityTracking({
  minimumVisitLength: 30,
  heartbeatDelay: 10
});

trackPageView();
```
  </TabItem>

</Tabs>

### `trackPageView`

Track pageview is called using the simple:

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

`trackPageView` can also be passed an array of custom context entities as an additional parameter. See [custom context](#custom-context) for more information. TODO

Additionally, you can pass a function which returns an array of zero or more context entities to `trackPageView`. For the page view and for all subsequent page pings, the function will be called and the contexts it returns will be added to the event.

TODO page pings link

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
  // The usual array of static contexts
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context
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
  // The usual array of static contexts
  context: [{
    schema: 'iglu:com.acme/static_context/jsonschema/1-0-0',
    data: {
      staticValue: new Date().toString()
    }
  }],
  // Function which returns an array of custom context
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

The page view and every subsequent page ping will have both a static_context and a dynamic_context attached. The static_contexts will all have the same staticValue, but the dynamic_contexts will have different dynamicValues since a new context is created for every event.
