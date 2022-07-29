---
title: "Indicative"
date: "2020-02-26"
sidebar_position: 0
---

Indicative is a specialist customer and product analytics tool. You can setup Snowplow to stream your event data directly into Indicative for analysis.

[Snowplow Indicative Relay](https://github.com/snowplow-incubator/snowplow-indicative-relay) is an AWS Lambda function that reads Snowplow enriched events from a Kinesis Stream and transfers them to Indicative. It processes events in batches, whose size depends on your AWS Lambda configuration.
