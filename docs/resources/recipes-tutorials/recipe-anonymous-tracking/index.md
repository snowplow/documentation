---
title: "Anonymous tracking"
date: "2021-01-04"
sidebar_position: 50
---

## Introduction

By default, Snowplow captures identifiers with all events that can be considered personal identifiable information (PII) — user and session cookie IDs as well as the IP address. However, Snowplow also allows you to track data without these identifiers. This tutorial explains how you can capture Snowplow web events without:

- setting any cookies
- capturing any user or session IDs
- capturing the user's IP address

## What you'll be doing

Snowplow provides two ways for limiting the amount of PII you capture and store:

- Not collecting the PII in the first place (this is covered in this recipe)
- Pseudonymizing the PII during enrichment

You will be updating your JavaScript tracker implementation to stop setting and collecting the following four fields:

- `domain_userid` (client side cookie ID set against the domain the tracking is on)
- `domain_sessionid` (client side session cookie ID)
- `network_userid` (server side cookie ID set against the collector domain)
- `user_ipaddress` (the user’s IP address)

You will then verify that events no longer contain any PII.

#### Toggling on fully anonymous data collection

In your JavaScript tracker implementation, you need to add the following into your tracker initialisation:

```javascript
anonymousTracking: {withServerAnonymisation: true}
```

Therefore, the entire tracker initialization code will look like this:

```javascript
snowplow("newTracker", "sp", "<YOUR_COLLECTOR_ENDPOINT>", {
  appId: "hosted-snowplow",
  platform: "web",
  anonymousTracking: {withServerAnonymisation: true}
  contexts: {
    webPage: true,
    performanceTiming: true
  }
});
```

#### Verifying no PII is sent with events

Run the following query to verify that no PII is sent with subsequent events:

```sql
SELECT COUNT(*) FROM atomic.events
WHERE collector_tstamp > '2021-01-01 00:00:00' -- insert the timestamp from when you toggled anonymous tracking on
  AND domain_userid IS NULL
  AND domain_sessionid IS NULL
  AND network_userid IS NULL
  AND user_ipaddress is NULL;
```

## Let's break down what you've done

- You have updated your tracking to no longer capture any PII with your Snowplow events.
- You have verified that Snowplow no longer captures PII with events.

## What you might want to do next

You have now fully disabled capturing any PII with Snowplow events. However, Snowplow also allows you do anonymous session tracking: a session hash is stored in the browser for the duration of the session but no persistent user identifiers are set or captured. More information on Snowplow's different anonymous tracking capabilities can be found in the relevant JavaScript tracker release posts ([2.15.0](https://snowplow.io/blog/snowplow-javascript-tracker-2-15-0-released/) and [2.17.0](https://snowplow.io/blog/snowplow-javascript-tracker-2-17-0-released/)).

An overall overview of Snowplow's approach to user identification and user privacy can be found in [this blog post](https://snowplow.io/blog/user-identification-and-privacy/).
