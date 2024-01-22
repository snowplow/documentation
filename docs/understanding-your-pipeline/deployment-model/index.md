---
title: "Deployment model"
sidebar_position: 0.5
description: "Details on where and how Snowplow is deployed"
---

## Snowplow BDP Enterprise

Snowplow BDP Enterprise is deployed using a “private SaaS” or “Bring Your Own Cloud (BYOC)” deployment model. This means the data pipeline is hosted and run in your own cloud environment, using your data warehouse or lake. (These comprise the **data plane**.) The ongoing pipeline maintenance, such as upgrades and security patches, are still managed by Snowplow.

The **control plane**, which includes a UI and an API for [defining your data](/docs/understanding-tracking-design/index.md) and managing your infrastructure, is hosted by Snowplow.

|   | Hosted by Snowplow | Hosted by you |
|:--|:------------------:|:-------------:|
| **Control plane** | | |
| Management Console | ✅ | |
| API endpoints | ✅ | |
| **Data plane** | | |
| Pipeline infrastructure (AWS / Azure / GCP) | | ✅ |
| Data destination (warehouse / lake) | | ✅ |

## Snowplow BDP Cloud

BDP Cloud differs from BDP Enterprise above in that the data pipeline is deployed in Snowplow’s cloud account and entirely managed by Snowplow.

|   | Hosted by Snowplow | Hosted by you |
|:--|:------------------:|:-------------:|
| **Control plane** | | |
| Management Console | ✅ | |
| API endpoints | ✅ | |
| **Data plane** | | |
| Pipeline infrastructure | ✅ | |
| Data destination (warehouse / lake) | | ✅ |

## Snowplow Community Edition

With Snowplow Community Edition, everything is deployed and hosted by you. Note that the **control plane** functionality from above is not availble in Community Edition.

|   | Hosted by Snowplow | Hosted by you |
|:--|:------------------:|:-------------:|
| **Control plane** | | |
| Management Console | N/A | N/A |
| API endpoints | N/A | N/A |
| **Data plane** | | |
| Pipeline infrastructure (AWS / Azure / GCP) | | ✅ |
| Data destination (warehouse / lake) | | ✅ |
