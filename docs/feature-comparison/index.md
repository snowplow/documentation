---
title: "Feature comparison"
sidebar_position: 1
hide_table_of_contents: true
---

Should you choose [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md), [Snowplow BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) or [Snowplow BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md)? Below you can find a detailed feature comparison. Still not sure? Check out [our guide](https://snowplow.io/os-or-bdp/).

To find out more about the support services offered to Snowplow BDP customers see our [Statement of Support](/statement-of-support/).

| <h3>Create & consume behavioral data</h3> | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) | [BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md) |
|:--|:-:|:-:|:-:|
| [35+ trackers & webhooks](/docs/collecting-data/index.md) | ✅ | ✅ | ✅ |
| 1st party tracking | ✅ | ✅ | ✅ |
| [Anonymous data collection](/docs/recipes/recipe-anonymous-tracking/index.md) | ✅ | ✅ | ✅ |
| Custom [events](/docs/understanding-your-pipeline/events/index.md#out-of-the-box-and-custom-events) & [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities) | ✅ | ✅ | ✅ |
| [Enrichments](/docs/enriching-your-data/available-enrichments/index.md) | ✅ | ✅ | ✅ |
| Advanced stream transformations (JS, API, SQL enrichments) | ✅ | ❌ | ✅ |
| [Out-of-the-box data models](/docs/modeling-your-data/what-is-data-modeling/index.md)  | ✅ | ✅ | ✅ |
| [Data Product Accelerators](https://snowplow.io/data-product-accelerators/) | ✅ | ✅ | ✅ |
| [Destinations hub](https://snowplow.io/destination-hub/) | do-it-yourself | ❌ | ✅ |
| **Warehouse / lake destinations** | | | |
| • Snowflake | ✅ | ✅ | ✅ |
| • Redshift | ✅ | ✅| ✅ |
| • BigQuery | ✅ | ❌ | ✅ |
| • Databricks | ✅ | ✅ | ✅ |
| • Synapse Analytics 🧪 | ✅ | ❌ | _coming soon_ |
| • Elasticsearch | ✅ | ❌ | ✅ |
| • Postgres | ✅<br/>_(not suitable for high volumes)_ | ❌ | ❌ |
| • S3 | ✅ | ❌ | ✅ |
| • GCS | ✅ | ❌ | ✅ |
| • ADLS 🧪 | ✅ | ❌ | _coming soon_ |
| **Real-time streams** | | | |
| • Kinesis | ✅ | ❌ | ✅ |
| • Pubsub | ✅ | ❌ | ✅ |
| • Kafka / Azure Event Hubs / Confluent Cloud | ✅ | ❌ | ✅<br/>_(bolt-on)_ |
| <h3>Build more trust in your data</h3> | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) | [BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md) |
| [Failed Events](/docs/understanding-your-pipeline/failed-events/index.md) | ✅ | ❌ | ✅ |
| [Data quality monitoring & API](/docs/managing-data-quality/monitoring-failed-events/index.md) | ❌ | ❌ | ✅ |
| Jobs monitoring dashboard | ❌ | ❌ | ✅ |
| Pipeline configuration tooling | ❌ | ❌ | ✅ |
| QA pipeline | do-it-yourself | ❌ | ✅ |
| Auto-scaling | do-it-yourself | ❌ | ✅ |
| Collector uptime SLA | ❌ | ❌ | ✅ |
| Warehouse loading latency SLA | ❌ | ❌ | ✅ |
| Surge protection | do-it-yourself | ❌ | ✅ |
| Outage protection | ❌ | ❌ | ✅<br/>_(top tier only)_ |
| <h3>Collaborate across multiple teams</h3> | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) | [BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md) |
| Seats | N/A | unlimited | unlimited |
| [Data structures tooling & API](/docs/understanding-tracking-design/managing-your-data-structures/ui/index.md) | ❌ | ✅<br/>[_(UI only)_](/docs/understanding-tracking-design/managing-your-data-structures/builder/index.md) | ✅ |
| [Tracking scenarios](/docs/understanding-tracking-design/tracking-plans/index.md) | ❌ | ✅<br/>_(UI only)_ | ✅ |
| [Data modeling management tooling](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/using-dbt/index.md) | ❌ | _coming soon_ | ✅ |
| [Tracking catalog](/docs/discovering-data/tracking-catalog/index.md) | ❌ | ❌ | ✅ |
| <h3>Deployment & security</h3> | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) | [BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md) |
| Deployment method | self-hosted | Snowplow-hosted cloud | private cloud |
| • AWS | ✅ | — | ✅ |
| • GCP | ✅ | — | ✅ |
| • Azure 🧪 | ✅ | — | _coming soon_ |
| Single Sign-On | ❌ | ❌ | ✅ |
| Fine grained user permissions (ACLs) | ❌ | ❌ | ✅<br/>_(top tier only)_ |
| Custom VPC integration | ❌ | ❌ | ✅<br/>_(bolt-on)_ |
| AWS Infra security bundle | ❌ | ❌ | ✅<br/>_(top tier only)_ |
| <h3>Services</h3> | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud](/docs/getting-started-on-snowplow-bdp-cloud/index.md) | [BDP Enterprise](/docs/getting-started-on-snowplow-bdp-enterprise/index.md) |
| Self-help support website, FAQs and educational materials | ✅ | ✅ | ✅ |
| Community support via Discourse | ✅ | ✅ | ✅ |
| 24/7/365 Support through email / Help Centre | ❌ | ✅ | ✅ |
| Support SLAs (first response time) [*](https://snowplow.io/snowplow-bdp-product-description/#slas) | ❌ | ❌ | ✅ |
| Infrastructure management | ❌ | ✅ | ✅ |
| Regular infrastructure reviews | ❌ | ❌ | ✅<br/>_(select tiers)_ |
| Deferred upgrades | ❌ | ❌ | ✅<br/>_(select tiers)_ |
| Provision of news / updates / ideas / customer stories | ✅ | ✅ | ✅ |
| Success management | ❌ | ❌ | ✅<br/>_(select tiers)_ |
| Data strategy and consultation sessions | ❌ | ❌ | ✅<br/>_(select tiers)_ |
