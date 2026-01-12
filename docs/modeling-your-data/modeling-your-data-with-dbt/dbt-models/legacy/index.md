---
title: "Overview of legacy dbt models"
sidebar_label: "Legacy packages"
sidebar_position: 9999
description: "Legacy Snowplow dbt packages including Web, Mobile, and Fractribution models superseded by newer packages."
keywords: ["legacy dbt packages", "deprecated packages", "web dbt legacy", "mobile dbt legacy", "fractribution legacy"]
---

:::warning

Legacy packages are no longer under active development and are in some cases no longer supported. Please look for a suitable replacement for these packages where possible.

:::

| Package name  | Purpose                                             | Superseded by                                                                                                      |
| ------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Web           | Transform raw web event data into derived tables    | [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) |
| Mobile        | Transform raw mobile event data into derived tables | [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md) |
| Fractribution | Marketing attribution analysis                      | [Attribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md) |
