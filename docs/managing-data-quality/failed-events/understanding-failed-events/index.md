---
title: "Understanding failed events"
date: "2020-02-15"
sidebar_position: 0
---

## What is a Failed Event?

A Failed Event is simply what we label any event that was not able to be processed through your pipeline. There are multiple points at which an event can fail in the pipeline: collection, validation and enrichment.

While an event is being processed by the pipeline it is checked to ensure it meets the specific formatting or configuration expectations; these include checks like: does it match the schema it is associated with, were Enrichments successfully applied and was the payload sent by the tracker acceptable.

Generally, the [collector](/docs/pipeline-components-and-applications/stream-collector/index.md) tries to write any payload to the raw stream, no matter its content, and no matter whether it is valid. This explains why many of the failure types are filtered out by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application, and not any earlier.

All failed events are routed to storage (AWS S3 or GCP cloud storage).

Note

When an error occurs while enriching an event (that is part of a collector payload with several events), the Failed Event will contain **only** this event. The other events of the collector payload can be successfully enriched.

## Failure Types

### Schema Violation

This failure type is produced during the process of [validation and enrichment](/docs/enriching-your-data/what-is-enrichment/index.md). It concerns the [self-describing events and entities](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) which can be attached to your snowplow event.

In order for an event to be processed successfully:

1. There must be a schema in an [iglu repository](/docs/pipeline-components-and-applications/iglu/iglu-repositories/index.md) corresponding to each self-describing event or entity. The enrichment app must be able to look up the schema in order to validate the event.
2. Each self-describing event or entity must conform to the structure described in the schema. For example, all required fields must be present, and all fields must be of the expected type.

If your pipeline is generating schema violations, it might mean there is a problem with your tracking, or a problem with your [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) which lists where schemas should be found. The error details in the schema violation JSON object should give you a hint about what the problem might be.

Snowplow BDP users should check in the Snowplow BDP Console that all data structures are correct and have been [promoted to production](/docs/understanding-tracking-design/managing-data-structures/index.md). Snowplow open source users should check that the Enrichment app is configured with an [iglu resolver file](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) that points to a repository containing the schemas.

Next, check the tracking code in your custom application, and make sure the entities you are sending conform the schema definition.

Once you have fixed your tracking, you might want to also [recover the failed events](/docs/managing-data-quality/snowplow-event-recovery/index.md), to avoid any data loss.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Schema violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/schema_violations/jsonschema).

### Enrichment failure

This failure type is produced by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application, and it represents any failure to enrich the event by one of your configured enrichments.

There are many reasons why an enrichment will fail, but here are some examples:

- You are using the [custom SQL enrichment](/docs/enriching-your-data/available-enrichments/custom-sql-enrichment/index.md) but the credentials for accessing the database are wrong.
- You are using the [IP lookup enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md) but have mis-configured the location of the MaxMind database.
- You are using the [custom API request enrichment](/docs/enriching-your-data/available-enrichments/custom-api-request-enrichment/index.md) but the API server is not responding.
- The raw event contained an unstructured event field or a context field which was not valid JSON.
- An iglu server responded with an unexpected error response, so the event schema could not be resolved.

If your pipeline is generating enrichment failures, it might mean there is a problem with your enrichment configuration. The error details in the enrichment failure JSON object should give you a hint about what the problem might be.

Once you have fixed your enrichment configuration, Once you have fixed your tracking, you might want to also [recover the failed events](/docs/managing-data-quality/snowplow-event-recovery/index.md), to avoid any data loss.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Enrichment failure schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/enrichment_failures/jsonschema).  

### Collector Payload Format Violation

This failure type is produced by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application, when collector payloads from the raw stream are deserialized from thrift format. Violations could be:

- Malformed HTTP requests
- Truncation
- Invalid query string encoding in URL
- Path not respecting /vendor/version

The most likely source of this failure type is bot traffic that has hit the collector with an invalid http request. Bots are prevalent on the web, so do not be surprised if your collector receives some of this traffic. Generally you would ignore not try to recover a collector payload format violation, because it likely did not originate from a tracker or a webhook.

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Collector payload format violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/collector_payload_format_violation/jsonschema).

### Adaptor Failure

This failure type is produced by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application, when it tries to interpret a collector payload from the raw stream as a http request from a [3rd party webhook](/docs/collecting-data/collecting-data-from-third-parties/index.md). The failure could be:

1. The vendor/version combination in the collector url is not supported. For example, imagine a http request sent to `/com.sandgrod/v3` which is a mis-spelling of the [sendgrid adaptor](http://sendgrid) endpoint.
2. The webhook sent by the 3rd party does not conform to the expected structure and list of fields for this webhook. For example, imagine the 3rd party webhook payload is updated and stops sending a field that it was sending before.

Many adaptor failures are caused by bot traffic, so do not be surprised to see some of them in your pipeline. However, if you believe you are missing data because of a misconfigured webhook, then you might try to fix the webhook and then [recover the failed events](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Adapter failure schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/adapter_failures/jsonschema).

### Tracker Protocol Violation

This failure type is produced by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application, when a http request does not conform to our [tracker protocol](https://github.com/snowplow/snowplow/wiki/snowplow-tracker-protocol).

Snowplow trackers send http requests to the `/i` endpoint or the `/com.snowplowanalytics.snowplow/tp2` endpoint, and they are expected to conform to this protocol.

Many tracker protocol violations are caused by bot traffic, so do not be surprised to see some of them in your pipeline.

Another likely source is misconfigured query parameters if you are using the [pixel tracker](/docs/collecting-data/collecting-from-own-applications/pixel-tracker/index.md). In this case you might try to fix your application sending events, and then [recover the failed events](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Because this failure is handled during enrichment, events in the real time good stream are free of this violation type.

Tracker protocol violation schema can be found [here](https://github.com/snowplow/iglu-central/tree/master/schemas/com.snowplowanalytics.snowplow.badrows/tracker_protocol_violations/jsonschema).

### Size Violation

This failure type can be produced either by the [collector](/docs/pipeline-components-and-applications/stream-collector/index.md) or by the [enrichment](/docs/enriching-your-data/what-is-enrichment/index.md) application. It happens when the size of the raw event or enriched event is too big for the output message queue. In this case it will be truncated and wrapped in a size violation failed event instead.

Failures of this type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md). The best you can do is to fix any application that is sending over-sized events.

Size violation schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/size_violation/jsonschema/1-0-0).

### Loader Parsing Error

This failure type can be produced by [any loader](/docs/pipeline-components-and-applications/loaders-storage-targets/index.md), if the enriched event in the real time good stream cannot be parsed as a canonical TSV event format. For example, if line has not enough columns (not 131) or event_id is not UUID.

This error type is uncommon and unexpected, because it can only be caused by an invalid message in the stream of validated enriched events. This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Loader parsing error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_parsing_error/jsonschema/2-0-0).

### Loader Iglu Error

This failure type can be produced by [any loader](/docs/pipeline-components-and-applications/loaders-storage-targets/index.md) and describes an error using the [Iglu](/docs/pipeline-components-and-applications/iglu/index.md) subsystem. For example:

- A schema is not available in any of the repositories listed in the [iglu resolver](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md).
- Some loaders (e.g. [RDB loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/index.md) and [Postgres loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md)) make use of the "schema list" api endpoints, which are only implemented for an [iglu-server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) repository. A loader iglu error will be generated if the schema is in a [static repo](/docs/pipeline-components-and-applications/iglu/iglu-repositories/static-repo/index.md) or [embedded repo](/docs/pipeline-components-and-applications/iglu/iglu-repositories/jvm-embedded-repo/index.md).
- The loader cannot auto-migrate a database table. If a schema version is incremented from `1-0-0` to `1-0-1` then it is expected to be [a non-breaking change](/docs/pipeline-components-and-applications/iglu/common-architecture/schemaver/index.md), and many loaders (e.g. RDB loader) attempt to execute a `ALTER TABLE` statement to facilitate the new schema in the warehouse. But if the schema change is breaking (e.g. string field changed to integer field) then the database migration is not possible.

This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Loader iglu error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_iglu_error/jsonschema/2-0-0).

### Loader Recovery Error

Currently only the [BigQuery repeater](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md#block-8db848d4-0265-4ffa-97db-0211f4e2293d) generates this error. We call it "loader recovery error" because the purpose of the repeater is to recover from previously failed inserts. It represents the case when the software could not re-insert the row into the database due to a runtime failure or invalid data in a source.

This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Loader recovery error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_recovery_error/jsonschema/1-0-0)

### Loader Runtime Error

This failure type can be produced by any loader and describes generally any runtime error that we did not catch. For example, a DynamoDB outage, or a null pointer exception.

This error type is uncommon and unexpected, and it probably indicates a mistake in the configuration or a bug in the software. This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Loader runtime error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-1).

### Relay Failure

This failure type is only produced by relay jobs (e.g. the [Indicative relay](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/indicative/index.md)), which transfer Snowplow data into a 3rd party platform. This error type is uncommon and unexpected, and it probably indicates a mistake in the configuration or a bug in the software. This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Relay failure schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/relay_failure/jsonschema/1-0-0).

### Generic Error

This is a failure type for anything that does not fit into the other categories, and is unlikely enough that we have not created a special category. The failure error messages should give you a hint about what has happened.

This failure type cannot be [recovered](/docs/managing-data-quality/snowplow-event-recovery/index.md).

Generic error schema can be found [here](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow.badrows/generic_error/jsonschema/1-0-0).
