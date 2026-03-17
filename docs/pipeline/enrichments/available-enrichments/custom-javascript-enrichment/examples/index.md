---
title: "JavaScript enrichment code examples"
sidebar_position: 3
description: "Example JavaScript enrichment implementations for common use cases and transformation patterns."
sidebar_label: "Examples"
keywords: ["JavaScript enrichment examples", "enrichment patterns", "code samples", "custom enrichment"]
---

Suppose you want to extend your events with a label that distinguishes traffic from internal and external systems. This is a good use case for [adding an entity](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/writing/index.md#adding-extra-entities-to-the-event).

```js
const internalIPs = new Set([
  "1.2.3.4",
  "2.3.4.5"
]);

function process(event) {
  const ip = event.getUser_ipaddress();
  const traffic_source = internalIPs.has(ip) ? 'internal' : 'external';

  return [{
    schema: "iglu:com.my-company/traffic_source/jsonschema/1-0-0",
    data: { traffic_source }
  }];
}
```

:::note

This example is not copy-paste-able. You will need to define your own schema.

:::

## Filtering out bots

You can use the [IAB enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) to identify bots. However, it does not remove the bot-generated events from your data — it only adds relevant information to the events (in the `derived_contexts` field), e.g.:

```json
{
    "schema": "iglu:com.iab.snowplow/spiders_and_robots/jsonschema/1-0-0",
    "data": {
        "spiderOrRobot": false,
        "category": "BROWSER",
        "reason": "PASSED_ALL",
        "primaryImpact": "NONE"
    }
}
```

If you wish to discard the bot events (sending them to [failed events](/docs/fundamentals/failed-events/index.md)), you can use the JavaScript enrichment:

```js
function process(event) {
  const entities = JSON.parse(event.getDerived_contexts());
  if (entities) {
    for (const entity of entities.data) {
      if (entity.schema.startsWith('iglu:com.iab.snowplow/spiders_and_robots/jsonschema/1') &&
          entity.data.spiderOrRobot) {
        throw "Filtered a spider/bot event";
      }
    }
  }
}
```

:::note

You need to use Enrich 3.8.0+ (or Snowplow Micro 1.7.1+) to be able to access the derived entities via `event.getDerived_contexts()`. In prior versions, this function always returns `null`.

:::

For special cases, you can also dispense with the IAB enrichment and add something simpler:

```js
const botPattern = /.*Googlebot.*/;

function process(event) {
  const useragent = event.getUseragent();

  if (useragent !== null && botPattern.test(useragent)) {
    throw "Filtered event produced by Googlebot";
  }
}
```

## Omitting information based on a condition

Let’s say you want to omit certain user information depending on which country the user is in. While [PII pseudonymization enrichment](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md) is very useful for dealing with PII, it does not support such conditions. JavaScript enrichment to the rescue!

```js
function process(event) {
  if (event.getGeo_country() === 'US') {
    event.setGeo_latitude(null);
    event.setGeo_longitude(null);
  }
}
```
