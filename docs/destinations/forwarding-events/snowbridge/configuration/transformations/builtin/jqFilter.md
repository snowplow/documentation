# jqFilter

:::note
This transformation was added in version 3.0.0.
:::

```mdx-code-block
import JQDescriptionSharedBlock from "./reusable/_jqDescription.md"

<JQDescriptionSharedBlock/>
```

`jqFilter` filters messages based on the output of a jq command which is run against the data. The provided command must return a boolean result. `false` filters the message out, `true` keeps it.

If the provided jq command returns a non-boolean value error, or results in an error, then the message will be considered invalid, and will be sent to the failure target.

## Configuration options

This example filters out all data that doesn't have an `app_id` key.

Minimal configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/builtin/jqFilter-minimal-example.hcl
```

Every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/transformations/builtin/jqFilter-full-example.hcl
```

## Helper Functions

```mdx-code-block
import JQHelpersSharedBlock from "./reusable/_jqHelpers.md"

<JQHelpersSharedBlock/>
```
