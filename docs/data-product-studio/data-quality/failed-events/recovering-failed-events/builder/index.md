---
title: "Using the Console to request data recovery"
sidebar_label: "Using the Console"
sidebar_position: 0
sidebar_custom_props:
  offerings:
    - cdi
---

You can use Snowplow Console to [submit a data recovery request](https://console.snowplowanalytics.com/recovery) to our Support team.

:::caution

Instead of relying on this process, we strongly recommend you to [set up loading failed events into a separate table in your warehouse or lake](/docs/data-product-studio/data-quality/failed-events/exploring-failed-events/index.md).

This way, you can explore failed events much easier. You can also fix them using SQL and merge the results with your good events.

:::


To make a data recovery request, you will need to specify the problem that needs fixing, e.g.:
* The name of an attribute is wrong (e.g. there is a typo)
* An attribute is missing from some events
* The version of an entity is wrong
* There was a loading or a Collector error

In addition, provide the time range and notes on the specific problem.
