Custom context can be used to augment any standard Snowplow event type, including self-describing events, with additional data. We refer to this custom context as [entities](/docs/fundamentals/entities/index.md).

The context is an array of entities. More than one entity (of either different or the same type) can be attached to an event. The `context` argument (if it is provided at all) should be a non-empty array.

As with self-describing events, if you want to create your own custom context, you will need to [create a corresponding schema](/docs/event-studio/data-structures/index.md). Snowplow uses the schema to validate that the JSON containing the context properties is well-formed.
