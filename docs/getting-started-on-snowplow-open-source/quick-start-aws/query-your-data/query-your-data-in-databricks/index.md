---
title: "Query your data in Databricks"
date: "2022-05-10"
sidebar_position: 250
---

If you have created Databricks resources by following [this guide](/docs/getting-started-on-snowplow-open-source/quick-start-aws/index.md) and deployed the pipeline using the default or secure, you will have a Databricks database where all of your enriched data is stored.

Since Databricks Loader only allows to load enriched data to Databricks, your Databricks database will contain only `atomic` schema that contains your rich, high quality data. It will not contain `atomic_bad` schema, unlike Postgres variant.

To query the good data in atomic.events, you will first need to connect to your Databricks database.

- There is two different ways to connect to Databricks database:
- Use `databricks_loader_user` that is output by Databricks Terraform module. The password for this user is the password you've passed as `databricks_loader_password` to Databricks Terraform module.
- Grant `databricks_loader_role` that is output by Databricks Terraform module to a Databricks user you have access and connect to database with credentials of this user.
- Either Databricks dashboard or [SnowSQL](https://docs.snowflake.com/en/user-guide/snowsql.html) can be used to connect to Databricks database and query data in there.
- Run a query against your atomic.events table to take a look at the page view event that you generated in the previous step (`where event_name = ‘page_view’`). You can understand more about each field in the canonical event [here](/docs/understanding-your-pipeline/canonical-event/index.md).
- `SELECT * FROM atomic.events WHERE event_name = 'page_view';`

By default, there are 5 enrichments enabled, as listed below. These enrichments add extra properties and values to your events in real time as they are being processed by the Enrich application.

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md)
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md)
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Some enrichments are legacy and therefore populate your atomic columns. From the above list, these are the campaign attribution, referer parser and event fingerprint enrichments. The UA parser and YAUAA enrichment also add a separate entity to each event (these are also referred to as contexts since they add additional context to the events). The contexts are loaded into separate columns:

- contexts_com_snowplowanalytics_snowplow_ua_parser_context_1
- contexts_nl_basjes_yauaa_context_1
