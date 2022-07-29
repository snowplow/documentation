---
title: "Databricks loader"
date: "2022-05-27"
sidebar_position: 300
---

## Setting up Databricks

The following resources need to be created:

- [AWS instance profile](https://docs.databricks.com/administration-guide/cloud-configurations/aws/instance-profiles.html) for giving permission to Databricks cluster to access S3 buckets securely
- [Databricks cluster](https://docs.databricks.com/administration-guide/cloud-configurations/aws/instance-profiles.html#step-5-add-the-instance-profile-to-databricks) configured with the instance profile created above
- [Databricks access token](https://docs.databricks.com/dev-tools/api/latest/authentication.html)

### Downloading the artefact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

It's also available as a Docker image on Docker Hub under `snowplow/rdb-loader-databricks:4.2.0`.

### Configuring `rdb-loader-databricks`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Databricks loader can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/databricks.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/databricks.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/migrated/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader-3-0-0/loading-transformed-data/rdb-loader-configuration-reference/).

See [here](/docs/migrated/pipeline-components-and-applications/iglu/iglu-resolver/) for details on how to prepare the Iglu resolver file.

**NOTE:** All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/migrated/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/) 0.6.0 or above. [Iglu Central](/docs/migrated/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplowanalytics.com/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

### Running the Databricks loader

The two config files need to be passed in as base64-encoded strings:

```
$ docker run snowplow/rdb-loader-databricks:4.2.0 \
  --iglu-config $RESOLVER_BASE64 \
  --config $CONFIG_BASE64
```
