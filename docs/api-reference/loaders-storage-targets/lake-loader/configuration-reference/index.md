---
title: "Lake Loader configuration reference"
sidebar_label: "Configuration reference"
sidebar_position: 1
description: "Configure Lake Loader for Delta Lake and Iceberg tables with Kinesis, Pub/Sub, and Kafka stream settings for data lakes."
keywords: ["lake loader config", "delta config", "iceberg config", "glue catalog", "lake configuration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DeltaConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_delta_config.md';
import IcebergRestConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_iceberg_rest_config.md';
import IcebergGlueConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_iceberg_glue_config.md';
import PubsubConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_kinesis_config.md';
import KafkaConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_common_config.md';
```

<p>The configuration reference in this page is written for Lake Loader <code>{`${versions.lakeLoader}`}</code></p>

### License

The Lake Loader is released under the [Snowplow Limited Use License](/limited-use-license-1.1/) ([FAQ](/docs/licensing/limited-use-license-faq/index.md)).

To accept the terms of license and run the loader, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, configure the `license.accept` option in the config file:

```hocon
license: {
  accept: true
}
```

### Table configuration

<Tabs groupId="lake-format" queryString>
  <TabItem value="delta" label="Delta Lake" default>
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <DeltaConfig/>
        </tbody>
    </table>
  </TabItem>

  <TabItem value="iceberg-glue" label="Iceberg / Glue">
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <IcebergGlueConfig/>
        </tbody>
    </table>
  </TabItem>

  <TabItem value="iceberg-rest" label="Iceberg / REST">

:::note

The REST catalog integration has been tested with Snowflake Open Catalog (Apache Polaris), Snowflake Horizon Catalog, and Databricks Unity Catalog.

:::

    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <IcebergRestConfig/>
        </tbody>
    </table>

Since 0.15.0, the loader can authenticate to Snowflake Horizon Catalog with a Snowflake key pair. Set `rest.auth.type` in `output.good.catalog.options` to select the loader's key-pair authentication, and provide the key pair's details alongside it. The loader exchanges a signed JWT for a catalog token at the catalog's `/v1/oauth/tokens` endpoint, and renews it before it expires.

```hocon
options: {
  "rest.auth.type": com.snowplowanalytics.snowplow.lakes.SnowflakeKeyPairAuthManager

  # -- Snowflake account identifier
  "snowflake.auth.account": MYORG-MYACCT

  # -- The Snowflake user the public key is registered against
  "snowflake.auth.user": LAKE_LOADER_SVC

  # -- The PKCS#8 private key in PEM format
  "snowflake.auth.private-key": ${SNOWFLAKE_PRIVATE_KEY}

  # -- Optional. Passphrase of an encrypted private key
  "snowflake.auth.private-key-passphrase": ${SNOWFLAKE_PRIVATE_KEY_PASSPHRASE}

  # -- The Snowflake role the loader acts as
  scope: "session:role:LAKE_LOADER_ROLE"
}
```

:::note[Account identifier format]

Write `snowflake.auth.account` as `<ORG>-<ACCOUNT>`, with a hyphen rather than a period, or as an account locator without its region, for example `XY12345` rather than `XY12345.us-east-1`. Snowflake rejects any other format as bad credentials.

:::

  </TabItem>

</Tabs>

### Streams configuration

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <KinesisConfig/>
        </tbody>
    </table>
  </TabItem>
  <TabItem value="gcp" label="GCP">
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <PubsubConfig/>
        </tbody>
    </table>
  </TabItem>
  <TabItem value="azure" label="Azure">
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <KafkaConfig/>
        </tbody>
    </table>

:::info[Event Hubs Authentication]

You can use the `input.consumerConf` and `output.bad.producerConf` options to configure authentication to Azure event hubs using SASL.  For example:

```hocon
input: {
  consumerConf: {
    "security.protocol": SASL_SSL
    "sasl.mechanism": PLAIN
    "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$ConnectionString\" password=<PASSWORD>;"
  }
}
```

:::

  </TabItem>
</Tabs>

## Other configuration options

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <CommonConfig/>
    </tbody>
</table>
