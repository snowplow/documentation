---
title: "Example code"
sidebar_position: 3
description: "Examples of enrichment code in JavaScript."
---

## Labeling internal and external traffic

Suppose you want to extend your events with a label that distinguishes traffic from internal and external systems. This is a good use case for [adding an entity](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#adding-extra-entities-to-the-event).

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

You may want to prevent certain bot-generated events from entering your data warehouse. Here is an example that uses a [`throw` statement](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#discarding-the-event) to achieve that:

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

Let’s say you want to omit certain user information depending on which country the user is in. While [PII pseudonymization enrichment](/docs/enriching-your-data/available-enrichments/pii-pseudonymization-enrichment/index.md) is very useful for dealing with PII, it does not support such conditions. JavaScript enrichment to the rescue!

```js
function process(event) {
  if (event.getGeo_country() === 'US') {
    event.setGeo_latitude(null);
    event.setGeo_longitude(null);
  }
}
```
