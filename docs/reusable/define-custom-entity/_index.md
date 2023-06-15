Custom context can be used to augment any standard Snowplow event type, including self describing events, with additional data. We refer to this custom context as [Event Entities](/docs/understanding-tracking-design/understanding-events-entities/index.md).

Each custom context is an array of self-describing JSON following the same pattern as an self describing event. Since more than one context (of either different or the same type) can be attached to an event, the `context` argument (if it is provided at all) should be a non-empty array of self-describing JSONs.

As with self describing events, if you want to create your own custom context, you will need to [create a corresponding schema](/docs/understanding-tracking-design/managing-your-data-structures/index.md). Snowplow uses the schema to validate that the JSON containing the context properties is well-formed.
