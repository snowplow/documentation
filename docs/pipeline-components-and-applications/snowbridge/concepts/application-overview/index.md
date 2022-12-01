---
title: "Application overview"
date: "2022-10-20"
sidebar_position: 100
---

# Application overview

## Architecture

Snowbridge’s architecture is fairly simple: it receives data from one streaming technology (via [Sources](../sources/index.md)), optionally runs filtering and transformation logic on them (message-by-message, via [Transfomations](../transformations/index.md)), and sends the data to another streaming technology or destination (via [Targets](../targets/index.md)). If it is not possible to process or retry the data [as per the failure model](../failure-model/index.md), it outputs a message to another destination (via [Failure Targets](../failure-model/index.md#failure-targets)).

![draft_architecture](./images/stream-replicator-architecture.jpg)

## Operational details

Data is processed on an at-least-once basis, and there is no guarantee of order of messages. The application is designed to minimise duplicates as much as possible, but there isn’t a guarantee of avoiding them — for example if there’s a failure, it is possible for messages to be delivered without a successful response, and duplicates can occur.

Snowbridge is built to suit a horizontal scaling model, and you can safely deploy multiple instances of Snowbridge to consume the same input out-of-the-box (the kinesis source requires Dynamo DB tables to be created for this purpose). Within each instance, concurrency may be managed via the `concurrent_writes` setting.