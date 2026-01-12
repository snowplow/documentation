---
title: "Custom JavaScript enrichment"
sidebar_position: 11
sidebar_label: Custom JavaScript
description: "Write custom JavaScript code to transform and enrich events with flexible data manipulation logic."
keywords: ["JavaScript enrichment", "custom enrichment", "event transformation"]
---

With this enrichment, you can write a JavaScript function to be executed for each event. Use this enrichment to apply your own business logic to your events, including:
* [Adding extra data](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/writing/index.md#adding-extra-entities-to-the-event) to the event in the form of [entities](/docs/fundamentals/entities/index.md)
* [Modifying event fields](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/writing/index.md#modifying-event-fields-directly) directly
* [Discarding the event](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/writing/index.md#discarding-the-event) so that it goes to [failed events](/docs/fundamentals/failed-events/index.md) rather than your data destination

## Configuration

- [schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-1)
- [example](https://github.com/snowplow/enrich/blob/master/config/enrichments/javascript_script_enrichment.json)

:::note base64 encoding

Notice that in the configuration file you will need to provide the JavaScript code of your enrichment encoded in base64.

:::

## Output

This enrichment is the only one that can both update fields of the atomic event in-place or/and add derived contexts to the enriched event.
