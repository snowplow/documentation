---
title: "Transformations"
date: "2022-10-20"
sidebar_position: 200
---

# Transformations Configuration

You can configure any number of transformations to run on the data one after another - transformations will run in the order provided. (You can repeatedly specify the same transformation more than once, if needed.) All transformations operate on a single message basis.

If you're filtering the data, it's best to provide the filter first, for efficiency.

If you're working with Snowplow enriched messages, you can configure scripting transformations, or any of the built-in transformations, which are specific to Snowplow data.

If you're working with any other type of data, you can create transformations via scripting transformations.

## Transformations and filters

Transformations modify messages in-flight. They might rename fields, perform computations, set partition keys, or modify data. For example if you wanted to change a `snake_case` field name to `camelCase`, you would use a transformation to do this.

Filters are a type of transformation which prevent Snowbridge from further processing data based on a condition. When data is filtered, Snowbridge will ack the message without sending it to the target. For example if you only wanted to send page views to the destination, you would set up a filter with a condition where `event_name` matches the string `page_view`.

## Transformation Configuration

To configure transformations, supply one or more `transform {}` block. Choose the transformation using `use "${transformation_name}"`. 

Example:

The below first filters out any `event_name` which does not match the regex `^page_view$`, then runs a custom javascript script to change the app_id value to `"1"`

```hcl reference
https://github.com/snowplow-incubator/stream-replicator-examples-temp/blob/main/docs/docs/documentation-examples/configuration/transformations/transformations-overview-example.hcl
```

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```