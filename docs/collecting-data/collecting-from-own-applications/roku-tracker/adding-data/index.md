---
title: "Adding data to your events: context and more"
date: "2021-11-16"
sidebar_position: 3000
---

There are multiple ways to add extra data to your tracked events, adding richness and value to your dataset. Each of them involves a different class from the Roku tracker.

1. Event context using self-describing data: Attach event context, describing anything you like, in the form of self-describing JSONs.
2. Subject: Include information about the user, or the platform on which the event occurred.
3. Timestamp: Override the default event timestamp with your own timestamp.

You can attach any of these as additional arguments to the track event methods.

## Event context

Event context is an incredibly powerful aspect of Snowplow tracking, which allows you to create very rich data. It is based on the same self-describing JSON schemas as the self-describing events. Using event context, you can add any details you like to your events, as long as you can describe them in a self-describing JSON schema.

Each schema will describe a single "entity". All of an event’s entities together form the event context. The event context will be sent as one field of the event, finally ending up in one column (`context`) in your data storage. There is no limit to how many entities can be attached to one event.

Note that context can be added to any event type, not just self-describing events. This means that even a simple event type like a page view can hold complex and extensive information – reducing the chances of data loss and the amount of modeling (JOINs etc.) needed in modeling, while increasing the value of each event, and the sophistication of the possible use cases.

The entities you provide are validated against their schemas as the event is processed (during the enrich phase). If there is a mistake or mismatch, the event is processed as a Bad Event.

Once defined, an entity can be attached to any kind of event. This is also an important point; it means your tracking is as DRY as possible. Using the same "user" or "image" or "search result" (etc.) entities throughout your tracking reduces error, and again makes the data easier to model.

Example:

```brightscript
m.global.snowplow.screenView = {
    id: "screen23",
    context: [
        {
            schema: "iglu:com.my_company/movie_poster/jsonschema/1-0-0",
            data: {
                movie_name: "Solaris",
                poster_country: "JP",
                poster_date: "1978-01-01"
            }
        },
        {
            schema: "iglu:com.my_company/customer/jsonschema/1-0-0",
            data: {
                p_buy: 0.23,
                segment: "young_adult"
            }
        }
    ]
}
```

## Adding user and platform data with Subject

Subject information describes the user and device associated with the event, such as their user ID, what type of device they used, or what size screen that device had.

This information can be entered during tracker initialization by passing a `subject` associative array to the `init` method. All of the information is optional.

Some subject information is filled automatically by the tracker. This includes the platform of the user, timezone, language, resolution, and viewport.

The following table lists all the properties that can be set in tracker initialization. These are all part of the [Snowplow Tracker Protocol](/docs/collecting-data/collecting-from-own-applications/snowplow-tracker-protocol/index.md).

| Property | Description |
| --- | --- |
| `domainUserId` | Cookie-based unique identifier for user |
| `networkUserId` | Cookie-based unique identifier for user |
| `appId` | Unique identifier for application |

Example:

```brightscript
m.global.snowplow.init = {
    subject: {
        domainUserId: "...",
        networkUserId: "...",
        appId: "..."
    }
}
```

## Event timestamps

Processed Snowplow events have five different timestamps.

| Timestamp name | Description |
| --- | --- |
| `dtm` | Device timestamp. Added automatically during event creation. |
| `ttm` | True timestamp. This can be manually set as an alternative to `dtm`. |
| `stm` | Sent timestamp. Added automatically on event sending. |
| `collector_tstamp` | Added by the event collector. |
| `etl_tstamp` | Added after event enrichment during the processing pipeline. |
| `derived_tstamp` | Either a calculated value (`collector_tstamp` - (`stm` - `dtm`)) or the same as `ttm` |

Overriding the default event timestamp (`dtm`) with `ttm` can be useful in some situations. For example, if the Snowplow event refers to an action that happened previously but is only now being tracked. The type of the timestamp is a string with number of milliseconds since the Unix epoch.

Example:

```brightscript
m.global.snowplow.structured = {
    se_ca: "category",
    se_ac: "action",
    se_va: 10,
    ttm: CreateObject("roDateTime").AsSeconds().ToStr() + "000"
}
```

This [Discourse forums](https://discourse.snowplow.io/t/which-timestamp-is-the-best-to-see-when-an-event-occurred/538) post explains why you may wish to use `derived_tstamp` as the main event timestamp rather than `dvce_created_tstamp` (`dtm`).
