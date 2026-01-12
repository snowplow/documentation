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
import IcebergBigLakeConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_iceberg_biglake_config.md';
import IcebergGlueConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_iceberg_glue_config.md';
import PubsubConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_kinesis_config.md';
import KafkaConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/api-reference/loaders-storage-targets/lake-loader/configuration-reference/_common_config.md';
import Admonition from '@theme/Admonition';
```

<p>The configuration reference in this page is written for Lake Loader <code>{`${versions.lakeLoader}`}</code></p>

### License

The Lake Loader is released under the [Snowplow Limited Use License](https://docs.snowplow.io/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run the loader, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, configure the `license.accept` option in the config file:

```json
"license": {
  "accept": true
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

:::info Event Hubs Authentication

You can use the `input.consumerConf` and `output.bad.producerConf` options to configure authentication to Azure event hubs using SASL.  For example:

```json
"input.consumerConf": {
    "security.protocol": "SASL_SSL"
    "sasl.mechanism": "PLAIN"
    "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"\$ConnectionString\" password=<PASSWORD>;"
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
