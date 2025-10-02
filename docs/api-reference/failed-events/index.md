---
title: "Failed event types"
sidebar_position: 15
---

This page lists all the possible types of [failed events](/docs/fundamentals/failed-events/index.md).

## Where do failed events originate?

While an event is being processed by the pipeline it is checked to ensure it meets the specific formatting or configuration expectations. These include checks like: does it match the schema it is associated with, were Enrichments successfully applied, and was the payload sent by the tracker acceptable.

Generally, the [Collector](/docs/api-reference/stream-collector/index.md) tries to write any payload to the raw stream, no matter its content, and no matter whether it is valid. This explains why many of the failure types are filtered out by the [Enrich](/docs/api-reference/enrichment-components/index.md) application, and not any earlier.

:::note

The Collector might receive events in batches. If something is wrong with the Collector payload as a whole (e.g. due to a [Collector payload format violation](#collector-payload-format-violation)), the generated failed event would represent an entire batch of Snowplow events.

Once the Collector payload successfully reaches the validation and enrichment steps, it is split into its constituent events. Each of them would fail (or not fail) independently (e.g. due to an [enrichment failure](#enrichment-failure)). This means that each failed event generated at this stage represents a single Snowplow event.

:::

## Schema violation

This failure type is produced during the process of [validation and enrichment](/docs/pipeline/enrichments/index.md). It concerns the [self-describing events](/docs/fundamentals/events/index.md#self-describing-events) and [entities](/docs/fundamentals/entities/index.md) which can be attached to your snowplow event.

<details>

In order for an event to be processed successfully:

1. There must be a schema in an [Iglu repository](/docs/api-reference/iglu/iglu-repositories/index.md) corresponding to each self-describing event or entity. The enrichment app must be able to look up the schema in order to validate the event.
2. Each self-describing event or entity must conform to the structure described in the schema. For example, all required fields must be present, and all fields must be of the expected type.

If your pipeline is generating schema violations, it might mean there is a problem with your tracking, or a problem with your [Iglu resolver](/docs/api-reference/iglu/iglu-resolver/index.md) which lists where schemas should be found. The error details in the schema violation JSON object should give you a hint about what the problem might be.

Snowplow customers should check in the Snowplow Console that all data structures are correct and have been [promoted to production](/docs/data-product-studio/data-structures/manage/index.md). Snowplow Community Edition users should check that the Enrichment app is configured with an [Iglu resolver file](/docs/api-reference/iglu/iglu-resolver/index.md) that points to a repository containing the schemas.

Next, check the tracking code in your custom application, and make sure the entities you are sending conform to the schema definition.

Once you have fixed your tracking, you might want to also [recover the failed events](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md), to avoid any data loss.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Schema violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema).

</details>

## Enrichment failure

This failure type is produced by the [Enrich](/docs/pipeline/enrichments/index.md) application, and it represents any failure to enrich the event by one of your configured enrichments.

<details>

There are many reasons why an enrichment will fail, but here are some examples:

- You are using the [custom SQL enrichment](/docs/pipeline/enrichments/available-enrichments/custom-sql-enrichment/index.md) but the credentials for accessing the database are wrong
- You are using the [IP lookup enrichment](/docs/pipeline/enrichments/available-enrichments/ip-lookup-enrichment/index.md) but have mis-configured the location of the MaxMind database
- You are using the [custom API request enrichment](/docs/pipeline/enrichments/available-enrichments/custom-api-request-enrichment/index.md) but the API server is not responding
- The raw event contained an unstructured event field or a context field which was not valid JSON
- An Iglu server responded with an unexpected error response, so the event schema could not be resolved

If your pipeline is generating enrichment failures, it might mean there is a problem with your enrichment configuration. The error details in the enrichment failure JSON object should give you a hint about what the problem might be.

Once you have fixed your enrichment configuration, you might want to also [recover the failed events](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md), to avoid any data loss.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Enrichment failure schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema).

</details>

## Collector payload format violation

This failure type is produced by the [Enrich](/docs/pipeline/enrichments/index.md) application, when Collector payloads from the raw stream are deserialized.

<details>

Violations could be:

- Malformed HTTP requests
- Truncation
- Invalid query string encoding in URL
- Path not respecting `/vendor/version`

The most likely source of this failure type is bot traffic that has hit the Collector with an invalid HTTP request. Bots are prevalent on the web, so do not be surprised if your Collector receives some of this traffic. Generally you would ignore, and not try to recover, a Collector payload format violation, because it likely did not originate from a tracker or a webhook.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Collector payload format violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/collector_payload_format_violation/jsonschema).

</details>

## Adapter failure

This failure type is produced by the [Enrich](/docs/pipeline/enrichments/index.md) application, when it tries to interpret a Collector payload from the raw stream as a HTTP request from a [3rd party webhook](/docs/sources/webhooks/index.md).

:::info

Many adapter failures are caused by bot traffic, so do not be surprised to see some of them in your pipeline.

:::

<details>

The failure could be:

1. The vendor/version combination in the Collector URL is not supported. For example, imagine an HTTP request sent to `/com.sandgrod/v3` which is a mis-spelling of the [sendgrid adapter](http://sendgrid.com) endpoint.
2. The webhook sent by the 3rd party does not conform to the expected structure and list of fields for this webhook. For example, imagine the 3rd party webhook payload is updated and stops sending a field that it was sending before.

Many adapter failures are caused by bot traffic, so do not be surprised to see some of them in your pipeline. However, if you believe you are missing data because of a misconfigured webhook, then you might try to fix the webhook and then [recover the failed events](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Adapter failure schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema).

</details>

## Tracker protocol violation

This failure type is produced by the [Enrich](/docs/pipeline/enrichments/index.md) application, when an HTTP request does not conform to our [Snowplow Tracker Protocol](/docs/events/index.md).

<details>

Snowplow trackers send HTTP requests to the `/i` endpoint or the `/com.snowplowanalytics.snowplow/tp2` endpoint, and they are expected to conform to this protocol.

Many tracker protocol violations are caused by bot traffic, so do not be surprised to see some of them in your pipeline.

Another likely source is misconfigured query parameters if you are using the [pixel tracker](/docs/sources/trackers/pixel-tracker/index.md). In this case you might try to fix your application sending events, and then [recover the failed events](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Tracker protocol violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/tracker_protocol_violations/jsonschema).

</details>

## Size violation

This failure type can be produced either by the [Collector](/docs/api-reference/stream-collector/index.md) or by the [Enrich](/docs/pipeline/enrichments/index.md) application. It happens when the size of the raw event or enriched event is too big for the output message queue. In this case it will be truncated and wrapped in a size violation failed event instead.

<details>

Failures of this type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md). The best you can do is to fix any application that is sending over-sized events.

Because this failure is handled during collection or enrichment, events in the real time good stream are free of this violation type.

The size violation schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/size_violation/jsonschema/1-0-0).

</details>

## Loader parsing error

This failure type can be produced by [any loader](/docs/api-reference/loaders-storage-targets/index.md), if the enriched event in the real time good stream cannot be parsed as a canonical TSV event format. For example, if the row does not have enough columns (131 are expected) or the `event_id` is not a UUID. This error type is uncommon and unexpected, because it can only be caused by an invalid message in the stream of validated enriched events.

<details>

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

The loader parsing error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/2-0-0).

</details>

## Loader Iglu error

This failure type can be produced by [any loader](/docs/api-reference/loaders-storage-targets/index.md) and describes an error using the [Iglu](/docs/api-reference/iglu/index.md) subsystem.

<details>

For example:

- A schema is not available in any of the repositories listed in the [Iglu resolver](/docs/api-reference/iglu/iglu-resolver/index.md).
- Some loaders (e.g. [RDB loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) and [Postgres loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)) make use of the "schema list" API endpoints, which are only implemented for an [Iglu server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) repository. A loader Iglu error will be generated if the schema is in a [static repo](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md) or [embedded repo](/docs/api-reference/iglu/iglu-repositories/jvm-embedded-repo/index.md).
- The loader cannot auto-migrate a database table. If a schema version is incremented from `1-0-0` to `1-0-1` then it is expected to be [a non-breaking change](/docs/api-reference/iglu/common-architecture/schemaver/index.md), and many loaders (e.g. RDB loader) attempt to execute a `ALTER TABLE` statement to facilitate the new schema in the warehouse. But if the schema change is breaking (e.g. string field changed to integer field) then the database migration is not possible.

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Loader Iglu error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_iglu_error/jsonschema/2-0-0).

</details>

## Loader recovery error

Currently only the [BigQuery repeater](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md#block-8db848d4-0265-4ffa-97db-0211f4e2293d) generates this error. We call it "loader recovery error" because the purpose of the repeater is to recover from previously failed inserts. It represents the case when the software could not re-insert the row into the database due to a runtime failure or invalid data in a source.

<details>

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Loader recovery error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_recovery_error/jsonschema/1-0-0)

</details>

## Loader runtime error

This failure type can be produced by any loader and describes generally any runtime error that we did not catch. For example, a DynamoDB outage, or a null pointer exception. This error type is uncommon and unexpected, and it probably indicates a mistake in the configuration or a bug in the software.

<details>

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Loader runtime error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-1).

</details>

## Relay failure

This failure type is only produced by relay jobs, which transfer Snowplow data into a 3rd party platform. This error type is uncommon and unexpected, and it probably indicates a mistake in the configuration or a bug in the software.

<details>

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Relay failure schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/relay_failure/jsonschema/1-0-0).

</details>

## Generic error

This is a failure type for anything that does not fit into the other categories, and is unlikely enough that we have not created a special category. The failure error messages should give you a hint about what has happened.

<details>

This failure type cannot be [recovered](/docs/data-product-studio/data-quality/failed-events/recovering-failed-events/index.md).

Generic error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/generic_error/jsonschema/1-0-0).

</details>
