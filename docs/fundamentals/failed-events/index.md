---
title: "Introduction to failed events"
sidebar_label: "Failed events"
sidebar_position: 5
description: "Failed events represent data that did not pass validation or otherwise failed to be processed"
---

_Failed events_ is an umbrella term for events that the pipeline had some problem processing.

These problems can arise at various stages:
* Collection (e.g. invalid payload format)
* Validation (e.g. event does not match the schema)
* Enrichment (e.g. external API unavailable)
* Loading (very unlikely with modern versions of Snowplow)

:::note

Failed events are **not** written to your `atomic` events table, which only contains high quality data. See [below](#dealing-with-failed-events) for how to deal with them.

:::

## Common failures

The two most common types of failed events are:

* **Validation failures**. These errors occur when an [event](/docs/fundamentals/events/index.md) or an [entity](/docs/fundamentals/entities/index.md) does not match its [schema](/docs/fundamentals/schemas/index.md). The reason usually is incorrect tracking code. For example, if you have a schema with a property defined as an `enum` accepting values `a`, `b`, and `c`, but the incoming event which references that schema includes the property with a value of `d`, that will be a `ValidationError`. The error's description will include that information -- e.g. `$property does not match enum list`. Validation can also fail if the schema is not available, such as when you forgot to add it to the production schema registry before putting the tracking code live. The pipeline will first search for a schema in the associated [Iglu](https://docs.snowplow.io/docs/fundamentals/schemas/#iglu) repository, and if it cannot find it, it will search in [Iglu Central](https://iglucentral.com), the public repository of self-describing schemas available to everyone. If the schema is not found in either location, the event will be labeled as a `ResolutionError`.

* **Enrichment failures**. These can be due to an [API enrichment](/docs/pipeline/enrichments/available-enrichments/custom-api-request-enrichment/index.md) reaching out to an external API that’s down. Another cause is a failure in the custom code in a [JavaScript enrichment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/index.md).

:::tip

In many cases, you will be able to fix the underlying problem directly, e.g. by altering your tracking code, by providing the correct schema, or by changing your enrichment configuration.

:::

## Other failures

Other failures generally fall into 3 categories:

* **Bots or malicious activity**. Bots, vulnerability scans, and so on, can send completely invalid events to the Collector. The format might be wrong, or the payload size might be extraordinarily large.

* **Pipeline misconfiguration**. For example, a loader could be reading from the wrong stream (with events in the wrong format). This is quite rare, unless you're self-hosting Snowplow, as all relevant pipeline configuration is automatic.

* **Temporary infrastructure issue**. This is again rare. One example would be Iglu Server (schema registry) not being available.

:::tip

All of these are internal failures you typically can’t address upstream.

:::

## Dealing with failed events

Snowplow provides a dashboard and alerts for failed events. See [Monitoring failed events](/docs/monitoring/index.md).

---

For the common failures (validation and enrichment), you can configure continuous loading of any offending events into _a separate table_ in your warehouse or lake. This way, you can easily inspect them and decide how they might be patched up (e.g. with SQL) and merged with the rest of your data.

:::note

This feature is not retroactive, i.e. only failed events that occur _after it’s enabled_ will be loaded into your desired destination.

:::

The events will include a special column with the details of the failure, and any invalid columns will be set to `null`. Otherwise, the format is [the same as for your atomic events](/docs/fundamentals/canonical-event/index.md).

See [Exploring failed events](/docs/monitoring/exploring-failed-events/index.md) for more details and setup instructions.

---

Finally, on AWS and GCP all failed events are backed up in object storage (S3 and GCS respectively). Sometimes, but not in all cases (e.g. not if the original events exceeded size limits), it’s possible to recover them by replaying them through the pipeline. This is a complicated process mainly reserved for internal failures and outages. Refer to [Recovering failed events](/docs/monitoring/recovering-failed-events/index.md).

---

You can find a full list of failed event types [in the API reference section](/docs/api-reference/failed-events/index.md).
