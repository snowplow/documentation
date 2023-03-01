---
title: "Scaling"
sidebar_position: 150
---

# Scaling

## Horizontal scaling

Snowbridge is built to suit a horizontal scaling model, and you can safely deploy multiple instances of Snowbridge to consume the same input out-of-the-box (the kinesis source requires Dynamo DB tables to be created for this purpose). No addditional configuration or setup is required for the app to smoothly run across multiple instance/environment, compared to a single instance/environment.

How to configure scaling behaviour will depend on the infrastructure you're using, and the use case you have implemented. For example, if you choose to scale based on CPU usage, note that this metric will be affected by the size and shape of the data, by the transformations and filters used, and for script transformations, by the content of the scripts.

We recommend that you instrument your use case, and follow the best practices for the deployment infrastrucutre you're using to find a the scaling configuration which suits your requirements. Note that occasionally releases will improve efficiency, which in the past has had a large impact on metrics which can be used for scaling. So, it is advisable to monitor those metrics after any version update or transformation configuration change, to ensure that scaling behaves as expected.

Additionally within each instance/environment, concurrency may be managed via the `concurrent_writes` setting - which provides a degree of control over throughput and resource usage. Snowbridge should consume as much data as possible, as fast as possible - a backlog of data or spike in traffic should cause the app's CPU usage to increase significantly. If spikes/backlogs do not induce this behaviour, and there are no target retries or failures (see below), then the `concurrent_writes` can be increased to induce this behaviour.

## Concurrency

Snowbridge is a Go application, which makes use of [goroutines](https://golangdocs.com/goroutines-in-golang). You can think of goroutines as lightweight threads. The source’s `concurrent_writes` setting controls how many goroutines may be processing data at once, in a given instance of the app (others may exist separately, under the hood for non-data processing purposes).

You can determine the total maximum concurrency for the entire application by multiplying `concurrent_writes` by the number of horizontal instances of the app. For example, if Snowbridge is deployed via kubernetes pods, and there are 4 active pods with `concurrent_writes` set to 150, then at any given time there will be up to 600 concurrent goroutines that can process and send data.

## Target scaling

Snowbridge will attempt to send data to the target as fast as resources will allow, and so we recommend that you set up the target to scale sufficiently with the expected volume and throughput. Note that in case of failure, Snowbridge will enter an exponential retry loop, staring with a 1s delay between retries, and increasing that delay for 5 retries.

If a backlog of data builds up due to some failure — for example target downtime — then we advise to overprovision the target until the backlog is processed. That’s only required until latency falls back to normal rates.
