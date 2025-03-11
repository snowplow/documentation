---
title: "Utils"
sidebar_position: 60
description: "The Snowplow Utils dbt Package"
hide_title: true
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import ThemedImage from '@theme/ThemedImage';
```

<Badges badgeType="dbt-package Release" pkg="utils"></Badges>&nbsp;
<Badges badgeType="Actively Maintained"></Badges>&nbsp;
<Badges badgeType="SPAL"></Badges>

# Snowplow Utils Package

:::info
The models, functionality, and variables described below are only available from `snowplow-utils v0.15.0` and above, as earlier packages do not utilize these variables.
:::

**The package source code can be found in the [snowplow/dbt-snowplow-utils repo](https://github.com/snowplow/dbt-snowplow-utils).**

The package contains a handful of useful macros that can help speed up development, as well as two types of collection of macros to rebuild the `base` level tables that each Snowplow dbt package uses internally: One of them is called the `session based incremental macros` which have been used historically at Snowplow to process incoming new events that belong to the same session as a whole, and `time based incremental macros` which were introduced in 2025 which reprocesses events based on a time period (e.g. only newly arriving events, reprocessing the current or last x days data for daily aggregates etc.)

We highly recommend looking at the package [readme](https://github.com/snowplow/dbt-snowplow-utils?tab=readme-ov-file#macros) for a list of all macros in the package that may be of use in any [custom models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-custom-models/index.md) you may build.

:::info
This `base` functionality and the process flow described below is only available from `snowplow-utils v0.15.0` and above for the session based incrementalization and `snowplow-utils v0.18.0` and above for the time based incrementalization.
:::
