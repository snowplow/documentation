---
title: "Sources"
description: "Source system concepts and integration patterns for behavioral event ingestion into Snowbridge."
schema: "TechArticle"
keywords: ["Source Concepts", "Input Sources", "Source Architecture", "Source Design", "Input Strategy", "Source Types"]
date: "2022-10-20"
sidebar_position: 200
---

# Sources

Sources deal with retrieving data from the input stream, and forwarding it for processing — once messages are either filtered or successfully sent, they are then acked (if the source technology supports acking). Otherwise, messages will be retrieved again by the source. Sources also have a setting which controls concurrency for the instance — `concurrent_writes`.

You can find more detail on setting up a source, in the [configuration section](/docs/destinations/forwarding-events/snowbridge/configuration/sources/index.md).