---
title: "Query your data in BigQuery"
date: "2022-11-21"
sidebar_position: 200
---

If you were using the `default` or `secure` example scripts unedited in the last section, you will have created a BigQuery dataset where all of your data is stored. Your BigQuery database will contain the following tables:

- `events`: this is your rich, high quality data

**Step 1**. **Querying your good data**

To query the good data in the events table, you will first you need to connect to your BigQuery dataset.  Within GCP:

1. Navigate to the BigQuery UI: https://console.cloud.google.com/bigquery
2. In the Explorer open up the available datasets and select your newly created one `<prefix>_pipeline_db`
3. Select the `events` table (this should show all the fields available for querying)
4. Select `query` the top panel and open in a `new tab`
5. Execute the following (this should almost exactly resemble the default query GCP produces):
  - `SELECT * FROM '<project_id>.<prefix>_pipeline_db.events' WHERE DATE(collector_tstamp) = "YYYY-MM-DD" LIMIT 1000`

To run a query against your events table to take a look at the page view event that you generated in the previous step (`where event_name = ‘page_view’`). You can understand more about each field in the canonical event [here](/docs/understanding-your-pipeline/canonical-event/index.md).
  - `SELECT * FROM '<project_id>.<prefix>_pipeline_db.events' WHERE DATE(collector_tstamp) = "YYYY-MM-DD" AND event = 'page_view' LIMIT 1000`

By default, there are 5 enrichments enabled, as listed below. These enrichments add extra properties and values to your events in real time as they are being processed by the Enrich application.

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) 
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) 
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Some enrichments are _legacy_ and therefore populate your atomic.events table. From the above list, these are the _campaign attribution, referer parser_ and _event fingerprint_ enrichments. The UA parser and YAUAA enrichment also add a separate _entity_ to each event (these are also referred to as contexts since they add additional context to the events in your atomic.events table). The contexts are loaded into separate columns of the events table:

- _contexts_com_snowplowanalytics_snowplow_ua_parser_context_1_0_0_
- _contexts_nl_basjes_yauaa_context_1_0_3_

**Step 2. Querying your bad data**

COMING SOON

:::note Schemas

Learn more about [self-describing events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) and [schemas](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md), and the different types of failures [here.](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md)

:::

Next, let's take a [detailed look at what you have deployed](/docs/getting-started-on-snowplow-open-source/quick-start-gcp/summary-of-what-you-have-deployed/gcp-and-bigquery/index.md).
