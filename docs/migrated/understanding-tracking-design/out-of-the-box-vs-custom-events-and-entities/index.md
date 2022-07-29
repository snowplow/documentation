---
title: "Out-of-the-box vs custom events"
date: "2020-02-24"
sidebar_position: 30
---

## Snowplow authored events

Snowplow supports a large number of events "out of the box", most of which are fairly standard in a web analytics context.

Examples of events that we support include:

- Page views and Screen views
- Page pings
- Link clicks
- Form fill-ins (for the web)
- Form submissions
- Transactions

For events that Snowplow natively supports, there is generally a specific API for tracking that event type in Snowplow. For example, if you want to track a page view using the Javascript tracker, you do so with the following Javascript:

```
window.snowplow('trackPageView');
```

Whereas if you were tracking a screen view in an iOS app using the iOS tracker, you’d do so like this:

```
let event = ScreenView(name: "DemoScreenName", screenId: UUID())
tracker.track(event)
```

In general, each tracker will have a specific API call for tracking any events that have been defined by the Snowplow team, and you should refer to the [tracker-specific documentation](/docs/migrated/collecting-data/collecting-from-own-applications/) to make sure that this is set up correctly.

## [](https://github.com/snowplow/snowplow/wiki/Events-overview#custom-events)Custom events

If you wish to track an event that you have designed yourself, and therefore isn't a Snowplow authered event, then you can track them using the approach of _self-describing events_.

### Self-describing events

Self-describing events are events you define yourself. A **self-describing event** consists of two elements:

- The `name` of the self-describing event, e.g. "Game saved" or "Returned order".
- A set of `key: value` properties (also known as a hash, associative array or dictionary)

Self-describing events are great:

- Where you want to track event types which are proprietary/specific to your business (i.e. not already part of Snowplow)
- Where you want to track events which have unpredictable or frequently changing properties

The set of `key: value` properties in self-describing events is represented with **self-describing JSON** which can have arbitrarily many fields.

For example, to track a self-describing event with Javascript tracker (v3), you make use of the `trackSelfDescribingEvent` method with the pattern shown below:

```
window.snowplow('trackSelfDescribingEvent', { 
  event: { 
    schema: '...', 
    data: { ... } 
  } 
});
```

More specific example using JavaScript tracker:

```
window.snowplow('trackSelfDescribingEvent', {
    event: {
        schema: 'iglu:com.acme_company/viewed_product/jsonschema/2-0-0',
        data: {
            productId: 'ASO01043',
            category: 'Dresses',
            brand: 'ACME',
            returning: true,
            price: 49.95,
            sizes: ['xs', 's', 'l', 'xl', 'xxl'],
            availableSince: new Date(2013,3,7)
        }
    }
});
```

Note that with **self-desribing** events, the number of `key: value` pairs can vary and is determined by business model of the entity associated with the event.

Therefore, for Snowplow to be able to validate and extract the data self-describing JSON would have to be sent with the event. By its definition, self-describing JSON includes a [reference to JSON schema](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/) which has to be in place by the time enrichment process takes place. It allows for maximum customisation of the self describing events.

Knowing in advance what the expected structure and format of data should be as a necessity to be able to handle events and contexts.

See [Structuring your data with schemas](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/).

### Structured events

Alternatively, if you don't wish to define your own schemas, you can generate a **structured event**, you get five parameters:

- _Category_: The name for the group of objects you want to track.
- _Action_: A string that is used to define the user in action for the category of object.
- _Label_: An optional string which identifies the specific object being actioned.
- _Property_: An optional string describing the object or the action performed on it.
- _Value_: An optional numeric data to quantify or further describe the user action.

Important

We recommend using Self Describing events whenever possible as they give more control and semantic meaning to your data tracking.
