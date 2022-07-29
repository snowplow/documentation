---
title: "Configure Stream Enrich"
date: "2020-02-26"
sidebar_position: 20
---

## Basic configuration

### [](https://github.com/snowplow/snowplow/wiki/Configure-Stream-Enrich#template)Template

Template configuration for Kafka can be found [here](https://github.com/snowplow/enrich/blob/3.2.0/config/stream-enrich-kafka.hocon).

### Monitoring

You can also now include Snowplow Monitoring in the application. This is setup through an optional section at the bottom of the config. You will need to ammend:

- `monitoring.snowplow.collectorUri` insert your snowplow collector URI here.
- `monitoring.snowplow.appId` the app-id used in decorating the events sent.

If you do not wish to include Snowplow Monitoring please remove the entire `monitoring` section from the config.

## Resolver configuration

You will also need a JSON configuration for the Iglu resolver used to look up JSON schemas. A sample configuration is available [here](https://github.com/snowplow/enrich/blob/master/config/iglu_resolver.json).

## Enrichments configuration

You may wish to use Snowplow's configurable enrichments. To do this, create a directory of enrichment JSONs. For each configurable enrichment you wish to use, the enrichments directory should contain a .json file with a configuration JSON for that enrichment. When you come to run Stream Enrich you can then pass in the path to this directory using the _\--enrichments_ parameter.

Example configurations could be found at [GitHub repository](https://github.com/snowplow/enrich/tree/master/config/enrichments).

See the documentation on [configuring enrichments](/docs/migrated/enriching-your-data/available-enrichments/) for details on the available enrichments.

## Configuration in DynamoDB

When using with Kinesis, it’s possible to store the configuration of the resolver and/or enrichments in DynamoDB. In this case `dynamodb:` prefix needs to be used in place of `file:` prefix:

```
  --resolver dynamodb:eu-west-1/configuration_table/resolver \
  --enrichments dynamodb:eu-west-1/configuration_table/enrichment_
```

In this case it’s assumed that the enrichments and resolver are stored in a table named `configuration_table` in eu-west-1, that the key for that table is `id`, that the resolver JSON is stored in an item whose key has value `resolver`, and the enrichments are stored in items whose keys have values beginning with `enrichment`.

In the example above `configuration_table` is a table with 2 columns : `id` and `json`.

There must be one line with `resolver` as `id` and the content in the `json` column.

`enrichment_` is the prefix used in the `id` column to configure an enrichment, and then the content must be put in the `json` column. Here is the list of all the enrichments (with `enrichment_` prefix) in `id` column :

- enrichment\_api\_request\_enrichment\_config
- enrichment\_http\_header\_extractor\_config
- enrichment\_iab\_spiders\_and\_robots\_enrichment
- enrichment\_pii\_enrichment\_config
- enrichment\_sql\_query\_enrichment\_config
- enrichment\_weather\_enrichment\_config
- enrichment\_yauaa\_enrichment\_config
- enrichment\_anon\_ip
- enrichment\_campaign\_attribution
- enrichment\_cookie\_extractor\_config
- enrichment\_currency\_conversion\_config
- enrichment\_event\_fingerprint\_config
- enrichment\_ip\_lookups
- enrichment\_javascript\_script\_config
- enrichment\_referer\_parser
- enrichment\_ua\_parser\_config
- enrichment\_user\_agent\_utils\_config
