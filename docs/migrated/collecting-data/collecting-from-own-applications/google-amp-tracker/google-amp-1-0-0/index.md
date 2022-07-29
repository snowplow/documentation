---
title: "Google AMP (0.1.0)"
date: "2020-03-13"
sidebar_position: 1000
---

Deprecated

Please refer to the [latest version of this tracker.](/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/)

## Overview

Snowplow is collaborating with Google on their [Accelerated Mobile Pages Project](https://www.ampproject.org/) (AMPP or AMP for short). AMP is an open source (Apache License 2.0) initiative to improve the mobile web experience by optimizing web pages for mobile devices.

To learn more about analytics for AMP pages see the [amp-analytics](https://www.ampproject.org/docs/reference/extended/amp-analytics.html) reference. For general information about AMP see [What Is AMP?](https://www.ampproject.org/docs/get_started/about-amp.html) on the [Accelerated Mobile Pages (AMP) Project](https://www.ampproject.org/) site.

Snowplow is natively integrated into the project, so pages optimized with AMP HTML can be tracked in Snowplow by adding the appropriate `amp-analytics` tag to your pages:

```markup
<amp-analytics type="snowplow" id="snowplow1">
    <script type="application/json">
      {     ...   }   
    </script>   
  </amp-analytics>
</body>
```

## Standard variables

Certain parameters must be provided in the `"vars"` section of the tag:

```json
"vars": {   ... },
```

### `collectorHost`

Specify the host to your collector like so:

```json
"vars": {
  "collectorHost": "snowplow-collector.acme.com",
  ...
```

**Notes:**

- Do _not_ include the protocol aka schema (`http(s)://`)
- Do _not_ include a trailing slash
- Use of HTTPS is mandatory in AMP, so your Snowplow collector **must** support HTTPS

### `appId`

You must set the application ID for the website you are tracking via AMP:

```json
"vars": {
  "appId": "campaign-microsite",
  ...
```

**Notes:**

- You do not have to use the `appId` to distinguish AMP traffic from other web traffic (unless you want to) - see the [Analytics](https://github.com/snowplow/snowplow/wiki/Google-AMP-Tracker#analytics) section for an alternative approach

## Tracking events

The following trigger request values are supported for the Snowplow Analytics configuration:

- `pageView` for page view tracking
- `structEvent` for structured event tracking

All event tracking is disabled by default; you can enable it on an event-by-event basis as follows:

### Page view

Enable the page view tracking like so:

```markup
<amp-analytics type="snowplow" id="snowplow2">
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

```markup
<amp-analytics type="snowplow" id="snowplow3">
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

| Argument | Description | Required? | Validation |
| --- | --- | --- | --- |
| `structEventCategory` | The grouping of structured events which this `action` belongs to | Yes | String |
| `structEventAction` | Defines the type of user interaction which this event involves | Yes | String |
| `structEventLabel` | A string to provide additional dimensions to the event data | No | String |
| `structEventProperty` | A string describing the object or the action performed on it | No | String |
| `structEventValue` | A value to provide numerical data about the event | No | Int or Float |

### Analytics

All events sent via this tracker will have:

- `v_tracker` set to `amp-0.1`
- `platform` set to `web`

If you want to analyze events sent via this tracker, you may prefer to query for `v_tracker LIKE 'amp-%'` to future-proof your query against future releases of this tracker (which may change the version number).
