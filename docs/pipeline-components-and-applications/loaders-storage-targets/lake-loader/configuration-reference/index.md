---
title: "Lake Loader configuration reference"
sidebar_position: 1
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import DeltaConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_delta_config.md';
import HudiConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_hudi_config.md';
import IcebergBigLakeConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_iceberg_biglake_config.md';
import PubsubConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_kinesis_config.md';
import KafkaConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_kafka_config.md';
import CommonConfig from '@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/configuration-reference/_common_config.md';
import Admonition from '@theme/Admonition';
```

<p>The configuration reference in this page is written for Lake Loader <code>{`${versions.lakeLoader}`}</code></p>

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

  <TabItem value="hudi" label="Hudi">
    <Admonition type="note" title="Alternative Docker image">
    To use the Lake Loader with Hudi support, pull the appropriate alternative image from Docker Hub:
    <ul>
        <li><code>snowplow/lake-loader-aws:{`${versions.lakeLoader}`}-hudi</code></li>
        <li><code>snowplow/lake-loader-gcp:{`${versions.lakeLoader}`}-hudi</code></li>
        <li><code>snowplow/lake-loader-azure:{`${versions.lakeLoader}`}-hudi</code></li>
    </ul>
    </Admonition>
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <HudiConfig/>
        </tbody>
    </table>
  </TabItem>

  <TabItem value="iceberg-biglake" label="Iceberg / BigLake">
    <Admonition type="note" title="Alternative Docker image">
    To use the Lake Loader with BigLake support, pull the <code>snowplow/lake-loader-gcp:{`${versions.lakeLoader}`}-biglake</code> image from Docker Hub.
    </Admonition>
    <table>
        <thead>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
          <IcebergBigLakeConfig/>
        </tbody>
    </table>
  </TabItem>

  <TabItem value="iceberg-glue" label="Iceberg / Glue">

:::note Coming soon

A future release of Lake Loader will add support for [AWS Glue as an Iceberg catalog](https://docs.aws.amazon.com/glue/).

:::

  </TabItem>

  <TabItem value="iceberg-snowflake" label="Iceberg / Snowflake">

:::note Coming soon

A future release of Lake Loader will add support for [Snowflake as an Iceberg catalog](https://docs.snowflake.com/en/user-guide/tables-iceberg).

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

```json
"input.consumerConf": {
    "security.protocol": "SASL_SSL"
    "sasl.mechanism": "PLAIN"
    "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"\$ConnectionString\" password=<PASSWORD>;"
}
```

:::

  </TabItem>
  <TabItem value="aws" label="AWS">
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
