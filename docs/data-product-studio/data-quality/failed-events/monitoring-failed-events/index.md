---
title: "Monitoring failed events"
sidebar_position: 2
sidebar_custom_props:
  offerings:
    - cdi
sidebar_label: "Monitor"
---

Snowplow pipelines separate events that are problematic in order to keep data quality high in downstream systems. For more information on understanding failed events see [here](/docs/fundamentals/failed-events/index.md).

## Monitoring failed events in Snowplow Console

For Snowplow customers that would like to benefit from seeing aggregates of failed events by type, there are relevant optional features in Snowplow Console. Snowplow offers two different ways to monitor failed events:
- The default view with little available information to debug errors
- The data quality dashboard that surfaces failed events directly from your warehouse in a secure manner, making debugging easier

The two ways are representing a trade-off between ease of exploration and avoidance of PII exposure, which we will discuss in detail below.

### Default view

The default view is a relatively simple interface that shows the number of failed events over time alongside a coarse-grained description of the problem at hand. In certain cases, the error message can be somewhat cryptic in terms of diagnosing the root cause of the error. The reason is that this information flows through Snowplow infrastructure, therefore we have redacted it substantially before it leaves your pipeline, to ensure that PII does not traverse Snowplow systems. The aggregates are served by the Console's backend:

![](images/aggregator-architecture.png)

In this setup, you expose no additional interface to the public internet, and all failed events information is served by the Console's APIs.

Below is an example view of the failed events screen in Snowplow Console:

![](images/image-1024x1024.png)

This interface is intended to give you a quick representation of the volume of event failures so that action can be taken. The UI focuses on schema violation and enrichment errors at present.

We've filtered on these two types of errors to reduce noise like bot traffic that causes adapter failures for instance. All failed events can be found in your S3 or GCS storage targets partitioned by type and then date/time.

At the top there is a data quality score that compares the volume of failed events to the volume that were successfully loaded into a data warehouse.

The bar chart shows how the total number of failed events varies over time, color-coding validation and enrichment errors. The time window is 7 days be default but can be extended to 14 or 30 days.

In the table, failed events are aggregated by the unique type of failure (validation, enrichment) and the offending schema.

By selecting a particular error you are able to get more detail:

![](images/image-1-1024x1009.png)

The detailed view shows the error message as well as other useful metadata (when available), like `app_id`, to help diagnose the source and root cause of the error; as well as a bar chart indicating how the volume of failures varies over time for this particular failed event.

### Data quality dashboard

The data quality dashboard allows you to see failed events directly from your warehouse. Your browser connects directly to an API running within your infrastructure, such that no failed event information flows through Snowplow. The discussion of architecture is important as it highlights the trade-offs between the two ways of monitoring failed events. The aforementioned API is a simple proxy that connects to your warehouse and serves the failed events to your browser. The connection is fully secure, using an encrypted channel (HTTPS) and authenticating/authorizing via the same mechanism used by Console.

In order for you to be able to deploy and use the data quality dashboard, you need to sink failed events to the warehouse via a [Failed Events Loader](/docs/data-product-studio/data-quality/failed-events/exploring-failed-events/index.md#configure). The data quality dashboard currently supports Snowflake and Bigquery connections.

![](images/dqd-architecture.png)

In this setup, you expose an additional interface (Data Quality API) to the public internet, and all failed events information is served via that interface.

The user experience of the data quality dashboard is similar to the default view, but offers substantially more information to support resolution of tracking issues. The overview page looks as follows:

![](images/dqd-overview.png)

As in the default view, it is possible to change the time horizon from the 7-day default, to the last hour, last day, or last 30 days. You get a corresponding overview of event volumes, both the successful and the failed ones, for the whole time period but also split per day/hour/minute in the bar chart right below.

Complementing the graphical overview, there is a table that lists all errors (at this moment only validation and resolution errors are supported). You can quickly see, for each type of failed event, a short description of the root cause, the offending data structure, first and last seen timestamps, and the total volume.

Clicking on a particular error type will take you to a detailed view:

![](images/dqd-details.png)

The detailed view also shows a description of the root cause and the application version ([web](/docs/events/ootb-data/app-information/index.md#application-context-entity-on-web-apps), [mobile](/docs/sources/trackers/mobile-trackers/tracking-events/platform-and-application-context/index.md)). It provides a sample of the failed events in their entirety, as found in your warehouse.

Some columns are too wide to fit in the table: click on them to see the full pretty-printed, syntax-highlighted content. The most useful column to explore is probably `CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_FAILURE_1`, which contains the actual error information encoded as a JSON object:

![](images/cell-content.png)

Finally, you can click on the **View SQL query** button to see the SQL query that was used to fetch the failed events from your warehouse:

![](images/sql-query.png)

## Monitoring failed events using an API

The API that powers the Console view and dashboard is publicly available, and can be invoked with a valid token to feed your own monitoring systems.

### Authorization

Before you can invoke the Failed Events API, you will need to [authenticate with an API key](/docs/account-management/index.md).


### Available operations and data returned

A full specification of the API can be found in [our swagger docs](https://console.snowplowanalytics.com/api/msc/v1/docs/index.html?url=/api/msc/v1/docs/docs.yaml#/Metrics/getOrganizationsOrganizationidMetricsV1PipelinesPipelineidFailed-events). It is worth pointing out that, as is the case in the UI, the data returned only contains schema validation errors and enrichment failures.
