---
title: "Snowplow Materialization"
date: "2022-10-05"
sidebar_position: 400
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This package makes use of the `snowplow_incremental` [materialization](https://docs.getdbt.com/guides/legacy/creating-new-materializations) from the `snowplow_utils` package for the incremental models. This builds upon the out-of-the-box [incremental materialization](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/materializations#incremental) provided by dbt. Its key advantage is that it limits table scans on the target table when updating/inserting based on the new data. This improves performance and reduces cost.

All models built by Snowplow use this materialization by default, any [custom modules](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) are also able to make use of it. As is the case with the native incremental materialization, the strategy varies between adapters.

Please refer to the [snowplow-utils](https://github.com/snowplow/dbt-snowplow-utils) docs for the full documentation on `snowplow_incremental` materialization.

## Usage Notes

- If using this the `snowplow_incremental` materialization, the native dbt `is_incremental()` macro will not recognize the model as incremental. Please use the `snowplow_utils.snowplow_is_incremental()` macro instead, which operates in the same way.
- If you would rather use an alternative incremental materialization for all incremental models within the package, set the variable `snowplow__incremental_materialization` to your preferred materialization. See the [Configuration](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) section for more details.

