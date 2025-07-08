---
title: "Using the Console to request data recovery"
sidebar_label: "Using the Console"
sidebar_position: 0
sidebar_custom_props:
  offerings:
    - bdp
---

You can use BDP Console to [submit a data recovery request](https://console.snowplowanalytics.com/recovery) to our Support team.

:::caution

Instead of relying on this process, we strongly recommend you to [set up a failed events loader](/docs/data-product-studio/data-quality/failed-events/exploring-failed-events/index.md).

This way, you can explore failed events in your warehouse or lake much easier. You can also fix them using SQL and merge the results with your good events.

:::


You will need to specify the problem that needs fixing, e.g.:
* the name of an attribute is wrong (e.g. there is a typo)
* an attribute is missing from some events
* the version of an entity is wrong
* there was a loading or a Collector error

In addition, provide the time range and notes on the specific problem.
