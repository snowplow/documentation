---
title: "Product features"
sidebar_position: 2
hide_table_of_contents: true
sidebar_label: "Feature comparison"
---

Below you can find a detailed list of product features, including which are available as part of the Snowplow Behavioral Data Platform (BDP) and which are available with the [Snowplow Community Edition](/docs/get-started/snowplow-community-edition/index.md).

| <h3>Data Pipeline</h3>                                                                                                    |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| :------------------------------------------------------------------------------------------------------------------------ | :---: | :------------------------------------------------------------------------: |
| [35+ trackers & webhooks](/docs/sources/index.md)                                                                         |   ✅   |                                     ✅                                      |
| 1st party tracking                                                                                                        |   ✅   |                                     ✅                                      |
| [Anonymous data collection](/docs/resources/recipes-tutorials/recipe-anonymous-tracking/index.md)                         |   ✅   |                                     ✅                                      |
| [ID service](/docs/sources/trackers/javascript-trackers/web-tracker/browsers/index.md#what-is-an-id-service)              |   ✅   |                                     ✅                                      |
| High availability & auto-scaling                                                                                          |   ✅   |                                     ❌                                      |
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
| • GCS                                                                                                                     |   ✅   |                                     ✅                                      |
| • ADLS / OneLake                                                                                                          |   ✅   |                                     ✅                                      |
| **Real-time streams**                                                                                                     |       |
| • Kinesis                                                                                                                 |   ✅   |                                     ✅                                      |
| • Pubsub                                                                                                                  |   ✅   |                                     ✅                                      |
| • Kafka / Azure Event Hubs / Confluent Cloud                                                                              |   ✅   |                                     ✅                                      |
| <h3>Data Product Studio</h3>                                                                                              |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Advanced enrichments (PII, IP anonymisation, JS, API, SQL enrichments)                                                    |   ✅   |                              ✅ (no UI or API)                              |
| [Data structures tooling & API](/docs/data-product-studio/data-structures/manage/ui/index.md)                             |   ✅   |                                     ❌                                      |
| [Data Products](/docs/data-product-studio/data-products/index.md)                                                         |   ✅   |                                     ❌                                      |
| [Data modeling management tooling](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/dbt/index.md)            |   ✅   |                                     ❌                                      |
| Jobs monitoring dashboard                                                                                                 |   ✅   |                                     ❌                                      |
| Failed events alerting                                                                                                    |   ✅   |                                     ❌                                      |
| Failed events recoveries                                                                                                  |   ✅   |                                     ❌                                      |
| QA pipeline                                                                                                               |   ✅   |                               do-it-yourself                               |
| Fine grained user permissions (ACLs)                                                                                      |   ✅   |                                     ❌                                      |
| API key access                                                                                                            |   ✅   |                                     ❌                                      |
| <h3>[Data Model Packs](/docs/modeling-your-data/visualization/index.md)</h3>                                                                     |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| **Digital Analytics**                                                                                                     |       |                                                                            |
| Funnel builder                                                                                                            |   ✅   |                                     ❌                                      |
| User & Marketing Analytics                                                                                                |   ✅   |                                     ❌                                      |
| Marketing Attribution                                                                                                     |   ✅   |                                     ❌                                      |
| Video & Media                                                                                                             |   ✅   |                                     ❌                                      |
| [Unified, Utils, Attribution, Media, Normalize data models](/docs/modeling-your-data/index.md)                            |   ✅   |                                     ❌                                      |
| **Ecommerce Analytics**                                                                                                   |       |                                                                            |
| Ecommerce Analytics                                                                                                       |   ✅   |                                     ❌                                      |
| [Ecommerce data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) |   ✅   |                                     ❌                                      |
| <h3>Performance & Resilience</h3>                                                                                         |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
| Outage Protection                                                                                                         |   ✅   |                                     ❌                                      |
| Global Availability                                                                                                       |   ✅   |                                     ❌                                      |
| <h3>Infrastructure & Security</h3>                                                                                        |  BDP  | [Community Edition](/docs/get-started/snowplow-community-edition/index.md) |
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
