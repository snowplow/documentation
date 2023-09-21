---
title: "Lake Loader configuration reference"
sidebar_position: 1
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import CodeBlock from '@theme/CodeBlock';
import DeltaConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_delta_config.md';
import PubsubConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_pubsub_config.md';
import KafkaConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_common_config.md';
```

<p>The configuration reference in this page is written for Lake Loader <code>{`${versions.lakeLoader}`}</code></p>

### Table configuration

<Tabs groupId="format" queryString>
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

  <TabItem value="iceberg" label="Iceberg">

:::note Coming soon

Currently the lake loader supports [Delta format](https://delta.io/) only. Future releases will add support for [Iceberg](https://iceberg.apache.org/) format.

:::

  </TabItem>
</Tabs>

### Streams configuration

<Tabs groupId="cloud" queryString>
  <TabItem value="gcp" label="GCP" default>
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

<CodeBlock>{`\
input.consumerConf: {
    "security.protocol": "SASL_SSL"
    "sasl.mechanism": "PLAIN"
    "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"\$ConnectionString\" password=<PASSWORD>;"
}`}</CodeBlock>

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
