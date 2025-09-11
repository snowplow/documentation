---
title: "Debugging Google Tag Manager Server Side Tags"
sidebar_label: "Testing & debugging"
sidebar_position: 800
---

If you are working on some changes to the configuration of your Google Tag Manager tags and would like to test them before applying them in production, you can use GTM’s [Preview Mode](https://developers.google.com/tag-platform/tag-manager/server-side/debug) feature. It shows information about the events it receives, which tags get triggered, etc.

You can direct some (or all) of your Snowplow events to the Preview Mode, instead of the production tags.

:::note Snowbridge 2.3+

To follow the steps below, you will need to be running [Snowbridge](/docs/api-reference/snowbridge/index.md) 2.3+. You will also need to have the [`spGtmssPreview` transformation](/docs/api-reference/snowbridge/configuration/transformations/builtin/spGtmssPreview.md) activated (this is the default for Snowplow BDP customers using Snowbridge with GTM Server Side).

:::

## Copy the preview header

Once you enter Preview Mode in Google Tag Manager, click on the three dots in the top right corner of the screen and click “Send requests manually”.

You will see a popup with a preview header, for example (not a real value):

:::note X-Gtm-Server-Preview HTTP header

```
sTjhMcUdkNldaM2RsOThwWTRvNzE3VkZtb1BwK0E9PQo=
```

:::

Copy the header value (in the example above, `sTjhMcUdkNldaM2RsOThwWTRvNzE3VkZtb1BwK0E9PQo=`).

## Add the preview header to your events

You can add the header value to all or some of your events as an [entity](/docs/fundamentals/entities/index.md).

For example, if you are using the [JavaScript tracker](/docs/sources/trackers/web-trackers/index.md):

```javascript
snowplow('trackPageView', {
  context: [{
    schema: 'iglu:com.google.tag-manager.server-side/preview_mode/jsonschema/1-0-0',
    data: {
      // paste your header value here
      'x-gtm-server-preview': 'sTjhMcUdkNldaM2RsOThwWTRvNzE3VkZtb1BwK0E9PQo='
    }
  }]
});
```

You can also add it as a [global context](/docs/sources/trackers/web-trackers/custom-tracking-using-schemas/global-context/index.md) for all events:

```javascript
const gtmPreviewContext = {
  schema: 'iglu:com.google.tag-manager.server-side/preview_mode/jsonschema/1-0-0',
  data: {
    // paste your header value here
    'x-gtm-server-preview': 'sTjhMcUdkNldaM2RsOThwWTRvNzE3VkZtb1BwK0E9PQo='
  }
};
snowplow('addGlobalContexts', [gtmPreviewContext]);
```

For trackers other than the JavaScript tracker, the approach is the same — you need to add the preview header as an entity.

:::tip

Note that the header value can change over time as you make changes to your Google Tag Manager setup.

:::
