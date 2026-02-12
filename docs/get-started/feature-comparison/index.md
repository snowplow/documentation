---
title: "Product features in Snowplow CDI and Self-Hosted"
sidebar_position: 2
hide_table_of_contents: true
sidebar_label: "Feature comparison"
description: "Detailed comparison of features available in Snowplow CDI and Self-Hosted deployments."
keywords: ["feature comparison", "CDI features", "Self-Hosted features", "product capabilities"]
---

Here is a detailed list of product features, showing which are available as part of Snowplow [Customer Data Infrastructure](/docs/get-started/index.md#customer-data-infrastructure) (CDI) or [Snowplow Self-Hosted](/docs/get-started/index.md#self-hosted).

Check out the [Snowplow Product Directory](https://snowplow.io/snowplow-product-description) to learn more about which features are available for CDI Cloud or CDI Private Managed Cloud deployments.

| <h3>Data Pipeline</h3>                                                                                                    |  CDI  |   Self-Hosted    |
| :------------------------------------------------------------------------------------------------------------------------ | :---: | :--------------: |
| [25+ trackers and webhooks](/docs/sources/index.md)                                                                       |   ✅   |        ✅         |
| First party tracking                                                                                                      |   ✅   |        ✅         |
| Anonymous data collection                                                                                                 |   ✅   |        ✅         |
| [Cookie Lifetime Extension service](/docs/sources/web-trackers/cookies-and-local-storage/cookie-extension/index.md)       |   ✅   |        ✅         |
| High availability and auto-scaling                                                                                        |   ✅   |        ❌         |
| [Enrichments](/docs/pipeline/enrichments/available-enrichments/index.md)                                                  |   ✅   |        ✅         |
| [Failed events](/docs/fundamentals/failed-events/index.md)                                                                |   ✅   |        ✅         |
| [Data quality monitoring](/docs/monitoring/index.md)                                                                      |   ✅   |        ❌         |
| Single Sign-On                                                                                                            |   ✅   |        ❌         |
| Pipeline observability                                                                                                    |   ✅   |  do-it-yourself  |
| Surge protection                                                                                                          |   ✅   |  do-it-yourself  |
| **Warehouse / lake destinations**                                                                                         |       |
| • Snowflake                                                                                                               |   ✅   |        ✅         |
| • Redshift                                                                                                                |   ✅   |        ✅         |
| • BigQuery                                                                                                                |   ✅   |        ✅         |
| • Databricks                                                                                                              |   ✅   |        ✅         |
| • Synapse Analytics                                                                                                       |   ✅   |        ✅         |
| • Elasticsearch                                                                                                           |   ✅   |        ✅         |
| • S3                                                                                                                      |   ✅   |        ✅         |
| • Google Cloud Storage                                                                                                    |   ✅   |        ✅         |
| • Azure Data Lake Storage / OneLake                                                                                       |   ✅   |        ✅         |
| **Real-time streams**                                                                                                     |       |
| • Kinesis                                                                                                                 |   ✅   |        ✅         |
| • PubSub                                                                                                                  |   ✅   |        ✅         |
| • Kafka / Azure Event Hubs / Confluent Cloud                                                                              |   ✅   |        ✅         |
| <h3>Event Studio</h3>                                                                                              |  CDI  |   Self-Hosted    |
| Advanced enrichments (PII, IP anonymization, JS, API, SQL enrichments)                                                    |   ✅   | ✅ (no UI or API) |
| [Data structures tooling and API](/docs/event-studio/data-structures/manage/index.md)                              |   ✅   |        ❌         |
| [Tracking plans](/docs/event-studio/tracking-plans/index.md)                                                         |   ✅   |        ❌         |
| [Data modeling management tooling](/docs/modeling-your-data/running-data-models-via-console/dbt/index.md)                 |   ✅   |        ❌         |
| Jobs monitoring dashboard                                                                                                 |   ✅   |        ❌         |
| Failed events alerting                                                                                                    |   ✅   |        ❌         |
| Failed events in the warehouse                                                                                            |   ✅   |        ✅         |
| QA pipeline                                                                                                               |   ✅   |  do-it-yourself  |
| Fine-grained user permissions using access control lists                                                                  |   ✅   |        ❌         |
| API key access                                                                                                            |   ✅   |        ❌         |
| <h3>[Data Model Packs](/docs/modeling-your-data/visualization/index.md)</h3>                                              |  CDI  |   Self-Hosted    |
| **Digital Analytics**                                                                                                     |       |                  |
| Funnel builder                                                                                                            |   ✅   |        ❌         |
| User and Marketing Analytics                                                                                              |   ✅   |        ❌         |
| Marketing Attribution                                                                                                     |   ✅   |        ❌         |
| Video and Media                                                                                                           |   ✅   |        ❌         |
| [Unified Digital, Attribution, Media Player, Ecommerce, Normalize, Utils data models](/docs/modeling-your-data/index.md)  |   ✅   |        ❌         |
| **Ecommerce Analytics**                                                                                                   |       |                  |
| Ecommerce Analytics                                                                                                       |   ✅   |        ❌         |
| [Ecommerce data model](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-ecommerce-data-model/index.md) |   ✅   |        ❌         |
| <h3>Signals</h3>                                                                                                          |  CDI  |   Self-Hosted    |
| [Real-time personalization engine](/docs/signals/index.md)                                                                |   ✅   |        ❌         |
| Profiles Store                                                                                                            |   ✅   |        ❌         |
| Interventions                                                                                                             |   ✅   |        ❌         |
| <h3>Extensions</h3>                                                                                                       |  CDI  |   Self-Hosted    |
| Reverse ETL, powered by Census                                                                                            |   ✅   |        ❌         |
| Audience Hub, powered by Census                                                                                           |   ✅   |        ❌         |
| <h3>Performance and Resilience</h3>                                                                                       |  CDI  |   Self-Hosted    |
| Outage Protection                                                                                                         |   ✅   |        ❌         |
| Global Availability                                                                                                       |   ✅   |        ❌         |
| <h3>Infrastructure and Security</h3>                                                                                      |  CDI  |   Self-Hosted    |
| **High**                                                                                                                  |       |                  |
| HTTP access controls                                                                                                      |   ✅   |        ❌         |
| VPC peering                                                                                                               |   ✅   |        ❌         |
| SSH access control                                                                                                        |   ✅   |        ❌         |
| CVE reporting                                                                                                             |   ✅   |        ❌         |
| Static collector IPs                                                                                                      |   ✅   |        ❌         |
| **Advanced**                                                                                                              |       |                  |
| Custom VPC integration                                                                                                    |   ✅   |        ❌         |
| Custom IAM policy                                                                                                         |   ✅   |        ❌         |
| Custom security agents                                                                                                    |   ✅   |        ❌         |
| <h3>SLAs</h3>                                                                                                             |  CDI  |   Self-Hosted    |
| Collector uptime SLA                                                                                                      |   ✅   |        ❌         |
| Warehouse loading latency SLA                                                                                             |   ✅   |        ❌         |
