---
title: "Setup Validation and Enrich"
date: "2020-02-26"
sidebar_position: 40
---

![](images/snowplow-aws-pipeline-enrich.png)

[Stream Enrich](https://github.com/snowplow/enrich) is an application which:

1. **Reads** raw Snowplow events off a stream populated by the Stream Collector
2. **Validates** each raw event
3. **Enriches** each event (e.g. infers the location of the user from his/her IP address)
4. **Writes** the enriched Snowplow event to another stream

This guide covers how to setup Stream Enrich.

## Install, configure and run Stream Enrich

The [Stream Enrich reference](/docs/migrated/pipeline-components-and-applications/enrichment-components/stream-enrich/) describes how to install, run, and configure the application.

## Add any desired Enrichments

Each enrichment is enabled by configuring a JSON config file (one per enrichment), loading these into DynamoDB and then passing the location of the configs in DynamoDB to stream enrich on running it using the `--enrichments` [argument as documented](/docs/migrated/pipeline-components-and-applications/enrichment-components/stream-enrich/run-stream-enrich/).

## Sink the enriched data to S3 from Kinesis

Now that you have Stream Enrich running, you should have validated, enriched data being output into a Kinesis stream.

The next step is to [setup the Snowplow S3 loader](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/load-data-to-s3/) to sink this data to S3.

Instructions on how to load the data into other data stores e.g. Redshift, SnowflakeDB and Elastic can be found under [Destinations](/docs/migrated/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/)
