---
title: "Define interventions"
sidebar_position: 40
description: "Configure and deploy interventions to trigger real-time actions based on user attribute changes in Snowplow Signals."
---

[Interventions](/docs/signals/concepts/index.md) are opportunities to take actions to improve user outcomes.

There are three methods for defining interventions in Signals:
* BDP Console UI
* Signals Python SDK
* [Signals API](/docs/signals/connection/index.md#signals-api)

## Snowplow BDP Console

To create an intervention, go to **Signals** > **Interventions** in Snowplow Console and follow the instructions.

The first step is to specify:
* A unique name
* An optional description
* The email address of the primary owner or maintainer

<!-- TODO image create intervention -->

## Signals Python SDK

Use the [Signals Python SDK](https://github.com/snowplow-incubator/snowplow-signals-sdk) to define interventions via code. Check out the [SDK configuration section](/docs/signals/define-interventions/using-python-sdk/index.md) for instructions.
