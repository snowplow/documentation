---
title: "Feature comparison"
sidebar_position: -0.5
---

Should you choose [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md), [Snowplow BDP Cloud](/docs/getting-started-with-snowplow-bdp/cloud/index.md) or [Snowplow BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md)?

## Create & consume behavioral data

| Feature | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud *Preview* :new:](/docs/getting-started-with-snowplow-bdp/cloud/index.md) | [BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md) | 
|:--|:-:|:-:|:-:|
| [35+ trackers & webhooks](/docs/collecting-data/index.md) | ✅ | ✅ | ✅ |
| 1st party tracking | ✅ | _coming soon_ | ✅ |
| [Anonymous data collection](/docs/recipes/recipe-anonymous-tracking/index.md) | ✅ | ✅ | ✅ |
| [Custom events & entities](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) | ✅ | _coming soon_ | ✅ |
| [Enrichments](/docs/enriching-your-data/available-enrichments/index.md) | ✅ | ✅ | ✅ |
| Advanced stream transformations (JS, API, SQL enrichments) | ✅ | ❌ | ✅ |
| [Out-of-the-box data models](/docs/modeling-your-data/what-is-data-modeling/index.md)  | ✅ | ✅ | ✅ |
| [Data Product Accelerators](https://snowplow.io/data-product-accelerators/) | ✅ | ✅ | ✅ |
| [Destinations hub](https://snowplow.io/destination-hub/) | ❌ | ❌ | ✅ |
| **Warehouse / lake destinations** | | | |
| • Snowflake | ✅ | ✅ | ✅ |
| • Redshift | ✅ | _coming soon_ | ✅ |
| • BigQuery | ✅ | ❌ | ✅ |
| • Databricks | ✅ | _coming soon_ | ✅ |
| • Elasticsearch | ✅ | ❌ | bolt-on |
| • Postgres | ✅ | ❌ | ❌ |
| • S3 | ✅ | ❌ | ✅ |
| • GCS | ✅ | ❌ | ✅ |
| **Real-time streams** | | | |
| • Kinesis | ✅ | ❌ | ✅ |
| • Pubsub | ✅ | ❌ | ✅ |
| • Kafka | ❌ | ❌ | bolt-on |
| • Azure Eventhubs | ❌ | ❌ | bolt-on |

## Build more trust in your data

| Feature | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud *Preview* :new:](/docs/getting-started-with-snowplow-bdp/cloud/index.md) | [BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md) | 
|:--|:-:|:-:|:-:|
| [Failed Events](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md) | ✅ | ❌ | ✅ |
| [Data quality monitoring & API](/docs/managing-data-quality/failed-events/failed-events-in-the-ui/index.md) | ❌ | ❌ | ✅ |
| Jobs monitoring dashboard | ❌ | ❌ | ✅ |
| Pipeline configuration tooling | ❌ | ❌ | ✅ |
| QA pipeline | do-it-yourself | ❌ | ✅ |
| Auto-scaling | do-it-yourself | ❌ | ✅ |
| Collector uptime SLA | ❌ | ❌ | ✅ |
| Warehouse loading latency SLA | ❌ | ❌ | ✅ |
| Surge protection | do-it-yourself | ❌ | ✅ |
| Outage protection | ❌ | ❌ | ✅<br/>_(top tier only)_ |

## Collaborate across multiple teams

| Feature | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud *Preview* :new:](/docs/getting-started-with-snowplow-bdp/cloud/index.md) | [BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md) | 
|:--|:-:|:-:|:-:|
| Seats | N/A | unlimited | unlimited |
| [Data structures tooling & API](/docs/understanding-tracking-design/managing-data-structures/index.md) | ❌ | ❌ | ✅ |
| [Data modelling management tooling](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/using-dbt/index.md) | ❌ | _coming soon_ | ✅ |
| [Tracking catalog](/docs/discovering-data/tracking-catalog/index.md) | ❌ | ❌ | ✅ |

## Deployment & security

| Feature | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud *Preview* :new:](/docs/getting-started-with-snowplow-bdp/cloud/index.md) | [BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md) | 
|:--|:-:|:-:|:-:|
| Deployment method | self-hosted<br/>(AWS, GCP) | Snowplow-hosted cloud | private cloud<br/>(AWS, GCP) |
| SSO | ❌ | ❌ | ✅ |
| Fine grained user permissions (ACLs) | ❌ | ❌ | ✅ |
| Custom VPC peering | ❌ | ❌ | bolt-on |
| AWS Infra security bundle | ❌ | ❌ | bolt-on |

## Support

| Feature | [Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [BDP Cloud *Preview* :new:](/docs/getting-started-with-snowplow-bdp/cloud/index.md) | [BDP Enterprise](/docs/getting-started-with-snowplow-bdp/enterprise/index.md) | 
|:--|:-:|:-:|:-:|
| Community support via Discourse | ✅ | ✅ | ✅ |
| Snowplow support via Zendesk | ❌ | ✅ | ✅ |
| First response time SLAs | ❌ | ❌ | ✅ |
| Dedicated customer success team | ❌ | ❌ | ✅ |
| Kickstarter (implementation) | ❌ | ❌ | ✅ |
| Strategic Success Manager | ❌ | ❌ | ✅<br/>_(top tier only)_ |
| Managed upgrades | ❌ | ✅ | ✅ |
| Elective upgrades | ❌ | ❌ | ✅<br/>_(top tier only)_ |
| Quarterly infrastructure reviews | ❌ | ❌ | ✅<br/>_(top tier only)_ |