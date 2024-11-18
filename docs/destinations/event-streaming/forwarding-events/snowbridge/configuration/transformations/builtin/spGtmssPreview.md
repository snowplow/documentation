# spGtmssPreview

:::note
This transformation was added in version 2.3.0
:::

`spGtmssPreview`: Specific to Snowplow data. Extracts a value from the `x-gtm-server-preview` field of a [preview mode context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.google.tag-manager.server-side/preview_mode/jsonschema/1-0-0), and attaches it as the GTM SS preview mode header, to enable easier debugging using GTM SS preview mode.

Only one preview mode context should be sent at a time.

There are no configuration optons for this transformation.

Example:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/snowplow-builtin/spGtmssPreview-minimal-example.hcl
```
