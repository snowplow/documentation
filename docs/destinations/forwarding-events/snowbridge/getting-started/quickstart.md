---
title: "Quickstart"
date: "2022-10-20"
sidebar_position: 100
---

# Quickstart

The fastest way to get started and experiment with Snowbridge is to run it via the command line:

1. Download the pre-compiled ZIP from the [releases](https://github.com/snowplow/snowbridge/releases/)
2. Unzip and run the binary with eg. `echo "hello world" | ./snowbridge`

The defaults for the app are stdin source, no transformations, and stdout target - so this should print the message 'hello world' along with some logging data to the console.

Next, the app can be configured using HCL - simply create a configuration file, and provide the path to it using the `SNOWBRIDGE_CONFIG_FILE` environment variable. 

You can find a guide to configuration in the [configuration section](/docs/destinations/forwarding-events/snowbridge/configuration/index.md), and a guide to deployment in the [deployment page](./distribution-and-deployment.md).


```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Snowbridge" since="1.0.0" idSetting="user_provided_id" disableSetting="disable_telemetry" />
```