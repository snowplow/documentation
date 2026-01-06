You may wish to track events which are not directly supported by Snowplow. The solution is [self-describing events](/docs/fundamentals/events/index.md#self-describing-events). Self-describing events are [based on JSON Schemas](/docs/fundamentals/schemas/index.md) and can have arbitrarily many fields.

To define your own custom event, you will need to [create a corresponding schema](/docs/data-product-studio/data-structures/manage/index.md). Snowplow uses the schema to validate that the JSON containing the event properties is well-formed.
