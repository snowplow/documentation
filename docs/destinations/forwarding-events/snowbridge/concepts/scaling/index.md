---
title: "Scaling
date: "2023-02-27"
sidebar_position: 150
---

# Scaling

## Horizontal scaling

Snowbridge is built to suit a horizontal scaling model, and you can safely deploy multiple instances of Snowbridge to consume the same input out-of-the-box (the kinesis source requires Dynamo DB tables to be created for this purpose). No addditional configuration or setup is required for the app to smoothly run across multiple instance/environment, compared to a single instance/environment.

Within each instance/environment, concurrency may be managed via the `concurrent_writes` setting - which provides a degree of control over vertical scaling.

Configuration of horizontal scaling will depend on the implementation, and infrastructure the app runs on. Use cases and infrastructure types have an impact on performance behaviour.

## Target scaling

Snowbridge will attempt to send data to the target as fast as resources will allow, and so we recommend that you set up the target to scale sufficiently with the expected volume and throughput. Note that in case of failure, Snowbridge will enter an exponential retry loop, staring with a 1s delay between retries, and increasing that delay for 5 retries.

If a backlog of data builds up due to some failure - for example target downtime - then it is advisable to overprovision the target until the backlog is processed. This would only need to last until latency has fallen back to normal rates.
