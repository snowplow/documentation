---
title: "Custom event tracking"
date: "2021-08-06"
sidebar_position: 21
---

Self-describing (self-referential) JSON schemas are at the core of Snowplow tracking. Read more about them [here](/docs/understanding-your-pipeline/schemas/index.md). They allow you to track completely customised data, and are also used internally throughout Snowplow pipelines.

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
- `data`: (object) – The custom data for your event. This data must conform to the schema specified in the `schema` argument, or the event will fail validation and land in bad rows.

To track a custom self-describing event, use the `trackSelfDescribingEvent` method of the tracker.

For example, to track a link-click event, which is one whose schema is already published in [Iglu Central](https://github.com/snowplow/iglu-central):

```typescript
tracker.trackSelfDescribingEvent({
    schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
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
    schema: 'iglu:com.example/screen/jsonschema/1-2-1',
    data: {
        screenType: 'test',
        lastUpdated: '2021-06-11'
    }
};
```

Another example custom context to describe a user on a screen could be:

```typescript
const myUserEntity: EventContext = {
    schema: 'iglu:com.example/user/jsonschema/2-0-0',
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

It is also possible to add custom contexts globally, so that they are applied to all events within an application. For more information, see the Global Contexts section below.

## Global Contexts

As mentioned in the GCConfiguration section, you can set global contexts when initializing the tracker.

However, as the user journey evolves, you may need to remove or add global contexts at runtime.

### Removing Global Contexts

A set of global contexts is identified by its tag, which was set when the global contexts was added, either as part of tracker initial configuration or manually (see below).

To remove the global contexts associated with a tag, you can use the `removeGlobalContexts` tracker method, which takes as argument the tag. For example:

```typescript
tracker.removeGlobalContexts('my-old-tag');
```

### Adding Global Contexts

Similarly, you can add global contexts at runtime using the `addGlobalContexts` tracker method. This method takes as argument the GlobalContext to add.

For example:

```typescript
tracker.addGlobalContexts({
    tag: 'my-new-tag',
    globalContexts: [
        {
            schema: 'iglu:com.snowplowanalytics.snowplow/ad_impression/jsonschema/1-0-0',
            data: {impressionId: 'my-ad-impression-id'},
        },
    ]
});
```
