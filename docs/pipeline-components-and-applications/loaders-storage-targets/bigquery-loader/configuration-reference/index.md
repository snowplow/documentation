---
title: "BigQuery Loader configuration reference"
sidebar_label: "Configuration reference"
sidebar_position: 1
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import BigqueryConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/_bigquery_config.md';
import PubsubConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/_kinesis_config.md';
import KafkaConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/configuration-reference/_common_config.md';
```

<p>The configuration reference in this page is written for BigQuery Loader <code>{`${versions.bqLoader}`}</code></p>

### BigQuery configuration

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <BigqueryConfig/>
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
