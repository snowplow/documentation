---
title: "Google AMP (1.1.0)"
sidebar_position: 990
---

## Overview

Snowplow is collaborating with Google on their [Accelerated Mobile Pages Project](https://www.ampproject.org/) (AMPP or AMP for short). AMP is an open source (Apache License 2.0) initiative to improve the mobile web experience by optimizing web pages for mobile devices.

To learn more about analytics for AMP pages see the [amp-analytics](https://www.ampproject.org/docs/reference/extended/amp-analytics.html) reference. For general information about AMP see [What Is AMP?](https://www.ampproject.org/docs/get_started/about-amp.html) on the [Accelerated Mobile Pages (AMP) Project](https://www.ampproject.org/) site.

Snowplow is natively integrated into the project, so pages optimized with AMP HTML can be tracked in Snowplow by adding the appropriate `amp-analytics` tag to your pages:

```html

<body>
  ...
  <amp-analytics type="snowplow_v2" id="snowplow_v2">
  <script type="application/json">
  {
    "vars": {
     "collectorHost": "collector.snplow.net",
     "appId": "amp-examples-v2.0.2",
     ...
    },
    "linkers": {
     "enabled": true,
     ...
    },
    "triggers": {
     "defaultPageview": {
       "on": "visible",
       "request": "pageView"
     }
    }
  }
  </script>
  </amp-analytics>
</body>
```
:::note
The tracker utilises AMP linker functionality to ensure that user identification can be done where a user may visit via the google domain or the site's own domain. In order to function, this requires that linkers are enabled in the amp-analytics configuration. Not doing so can result in changing AMP client Ids (which are the primary user identifier).
:::

## Standard variables

`collectorHost` and `appId` must be provided in the `"vars"` section of the tag:

```javascript
"vars": {
  ...
},
```

The rest are optional

### `collectorHost`

Specify the host to your collector like so:

```javascript
"vars": {
  "collectorHost": "snowplow-collector.acme.com",
  ...
```

Notes:

- Do _not_ include the protocol aka schema (`http(s)://`)
- Do _not_ include a trailing slash
- Use of HTTPS is mandatory in AMP, so your Snowplow collector **must** support HTTPS

### `appId`

You must set the application ID for the website you are tracking via AMP:

```javascript
"vars": {
  "appId": "campaign-microsite",
  ...
```

Notes:

- You do not have to use the `appId` to distinguish AMP traffic from other web traffic (unless you want to) - see the  [Analytics](#analytics) section for an alternative approach.

### `userId`

Specify the optional `"userId"` var to set the uid/user_id  [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md#user-related-parameters) field.

```javascript
"vars": {
  "userId": "someUserId",
  ...
```

### `nameTracker`

Specify the optional "nameTracker" var to set the tna/name_tracker [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md#application-parameters) field.

```javascript
"vars": {
  "nameTracker": "someTrackerName",
  ...
```

### `customContexts`

Custom contexts may be added by including Self-Describing JSON as a `"customContexts"` var, with `"` characters escaped:

```javascript
"vars": {
  "customContexts":  "{\"schema\":\"iglu:com.acme/first_context/jsonschema/1-0-0\",\"data\":{\"someKey\":\"someValue\"}}"
  ...
```

Multiple custom contexts may be added by separating each self-describing JSON with a comma:

```javascript
"vars": {
  "customContexts":  "{\"schema\":\"iglu:com.acme/first_context/jsonschema/1-0-0\",\"data\":{\"someKey\":\"someValue\"}},{\"schema\":\"iglu:com.acme/second_context/jsonschema/1-0-0\",\"data\":{\"someOtherKey\":\"someOtherValue\"}}"
  ...
```

Custom contexts may either be set globally for all events (as a top-level var, see above) or per-event trigger:

```javascript
...
"triggers": {
...
  "defaultPageview": {
    "on": "click",
    "selector": "visible",
    "request": "pageView",
    "vars": {
      "customContexts":  "{\"schema\":\"iglu:com.acme/first_context/jsonschema/1-0-0\",\"data\":{\"someKey\":\"someValue\"}}"
    }
  }
}
...
```

These approaches may not currently be mixed, however.

## Tracking events

The following trigger request values are supported for the Snowplow Analytics configuration:

- `pageView` for page view tracking
- `structEvent` for structured event tracking
- `ampPagePing` for page ping tracking
- `selfDescribingEvent` for custom event tracking

All event tracking is disabled by default; you can enable it on an event-by-event basis as follows:

### Page view

Enable the page view tracking like so:

```javascript
<amp-analytics type="snowplow_v2" id="event1">
<script type="application/json">
{
  "vars": {
    "collectorHost": "snowplow-collector.acme.com",  // Replace with your collector host
    "appId": "campaign-microsite"                    // Replace with your app ID
  },
  "triggers": {
    "trackPageview": {  // Trigger names can be any string. trackPageview is not a required name
      "on": "visible",
      "request": "pageView"
    }
  }
}
</script>
</amp-analytics>
```

### Structured events

Structured events are user interactions with content that can be tracked independently from a web page or a screen load. "Structured" refers to the Google Analytics-style structure of having up to five fields (with only the first two required).

Events can be sent by setting the AMP trigger request value to event and setting the required event category and action fields.

The following example uses the selector attribute of the trigger to send an event when a particular element is clicked:

```javascript
<amp-analytics type="snowplow_v2" id="event2">
<script type="application/json">
{
  "vars": {
    "collectorHost": "snowplow-collector.acme.com",  // Replace with your collector host
    "appId": "campaign-microsite"                    // Replace with your app ID
  },
  "triggers": {
    "trackClickOnHeader" : {
      "on": "click",
      "selector": "#header",
      "request": "structEvent",
      "vars": {
        "structEventCategory": "ui-components",
        "structEventAction": "header-click"
      }
    }
  }
}
</script>
</amp-analytics>
```

You can set key-value pairs for the following event fields in the vars attribute of the trigger:

| **Argument**          | **Description**                                                  | **Required?** | **Validation** |
|-----------------------|------------------------------------------------------------------|---------------|----------------|
| `structEventCategory` | The grouping of structured events which this `action` belongs to | Yes           | String         |
| `structEventAction`   | Defines the type of user interaction which this event involves   | Yes           | String         |
| `structEventLabel`    | A string to provide additional dimensions to the event data      | No            | String         |
| `structEventProperty` | A string describing the object or the action performed on it     | No            | String         |
| `structEventValue`    | A value to provide numerical data about the event                | No            | Int or Float   |

### Page pings

Enable page ping tracking like so:

```javascript
<amp-analytics type="snowplow_v2" id="event3">
<script type="application/json">
{
  "vars": {
    "collectorHost": "snowplow-collector.acme.com",  // Replace with your collector host
    "appId": "campaign-microsite"                    // Replace with your app ID
  },
  "triggers": {
    "trackPagePings": {
      "on": "timer",
      "request": "ampPagePing",
      "timerSpec": {
        "interval": 30,      // Set to desired ping interval
        "maxTimerLength": 1800,
        "immediate": false,
        "startSpec": {
          "on": "visible",
          "selector": ":root"
        },
        "stopSpec": {
          "on": "hidden",
          "selector": ":root"
        }
      }
    }
  }
}
</script>
</amp-analytics>
```

AMP page ping events will be sent as AMP-specific page ping events (rather than Javascript tracker page pings), against the [AMP page ping schema](https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_page_ping/jsonschema/1-0-0), since the data available on AMP is defined differently to Javascript tracker page pings.  
  
All events are sent with an  [AMP web page](https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_web_page/jsonschema/1-0-0) context, for aggregation of pings by page view id.

### Custom events

Custom events may be sent via the AMP tracker by passing the schema vendor, and version, and an escaped JSON of the desired data, as follows:

```javascript
<amp-analytics type="snowplow_v2" id="event3">
<script type="application/json">
{
  "vars": {
    "collectorHost": "snowplow-collector.acme.com",  // Replace with your collector host
    "appId": "campaign-microsite"                    // Replace with your app ID
  },
  "triggers": {
    "trackSelfDescribingEvent": {
      "on": "click",
      "selector": "a",
      "request": "selfDescribingEvent",
      "vars": {
        "customEventSchemaVendor": "com.snowplowanalytics.snowplow",
        "customEventSchemaName": "link_click",
        "customEventSchemaVersion": "1-0-1",
        "customEventSchemaData": "{\"targetUrl\":\"${targetUrl}\",\"elementId\":\"TEST\",\"elementContent\":\"${elementContent}\"}"
      }
    }
  }
}
</script>
</amp-analytics>
```

## Analytics

v2 of the tracker brings with it significant improvements in our ability to model and gain insights.

### Standard fields

All events sent via this tracker will have:

- `v_tracker` set to `amp-1.1.0`
- `platform` set to `web`

If you want to analyze events sent via this tracker, you may prefer to query for `v_tracker LIKE 'amp-%'` to future-proof your query against future releases of this tracker (which may change the version number).

### Page view and ping aggregation

By default, the  [AMP web page context](https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_web_page/jsonschema/1-0-0) is attached to every event. This will contain the AMP-defined [PAGE_VIEW_ID_64](https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md#page-view-id-64), which defined as "intended to be random with a high entropy and likely to be unique per URL, user and day".

Users can aggregate page views, page pings and other events on-page by this ID to aggregate engaged time, and model events to a page view level, by combining it with the url, amp client ID, and date.

Note that page pings and the page view ID itself are not defined by Snowplow's logic, but by what's made available by AMP - therefore applying the same logic to this data as that produced by the Javascript tracker is liable to produce different results.

### Session information

:::note
Available from version 1.1.0.
:::

By default the [AMP Session](https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_session/jsonschema/) context is attached to every event. This context allows for tracking information related to session analytics capabilities, as implemented in the [AMP framework](https://github.com/ampproject/issues/3399). The attributes included are the following:
- `ampSessionId`: An identifier for the AMP session.
- `ampSessionIndex`: The index of the current session for this user.
- `sessionEngaged`: If there has been any kind of user engagement in the AMP session. Engagement in this context means if the page is visible, has focus and is in the foreground.
- `sessionCreationTimestamp`: Timestamp at which the session was created in milliseconds elapsed since the UNIX epoch.
- `lastSessionEventTimestamp`: Timestamp at which the last event took place in the session in milliseconds elapsed since the UNIX epoch.


### User Identification

By default, the  [AMP ID](https://github.com/snowplow/iglu-central/blob/master/schemas/dev.amp.snowplow/amp_id/jsonschema/1-0-0) context is attached to every event. This contains the [AMP Client ID](https://github.com/ampproject/amphtml/blob/master/spec/amp-var-substitutions.md#client-id), the `user_id` (if set via the `userId` var), and the domain_userid (if passed to an AMP page via cross-domain linking - more detail below).

This provides a map between the main relevant identifiers, which can be used to model user journeys across platforms. Users can choose to instrument further user identification methods using custom contexts.

In order for the AMP Client ID to behave as expected, the 'linker' parameter of the configuration JSON must have `'enabled': true` set. Failing to do so can result in changing AMP client IDs, even where a user remains on AMP pages for the whole journey. (This can happen because AMP pages can be served from Google's AMP cache).

The tracker is designed to handle user journeys as follows:

#### JS-tracker page to AMP page

Where a user moves from a standard web page, tracked by the Javascript tracker, to an AMP page, the domain userid from the Javascript tracker can be passed to the AMP tracker by enabling the  [Javascript tracker's crossDomainLinker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/tracker-setup/initialization-options/#cross-domain-tracking). The AMP tracker will parse the value from the querystring, and attach it to all events, along with the AMP client ID, via the AMP ID context.

The AMP tracker uses a combination of cookies and the AMP linker to attempt to retain the value, however due to the nature of AMP pages, there is no guarantee that the value will be retained across sessions. To ensure best possible retention of the value within the session, make sure the tracker config has linker pages enabled for your AMP domains:

```javascript
...
"linkers": {
  "enabled": true,
  "proxyOnly": false,
  "destinationDomains": ["ampdomain"]
},
...
```

Data models should be designed for an 'at least once' identification structure - in other words, configuring the cross-domain linker correcttly will ensure at least one event contains both AMP ID and domain User ID. Models should aim to map this across all events. Of course, this method of identification depends on the user traveling directly from a JS-tracked page to an AMP page at least once.

#### AMP page to JS-tracker page

Where a user moves frrom an AMP page to a standard web page which is tracked by the Javascript tracker, the AMP tracker will use AMP's linker functionality to append the AMP CLient ID to the querystring, as long as linkers are enabled for the destination domain:

```javascript
...
"linkers": {
  "enabled": true,
  "proxyOnly": false,
  "destinationDomains": ["destDomain"]
},
...
```

This will add a querystring parameter 'linker=' to the destination url, which contains the amp_id value, base-64 encoded. This will look something like this: `?sp_amp_linker=1*1c1wx43*amp_id*amp-a1b23cDEfGhIjkl4mnoPqr`.

The structure of this param is explained in the [AMP documentation](https://github.com/ampproject/amphtml/blob/master/extensions/amp-analytics/linker-id-receiving.md) - models can extract the base64-encoded AMP Client ID, decode it, and map it to the domain userid (or any other user value) from the Javascript tracker.

## Reporting Issues and Contributing

A fork of the AMP project can be found in the [Snowplow Incubator Github](https://github.com/snowplow-incubator/amphtml) Repo. Please submit issues, bugreports and PRs to this repo.
