---
title: "Filtering bot events"
sidebar_position: 3.05
sidebar_label: "Filtering bot events"
description: "Detect and filter out bot traffic to keep your analytics accurate and your data warehouse or lake clean."
keywords: ["bot filtering", "bot detection", "spam events", "event filtering", "IAB", "YAUAA"]
date: "2026-03-24"
---

Bot traffic — crawlers, scrapers, and automated agents — can make up a significant share of the events flowing through your pipeline.

If left unfiltered, these events inflate page view counts, distort session metrics, and degrade the quality of any downstream analysis or machine learning model that relies on your data.

Filtering bot events helps you maintain accurate analytics and can reduce unnecessary storage and compute costs in your data warehouse.

## Detect bot traffic

Snowplow can identify bot traffic both client-side, via a [tracker plugin](/docs/sources/web-trackers/tracking-events/bot-detection/index.md), and server-side, via [enrichments](/docs/pipeline/enrichments/index.md).

Each source attaches information to the event that you can use for filtering. For convenience, the [bot detection enrichment](#bot-detection-enrichment) consolidates all sources into a single `bot` field.

:::note Anonymous tracking

Events tracked with [server-side anonymization](/docs/events/anonymous-tracking/index.md#server-side-anonymization) lack IP address data. As such, bot detection based on IP addresses will not be effective for these events. This includes the ASN lookup enrichment and the IP-related check in the IAB enrichment.

:::

### Client-side bot detection plugin

The [bot detection plugin](/docs/sources/web-trackers/tracking-events/bot-detection/index.md) for the web tracker runs in the browser to detect automation frameworks, such as Selenium, PhantomJS, or headless Chrome, using behavioral signals. It attaches a `client_side_bot_detection` [entity](/docs/fundamentals/entities/index.md) with a `bot` boolean and a `kind` field identifying the bot type.

### IAB enrichment

The [IAB enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) checks the event's IP address and user agent string against the [IAB/ABC International Spiders and Bots List](https://iabtechlab.com/software/iababc-international-spiders-and-bots-list/), an industry-standard database maintained by the Interactive Advertising Bureau. It adds an [entity](/docs/fundamentals/entities/index.md) with a `spiderOrRobot` boolean that indicates whether the event came from a known bot.

:::tip Custom rules

When configuring this enrichment, you can also [add custom user agent string patterns](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md#custom-user-agent-lists) you'd like to classify as bots or not bots.

:::

### YAUAA enrichment

The [YAUAA enrichment](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md) performs advanced user agent parsing using the [YAUAA library](https://yauaa.basjes.nl/). Among many other fields, it classifies the device and agent type — values such as `"Robot"`, `"Robot Mobile"`, or `"Robot Imitator"` in the `deviceClass` or `agentClass` fields indicate bot traffic.

### ASN lookup enrichment

The [ASN lookup enrichment](/docs/pipeline/enrichments/available-enrichments/asn-lookup-enrichment/index.md) checks the event's autonomous system number against a configurable list of ASNs associated with bots, cloud providers, or data centers. Many bots originate from well-known hosting ASNs, and community-maintained lists track these. When a match is found, the enrichment sets `likelyBot` to `true` on the ASN entity.

:::tip Prerequisites

For this enrichment to work, you also need to enable the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) and configure either its `asn` or `isp` setting, as this is what will generate the initial [ASN entity](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md#asn-data).

:::

### Bot detection enrichment

The [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md) consolidates the outputs of the sources above (including the client-side bot detection plugin and the server-side enrichments) into a single `bot_detection` entity. It uses "any positive = bot" logic: if any enabled source indicates that the event is a bot, the `bot` field is set to `true`, along with a list of which sources contributed to the decision. This gives you a single field to check instead of querying multiple entities separately.

## Filter out bot events

Once you have bot detection in place, there are two main approaches to removing bot events from your analytics.

### Filter events in the warehouse

If you prefer to keep all events in your warehouse or lake and filter at query time or in your data models, use the `bot_detection` entity added by the [bot detection enrichment](/docs/pipeline/enrichments/available-enrichments/bot-detection-enrichment/index.md). For example, in SQL:

```sql
select *
from events
where not contexts_com_snowplowanalytics_snowplow_bot_detection_1[0]:bot::boolean
```

This approach lets you keep the bot events for inspection or debugging if needed.

### Drop events in the pipeline

If you want to prevent bot events from reaching your warehouse or lake entirely, use a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md) to drop them during processing.

The bot detection enrichment runs before the JavaScript enrichment, so you can read its output in your JavaScript code. Use `event.getDerived_contexts()` to access the `bot_detection` entity and drop the event if it is flagged as a bot:

```js
function process(event) {
  const entities = JSON.parse(event.getDerived_contexts());
  if (entities) {
    for (const entity of entities.data) {
      if (entity.schema.startsWith('iglu:com.snowplowanalytics.snowplow/bot_detection/jsonschema/1') &&
          entity.data.bot) {
        event.drop();
      }
    }
  }
}
```

The `event.drop()` method (available since Enrich 5.3.0) prevents the event from being sent to any stream or destination, lowering infrastructure costs.

:::warning Events dropped permanently

There is no way to recover dropped events, so use this with caution.

:::

An alternative is to throw an exception, which sends the event to [failed events](/docs/fundamentals/failed-events/index.md) instead of dropping it entirely:

```js
function process(event) {
  const entities = JSON.parse(event.getDerived_contexts());
  if (entities) {
    for (const entity of entities.data) {
      if (entity.schema.startsWith('iglu:com.snowplowanalytics.snowplow/bot_detection/jsonschema/1') &&
          entity.data.bot) {
        throw "Filtered a bot event";
      }
    }
  }
}
```

:::note Failed events

This creates an "enrichment failure" failed event, which may be tricky to distinguish from genuine failures in your enrichment code.

:::
