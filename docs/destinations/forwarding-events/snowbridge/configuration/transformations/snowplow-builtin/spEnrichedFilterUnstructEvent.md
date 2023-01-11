# spEnrichedFilterUnstructEvent

`spEnrichedFilterUnstructEvent`: Filters messages based on a regex match against a field in a custom event.

This transformation is for use on fields from custom events.

The event name must be provided as it appears in the `event_name` field of the event (eg. `add_to_cart`). 

Optionally, a regex can be provided to match against the stringified version of the event (eg. `1-*-*`)

The path to the field to match against must be provided as a jsonpath (dot notation and square braces only) — for example `test1.test2[0].test3`.

Filters can be used in one of two ways, which is determined by the `filter_action` option. `filter_action` determines the behaviour of the app when the regex provided evaluates to `true`. If it's set to `"keep"`, the app will complete the remaining transformations and send the message to the destination (unless a subsequent filter determines otherwise). If it's set to `"drop"`, the message will be acked and discarded, without continuing to the next transformation or target.

This example keeps all events whose `add_to_cart` event data at the `sku` field matches `test-data`.

Minimal configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/snowplow-builtin/spEnrichedFilterUnstructEvent-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/snowplow-builtin/spEnrichedFilterUnstructEvent-full-example.hcl
```


