# spEnrichedSetPk

`spEnrichedSetPk`: Sets the message's destination partition key to an atomic field from a Snowplow Enriched tsv string.  The input data must be a valid Snowplow enriched TSV.

`SpEnrichedSetPk` only takes one option — the field to use for the partition key.

Example:

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/snowplow-builtin/spEnrichedSetPk-minimal-example.hcl
```

Note: currently, setting partition key to fields in custom events and contexts is unsupported.