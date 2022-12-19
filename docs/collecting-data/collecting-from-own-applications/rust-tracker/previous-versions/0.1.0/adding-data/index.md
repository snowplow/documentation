---
title: "Adding data to your events: context and more"
date: "2022-10-24"
sidebar_position: 4000
---

There are multiple ways to add extra data to your tracked events, adding richness and value to your dataset:

1. Event context using self-describing data: Attach event context, describing anything you like, in the form of self-describing JSONs.
2. Subject: Include information about the user, or the platform on which the event occurred.

## Event context

Event context is an incredibly powerful aspect of Snowplow tracking, which allows you to create very rich data. It is based on the same self-describing JSON schemas as the self-describing events. Using event context, you can add any details you like to your events, as long as you can describe them in a self-describing JSON schema.

Each schema will describe a single "entity". All of an event’s entities together form the event context. The event context will be sent as one field of the event, finally ending up in one column (`context`) in your data storage. There is no limit to how many entities can be attached to one event.

Note that context can be added to any event type, not just self-describing events. This means that even a simple event type like a page view can hold complex and extensive information – reducing the chances of data loss and the amount of modelling (JOINs etc.) needed in modelling, while increasing the value of each event, and the sophistication of the possible use cases.

The entities you provide are validated against their schemas as the event is processed (during the enrich phase). If there is a mistake or mismatch, the event is processed as a Bad Event.

Once defined, an entity can be attached to any kind of event. This is also an important point; it means your tracking is as DRY as possible. Using the same "user" or "image" or "search result" (etc.) entities throughout your tracking reduces error, and again makes the data easier to model.

Example:

```rust
// Tracking a Self-Describing event with context entity
let self_describing_event = SelfDescribingEvent::builder()
    .schema("iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0")
    .data(json!({"name": "test", "id": "something else"}))
    .build()?;

let event_context = Some(vec![SelfDescribingJson::new(
    "iglu:org.schema/WebPage/jsonschema/1-0-0",
    json!({"keywords": ["tester"]}),
)]);

let self_desc_event_id = tracker.track(self_describing_event, event_context).await?;
```

## Adding user and platform data with Subject

Subject information describes the user and device associated with the event. This information can be entered during tracker initialization by passing a `Subject` instance to the `Snowplow::create_tracker` method. All of the information is optional.

Some subject information is filled automatically by the tracker, such as the platform of the user, timezone, and language.

Please refer to the section on subject configuration on the [Configuration page](/docs/collecting-data/collecting-from-own-applications/rust-tracker/initialization-and-configuration/index.md) to learn more.
