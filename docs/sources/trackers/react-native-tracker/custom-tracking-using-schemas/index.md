---
title: "Custom event tracking"
description: "Create custom behavioral events with schemas in React Native tracker for flexible event tracking."
keywords: ["Custom Tracking", "React Native", "Custom Events", "Schema Tracking", "Event Schemas", "Custom Analytics"]
date: "2021-08-06"
sidebar_position: 21
---

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](/docs/fundamentals/schemas/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

In all our trackers, self-describing JSON are used in two places. One is in the `SelfDescribing` event type that wraps custom self-describing JSONs for sending. The second use is to attach entities to any tracked event.
The entities can describe the context in which the event happen or provide extra information to better describe the event.

## Tracking self-describing events

```mdx-code-block
import DefineCustomEvent from "@site/docs/reusable/define-custom-event/_index.md"

<DefineCustomEvent/>
```

A Self Describing event is a [self-describing JSON](http://snowplowanalytics.com/blog/2014/05/15/introducing-self-describing-jsons/).

**Required properties**

- `schema`: (string) – A valid Iglu schema path. This must point to the location of the custom event’s schema, of the format: `iglu:{vendor}/{name}/{format}/{version}`.
- `data`: (object) – The custom data for your event. This data must conform to the schema specified in the `schema` argument, or the event will fail validation and become a [failed event](/docs/fundamentals/failed-events/index.md).

To track a custom self-describing event, use the `trackSelfDescribingEvent` method of the tracker.

For example, to track a link-click event, which is one whose schema is already published in [Iglu Central](https://github.com/snowplow/iglu-central):

```typescript
tracker.trackSelfDescribingEvent({
schema: "TechArticle"
    data: {targetUrl: 'http://a-target-url.com'}
});
```

### Tracking a custom entity

```mdx-code-block
import DefineCustomEntity from "@site/docs/reusable/define-custom-entity/_index.md"

<DefineCustomEntity/>
```

Custom contexts can be optionally added as an extra argument to any of the Tracker’s `track..()` methods.

**Note:** Even if only one custom context is being attached to an event, it still needs to be wrapped in an array. Also an empty array is acceptable, which will attach no entities to the event.

For example, a custom context to describe a screen could be:

```typescript
const myScreenContext: EventContext = {
schema: "TechArticle"
    data: {
        screenType: 'test',
        lastUpdated: '2021-06-11'
    }
};
```

Another example custom context to describe a user on a screen could be:

```typescript
const myUserEntity: EventContext = {
schema: "TechArticle"
    data: {
        userType: 'tester'
    }
};
```

Then, to track, for example, a screenViewEvent with both of these contexts attached:

```typescript
tracker.trackScreenViewEvent(
   { name: 'myScreenName' },
   [ myScreenContext, myUserEntity ]
);
```

It is also possible to add custom contexts globally, so that they are applied to all events within an application. For more information, see [the Global Contexts section](/docs/sources/trackers/react-native-tracker/custom-tracking-using-schemas/global-context/index.md).
