# spEnrichedFilter

`spEnrichedFilter`: Filters messages based on a regex match against an atomic field.

This transformation is for use on base-level atomic fields, rather than fields from contexts, or custom events — which can be achieved with `spEnrichedFilterContext` and `spEnrichedFilterUnstructEvent`.

Filters can be used in one of two ways, which is determined by the `filter_action` option. `filter_action` determines the behaviour of the app when the regex provided evaluates to `true`. If it's set to `"keep"`, the app will complete the remaining transformations and send the message to the destination (unless a subsequent filter determines otherwise). If it's set to `"drop"`, the message will be acked and discarded, without continuing to the next transformation or target.

This example filters out all data whose `platform` value does not match either `web` or `mobile`.

Minimal configuration:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/snowplow-builtin/spEnrichedFilter-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/snowplow-builtin/spEnrichedFilter-full-example.hcl
```