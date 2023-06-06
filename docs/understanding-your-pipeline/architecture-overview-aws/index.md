---
title: "How your pipeline works"
date: "2020-02-15"
sidebar_position: 0
---

![](images/Screenshot-2020-02-24-at-10.38.12.png)

## The typical architecture of a Snowplow pipeline

The diagram above illustrates a typical Snowplow pipeline with data flowing left to right.

- **Trackers** generate event data and send this to your **Collector**. We have [trackers](/docs/collecting-data/collecting-from-own-applications/index.md) covering web, mobile, desktop, server and IoT. Additionally, [webhooks](/docs/collecting-data/collecting-data-from-third-parties/index.md) allow third-party software to send their own internal event streams to your Collector for further processing.
- Events hit the **Collector** application and it saves the raw events to storage (S3 on AWS and Google Cloud Storage on GCP) and then sends them down the pipeline to **Enrich**.
- The **Enrich** application cleanses the data and validates each event against its schema to ensure it meets the criteria [you have designed](/docs/understanding-tracking-design/index.md) and set. When an event fails to validate it will feed into a bad data stream which contains all of your [Failed Events](/docs/managing-data-quality/understanding-failed-events/index.md) - in this way the Snowplow pipeline is non-lossy as all failed events [can be reprocessed](/docs/managing-data-quality/recovering-failed-events/index.md).
- Once validated each event is enriched by the [Enrichments](/docs/enriching-your-data/available-enrichments/index.md) you have configured for your pipeline. Finally, these enriched events are saved to storage and loaded onto real-time streams (Kinesis on AWS, PubSub on GCP). At this point data can be consumed off the real-time stream to build applications or feed into real-time analytics solutions.
- Loaders then load your data off the real-time streams into the various Destinations you have set up for your pipeline. Typically these include a Data Warehouse (Redshift, Snowflake, BigQuery) but can also include [many other destinations](/docs/pipeline-components-and-applications/loaders-storage-targets/index.md).
- Your event-level data is now in your chosen destinations. From here we recommend this raw data [is modelled](/docs/modeling-your-data/index.md) into smaller, cleaner tables that are easier to perform analysis on. At this stage it can also be joined with other data sets. We have out-of-the-box data models for web and mobile to help you get started.

## Why do we use this architecture?

Snowplow's distinctive architecture has been informed by a set of key design principles:

1. **Extreme scalability** - Snowplow should be able to scale to tracking billions of customer events without affecting the performance of your client (e.g. website) or making it difficult to subsequently analyze all of those events
2. **Permanent event history** - Snowplow events should be stored in a simple, non-relational, immutable data store
3. **Direct access to individual events** - you should have direct access to your raw Snowplow event data at the atomic level
4. **Separation of concerns** - event tracking and event analysis should be two separate systems, only loosely-coupled
5. **Support any analysis** - Snowplow should make it easy for business analysts, data scientists and engineers to answer any business question they want, using as wide a range of analytical tools as possible

The Snowplow approach has several technical advantages over more conventional web analytics approaches. In no particular order, these advantages are:

- **Scalable, fast tracking** - using CloudFront for event tracking reduces complexity and minimizes client slowdown worldwide
- **Never lose your raw data** - your raw event data is never compacted, overwritten or otherwise corrupted by Snowplow
- **Direct access to events** - not intermediated by a third-party vendor, or a slow API, or an interface offering aggregates only
- **Analysis tool agnostic** - Snowplow can be used to feed whatever analytics process you want (e.g. Hive, R, Pig, Sky EQL)
- **Integrable with other data sources** - join Snowplow data into your other data sources (e.g. ecommerce, CRM) at the event level
- **Clean separation of tracking and analysis** - new analyzes will not require re-tagging of your site or app
