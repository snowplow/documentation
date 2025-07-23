---
title: "Tracking events"
date: "2021-11-16"
sidebar_position: 2000
---

Snowplow has been built to enable you to track a wide range of events that occur when users interact with your apps.

We provide several built-in methods to help you track different kinds of events. The methods range from single purpose methods, such as `screenView`, to the more complex but flexible `selfDescribing`, which can be used to track any kind of user behavior. We strongly recommend using `selfDescribing` for your tracking, as it allows you to design custom event types to match your business requirements. [This post](https://snowplowanalytics.com/blog/2020/01/24/re-thinking-the-structure-of-event-data/) on our blog, "Re-thinking the structure of event data" might be informative here.

Tracking methods supported by the Roku Tracker:

| Method | Event type tracked |
| --- | --- |
| `selfDescribing` | Custom event based on "self-describing" JSON schema |
| `structured` | Semi-custom structured event |
| `screenView` | View of screen |

All the methods share common features and parameters. Every type of event can have an optional context added. A Timestamp can also be provided for all event types to override the default event timestamp. See the next page to learn about adding extra data to events. It's important to understand how event context works, as it is one of the most powerful Snowplow features. Adding event context is a way to add depth, richness and value to all of your events.

Snowplow events are all processed into the same format, regardless of the event type (and regardless of the tracker language used). Read about the different properties and fields of events in the [Snowplow Tracker Protocol](/docs/events/index.md).

We will first discuss the custom event tracking methods, followed by the out-of-the-box event types. Note that you can also design and create your own page view, or screen view, using `selfDescribing`, to fit your business needs better. The out-of-the-box event types are provided so you can get started with generating event data quickly.

## Track self-describing events with `selfDescribing`

Use `selfDescribing` to track a custom event. This is the most advanced and powerful tracking method, which requires a certain amount of planning and infrastructure.

Self-describing events are based around "self-describing" (self-referential) JSONs, which are a specific kind of [JSON schema](http://json-schema.org/). A unique schema can be designed for each type of event that you want to track. This allows you to track the specific things that are important to you, in a way that is defined by you.

This is particularly useful when:

- You want to track event types which are proprietary/specific to your business
- You want to track events which have unpredictable or frequently changing properties

A self-describing JSON has two keys, `schema` and `data`. The `schema` value should point to a valid self-describing JSON schema. They are called self-describing because the schema will specify the fields allowed in the data value. Read more about how schemas are used with Snowplow [here](/docs/fundamentals/schemas/index.md).

After events have been collected by the event collector, they are validated to ensure that the properties match the self-describing JSONs. Mistakes (e.g. extra fields, or incorrect types) will result in events being processed as Bad Events. This means that only high-quality, valid events arrive in your data storage or real-time stream.

```mdx-code-block
import SchemaAccess from "@site/docs/reusable/schema-access/_index.md"

<SchemaAccess/>
```

The `selfDescribing` method takes a `roAssociativeArray`. This array takes a schema name and a flat hash of event data.

Example (assumes that you mounted the Snowplow instance in `m.global.snowplow`):

```brightscript
m.global.snowplow.selfDescribing = {
    data: {
        saveId: "4321",
        level: 23,
        difficultyLevel: "HARD",
        dlContent: true
    },
    schema: "iglu:com.example_company/save_game/jsonschema/1-0-2"
}
```

## Track structured events with `structured`

This method provides a halfway-house between tracking fully user-defined self-describing events and out-of-the box predefined events. This event type can be used to track many types of user activity, as it is somewhat customizable. "Struct" events closely mirror the structure of Google Analytics events, with "category" (`se_ca`), "action" (`se_ac`), "label" (`se_la`), and "value" (`se_va`) properties.

As these fields are fairly arbitrary, we recommend following the advice in this table how to define structured events. It's important to be consistent throughout the business about how each field is used.

| Argument | Description | Required in event? |
| --- | --- | --- |
| `se_ca` | The grouping of structured events which this action belongs to | Yes |
| `se_ac` | Defines the type of user interaction which this event involves | Yes |
| `se_la` | Often used to refer to the 'object' the action is performed on | No |
| `se_pr` | Describing the 'object', or the action performed on it | No |
| `se_va` | Provides numerical data about the event | No |

Example:

```brightscript
m.global.snowplow.structured = {
    se_ca: "shop",
    se_ac: "add-to-basket",
    se_pr: "pcs",
    se_va: 2
}
```

## Track screen views with `screenView`

Use `screenView` to track a user viewing a screen (or similar) within your app. This is the page view equivalent for apps that are not webpages. The arguments are `name`, `id`, `type`, and `transitionType`; while all are optional, you must provided at least one of either `name` or `id` to create a valid event. "Name" is the human-readable screen name, and "ID" should be the unique screen ID.

This method creates an unstruct event, by creating and tracking a self-describing event. The schema ID for this is "iglu:com.snowplowanalytics.snowplow/screen_view/jsonschema/1-0-0", and the data field will contain the parameters which you provide. That schema is hosted on the schema repository Iglu Central, and so will always be available to your pipeline.

Example:

```brightscript
m.global.snowplow.screenView = {
    id: "screen23",
    name: "HUD > Save Game"
}
```

## Automatic application install events

When [configuring the tracker](/docs/sources/trackers/roku-tracker/configuration/index.md), use the `trackInstall` setting to opt into automatic [`application_install` tracking](/docs/events/ootb-data/mobile-lifecycle-events/index.md#install-event).

There's no way to directly detect if the app is running as part of a fresh installation, so the tracker uses an indirect trigger.
It will send an install event after it creates a first `userId` value for the [`client_session` entity](/docs/sources/trackers/roku-tracker/adding-data/index.md#adding-user-and-platform-data-with-subject).
Generating a `userId` occurs even if the `client_session` entity is not enabled.
This is similar to the approach [recommended by Roku](https://community.roku.com/discussions/developer/tracking-application-install-and-version-state/188117).

```brightscript
m.global.snowplow.init = {
    trackInstall: true
}
```

:::note

This will track an "install" the first time the tracker runs and generates a user ID.
If you are adding tracking to an existing channel or upgrading from an older SDK version, enabling this setting may create a burst of events as older installations retroactively report this event for the first time.
To reduce this:

1. First release the app with Roku tracker v0.3+ and this setting **disabled**
2. Allow user devices time to generate their first `userId` values
3. Release an additional version with this setting **enabled**
4. Only new installations should track the event

To avoid multiple releases, you could also only enable the setting conditionally based on a timestamp, so only installations after a certain date trigger the event.

:::
