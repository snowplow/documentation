---
title: "Snowplow Micro test pipeline"
sidebar_label: "Snowplow Micro"
sidebar_position: 2
description: "Snowplow Micro is a lightweight version of the Snowplow pipeline that's great for getting familiar with Snowplow, debugging and testing."
---

```mdx-code-block
import AvailabilityBadges from '@site/src/components/ui/availability-badges';

<AvailabilityBadges available={['cloud', 'pmc', 'selfHosted']} />
```

[Snowplow Micro](https://github.com/snowplow/snowplow-micro) is a lightweight version of the Snowplow pipeline. It's great for:
* Getting familiar with Snowplow
* Debugging and testing, including [automated testing](/docs/testing/snowplow-micro/automated-testing/index.md)

![Snowplow Micro UI](./images/overview.png)

Just like a real Snowplow pipeline, Micro receives, validates and enriches events sent by your [tracking code](/docs/sources/trackers/index.md).

Unlike a real pipeline:
* It does not store the events in a data warehouse or database, although a [UI](/docs/testing/snowplow-micro/ui/index.md) and an [API](/docs/api-reference/snowplow-micro/api/index.md) are available to look at the data
* It's not meant for production traffic

Follow [these instructions](/docs/testing/snowplow-micro/basic-usage/index.md) to get started in minutes.
