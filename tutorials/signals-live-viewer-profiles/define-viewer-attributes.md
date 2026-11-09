---
title: "Define the viewer attributes"
position: 3
sidebar_label: "Define viewer attributes"
description: "Define two Signals stream attribute groups from Snowplow media events, using an AI assistant or the Python SDK. One group holds session-level viewer state, watch time, and skipped ads, and the other holds video-level audience metrics on a custom attribute key."
keywords: ["stream attribute group", "domain_sessionid", "custom attribute key", "media events", "signals python sdk", "snowplow mcp", "viewer state"]
date: "2026-07-31"
---

With media events flowing, you can tell Signals what to compute from them. In this section you'll define two [attribute groups](/docs/signals/attributes/attribute-groups/):

* `viewer_profile`, keyed on the built-in `domain_sessionid` [attribute key](/docs/signals/attributes/attribute-keys/), so that each viewing session gets its own profile
* `video_audience`, keyed on a custom `video_id` attribute key, so that every session watching the same video updates one shared set of counters

You'll also define a [service](/docs/signals/applications/services/) for each group, and publish the whole configuration.

## Map viewer actions to session attributes

The `viewer_profile` group computes three [attributes](/docs/signals/attributes/attributes/):

| Attribute         | Calculated from                          | Aggregation | Property                                  |
| ----------------- | ---------------------------------------- | ----------- | ----------------------------------------- |
| `viewer_state`    | `play_event`, `pause_event`, `end_event` | `last`      | `event_name` atomic property              |
| `seconds_watched` | `ping_event`, `pause_event`, `end_event` | `last`      | `timePlayed` in the media `session` entity |
| `ads_skipped`     | `ad_skip_event`                          | `counter`   | None                                      |

Two details of the [media schemas](/docs/events/ootb-data/media-events/) shape this design:

* Each media action is its own event schema under the `com.snowplowanalytics.snowplow.media` vendor, and the playback state events (`play_event`, `pause_event`, `end_event`) have no properties of their own. The most recent event name is therefore the viewer's state: `viewer_state` takes the `last` value of the `event_name` atomic property across those three event types.
* The media `session` entity, attached to every media event, already accumulates playback statistics. Its `timePlayed` property is the total seconds of content played so far, so `seconds_watched` takes the `last` value of `timePlayed` rather than summing anything. Ping events refresh it every 10 seconds during playback, and pause and end events capture the final value when playback stops.

`timePlayed` counts playback within one media session, which starts when the page calls `startMediaTracking`. Reloading the video page starts a new media session, so `seconds_watched` restarts from zero, while `ads_skipped` keeps counting because it's a counter over the whole `domain_sessionid`. Watching the same video twice without reloading does add up, because that stays within one media session.

`ads_skipped` is a plain counter: it increments every time Signals processes an `ad_skip_event` for the session. All three attributes use the `Lifetime` period, so they cover the whole session rather than a rolling time window.

## Aggregate metrics per video

The session profiles answer "What is this viewer doing?" A dashboard for the whole catalog also needs the opposite view: "How many people are watching this title, across every session?" Signals answers that with a second attribute group keyed on the video rather than the session.

Attribute keys aren't limited to the built-in user, device, and session identifiers. A [custom attribute key](/docs/signals/attributes/attribute-keys/) points at any property in your events, and Signals aggregates against whatever value that property holds. The standard `media_player` entity has no field for the content itself, so the video page sets its `label` to the video's ID, and the `video_id` attribute key reads that.

Because the `video_audience` group aggregates across sessions, `domain_sessionid` becomes something to count rather than something to group by, and the group computes three attributes.

`active_viewers` and `viewers` both use `approx_count_distinct` on the `domain_sessionid` atomic property, which counts how many different sessions produced the events. The difference is the window: `active_viewers` has a five-minute `period`, so it only counts sessions that pinged recently, which is a reasonable stand-in for concurrent viewers when the page pings every 10 seconds. `viewers` has no `period`, so it counts every session that has ever played the video. `total_ads_skipped` is the same counter as the session-level `ads_skipped`, but summed over everyone watching.

`approx_count_distinct` uses [HyperLogLog](https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/) internally, so at high cardinality it's a close approximation rather than an exact count. At the handful of viewers in this accelerator it's exact.

That's the whole design. Both routes below produce the same configuration, so pick one: [describe it to an AI assistant](#define-using-the-ai-assistant), or [write it with the Signals Python SDK](#define-using-the-python-sdk).

## Define using the AI assistant

The design above is a description of what to compute, and an AI assistant with access to your Signals registry can work from the description rather than from code. Two ways to get one:

* Any MCP-capable assistant, such as Claude Code or Cursor, connected to the [Snowplow MCP server](/docs/llms-support/snowplow-mcp/), which exposes the Signals registry as tools alongside the rest of your Snowplow account
* The [Snowplow Assistant](/docs/llms-support/console-agent/), if your organization has it enabled in [Snowplow Console](https://console.snowplowanalytics.com): it covers the same Signals capabilities with nothing to set up

Paste this prompt into the assistant. It asks for the whole configuration: the custom attribute key, both attribute groups, and both services.

```text
Using the Snowplow tools available to you, set up Snowplow Signals for a live
viewer profiles dashboard, computed from the standard Snowplow media events.
Create everything as drafts and don't publish anything yet.

1. An attribute key called video_id that reads the label property of the
   media_player entity (vendor com.snowplowanalytics.snowplow, major
   version 2). The video page puts the video's ID in that label.

2. A stream attribute group called viewer_profile, keyed on the built-in
   domain_sessionid attribute key, with three attributes over the
   com.snowplowanalytics.snowplow.media events at version 1-0-0:
   - viewer_state (string): the last event_name across play_event,
     pause_event, and end_event, so the most recent playback state wins
   - seconds_watched (double): the last value of timePlayed from the media
     session entity (com.snowplowanalytics.snowplow.media session, major
     version 1), across ping_event, pause_event, and end_event. timePlayed
     is already a running total, so read its most recent value, don't sum it
   - ads_skipped (int32): a counter of ad_skip_event, default 0
   All three cover the whole session, so none of them has a period.

3. A stream attribute group called video_audience, keyed on video_id, with:
   - active_viewers (int32): approximate distinct count of domain_sessionid
     over ping_event, within a five-minute period, default 0
   - viewers (int32): approximate distinct count of domain_sessionid over
     play_event and ping_event, with no period, default 0
   - total_ads_skipped (int32): a counter of ad_skip_event, default 0

4. One service per group: viewer_profile_service for viewer_profile, and
   video_audience_service for video_audience. A service can only reference
   groups that share an attribute key, so these two can't be combined.
```

:::note[Review before you publish]
Signals saves new definitions as drafts. Nothing reaches the streaming engine, and nothing is calculated, until you publish, which is your safety net for a configuration you didn't write yourself. Ask the assistant to show you the full definition of each group, or open **Signals** > **Attribute groups** in Console, and check the aggregations, properties, and periods against this page before you tell it to publish.
:::

Once the definitions match this page, tell the assistant to publish them. You can also publish the drafts yourself from **Signals** > **Attribute groups** in Snowplow Console.

## Define using the Python SDK

This route builds the same configuration as a script, with the [Signals Python SDK](/docs/signals/connection/).

### Connect to Signals

Install the Signals Python SDK into your Python environment:

```bash
pip install snowplow-signals
```

You'll need four connection values, all reachable from the **Signals** > **Overview** page in Snowplow Console: the Signals API URL and your organization ID are displayed there, and you can generate the API key and key ID in Console under [account management](/docs/account-management/). Export them as environment variables, using your own values:

```bash
export SIGNALS_API_URL=https://YOUR_ID.signals.snowplowanalytics.com
export SIGNALS_API_KEY=your-api-key
export SIGNALS_API_KEY_ID=your-api-key-id
export SNOWPLOW_ORG_ID=your-organization-id
```

Create a script called `define_attributes.py`, starting with the imports and the connection:

```python
import os
from datetime import timedelta

from snowplow_signals import (
    Attribute,
    AtomicProperty,
    AttributeKey,
    EntityProperty,
    Event,
    Service,
    Signals,
    StreamAttributeGroup,
    domain_sessionid,
)

sp_signals = Signals(
    api_url=os.environ["SIGNALS_API_URL"],
    api_key=os.environ["SIGNALS_API_KEY"],
    api_key_id=os.environ["SIGNALS_API_KEY_ID"],
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)

OWNER = "you@example.com"  # replace with your email address
```

### Define the session attributes

Each `Event` object references a media schema by vendor, name, and version, exactly as the schema URIs appear in the Inspector. Defining them once keeps the attributes readable, because several attributes read the same events:

```python
MEDIA_VENDOR = "com.snowplowanalytics.snowplow.media"

play = Event(vendor=MEDIA_VENDOR, name="play_event", version="1-0-0")
pause = Event(vendor=MEDIA_VENDOR, name="pause_event", version="1-0-0")
end = Event(vendor=MEDIA_VENDOR, name="end_event", version="1-0-0")
ping = Event(vendor=MEDIA_VENDOR, name="ping_event", version="1-0-0")
ad_skip = Event(vendor=MEDIA_VENDOR, name="ad_skip_event", version="1-0-0")
```

Group the three session attributes into a `StreamAttributeGroup`, keyed on the built-in `domain_sessionid` attribute key. None of the attributes set a `period`, so they all default to `Lifetime`:

```python
viewer_profile = StreamAttributeGroup(
    name="viewer_profile",
    version=1,
    attribute_key=domain_sessionid,
    owner=OWNER,
    description="Live playback state for each viewing session",
    attributes=[
        Attribute(
            name="viewer_state",
            description="The most recent playback state event in this session",
            type="string",
            events=[play, pause, end],
            aggregation="last",
            property=AtomicProperty(name="event_name"),
        ),
        Attribute(
            name="seconds_watched",
            description="Total seconds of content played in this media session",
            type="double",
            events=[ping, pause, end],
            aggregation="last",
            property=EntityProperty(
                vendor=MEDIA_VENDOR,
                name="session",
                major_version=1,
                path="timePlayed",
            ),
        ),
        Attribute(
            name="ads_skipped",
            description="Number of ads skipped in this session",
            type="int32",
            events=[ad_skip],
            aggregation="counter",
            default_value=0,
        ),
    ],
)
```

### Define the video attributes

The custom `video_id` attribute key comes first, because the attribute group references it:

```python
video_id = AttributeKey(
    name="video_id",
    description="The video being watched, read from the media player label",
    property=EntityProperty(
        vendor="com.snowplowanalytics.snowplow",
        name="media_player",
        major_version=2,
        path="label",
    ),
)
```

Then the group keyed on it:

```python
video_audience = StreamAttributeGroup(
    name="video_audience",
    version=1,
    attribute_key=video_id,
    owner=OWNER,
    description="Audience metrics for each video, across all sessions",
    attributes=[
        Attribute(
            name="active_viewers",
            description="Sessions that sent a playback ping in the last five minutes",
            type="int32",
            events=[ping],
            aggregation="approx_count_distinct",
            property=AtomicProperty(name="domain_sessionid"),
            period=timedelta(minutes=5),
            default_value=0,
        ),
        Attribute(
            name="viewers",
            description="Distinct sessions that have played this video",
            type="int32",
            events=[play, ping],
            aggregation="approx_count_distinct",
            property=AtomicProperty(name="domain_sessionid"),
            default_value=0,
        ),
        Attribute(
            name="total_ads_skipped",
            description="Ads skipped on this video across all sessions",
            type="int32",
            events=[ad_skip],
            aggregation="counter",
            default_value=0,
        ),
    ],
)
```

### Publish the definitions

Retrieving attributes through a service is the recommended pattern for applications, because the service name stays stable while you iterate on attribute group versions. Pass the group objects straight to `Service`, and the SDK records the group name and version for you:

```python
viewer_profile_service = Service(
    name="viewer_profile_service",
    owner=OWNER,
    description="Session-level viewer profiles for the dashboard",
    attribute_groups=[viewer_profile],
)

video_audience_service = Service(
    name="video_audience_service",
    owner=OWNER,
    description="Video-level audience metrics for the dashboard",
    attribute_groups=[video_audience],
)
```

A service bundles attribute groups that share an attribute key, so each of these two groups needs its own service, and the dashboard back-end makes one call per service.

Nothing exists in Signals until you publish. Include the custom attribute key in the same list, and put it before the group that uses it: an attribute group can only be published once its key exists.

```python
sp_signals.publish(
    [
        video_id,
        viewer_profile,
        video_audience,
        viewer_profile_service,
        video_audience_service,
    ]
)
print("Published 1 attribute key, 2 attribute groups, and 2 services")
```

Run the script:

```bash
python define_attributes.py
```

Publishing isn't instant: give the definitions a moment to reach the streaming engine. Signals only computes attributes from events processed after that point, so events you tracked before publishing don't contribute.

Open **Signals** > **Attribute groups** in Snowplow Console and select `viewer_profile` to review what you published:

![The published viewer_profile attribute group in Console showing the ads_skipped, seconds_watched, and viewer_state attributes with their events, properties, and Lifetime periods](images/console-attribute-group-published.png)

Your new `video_id` key appears under **Attribute keys**, alongside the four built-in keys, and both services appear under **Services**.

A published attribute group version is immutable, so running the script again as it stands won't change anything. To change a definition, increment `version` and publish again.
