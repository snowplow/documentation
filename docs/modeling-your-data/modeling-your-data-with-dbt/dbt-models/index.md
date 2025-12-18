---
title: "Our packages"
sidebar_position: 10
description: "All Snowplow dbt packages"
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'addon']}
  helpContent="Data models are a paid addon for Snowplow CDI."
/>
```

Snowplow provides several dbt packages to help you get value from your data.


| Package name                                                                                                         | Purpose                                                                            |
| -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Attribution](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/index.md)   | Marketing attribution analysis                                                     |
| [Unified Digital](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/index.md)   | Transform raw web and mobile event data into derived tables                        |
| [Media Player](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-media-player-data-model/index.md) | Transform raw media player event data into derived tables                          |
| [Ecommerce](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md)       | Transform raw ecommerce event data into derived tables                             |
| [Normalize](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-normalize-data-model/index.md)       | Normalize events, filtered events, and users table for use in downstream ETL tools |
| [Utils](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-utils-data-model/index.md)               | Useful macros                                                                      |
