---
title: "Package mechanics"
description: "Technical mechanics of dbt Snowplow packages for behavioral data modeling and transformation workflows."
schema: "TechArticle"
keywords: ["Package Mechanics", "DBT Internals", "Package Architecture", "DBT Framework", "Package Design", "DBT Structure"]
sidebar_position: 70
---

The following pages contain information relating to the core logic and processing of our packages, it is not required to understand these concepts to make use of our packages but they are provided for more advanced users who may wish to produce more complex [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) or better understand what's going on under the hood of the packages. We refer to these elements throughout the docs.

:::tip

Throughout the packages and these docs, we will refer to a `session`, or `session_identifier`. This is the atomic unit of re-processing, as described in the [incremental sessionization logic](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/incremental-processing/index.md) and by default usually refers to the actual session identifier within your tracker; however this language is in part only used for historic reasons. Thanks to the [custom identifiers](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-identifiers/index.md) in our packages, these _sessions_ can refer to any identifier you define and our packages will ensure that all events (within the limits) are processed in a single run. A similar case applies to user identifiers as well.

:::
