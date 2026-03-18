---
title: "Snowbridge transformation configuration"
sidebar_label: "Transformations"
date: "2022-10-20"
sidebar_position: 200
description: "Configure transformations and filters to modify or exclude messages with built-in transformations or custom scripts."
keywords: ["snowbridge config", "transformation config", "filters", "message transformation", "custom scripts"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

You can configure any number of transformations to run on the data one after another - transformations will run in the order provided. (You can repeatedly specify the same transformation more than once, if needed.) All transformations operate on a single message basis.

If you're filtering the data, it's best to provide the filter first, for efficiency.

If you're working with Snowplow enriched messages, you can configure scripting transformations, or any of the built-in transformations, which are specific to Snowplow data.

If you're working with any other type of data, you can create transformations via scripting transformations.

## Transformations and filters

Transformations modify messages in-flight. They might rename fields, perform computations, set partition keys, or modify data. For example if you wanted to change a `snake_case` field name to `camelCase`, you would use a transformation to do this.

Filters are a type of transformation which prevent Snowbridge from further processing data based on a condition. When data is filtered, Snowbridge will ack the message without sending it to the target. For example if you only wanted to send page views to the destination, you would set up a filter with a condition where `event_name` matches the string `page_view`.

## Configuration

Configure transformations by supplying a single `transform {}` block. Within it, choose each transformation using `use "transformation_name" {}`. Multiple transformations run in the order they appear.

Example:

The below first filters out any `event_name` which does not match the regex `^page_view$`, then runs a custom javascript script to change the app_id value to `"1"`

<CodeBlock language="hcl" reference>{`
https://github.com/snowplow/snowbridge/blob/v${versions.snowbridge}/assets/docs/configuration/transformations/transformations-overview-example.hcl
`}</CodeBlock>

:::note
In Snowbridge 4.x, each transformation required its own `transform {}` block.
From version 5.0.0, all transformations must be nested inside a single `transform {}` block. See the [upgrade guide](/docs/api-reference/snowbridge/upgrade-guides/upgrade-guide-5-X-X/index.md) for migration details.
:::

### Worker pool

The `transform {}` block accepts an optional `worker_pool` parameter that controls the number of concurrent goroutines used to run transformations. By default, the worker pool scales automatically based on `GOMAXPROCS`.

```hcl
transform {
  worker_pool = 4

  use "spEnrichedToJson" {}
}
```

Set `worker_pool` explicitly when you need predictable concurrency, for example in memory-constrained environments.
