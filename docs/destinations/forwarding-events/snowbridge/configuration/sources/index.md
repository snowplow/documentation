---
title: "Sources"
date: "2022-10-20"
sidebar_position: 100
---

**Stdin source** is the default. We also support Kafka, Kinesis, PubSub, and SQS sources.

Stdin source simply treats stdin as the input. It has one optional configuration to set the concurrency.

## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/sources/stdin-minimal-example.hcl
```

Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/sources/stdin-full-example.hcl
```
