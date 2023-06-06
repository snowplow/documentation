---
title: "Understanding bad data"
description: "Learn how to access and understand any bad Snowplow data you might have collected"
date: "2021-01-05"
sidebar_position: 80
---

:::note

This recipe is currently specific to Try Snowplow.

:::

## Introduction

Snowplow has the concept of upfront data validation: you get to decide what your data should look like, and data that does not match your definitions is classified as "bad data". Detailed information on the different failure types can be found in [the technical documentation](/docs/managing-data-quality/understanding-failed-events/index.md).

This bad data is not simply dropped, but rather loaded into dedicated locations so you can understand what went wrong and how your tracking implementation or your data structure definitions need to be updated to resolve the issue. This approach ensures you don't need to waste time cleaning data but can instead rely on Snowplow delivering only the highest quality data to you.

Snowplow BDP comes with a dedicated failed events monitoring tool, you can take a look at it in [the documentation](/docs/managing-data-quality/monitoring-failed-events/ui/index.md). With Try Snowplow, failed events are loaded into a `badrows` schema for monitoring and analysing. This recipe will teach you how to access and understand any bad Snowplow data you might have collected.

## What you'll be doing

#### Checking if you have bad data

You can see the different bad data tables by running the following query:

```sql
SELECT * FROM information_schema.tables
WHERE table_schema = 'badrows';
```

Please note that not all bad data is actually a source of concern. For example, if you navigate directly to your collector endpoint, you will generate a bad request. Therefore, certain types of bad events can be ignored. For more detail on the different failure types, check out [the technical documentation](/docs/managing-data-quality/understanding-failed-events/index.md).

In this recipe, you will focus on schema violations, i.e. errors that occur because data is not tracked as expected. To check if you already have any existing schema violations, you can run the following query:

```sql
SELECT COUNT(*) AS bad_events FROM badrows.com_snowplowanalytics_snowplow_badrows_schema_violations_2;
```

Please note that an issue with an entity attached to an event will cause the entire event to fail. More information on Snowplow's events and entities can be found [here](/docs/understanding-tracking-design/understanding-events-entities/index.md).

#### Generating bad data (optional)

If you do not have any bad data yet, you can send some on purpose to see what it looks like. For example, you could send an event with a schema that does not exist:

```javascript
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:io.snowplow.foundation/example_event/jsonschema/1-0-0",
      "data": {
         "example_field": "This is a bad data test!"
      }
   }
 });
```

Alternatively, if you have already implemented one of the recipes that involve implementing a custom event or entity, you could try updating the tracking code to purposefully cause bad data. For example, if you have instrumented the [marketing attribution recipe](/docs/recipes/recipe-marketing-attribution/index.md), you could change the conversion event, either by sending an incorrect type for one property:

```javascript
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:io.snowplow.foundation/conversion/jsonschema/1-0-0",
      "data": {
         "name": "email-signup",
         "value": "10" // this is meant to be an integer
      }
   }
 });
```

Or by making a property larger than allowed:

```javascript
window.snowplow('trackSelfDescribingEvent', {
   "event": {
      "schema": "iglu:io.snowplow.foundation/conversion/jsonschema/1-0-0",
      "data": {
         "name": "This property is only meant to be 255 characters long. When you send a value that is longer, the event will fail validation and end up as a bad event. In this case that is on purpose, as an exercise to understand Snowplow's concept of bad data. In real life, bad data typically means you need to either update your data structure definitions or your tracking code to resolve the issue."
     }
   }
 });
```

The custom event in this example does not have any required properties, but if the event you have already instrumented does, you can also try omitting those.

#### Understanding your bad data

Once you have confirmed you have bad data, you want to understand what it means and where it comes from. The following query shows you how many bad events you have by schema (data structure) and error type:

```sql
SELECT
   "failure.messages"->0->'error'->'error' AS error,
   "failure.messages"->0->'schemaKey' AS schema,
   count(*) AS bad_events
 FROM badrows.com_snowplowanalytics_snowplow_badrows_schema_violations_2
 GROUP BY 1,2
 ORDER BY 3 DESC
```

Common error types include:

- Resolution errors: the schema cannot be found
- Validation errors: a property in the event or entity does not match its definition in the schema, or is not defined in the schema at all

Other useful fields in this table are:

- `"payload.enriched.collector_tstamp"`: the time at which the event was collected
- `"payload.enriched.unstruct_event"`: the custom event payload
- `"payload.enriched.contexts"`: the entities payload
- `"payload.raw.parameters"`: the entire request payload

This information allows you to understand where these bad events are being generated, and therefore to resolve the issue and ensure that you are collecting high quality data you can trust.

## Learn more about how Snowplow processes data

This recipe has focused on understanding bad data resulting from tracking issues. However, as part of pipeline processing events aren't just validated, they are also enriched. Enrichment allows you to add more information to each event in real time, based on first and third party sources. But the enrichment process can also lead to failed events, for example when an API that is being called is not available.

Try Snowplow comes with a set of standard enrichments enabled out of the box:

- Campaign attribution
- Referer parser
- UA parser
- PII Pseudonymization

To see the full list of enrichments available with Snowplow BDP, including the customizable enrichments, check out [the documentation](/docs/enriching-your-data/available-enrichments/index.md).
