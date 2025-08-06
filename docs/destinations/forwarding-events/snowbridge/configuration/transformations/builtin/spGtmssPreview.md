---
title: "spGtmssPreview"
description: "Extracts a value from the x-gtm-server-preview field and attaches it as the GTM SS preview mode header."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::note
This transformation was added in version 2.3.0
:::

`spGtmssPreview`: Specific to Snowplow data. Extracts a value from the `x-gtm-server-preview` field of a [preview mode context](https://github.com/snowplow/iglu-central/blob/master/schemas/com.google.tag-manager.server-side/preview_mode/jsonschema/1-0-0), and attaches it as the GTM SS preview mode header, to enable easier debugging using GTM SS preview mode.

Only one preview mode context should be sent at a time.

:::note
As of version 3.0.0:

Invalid preview headers sent to GTM SS can result in requests failing, which may be problematic. There is insufficient information available about the values to allow us to confidently validate them, but we do two things to avoid this problem.

First, we validate to ensure that the value is a valid base64 string. Second, we compare the age of the event (based on `collector_tstamp`) to ensure it is under a configurable timeout age. If either of these conditions fail, we treat the message as invalid, and output to the failure target.
:::

## Configuration options

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spGtmssPreview-minimal-example.hcl
`}</CodeBlock>

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/${versions.snowbridge}/assets/docs/configuration/transformations/snowplow-builtin/spGtmssPreview-full-example.hcl
`}</CodeBlock>