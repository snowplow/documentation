---
title: "Custom JavaScript enrichment"
date: "2020-02-14"
sidebar_position: 10
---

With this enrichment, you can write a JavaScript function to be executed for each event. Use this enrichment to apply your own business logic to your events, including:
* [Adding extra data](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#adding-extra-entities-to-the-event) to the event in the form of [entities](/docs/understanding-tracking-design/understanding-events-entities/index.md)
* [Modifying event fields](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#modifying-event-fields-directly) directly
* [Discarding the event](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#discarding-the-event) so that it goes to [failed events](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md) rather than your data destination

## Configuration

- [schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-0)
- [example](https://github.com/snowplow/enrich/blob/master/config/enrichments/javascript_script_enrichment.json)

:::note base64 encoding

Notice that in the configuration file you will need to provide the JavaScript code of your enrichment encoded in base64.

:::

## Output

This enrichment is the only one that can both update fields of the atomic event in-place or/and add derived contexts to the enriched event.

```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```
