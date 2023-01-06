---
title: "Snowflake loader"
date: "2022-04-05"
sidebar_position: 20
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

It is possible to run Snowflake Loader on both AWS and GCP.

### Running on AWS

There are two ways to set up the necessary Snowflake resources and run the loader on AWS:

- using our dedicated open source Terraform modules to create the resources and deploy the loader on EC2
- creating the resources and running the application manually.

We recommend the first way.

### Running on GCP

At the moment, terraform modules for deploying Snowflake Loader on GCP aren't implemented. Therefore necessary Snowflake resources needs to be created and application needs to be deployed manually.


## Using the Terraform modules (for AWS)

### Requirements

- Terraform >= 1.0.0
- [`terraform-snowflake-target` module](https://registry.terraform.io/modules/snowplow-devops/target/snowflake/latest)
- [`terraform-aws-snowflake-loader-setup` module](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-setup/aws/latest)
- [`terraform-aws-snowflake-loader-ec2` module](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest)

### Usage

The `terraform-snowflake-target` and `terraform-aws-snowflake-loader-setup` modules create the necessary Snowflake resources to run the loader. The outputs of these modules become inputs to the `terraform-aws-snowflake-loader-ec2` module.

Stitching these modules together is described [here](https://github.com/snowplow-devops/terraform-aws-snowflake-loader-ec2/blob/master/README.md).

We also have full pipeline deployment examples [here](https://github.com/snowplow/quickstart-examples), including a [deployment example](https://github.com/snowplow/quickstart-examples/tree/main/terraform/aws/pipeline/secure/snowflake) for a pipeline with Snowflake as destination. This lets you see how all the Terraform modules are used in a full pipeline deployment.

## Manual setup and deployment

### Setting up Snowflake

The following resources need to be created:

- Snowflake loader [user](https://docs.snowflake.com/en/sql-reference/sql/create-user.html)
- Snowflake loader [role](https://docs.snowflake.com/en/sql-reference/sql/create-role.html)
- Snowflake [warehouse](https://docs.snowflake.com/en/sql-reference/sql/create-warehouse.html)
- Snowflake [database](https://docs.snowflake.com/en/sql-reference/sql/create-database.html)
- Snowflake [schema](https://docs.snowflake.com/en/sql-reference/sql/create-schema.html)
- `events` table in the same schema (see [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/modules/snowflake-loader/src/main/resources/atomic-def.sql) for the schema)
- Snowflake [storage integration](https://docs.snowflake.com/en/sql-reference/sql/create-storage-integration.html)
- Snowflake [file format](https://docs.snowflake.com/en/sql-reference/sql/create-file-format.html)
- Snowflake [stage](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html) to load transformed events.

#### Creating Snowflake stage for transformed events

The Snowflake stage is the most complicated one to create from the resources listed above.

To create a Snowflake stage, you need a Snowflake database, Snowflake schema, Snowflake storage integration, Snowflake file format, and the blob storage (S3 or GCS) path to the transformed events bucket.

You can follow [this tutorial](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration.html) to create the storage integration.

Assuming you created the other required resources for it, you can create the Snowflake stage by following [this document](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html).

### Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

<p>It's also available as a Docker image on Docker Hub under <code>{`snowplow/rdb-loader-snowflake:${versions.rdbLoader}`}</code>.</p>

### Configuring `rdb-loader-snowflake`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

|Minimal Configuration|Extended Configuration|
|-|-|
|[aws/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/snowflake.config.minimal.hocon)|[aws/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/snowflake.config.reference.hocon)|
|[gcp/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/gcp/snowflake.config.minimal.hocon)|[gcp/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/gcp/snowflake.config.reference.hocon)|

For details about each setting, see the [configuration reference](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplow.io/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

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
