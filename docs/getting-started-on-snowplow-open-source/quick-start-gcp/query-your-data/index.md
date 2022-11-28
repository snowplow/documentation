---
title: "Query your data"
sidebar_position: 200
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

If you were using the `default` or `secure` example scripts unedited in the last section, you will have created a Postgres database where all of your data is stored. Your database will contain the following standard Snowplow schemas:

<Tabs groupId="destination">
  <TabItem value="postgres" label="Postgres" default>

- `atomic`: this is your rich, high quality data
- `atomic_bad`: this is the data that has failed pipeline validation


  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

- `events`: this is your rich, high quality data


  </TabItem>
</Tabs>

**Step 1**. **Querying your good data**

To query the good data, you will first you need to connect to your database.

<Tabs groupId="destination">
  <TabItem value="postgres" label="Postgres" default>

- Connect to the database using the username and password you provided when creating the pipeline, along with the `db_address` and `db_port` you noted down after the pipeline was created.
    - If your Postgres RDS was configured to be publically accessible, there are a number of tools you can use to connect to a Postgres database from your local machine:
        - [pgAdmin](https://www.pgadmin.org/), [psql](https://www.postgresql.org/docs/current/app-psql.html), [DataGrip](https://www.jetbrains.com/datagrip/), [DBeaver](https://dbeaver.io/)
- Run a query against your `atomic.events` table to take a look at the page view event that you generated in the previous step (`where event_name = 'page_view'`). You can understand more about each field in the canonical event [here](/docs/understanding-your-pipeline/canonical-event/index.md).
    - `SELECT * FROM atomic.events WHERE event_name = 'page_view';`


</TabItem>
  <TabItem value="bigquery" label="BigQuery">

Within GCP:

1. Navigate to the BigQuery UI: https://console.cloud.google.com/bigquery
2. In the Explorer open up the available datasets and select your newly created one `<prefix>_snowplow_db`
3. Select the `events` table (this should show all the fields available for querying)
4. Select `query` the top panel and open in a `new tab`
5. Execute the following (this should almost exactly resemble the default query GCP produces):
  - `SELECT * FROM '<project_id>.<prefix>_snowplow_db.events' WHERE DATE(collector_tstamp) = "YYYY-MM-DD" LIMIT 1000`

To run a query against your events table to take a look at the page view event that you generated in the previous step (`where event_name = 'page_view'`). You can understand more about each field in the canonical event [here](/docs/understanding-your-pipeline/canonical-event/index.md).
  - `SELECT * FROM '<project_id>.<prefix>_snowplow_db.events' WHERE DATE(collector_tstamp) = "YYYY-MM-DD" AND event = 'page_view' LIMIT 1000`


</TabItem>
</Tabs>

By default, there are 5 enrichments enabled, as listed below. These enrichments add extra properties and values to your events in real time as they are being processed by the Enrich application.

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) 
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) 
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Some enrichments are _legacy_ and therefore populate your events table. From the above list, these are the _campaign attribution, referer parser_ and _event fingerprint_ enrichments. The UA parser and YAUAA enrichment also add a separate _entity_ to each event (these are also referred to as contexts since they add additional context to the events in your events table).

<Tabs groupId="destination">
  <TabItem value="postgres" label="Postgres" default>

The contexts are loaded into separate tables: 

- `atomic.com_snowplowanalytics_snowplow_ua_parser_context_1`
- `atomic.nl_basjes_yauaa_context_1`

Note: you can join these contexts back to your `atomic.events` using `root_id = event_id`.

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

The contexts are loaded into separate columns of the events table:

- `contexts_com_snowplowanalytics_snowplow_ua_parser_context_1_0_0`
- `contexts_nl_basjes_yauaa_context_1_0_3`


  </TabItem>
</Tabs>

**Step 2. Querying your bad data**

In the last section, we sent a test event that would fail to be processed by your pipeline (specifically one that fails to validate against a schema). This is a fundamental aspect of Snowplow; ensuring that only good quality data reaches your stream, lake and warehouse and syphoning off poor quality data so that you have the ability to correct and recover it. 

As the custom `product_view` event passed through your pipeline, the Enrich application fetches the schema for the event. It does this so it can validate that the structure of the event conforms to what was defined up front, therefore ensuring it is of the quality expected.  Since the schema for the `product_view` event doesn't yet exist in your Iglu schema registry, the event failed to validate.

<Tabs groupId="destination">
  <TabItem value="postgres" label="Postgres" default>

Your `atomic_bad` schema holds events that have failed to be processed by your pipeline. These are called [failed events](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md).

You will see in Postgres that you have a table called `atomic_bad.com_snowplowanalytics_snowplow_badrows_schema_violation_1.`

:::info

You might also see _adapter failure_ failed events in Postgres. Many adaptor failures are caused by bot traffic, so do not be surprised to see some of them in your pipeline. Find out more [here](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md#adaptor-failure).

:::

 </TabItem>
  <TabItem value="bigquery" label="BigQuery">

:::caution

Currently the Quick Start guide pipelines do not load bad data into BigQuery directly.

:::

To query it, you will need to follow a few additional steps manually:

- Configure the [GCS Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md) to load bad data from the _Bad 1_ (`<prefix>-bad-1-topic`) and _Bad Rows_ (`<prefix>-bq-bad-rows-topic`) pubsub topics into GCS.
- Create external tables in BigQuery to read the data from GCS as described [here](/docs/managing-data-quality/failed-events/failed-events-in-athena-and-bigquery/index.md).


  </TabItem>
</Tabs>

In the next section, we guide you through creating a custom schema so that your custom event would validate against it and not become a failed event. 

:::note Schemas

Learn more about [self-describing events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) and [schemas](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md), and the different types of failures [here](/docs/managing-data-quality/failed-events/understanding-failed-events/index.md).

:::

Next, let's take a [detailed look at what you have deployed](/docs/getting-started-on-snowplow-open-source/quick-start-gcp/summary-of-what-you-have-deployed/index.md).
