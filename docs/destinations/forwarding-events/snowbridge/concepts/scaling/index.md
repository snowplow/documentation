---
title: "Scaling"
description: "Scaling strategies and performance optimization for high-volume behavioral event forwarding with Snowbridge."
schema: "TechArticle"
keywords: ["Scaling Concepts", "Performance Scaling", "Load Management", "Capacity Planning", "Scale Strategy", "Throughput Scaling"]
sidebar_position: 150
---

Snowbridge is built to suit a **horizontal scaling** model, and you can safely deploy multiple instances of Snowbridge to consume the same input out-of-the-box. No addditional configuration or setup is required for the app to smoothly run across multiple instances/environments, compared to a single instance/environment.

:::note
If you are using the Kinesis source, you will need to manually create a few DynamoDB tables as described in [the Kinesis source configuration section](/docs/destinations/forwarding-events/snowbridge/configuration/sources/kinesis.md). Snowbridge uses these tables to coordinate multiple instances consuming from the same stream.
:::

How to configure scaling behavior will depend on the infrastructure you’re using, and the use case you have implemented. For example, if you choose to scale based on CPU usage, note that this metric will be affected by the size and shape of the data, by the transformations and filters used, and for script transformations, by the content of the scripts.

:::tip
Occasionally, new releases of Snowbridge will improve its efficiency. In the past, this has had a large impact on metrics typically used for scaling. To ensure that scaling behaves as expected, we recommend monitoring your metrics after you upgrade Snowbridge or change the transformation configuration.
:::

In addition to configuring the number of Snowbridge instances, you can manage concurrency via the `concurrent_writes` setting (explained in the [next section](#concurrency)). This setting provides a degree of control over throughput and resource usage. Snowbridge should consume as much data as possible, as fast as possible — a backlog of data or spike in traffic should cause the app’s CPU usage to increase significantly. If spikes/backlogs do not induce this behavior, and there are no target retries or failures (see below), then you can increase the `concurrent_writes`.

## Concurrency

Snowbridge is a Go application, which makes use of [goroutines](https://golangdocs.com/goroutines-in-golang). You can think of goroutines as lightweight threads. The source’s `concurrent_writes` setting controls how many goroutines may be processing data at once, in a given instance of the app (others may exist separately, under the hood for non-data processing purposes).

You can determine the total maximum concurrency for the entire application by multiplying `concurrent_writes` by the number of horizontal instances of the app. For example, if Snowbridge is deployed via kubernetes pods, and there are 4 active pods with `concurrent_writes` set to 150, then at any given time there will be up to 600 concurrent goroutines that can process and send data.

## Target scaling

Snowbridge will attempt to send data to the target as fast as resources will allow, so we recommend that you set up the target to scale sufficiently with the expected volume and throughput. Note that in case of failure, Snowbridge will retry sending the messages with an exponential backoff, staring with a 1s delay between retries, and doubling that delay for 5 retries.

If a backlog of data builds up due to some failure — for example target downtime — then we advise to overprovision the target until the backlog is processed. That’s only required until latency falls back to normal rates.
