---
title: "Run Snowplow Micro through Console"
sidebar_label: "Run via Console"
sidebar_position: 1
description: "Run Snowplow Micro through Snowplow Console to validate and debug tracking implementations. Send events to the collector endpoint and view results through the dashboard."
keywords: ["micro in console", "run micro", "test events", "micro dashboard", "micro ui"]
---

Snowplow Micro is fully integrated in Snowplow Console:
* You can deploy one or more Micro-based **development environments**
* Each environment is automatically connected to your development [data structures](/docs/event-studio/data-structures/index.md)
* You can manage [enrichments](/docs/pipeline/enrichments/available-enrichments/index.md) the same way as for regular pipelines, and copy enrichment configuration from a development environment to a pipeline

:::tip

Using a development environment is a great way to test your changes before applying them to a real pipeline.

:::

## Setup

To create a development environment, navigate to **Settings > Workspaces**, select your workspace, scroll to the **Development environments** section and click **Create environment**.

:::note[Permissions]

You will need _Edit environments_ permissions to do this.

:::

You can add multiple environments, or create and delete them as you see necessary. For example, it might be convenient to create separate environments for different teams testing different code in parallel.

Under the hood, an instance of Snowplow Micro will be deployed in your cloud account along with a database to store events. (This account is managed by you, in the case of Private Managed Cloud, or by Snowplow otherwise.)

## Usage

Once your development environment is ready, you can access it from the **Pipelines** section in the Console sidebar.

Select your environment and you will see the Collector endpoint URL you can use in your tracking code to send events to this environment.

Events will be stored for a (rolling) 7 day period.

To view events in the [Micro dashboard](/docs/testing/snowplow-micro/ui/index.md), select your environment and then click **Open dashboard**.

:::warning[Production data]

Do not send production data to development environments. Anyone with the _View environments_ permission can access the dashboard and see the events. Also, development environments are not configured to withstand high volumes of events.

:::

To enable or disable enrichments and edit their configurations, select the **Enrichments** tab. The process is the same as for regular pipelines. We highly recommend testing enrichments in a development environment before deploying them to production.

## Validate event specifications

Development environments validate incoming events against every published version of your [event specifications](/docs/event-studio/tracking-plans/event-specifications/index.md), following the same rules as [event specification validation](/docs/event-studio/tracking-plans/event-specification-validation/index.md) in a pipeline. Unlike pipelines, they also validate against the latest draft of each specification: you don't need to publish the tracking plan or its event specifications to test your tracking against them.

Edit the specification in Console, send a test event, and inspect the result in the [Micro dashboard](/docs/testing/snowplow-micro/ui/index.md): events that fail validation carry an `event_specification_validation` entity describing each error. The environment picks up specification changes automatically within a few minutes.

Events that arrive without an `event_specification` entity are matched by [inference](/docs/event-studio/tracking-plans/event-specification-inference/index.md) instead, against both published specifications and the latest drafts.
