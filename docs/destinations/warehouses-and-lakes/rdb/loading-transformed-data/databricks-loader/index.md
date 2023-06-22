---
title: "Databricks loader"
date: "2022-05-27"
sidebar_position: 300
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import AutoSchemaCreation from '@site/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/_automatic-schema-creation.md';
```

## Setting up Databricks

The following resources need to be created:

- [Databricks cluster](https://docs.databricks.com/clusters/create-cluster.html)
- [Databricks access token](https://docs.databricks.com/dev-tools/api/latest/authentication.html)

<AutoSchemaCreation name="Databricks" grantDocs="https://docs.databricks.com/sql/language-manual/security-grant.html" />

### Minimal Security Configuration _(optional)_

The security principal used by loader needs `Databricks SQL access` permission which can be enabled in the _Admin Console_.

Databricks does not have table access enabled by default. Enable it with the 
init script:
<details>
  <summary>Init script creation in scala notebook</summary>
  <CodeBlock language="scala">{
`
dbutils.fs.put("dbfs:/databricks/init/set_spark_params.sh","""
|#!/bin/bash
|
|cat << 'EOF' > /databricks/driver/conf/00-custom-table-access.conf
|[driver] {
|  "spark.databricks.acl.sqlOnly" = "true"
|}
|EOF
""".stripMargin, true)
`}</CodeBlock>
</details>

After adding the script, you need to restart the cluster. Verify that changes took effect by 
evaluating `spark.conf.get("spark.databricks.acl.sqlOnly")`, which should return `true`.


Start the loader so that it can create the tables. Now the cluster is ready to be configured:

```sql
-- Clean initial permissions from tables
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.events FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.manifest FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.rdb_folder_monitoring FROM `<principal>`;

-- Clean initial permissions from schema
REVOKE ALL PRIVILEGES ON SCHEMA <catalog>.<schema> FROM `<principal>`;

-- Loader will run CREATE TABLE IF NOT EXISTS statements, so USAGE and CREATE and both required.
GRANT USAGE, CREATE ON SCHEMA <catalog>.<schema> TO `<principal>`;

-- COPY TO statement requires ANY FILE and MODIFY for the receiving table
GRANT SELECT ON ANY FILE TO `<principal>`;
GRANT MODIFY  ON TABLE  <catalog>.<schema>.events TO `<principal>`;

-- These tables are used to store internal loader state
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.manifest TO `<principal>`;
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.rdb_folder_monitoring TO `<principal>`;
```

### Downloading the artifact

The asset is published as a jar file attached to the [Github release notes](https://github.com/snowplow/snowplow-rdb-loader/releases) for each version.

<p>It's also available as a Docker image on Docker Hub under <code>{`snowplow/rdb-loader-databricks:${versions.rdbLoader}`}</code>.</p>


### Configuring `rdb-loader-databricks`

The loader takes two configuration files:

- a `config.hocon` file with application settings
- an `iglu_resolver.json` file with the resolver configuration for your [Iglu](https://github.com/snowplow/iglu) schema registry.

An example of the minimal required config for the Databricks loader can be found [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/blob/master/config/loader/aws/databricks.config.reference.hocon). For details about each setting, see the [configuration reference](/docs/destinations/warehouses-and-lakes/rdb/loading-transformed-data/rdb-loader-configuration-reference/index.md).

See [here](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) for details on how to prepare the Iglu resolver file.

:::tip

All self-describing schemas for events processed by RDB Loader **must** be hosted on [Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or above. [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md) is a registry containing Snowplow-authored schemas. If you want to use them alongside your own, you will need to add it to your resolver file. Keep it mind that it could override your own private schemas if you give it higher priority. For details on this see [here](https://discourse.snowplow.io/t/important-changes-to-iglu-centrals-api-for-schema-lists/5720#how-will-this-affect-my-snowplow-pipeline-3).

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
