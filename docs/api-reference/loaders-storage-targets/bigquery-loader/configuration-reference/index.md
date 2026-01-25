---
title: "BigQuery Loader configuration reference"
sidebar_label: "Configuration reference"
sidebar_position: 1
description: "Configure BigQuery Streaming Loader with BigQuery, Kinesis, and Pub/Sub settings for streaming enriched Snowplow events."
keywords: ["bigquery config", "loader configuration", "streaming config", "kinesis config", "pubsub config"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Admonition from '@theme/Admonition';
import BigqueryConfig from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/_bigquery_config.md';
import PubsubConfig from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/_pubsub_config.md';
import KinesisConfig from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/_kinesis_config.md';
import CommonConfig from '@site/docs/api-reference/loaders-storage-targets/bigquery-loader/configuration-reference/_common_config.md';
```

<p>The configuration reference in this page is written for BigQuery Loader <code>{`${versions.bqLoader}`}</code></p>

### License

The BigQuery Loader is released under the [Snowplow Limited Use License](/limited-use-license-1.1/) ([FAQ](/docs/resources/limited-use-license-faq/index.md)).

To accept the terms of license and run the loader, set the `ACCEPT_LIMITED_USE_LICENSE=yes` environment variable. Alternatively, configure the `license.accept` option in the config file:

```json
"license": {
  "accept": true
}
```

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
