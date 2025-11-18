---
title: "Adding Context & Data to Events in the Flutter Tracker"
date: "2022-01-31"
sidebar_position: 4000
---

There are multiple ways to add extra data to your tracked events, adding richness and value to your dataset:

1. Event context using self-describing data: Attach event context, describing anything you like, in the form of self-describing JSONs.
2. Subject: Include information about the user, or the platform on which the event occurred.

## Event context

Event context is an incredibly powerful aspect of Snowplow tracking, which allows you to create very rich data. It is based on the same self-describing JSON schemas as the self-describing events. Using event context, you can add any details you like to your events, as long as you can describe them in a self-describing JSON schema.

Each schema will describe a single "entity". All of an event’s entities together form the event context. The event context will be sent as one field of the event, finally ending up in one column (`context`) in your data storage. There is no limit to how many entities can be attached to one event.

Note that context can be added to any event type, not just self-describing events. This means that even a simple event type like a page view can hold complex and extensive information – reducing the chances of data loss and the amount of modeling (JOINs etc.) needed in modeling, while increasing the value of each event, and the sophistication of the possible use cases.

The entities you provide are validated against their schemas as the event is processed (during the enrich phase). If there is a mistake or mismatch, the event is processed as a Bad Event.

Once defined, an entity can be attached to any kind of event. This is also an important point; it means your tracking is as DRY as possible. Using the same "user" or "image" or "search result" (etc.) entities throughout your tracking reduces error, and again makes the data easier to model.

Example:

```cpp
tracker.track(
    Structured(category: 'shop', action: 'add-to-basket'),
    contexts: [
        const SelfDescribing(
            schema: 'iglu:com.my_company/movie_poster/jsonschema/1-0-0',
            data: {
                'movie_name': 'Solaris',
                'poster_country': 'JP',
                'poster_date': '1978-01-01'
            }
        ),
        const SelfDescribing(
            schema: 'iglu:com.my_company/customer/jsonschema/1-0-0',
            data: {
                'p_buy': 0.23,
                'segment': 'young_adult'
            }
        )
    ]
);
```

## Adding user and platform data with Subject

Subject information describes the user and device associated with the event, such as their user ID, what type of device they used, or what size screen that device had.

This information can be entered during tracker initialization by passing a `SubjectConfiguration` instance to the `Snowplow.createTracker` method. All of the information is optional.

Some subject information is filled automatically by the tracker. This includes the platform of the user, timezone, language, resolution, and viewport.

Please refer to the section on subject configuration on the [Configuration page](/docs/sources/trackers/flutter-tracker/initialization-and-configuration/index.md) to learn more.
