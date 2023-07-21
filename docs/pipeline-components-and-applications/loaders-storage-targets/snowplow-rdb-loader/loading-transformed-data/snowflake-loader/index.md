---
title: "Snowflake loader"
date: "2022-04-05"
sidebar_position: 20
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import AutoSchemaCreation from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/_automatic-schema-creation.md';
```

It is possible to run Snowflake Loader on AWS, GCP and Azure.

### Setting up Snowflake

To create the Snowflake resources necessary for Snowflake Loader, you can execute the following SQL. You will need access to both `SYSADMIN` and `SECURITYADMIN` level roles to action this:

```sql
-- 1. Create database
CREATE DATABASE IF NOT EXISTS ${snowflake_database};

-- 2. Create schema within database
CREATE SCHEMA IF NOT EXISTS ${snowflake_database}.${snowflake_schema};

-- 3. Create a warehouse which will be used to load data
CREATE WAREHOUSE IF NOT EXISTS ${snowflake_warehouse} WITH WAREHOUSE_SIZE = 'XSMALL' WAREHOUSE_TYPE = 'STANDARD' AUTO_SUSPEND = 60 AUTO_RESUME = TRUE;

-- 4. Create a role that will be used for loading data
CREATE ROLE IF NOT EXISTS ${snowflake_loader_role};
GRANT USAGE, OPERATE ON WAREHOUSE ${snowflake_warehouse} TO ROLE ${snowflake_loader_role};
GRANT USAGE ON DATABASE ${snowflake_database} TO ROLE ${snowflake_loader_role};
GRANT ALL ON SCHEMA ${snowflake_database}.${snowflake_schema} TO ROLE ${snowflake_loader_role};

-- 5. Create a user that can be used for loading data
CREATE USER IF NOT EXISTS ${snowflake_loader_user} PASSWORD='${snowflake_password}'
  MUST_CHANGE_PASSWORD = FALSE
  DEFAULT_ROLE = ${snowflake_loader_role}
  EMAIL = 'loader@acme.com';
GRANT ROLE ${snowflake_loader_role} TO USER ${snowflake_loader_user};

-- 6. (Optional) Grant this role to SYSADMIN to make debugging easier from admin-users
GRANT ROLE ${snowflake_loader_role} TO ROLE SYSADMIN;
```

Also, there are two different load auth methods with Snowflake Loader. With `TempCreds` method, no additional Snowflake resources are needed. With `NoCreds` method, however, Loader needs Snowflake stage therefore it needs to be created prior as well.

To create a Snowflake stage, you need a Snowflake database, Snowflake schema, Snowflake storage integration, Snowflake file format, and the blob storage (S3, GCS and Azure) path to the transformed events bucket.

You can follow [this tutorial](https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration.html) to create the storage integration.

Assuming you created the other required resources for it, you can create the Snowflake stage by following [this document](https://docs.snowflake.com/en/sql-reference/sql/create-stage.html).

### Running the loader

There are dedicated terraform modules for deploying Snowflake Loader on [AWS](https://registry.terraform.io/modules/snowplow-devops/snowflake-loader-ec2/aws/latest) and [Azure](https://github.com/snowplow-devops/terraform-azurerm-snowflake-loader-vmss). You can see how they are used in our full pipeline deployment examples [here](https://github.com/snowplow/quickstart-examples).

We don't have terraform module for deploying Snowflake Loader on GCP yet. Therefore, it needs to be deployed manually at the moment.

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
|[azure/snowflake.config.minimal.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/azure/snowflake.config.minimal.hocon)|[azure/snowflake.config.reference.hocon](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/azure/snowflake.config.reference.hocon)|

For details about each setting, see the [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/loading-transformed-data/rdb-loader-configuration-reference/index.md).

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
