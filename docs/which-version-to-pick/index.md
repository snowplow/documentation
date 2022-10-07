---
title: "Which version to pick?"
slug: "/feature-comparison"
sidebar_position: -0.5
---

Should you choose [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md) or [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md)? Which BDP tiers are available? What’s [Open Source Quick Start](/docs/open-source-quick-start/index.md) and what’s [Try Snowplow](/docs/try-snowplow/index.md)? Discover on this page.

## Snowplow Open Source or Snowplow BDP?

### Key features

| Feature | [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md) |
|:--|:-:|:-:|
| Hosted in your own cloud | AWS, GCP | AWS, GCP |
| First party server cookies | :white_check_mark: | :white_check_mark: |
| Web, mobile and native SDKs and webhooks | :white_check_mark: | :white_check_mark: |
| [Custom events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) | :white_check_mark: | :white_check_mark: |
| Custom enrichments & transformations | :white_check_mark: | :white_check_mark: |
| [Out-of-the-box data models](/docs/modeling-your-data/what-is-data-modeling/index.md) | :white_check_mark: | :white_check_mark: |
| Data warehouse destinations | Redshift, Snowflake, BigQuery, Databricks, Postgres | Redshift, Snowflake, BigQuery, Databricks |
| Data lake destinations | S3, GCS | S3, GCS |
| Streaming destinations | Kinesis, Pubsub, <nobr>Kafka _(alpha)_</nobr> | Kinesis, PubSub, Azure Event Hubs, Kafka, Google Tag Manager Server-side |

### Premium features

| Feature | [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md) |
|:--|:-:|:-:|
| Data structures workflow tooling & API | :x: | :white_check_mark: |
| Data quality monitoring dashboard & API | :x: | :white_check_mark: |
| Data modeling workflow tooling | :x: | :white_check_mark: |
| Pipeline configuration UI | :x: | :white_check_mark: |
| Jobs monitoring dashboard | :x: | :white_check_mark: |

### High availability

| Feature | [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md) |
|:--|:-:|:-:|
| Out-of-the-box autoscaling | :x: | :white_check_mark: |
| Surge protection | :white_check_mark: | :white_check_mark: |
| Outage protection | :x: | :white_check_mark: |
| Cross-cloud data delivery | :x: | :white_check_mark: |
| SLAs | :x: | :white_check_mark:<br/><em>(Collector uptime, latency, support response)</em> |

### Support and guidance

| Feature | [Snowplow Open Source](/docs/getting-started-on-snowplow-open-source/index.md) | [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md) |
|:--|:-:|:-:|
| Community support via [Discourse](https://discourse.snowplow.io/) | :white_check_mark: | :white_check_mark: |
| 24×7 Technical support | :x: | :white_check_mark: |
| Managed upgrades | :x: | :white_check_mark: |
| Managed security & compliance | :x: | :white_check_mark: |
| Implementation & onboarding workshops | :x: | :white_check_mark: |
| Tracking, schema design, data modeling workshops & expertise | :x: | :white_check_mark: |
| Dedicated Customer Success team & strategic support | :x: | :white_check_mark: |

## Snowplow Open Source

| Feature | [Quick Start](/docs/open-source-quick-start/index.md) | [Custom](/docs/getting-started-on-snowplow-open-source/index.md) |
|:--|:-:|:-:|
| Hosted in your own cloud | AWS, GCP | AWS, GCP |
| First party server cookies | :white_check_mark: | :white_check_mark: |
| Installation | Automated via Terraform | Docker images available for each component |
| Data warehouse destinations | Postgres, Snowflake, _BigQuery coming soon_ | Postgres, Snowflake, Redshift, BigQuery, Databricks |
| Data lake destinations | S3 | S3, GCS |
| Streaming destinations | Kinesis, Pubsub | Kinesis, Pubsub, <nobr>Kafka _(alpha)_</nobr> |
| Surge protection | :x: | :white_check_mark: |

## Snowplow BDP

### Free trial

| Feature | [Try Snowplow](/docs/try-snowplow/index.md) | [Snowplow BDP](/docs/getting-started-with-snowplow-bdp/index.md) |
|:--|:-:|:-:|
| Time limit | 14 days | Unlimited |
| Hosted in your own cloud | :x: | AWS, GCP |
| First-party server cookies | :x: | :white_check_mark: |
| [Custom events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) | :x: | :white_check_mark: |
| Available enrichments | 7 | 16 |
| Custom enrichments & transformations | :x: | :white_check_mark: |
| Data quality monitoring | :x: | :white_check_mark: |
| Data warehouse destinations | Postgres | Redshift, Snowflake, BigQuery, Databricks |
| Data lake destinations | :x: | S3, GCS |
| Streaming destinations | :x: | Kinesis, PubSub, Azure Event Hubs, Kafka, Google Tag Manager Server-side |
| Maximum throughput | 50 events per second<br/>_(any events above this cap will be dropped)_ | Unlimited |
| Autoscaling | :x: | :white_check_mark: |
| SLAs | :x: | :white_check_mark: |

### Snowplow BDP tiers

See the [product description page](https://snowplow.io/snowplow-bdp-product-description) for more details.

| Feature | Basecamp | Ascent | Summit |
|:--|:-:|:-:|:-:|
| Collector uptime [SLA](https://snowplow.io/snowplow-bdp-product-description/#slas) | 99.90% | **99.99%** | **99.99%** |
| Data latency [SLA](https://snowplow.io/snowplow-bdp-product-description/#slas) | :x: | <nobr>BigQuery: 15 min</nobr><br/><nobr>Redshift: 30 min</nobr><br/><nobr>Snowflake: 30 min</nobr><br/><nobr>Databricks: N/A</nobr> | <nobr>BigQuery: 15 min</nobr><br/><nobr>Redshift: 30 min</nobr><br/><nobr>Snowflake: 30 min</nobr><br/><nobr>Databricks: N/A</nobr> |
| Single Sign On | :x: | :white_check_mark: | :white_check_mark: |
| Fine Grained User Permissions | :x: | :x: | :white_check_mark: |
| AWS Infra Security bundle | :x: | :x: | :white_check_mark: |
| Outage Protection | :x: | :x: | :white_check_mark: |
| Support SLA first response<br/>Urgent / High / Normal / Low | <nobr>1 / 8 / 24 / 24</nobr><br/>hours | <nobr>1 / **2** / 24 / 24</nobr><br/>hours | <nobr>**0.5** / **1** / **8** / 24</nobr><br/>hours |
| Kickstarter | Remote | Remote | In-person<br/>_(travel permitting)_ |
| Strategic Success Manager | :x: | :x: | :white_check_mark: |
| Elective Upgrades | :x: | :x: | :white_check_mark: |
| Regular (quarterly) infrastructure reviews | :x: | :x: | :white_check_mark: |
