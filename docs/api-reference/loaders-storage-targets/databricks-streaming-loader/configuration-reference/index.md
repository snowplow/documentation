---
title: "Databricks Streaming Loader configuration reference"
sidebar_label: "Configuration reference"
sidebar_position: 1
description: "Configure Databricks Streaming Loader with Unity Catalog, Kinesis, Pub/Sub, and Kafka settings for lakehouse streaming."
keywords: ["databricks config", "unity catalog config", "lakeflow config", "streaming loader configuration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import DatabricksConfig from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/_databricks_config.md';
import PubsubConfig from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/_kinesis_config.md';
import KafkaConfig from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/configuration-reference/_common_config.md';
```

<p>The configuration reference in this page is written for Databricks Streaming Loader <code>{`${versions.databricksStreamingLoader}`}</code></p>

### License

The Databricks Streaming Loader is released under the [Snowplow Limited Use License](/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run the loader, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, configure the `license.accept` option in the config file:

```json
"license": {
  "accept": true
}
```

### Databricks configuration

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <DatabricksConfig/>
    </tbody>
</table>

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
