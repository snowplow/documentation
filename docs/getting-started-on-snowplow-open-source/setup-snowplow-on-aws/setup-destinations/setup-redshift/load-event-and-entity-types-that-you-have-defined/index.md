---
title: "Load event and entity types that you have defined"
date: "2020-02-26"
sidebar_position: 30
---

Snowplow supports users creating their own events and entities. Events and entity definitions live as schemas in Iglu schema registries.

When you load Snowplow data into Redshift, the process for loading events and entities that you have authored, vs events and entities that Snowplow has authored, are slightly different.

**Note**: Before RDB Loader R32, user had to deploy SQL tables and so called JSON Path files manually, for both Snowplow-authored and custom entities. [RDB Loader R32](https://discourse.snowplow.io/t/snowplow-rdb-loader-r32-released/3626) introduced table automigrations, which allow you to define entities only on Iglu Server. Table creation and mapping happen automatically.

## Loading Snowplow-authored events and entities

Snowplow-authored events and entity definitions are published to [Iglu Central](https://github.com/snowplow/iglu-central/), where anyone can access them. Snowplow provides pre-made Redshft table definitions for all these schemas here: `h[ttps://github.com/snowplow/iglu-central/tree/master/sql](https://github.com/snowplow/iglu-central/tree/master/sql)`.

For example, if you have link click tracking enabled in the JavaScript Tracker, then install `[com.snowplowanalytics.snowplow/link_click_1.sql](https://github.com/snowplow/iglu-central/blob/master/sql/com.snowplowanalytics.snowplow/link_click_1.sql)` into your Snowplow database.

Each table needs to be loaded using a JSON Paths file. Snowplow hosts JSON Paths files for all Snowplow-authored JSONs. RDB Loader will automatically locate these JSON Paths files and use them to load shredded types into Redshift.

## Defining and installing a new table

### Overview

RDB Loader loads each shredded type into its own table in Redshift. You need to create a Redshift table for each new shredded type you have defined.

### Creating a new table for a new event type

Once you have created a new schema in Iglu corresponding to your new event or entity type, you need to create a table definition for it. This can be automatically generated using [igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md), using the [static generate](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md#static-generate) command.

## Creating and uploading a JSON Paths file

### Overview

You need to create a JSON Paths file which RDB Loader will use to load your shredded type into Redshift.

The format is simple - a JSON Paths file consists of a JSON array, where each element corresponds to a column in the target table. For full details, see the [Copy from JSON](http://docs.aws.amazon.com/redshift/latest/dg/copy-usage_notes-copy-from-json.html) documentation from Amazon.

### Creating a JSON Paths file

JSON Path files should be automatically generated using [igluctl static generate --with-json-paths](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md#static-generate)

### Installing the JSON Paths file

Upload the JSON Paths file to a private S3 bucket which is accessible using the AWS credentials provided in your `config.yml` file.

Store the JSON Paths file in a sub-folder named after the vendor, for example:

```text
s3://acme-jsonpaths-files/com.acme.website/anonymous_customer_1.json
```
