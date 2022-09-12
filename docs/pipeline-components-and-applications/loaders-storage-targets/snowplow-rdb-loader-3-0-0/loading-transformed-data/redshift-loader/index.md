---
title: "Redshift loader"
date: "2022-04-05"
sidebar_position: 10
---

## Setting up Redshift

Refer to our [guide](/docs/getting-started-on-snowplow-open-source/setup-snowplow-on-aws/setup-destinations/setup-redshift/index.md) on how to setup and launch a Redshift cluster.

## Downloading the artefact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

It's also available as a Docker image on Docker Hub under `snowplow/rdb-loader-redshift:4.2.0`.

## Configuring `rdb-loader-redshift`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Redshift loader can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/redshift.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/redshift.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

**NOTE:** All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplow.io/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

## Running the Redshift loader

The two config files need to be passed in as base64-encoded strings:

```bash
$ docker run snowplow/rdb-loader-redshift:4.2.0 \
  --iglu-config $RESOLVER_BASE64 \
  --config $CONFIG_BASE64
```
