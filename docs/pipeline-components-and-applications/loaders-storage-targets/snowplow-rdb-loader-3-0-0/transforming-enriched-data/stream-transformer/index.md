---
title: "Stream transformer"
date: "2022-04-04"
sidebar_position: 20
---

_For a high-level overview of the Transform process, see [Transforming enriched data](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/index.md). For guidance on picking the right `transformer` app, see [How to pick a transformer](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/index.md#how-to-pick-a-transformer)._

Unlike the [Spark transformer](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/spark-transformer/index.md), the stream transformer reads data directly from the enriched Kinesis stream and does not use Spark or EMR. It's a plain JVM application, like Stream Enrich or S3 Loader.

Reading directly from Kinesis means that the transformer can bypass the `s3DistCp` staging / archiving step.

Another benefit is that it doesn't process a bounded data set and can emit transformed folders based only on its configured frequency. This means the pipeline loading frequency is limited only by the storage target.

## Downloading the artefact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

It's also available as a Docker image on Docker Hub under `snowplow/transformer-kinesis:4.`1.0.

## Configuring `snowplow-transformer-kinesis`

The transformer takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the stream transformer can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.kinesis.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/transformer.kinesis.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/transforming-enriched-data/rdb-transformer-configuration-reference/index.md).

See [here](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

**NOTE:** All self-describing schemas for events processed by the transformer **must** be hosted on [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplow.io/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

## Running the stream transformer

The two config files need to be passed in as base64-encoded strings:

```bash
$ docker run snowplow/transformer-kinesis:4.1.0 \
  --iglu-config $RESOLVER_BASE64 \
  --config $CONFIG_BASE64
```
