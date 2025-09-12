---
title: "Databricks loader"
description: "Load transformed behavioral data into Databricks for advanced analytics and machine learning workflows."
schema: "TechArticle"
keywords: ["Databricks Loader", "Databricks Integration", "Data Lakehouse", "Spark Warehouse", "Analytics Platform", "Databricks Analytics"]
date: "2022-05-27"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import AutoSchemaCreation from '@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/_automatic-schema-creation.md';
```

## Setting up Databricks

The following resources need to be created:

- [Databricks cluster](https://docs.databricks.com/clusters/create-cluster.html)
- [Databricks access token](https://docs.databricks.com/dev-tools/api/latest/authentication.html)

<AutoSchemaCreation name="Databricks" grantDocs="https://docs.databricks.com/sql/language-manual/security-grant.html" />

### Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

<p>It's also available as a Docker image on Docker Hub under <code>{`snowplow/rdb-loader-databricks:${versions.rdbLoader}`}</code>.</p>


### Configuring `rdb-loader-databricks`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Databricks loader can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/api-reference/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) version 0.6.0 or above. [Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority.

:::

### Running the Databricks loader

The two config files need to be passed in as base64-encoded strings:

<CodeBlock language="bash">{
`$ docker run snowplow/rdb-loader-databricks:${versions.rdbLoader} \\
--iglu-config $RESOLVER_BASE64 \\
--config $CONFIG_BASE64
`}</CodeBlock>

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Databricks Loader" since="5.0.0" idSetting="telemetry.userProvidedId" disableSetting="telemetry.disable" />
```
