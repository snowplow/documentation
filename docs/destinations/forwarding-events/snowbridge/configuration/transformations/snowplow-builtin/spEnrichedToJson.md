# SpEnrichedToJson

`spEnrichedToJson`: Transforms a message's data from Snowplow Enriched tsv string format to a JSON object. The input data must be a valid Snowplow enriched TSV.

`spEnrichedToJson` has no options.

Example:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/snowplow-builtin/spEnrichedToJson-minimal-example.hcl
```

The transformation to JSON is done via the [analytics SDK](https://docs.snowplow.io/docs/modeling-your-data/analytics-sdk/ "https://docs.snowplow.io/docs/modeling-your-data/analytics-sdk/") logic, specifically in this case the [Golang analytics SDK](https://docs.snowplow.io/docs/modeling-your-data/analytics-sdk/analytics-sdk-go/ "https://docs.snowplow.io/docs/modeling-your-data/analytics-sdk/analytics-sdk-go/").

In brief, the relevant logic here is that:

*   If a field is not populated in the original event, it won’t have a key in the resulting JSON

*   In the TSV, there’s a separate field for `contexts` (sent via tracker), and `derived_contexts` (attached during enrichment). In the analytics SDK, there is one key per context, regardless of which type. (Technically, it’s one key per major version of a context. So if you had a 1.0.0 and a 2.0.0 of the same one, you’d have two keys).
