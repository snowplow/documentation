---
title: "Query your data in Postgres"
date: "2022-05-10"
sidebar_position: 100
---

If you were using the `default` or `secure` example scripts unedited in the last section, you will have created a Postgres database where all of your data is stored. Your Postgres database will contain the following standard Snowplow schemas:

- `atomic`: this is your rich, high quality data
- `atomic_bad`: this is the data that has failed pipeline validation

**Step 1**. **Querying your good data** **in Postgres**

To query the good data in atomic.events, you will first you need to connect to your Postgres database.

- Connect to the database using the username and password you provided when creating the pipeline, along with the `db_address` and `db_port` you noted down after the pipeline was created.
    - If you need to reset your username or password you can [follow these steps](https://aws.amazon.com/premiumsupport/knowledge-center/reset-master-user-password-rds/)
    - If your Postgres RDS was configured to be publically accessible, there are a number of tools you can use to connect to a Postgres database from your local machine:
        - [pgAdmin](https://www.pgadmin.org/), [psql](https://www.postgresql.org/docs/current/app-psql.html), [DataGrip](https://www.jetbrains.com/datagrip/), [DBeaver](https://dbeaver.io/)
- Run a query against your atomic.events table to take a look at the page view event that you generated in the previous step (`where event_name = ‘page_view’`). You can understand more about each field in the canonical event [here](/docs/understanding-your-pipeline/canonical-event/index.md).
    - `SELECT * FROM atomic.events WHERE event_name = 'page_view';`

By default, there are 5 enrichments enabled, as listed below. These enrichments add extra properties and values to your events in real time as they are being processed by the Enrich application.

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) 
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) 
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Some enrichments are _legacy_ and therefore populate your atomic.events table. From the above list, these are the _campaign attribution, referer parser_ and _event fingerprint_ enrichments. The UA parser and YAUAA enrichment also add a separate _entity_ to each event (these are also referred to as contexts since they add additional context to the events in your atomic.events table). The contexts are loaded into separate tables: 

- _atomic.com_snowplowanalytics_snowplow_ua_parser_context_1_
- _atomic.nl_basjes_yauaa_context_1_

Note: you can join these contexts back to your atomic.events using root_id = event_id.

**Step 2. Querying your bad data** **in Postgres**

Your atomic_bad schema holds events that have failed to be processed by your pipeline. These are called [failed events.](/docs/understanding-your-pipeline/failed-events/index.md)

You will see in Postgres that you have a table called _`atomic_bad.com_snowplowanalytics_snowplow_badrows_schema_violation_1.`_

In the last section, we sent a test event that would fail to be processed by your pipeline (specifically one that fails to validate against a schema). This is a fundamental aspect of Snowplow; ensuring that only good quality data reaches your stream, lake and warehouse and syphoning off poor quality data so that you have the ability to correct and recover it. 

As the custom `product_view` event passed through your pipeline, the Enrich application fetches the schema for the event. It does this so it can validate that the structure of the event conforms to what was defined up front, therefore ensuring it is of the quality expected.  Since the schema for the `product_view` event doesn't yet exist in your Iglu schema registry, the event failed to validate and landed in `atomic.bad`.

In the next section, we guide you through creating a custom schema so that your custom event would validate against it and not become a failed event. 

:::note Schemas

Learn more about [self-describing events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [schemas](/docs/understanding-your-pipeline/schemas/index.md), and the different types of failures [here](/docs/understanding-your-pipeline/failed-events/index.md).

:::

:::info

You might also see _adapter failure_ failed events in Postgres. Many adaptor failures are caused by bot traffic, so do not be surprised to see some of them in your pipeline. Find out more [here](/docs/understanding-your-pipeline/failed-events/index.md#adaptor-failure).

:::