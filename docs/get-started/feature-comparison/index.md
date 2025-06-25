---
title: "Product features"
sidebar_position: 2
hide_table_of_contents: true
sidebar_label: "Feature comparison"
---

Here is a detailed list of product features, including which are available as part of the Snowplow Behavioral Data Platform (BDP) or [Snowplow Community Edition](/docs/get-started/snowplow-community-edition/index.md).

| <h3>Data Pipeline</h3>                                                                                                    |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| :------------------------------------------------------------------------------------------------------------------------ | :---: | :------------------------------------------------------------------------: |
| [35+ trackers and webhooks](/docs/sources/index.md)                                                                       |   ✅   |                                     ✅                                      |
| First party tracking                                                                                                      |   ✅   |                                     ✅                                      |
| Anonymous data collection                                                                                                 |   ✅   |                                     ✅                                      |
| [Cookie Extension service](/docs/events/cookie-extension/index.md)                                                        |   ✅   |                                     ✅                                      |
| High availability and auto-scaling                                                                                        |   ✅   |                                     ❌                                      |
| [Enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)                                                  |   ✅   |                                     ✅                                      |
| [Failed events](/docs/fundamentals/failed-events/index.md)                                                                |   ✅   |                                     ✅                                      |
| [Data quality monitoring](/docs/data-product-studio/data-quality/failed-events/monitoring-failed-events/index.md)         |   ✅   |                                     ❌                                      |
| Single Sign-On                                                                                                            |   ✅   |                                     ❌                                      |
| Pipeline observability                                                                                                    |   ✅   |                               do-it-yourself                               |
| Surge protection                                                                                                          |   ✅   |                               do-it-yourself                               |
| **Warehouse / lake destinations**                                                                                         |       |
| • Snowflake                                                                                                               |   ✅   |                                     ✅                                      |
| • Redshift                                                                                                                |   ✅   |                                     ✅                                      |
| • BigQuery                                                                                                                |   ✅   |                                     ✅                                      |
| • Databricks                                                                                                              |   ✅   |                                     ✅                                      |
| • Synapse Analytics                                                                                                       |   ✅   |                                     ✅                                      |
| • Elasticsearch                                                                                                           |   ✅   |                                     ✅                                      |
| • S3                                                                                                                      |   ✅   |                                     ✅                                      |
| • Google Cloud Storage                                                                                                    |   ✅   |                                     ✅                                      |
| • Azure Data Lake Storage / OneLake                                                                                       |   ✅   |                                     ✅                                      |
| **Real-time streams**                                                                                                     |       |
| • Kinesis                                                                                                                 |   ✅   |                                     ✅                                      |
| • PubSub                                                                                                                  |   ✅   |                                     ✅                                      |
| • Kafka / Azure Event Hubs / Confluent Cloud                                                                              |   ✅   |                                     ✅                                      |
| <h3>Data Product Studio</h3>                                                                                              |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Advanced enrichments (PII, IP anonymization, JS, API, SQL enrichments)                                                    |   ✅   |                              ✅ (no UI or API)                              |
| [Data structures tooling and API](/docs/data-product-studio/data-structures/manage/index.md)                              |   ✅   |                                     ❌                                      |
| [Data products](/docs/data-product-studio/data-products/index.md)                                                         |   ✅   |                                     ❌                                      |
| [Data modeling management tooling](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/index.md)            |   ✅   |                                     ❌                                      |
| Jobs monitoring dashboard                                                                                                 |   ✅   |                                     ❌                                      |
| Failed events alerting                                                                                                    |   ✅   |                                     ❌                                      |
| Failed events in the warehouse                                                                                            |   ✅   |                                     ❌                                      |
| QA pipeline                                                                                                               |   ✅   |                               do-it-yourself                               |
| Fine-grained user permissions using access control lists                                                                  |   ✅   |                                     ❌                                      |
| API key access                                                                                                            |   ✅   |                                     ❌                                      |
| <h3>[Data Model Packs](/docs/modeling-your-data/visualization/index.md)</h3>                                              |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| **Digital Analytics**                                                                                                     |       |                                                                            |
| Funnel builder                                                                                                            |   ✅   |                                     ❌                                      |
| User and Marketing Analytics                                                                                              |   ✅   |                                     ❌                                      |
| Marketing Attribution                                                                                                     |   ✅   |                                     ❌                                      |
| Video and Media                                                                                                           |   ✅   |                                     ❌                                      |
| [Unified Digital, Attribution, Media Player, Ecommerce, Normalize, Utils data models](/docs/modeling-your-data/index.md)  |   ✅   |                                     ❌                                      |
| **Ecommerce Analytics**                                                                                                   |       |                                                                            |
| Ecommerce Analytics                                                                                                       |   ✅   |                                     ❌                                      |
| [Ecommerce data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) |   ✅   |                                     ❌                                      |
| <h3>Extensions</h3>                                                                                                       |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Reverse ETL, powered by Census                                                                                            |   ✅   |                                     ❌                                      |
| Audience Hub, powered by Census                                                                                           |   ✅   |                                     ❌                                      |
| <h3>Performance and Resilience</h3>                                                                                       |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Outage Protection                                                                                                         |   ✅   |                                     ❌                                      |
| Global Availability                                                                                                       |   ✅   |                                     ❌                                      |
| <h3>Infrastructure and Security</h3>                                                                                      |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| **High**                                                                                                                  |       |                                                                            |
| HTTP access controls                                                                                                      |   ✅   |                                     ❌                                      |
| VPC peering                                                                                                               |   ✅   |                                     ❌                                      |
| SSH access control                                                                                                        |   ✅   |                                     ❌                                      |
| CVE reporting                                                                                                             |   ✅   |                                     ❌                                      |
| Static collector IPs                                                                                                      |   ✅   |                                     ❌                                      |
| **Advanced**                                                                                                              |       |                                                                            |
| Custom VPC integration                                                                                                    |   ✅   |                                     ❌                                      |
| Custom IAM policy                                                                                                         |   ✅   |                                     ❌                                      |
| Custom security agents                                                                                                    |   ✅   |                                     ❌                                      |
| <h3>SLAs</h3>                                                                                                             |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Collector uptime SLA                                                                                                      |   ✅   |                                     ❌                                      |
| Warehouse loading latency SLA                                                                                             |   ✅   |                                     ❌                                      |
