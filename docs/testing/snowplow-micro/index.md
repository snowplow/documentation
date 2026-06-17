---
title: "Test and debug tracking with Snowplow Micro"
sidebar_label: "Snowplow Micro"
sidebar_position: 2
description: "Snowplow Micro is a lightweight test pipeline for debugging and automated testing. It receives, validates, and enriches events with a UI and API for inspection."
keywords: ["snowplow micro", "test pipeline", "automated testing", "local testing", "event validation", "local pipeline", "development environment", "console"]
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges
  available={['cloud', 'pmc', 'selfHosted']}
  helpContent="Snowplow Micro is included with all platforms."
/>
```

[Snowplow Micro](https://github.com/snowplow/snowplow-micro) is a lightweight version of the Snowplow pipeline. It's great for:
* Getting familiar with Snowplow
* Debugging and testing, including [automated testing](/docs/testing/snowplow-micro/automated-testing/index.md)

![Snowplow Micro dashboard at localhost:9090/micro/ui showing a bar chart of event volume over time and a table of 81 events. All visible rows show Valid status, with event names including page_ping, ping_event, and pause_event collected from a YouTube example page.](./images/overview.png)

Just like a real Snowplow pipeline, Micro receives, validates and enriches events sent by your [tracking code](/docs/sources/index.md).

:::note

Micro is not designed for production traffic.

:::

To get started in minutes, [deploy Micro through Console](/docs/testing/snowplow-micro/console/index.md) or [run it locally](/docs/testing/snowplow-micro/local/index.md).
