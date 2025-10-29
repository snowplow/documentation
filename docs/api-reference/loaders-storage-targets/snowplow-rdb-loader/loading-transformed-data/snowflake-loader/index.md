---
title: "Snowflake loader"
date: "2022-04-05"
sidebar_position: 20
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import AutoSchemaCreation from '@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/_automatic-schema-creation.md';
```

It is possible to run Snowflake Loader on AWS, GCP and Azure.

### Setting up Snowflake

You can use the steps outlined in our [quick start guide](/docs/get-started/self-hosted/quick-start/index.md?warehouse=snowflake#prepare-the-destination) to create most of the necessary Snowflake resources.

There are two different authentication methods with Snowflake Loader:
* With the `TempCreds` method, there are no additional Snowflake resources needed.
* With the `NoCreds` method, the Loader needs a Snowflake stage.

This choice is controlled by the `loadAuthMethod` [configuration setting](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md#snowflake-loader-storage-section).

:::note

For GCP pipelines, only the `NoCreds` method is available.

:::

<details>
<summary>Using the <code>NoCreds</code> method</summary>

First, create a Snowflake stage. For that, you will need a Snowflake database, Snowflake schema, Snowflake storage integration, Snowflake file format, and the path to the transformed events bucket (in S3, GCS or Azure Blob Storage).

You can follow [this tutorial](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration.html) to create the storage integration.

Assuming you created the other required resources for it, you can create the Snowflake stage by following [this document](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html).

Finally, use the `transformedStage` [configuration setting](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md#snowflake-loader-storage-section) to point the loader to your stage.

</details>

### Running the loader

There are dedicated terraform modules for deploying Snowflake Loader on [AWS](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest) and [Azure](https://github.com/snowplow-devops/terraform-azurerm-snowflake-loader-vmss). You can see how they are used in our full pipeline deployment examples [here](/docs/get-started/self-hosted/quick-start/index.md).

We don't have a terraform module for deploying Snowflake Loader on GCP yet. Therefore, it needs to be deployed manually at the moment.

### Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

<p>It's also available as a Docker image on Docker Hub under <code>{`snowplow/rdb-loader-snowflake:${versions.rdbLoader}`}</code>.</p>

### Configuring `rdb-loader-snowflake`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

| Minimal Configuration                                                                                                                                  | Extended Configuration                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [aws/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/snowflake.config.minimal.hocon)     | [aws/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/snowflake.config.reference.hocon)     |
| [gcp/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/gcp/snowflake.config.minimal.hocon)     | [gcp/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/gcp/snowflake.config.reference.hocon)     |
| [azure/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/azure/snowflake.config.minimal.hocon) | [azure/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/azure/snowflake.config.reference.hocon) |

For details about each setting, see the [configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/api-reference/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority.

:::

### Running the Snowflake loader

The two config files need to be passed in as base64-encoded strings:

<CodeBlock language="bash">{
`$ docker run snowplow/rdb-loader-snowflake:${versions.rdbLoader} \\
--iglu-config $RESOLVER_BASE64 \\
--config $CONFIG_BASE64
`}</CodeBlock>

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Snowflake Loader" since="5.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
