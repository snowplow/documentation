---
title: "Introduction to Snowplow Identities"
sidebar_label: "Identities"
date: "2025-02-25"
sidebar_position: 6
description: "Snowplow Identities provides real-time identity resolution, stitching user identifiers together to create unified profiles."
keywords: ["identities", "identity resolution", "identity stitching", "snowplow_id"]
---

Snowplow Identities provides real-time identity resolution. It stitches together user identifiers to create a unified view of each user, and adds a unified `snowplow_id` to each event.

Identities allows you to:
* Attribute anonymous events to authenticated users, both within the same session and across sessions and devices
* Connect behavior across web, iOS, and Android apps, when users authenticate with the same credentials on different platforms
* Build on [cross-navigation tracking](/docs/events/cross-navigation/index.md) to identify users across domains
* Distinguish between separate users sharing the same device

Use the provided Identities data models to build identifier mapping tables to help with key use cases such as marketing attribution, conversion funnel analysis, multi-touchpoint reporting, audience targeting, feature engineering, and personalization.

## How Identities fits into the Snowplow pipeline

Identity resolution happens in real time as part of the [event enrichment process](/docs/fundamentals/index.md).

After all other configured enrichments run, the pipeline sends user identifiers in the event payload to the Identities service. It either links the identifiers to an existing profile, or creates a new one. Enrich then adds the resolved `snowplow_id` to the event in an identity entity.
<!-- TODO: should we link to the identity entity? -->

Some incoming identifiers will reveal that two previously separate profiles actually belong to the same user. Identities will merge the two profiles in its graph database, and emit a merge event directly into your enriched event stream.
<!-- TODO: does graph database denote -->
<!-- TODO: link to what merge events are? -->

Your Identities infrastructure is deployed into the same cloud as your pipeline. The core components are:
* **Identities API**: used for identity operations
* **Managed Postgres database**: persists the identity graph and performs graph operations. Snowplow uses [Aurora](https://aws.amazon.com/rds/aurora/) on AWS and [AlloyDB](https://cloud.google.com/products/alloydb) on GCP.

## Using Identities

Deploy and configure Identities using [Snowplow Console](https://console.snowplowanalytics.com).

Steps for using Identities:
1. Decide which identifiers to use
2. Configure Identities
3. Use your new identity data

### 1. Decide which identifiers to use

Your first step is to decide which user identifiers are most relevant to your business use cases.

Identities supports identity stitching using any standard Snowplow user identifiers, such as `user_id` or `domain_userid`, as well as custom identifiers that you define. Identities can be derived from any field in the event payload, whether event or entity.

Read more about identifiers on the [concepts](/docs/identities/concepts/index.md) page.

### 2. Configure Identities

Use [Console](https://console.snowplowanalytics.com) to configure Identities with the identifiers you've chosen.
<!-- TODO: do we have any info about priorities? -->

Set optional filters to specify which events will be sent to Identities for resolution. Events that are filtered out will not have an [identity entity](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/identity/jsonschema/1-0-0) and corresponding `snowplowId` attached to them.

### 3. Use your new identity data

Set up the Identities dbt package to create your new identity tables. The existing Snowplow dbt models support Identities. Use your identity data to gain a better understanding of your users.
<!-- TODO: link to dbt models page -->

Identities is compatible with Snowplow [Signals](/docs/signals/index.md) for real-time personalization based on unified user profiles.
