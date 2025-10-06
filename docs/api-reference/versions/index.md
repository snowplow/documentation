---
title: "Versions and compatibility"
date: "2021-04-29"
sidebar_position: -1000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {versions} from '@site/src/componentVersions';
```

## Compatibility

In short, almost everything is compatible with almost everything. We rarely change the core protocols that various components use to communicate.

You might encounter specific restrictions when following the documentation, for example, some of our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md) might call for a reasonably recent version of the [warehouse loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md).

## Upgrades and deprecation

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to deal with upgrading your pipeline. We'll perform upgrades for you.

:::

Some major upgrades might have breaking changes. In this case, we provide upgrade guides, such as the ones for [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/upgrade-guides/index.md).

From time to time, we develop better applications for certain tasks and deprecate the old ones. Deprecations are announced on [Community](http://community.snowplow.io/).

---

## Latest versions

### Core pipeline

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install any of the core pipeline components yourself. We'll deploy your pipeline and keep it up to date.

:::

<Tabs groupId="cloud" queryString>
<TabItem value="aws" label="AWS" default>

<ReactMarkdown children={`
| Component                                                                                                                |            Latest version            |
| :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                                        |        ${versions.collector}         |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                             |          ${versions.enrich}          |
| [RDB Loader (Redshift, Snowflake, Databricks)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) |        ${versions.rdbLoader}         |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                          |        ${versions.lakeLoader}        |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)            | ${versions.snowflakeStreamingLoader} |
| [S3 Loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md)                                              |         ${versions.s3Loader}         |
| [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)                                                   |        ${versions.snowbridge}        |
| [Elasticsearch Loader](/docs/api-reference/elasticsearch/index.md)                                                       |         ${versions.esLoader}         |
| [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)                         |      ${versions.postgresLoader}      |
| [Dataflow Runner](/docs/api-reference/dataflow-runner/index.md)                                                          |      ${versions.dataflowRunner}      |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="gcp" label="GCP">

<ReactMarkdown children={`
| Component                                                                                                      |            Latest version            |
| :------------------------------------------------------------------------------------------------------------- | :----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                              |        ${versions.collector}         |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                   |          ${versions.enrich}          |
| [RDB Loader (Snowflake, Databricks)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) |        ${versions.rdbLoader}         |
| [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                        |         ${versions.bqLoader}         |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                |        ${versions.lakeLoader}        |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)  | ${versions.snowflakeStreamingLoader} |
| [GCS Loader](/docs/api-reference/loaders-storage-targets/google-cloud-storage-loader/index.md)                 |        ${versions.gcsLoader}         |
| [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md)                                         |        ${versions.snowbridge}        |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                |        ${versions.lakeLoader}        |
| [Postgres Loader](/docs/api-reference/loaders-storage-targets/snowplow-postgres-loader/index.md)               |      ${versions.postgresLoader}      |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="azure" label="Azure">

<ReactMarkdown children={`
| Component                                                                                                     |            Latest version            |
| :------------------------------------------------------------------------------------------------------------ | :----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                             |        ${versions.collector}         |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                  |          ${versions.enrich}          |
| [RDB Loader (Snowflake)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)            |        ${versions.rdbLoader}         |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                               |        ${versions.lakeLoader}        |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md) | ${versions.snowflakeStreamingLoader} |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
</Tabs>

### Iglu (schema registry)

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install Iglu Server yourself. It's also unlikely that you need to use any of the other components in this section. You can manage your data structures [in the UI or via the API](/docs/data-product-studio/data-structures/manage/index.md).

:::

<ReactMarkdown children={`
| Component                                                                              |       Latest version        |
| :------------------------------------------------------------------------------------- | :-------------------------: |
| [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)         |   ${versions.igluServer}    |
| [\`igluctl\` utility](/docs/api-reference/iglu/igluctl-2/index.md)                     |     ${versions.igluctl}     |
| [Iglu Scala client](/docs/api-reference/iglu/iglu-clients/scala-client-setup/index.md) | ${versions.igluScalaClient} |
| [Iglu Ruby client](/docs/api-reference/iglu/iglu-clients/ruby-client/index.md)         | ${versions.igluRubyClient}  |
| [Iglu Objective-C client](/docs/api-reference/iglu/iglu-clients/objc-client/index.md)  | ${versions.igluObjCClient}  |
`} remarkPlugins={[remarkGfm]} />

### Trackers

<ReactMarkdown children={`
| Tracker                                                                      |        Latest version         |
| :--------------------------------------------------------------------------- | :---------------------------: |
| [JavaScript (Web and Node.js)](/docs/sources/trackers/web-trackers/index.md) | ${versions.javaScriptTracker} |
| [iOS](/docs/sources/trackers/mobile-trackers/index.md)                       |    ${versions.iosTracker}     |
| [Android](/docs/sources/trackers/mobile-trackers/index.md)                   |  ${versions.androidTracker}   |
| [React Native](/docs/sources/trackers/react-native-tracker/index.md)         | ${versions.javaScriptTracker} |
| [Flutter](/docs/sources/trackers/flutter-tracker/index.md)                   |  ${versions.flutterTracker}   |
| [WebView](/docs/sources/trackers/webview-tracker/index.md)                   |  ${versions.webViewTracker}   |
| [Roku](/docs/sources/trackers/roku-tracker/index.md)                         |    ${versions.rokuTracker}    |
| [Google AMP](/docs/sources/trackers/google-amp-tracker/index.md)             | ${versions.googleAmpTracker}  |
| [Pixel](/docs/sources/trackers/pixel-tracker/index.md)                       |   ${versions.pixelTracker}    |
| [Golang](/docs/sources/trackers/golang-tracker/index.md)                     |   ${versions.golangTracker}   |
| [.NET](/docs/sources/trackers/net-tracker/index.md)                          |   ${versions.dotNetTracker}   |
| [Java](/docs/sources/trackers/java-tracker/index.md)                         |    ${versions.javaTracker}    |
| [Python](/docs/sources/trackers/python-tracker/index.md)                     |   ${versions.pythonTracker}   |
| [Scala](/docs/sources/trackers/scala-tracker/index.md)                       |   ${versions.scalaTracker}    |
| [Ruby](/docs/sources/trackers/ruby-tracker/index.md)                         |    ${versions.rubyTracker}    |
| [Rust](/docs/sources/trackers/rust-tracker/index.md)                         |    ${versions.rustTracker}    |
| [PHP](/docs/sources/trackers/php-tracker/index.md)                           |    ${versions.phpTracker}     |
| [C++](/docs/sources/trackers/c-tracker/index.md)                             |    ${versions.cppTracker}     |
| [Unity](/docs/sources/trackers/unity-tracker/index.md)                       |   ${versions.unityTracker}    |
| [Lua](/docs/sources/trackers/lua-tracker/index.md)                           |    ${versions.luaTracker}     |
`} remarkPlugins={[remarkGfm]} />

### Data Models

#### dbt

[Modeling data with dbt](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) is our recommended approach.

```mdx-code-block
import ModelVersionsDbt from '@site/docs/modeling-your-data/modeling-your-data-with-dbt/_model-versions.md'

<ModelVersionsDbt/>
```

See also the [dbt version compatibility checker](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md#dbt-version-compatibility-checker).

#### SQL Runner

:::note

We recommend using the dbt models above, as they are more actively developed.

:::

<ReactMarkdown children={`
The latest version of [SQL Runner](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md) itself is **${versions.sqlRunner}**.
`}/>

```mdx-code-block
import ModelVersionsSqlRunner from '@site/docs/modeling-your-data/modeling-your-data-with-sql-runner/_model-versions.md'

<ModelVersionsSqlRunner/>
```

### Testing and debugging

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install Snowplow Mini yourself. We can deploy it as required, and keep it up to date for you.

:::

<ReactMarkdown children={`
| Application                                                                      |      Latest version       |
| :------------------------------------------------------------------------------- | :-----------------------: |
| [Snowplow Micro](/docs/data-product-studio/data-quality/snowplow-micro/index.md) | ${versions.snowplowMicro} |
| [Snowplow Mini](/docs/api-reference/snowplow-mini/usage-guide/index.md)          | ${versions.snowplowMini}  |
`} remarkPlugins={[remarkGfm]} />

### Analytics SDKs

<ReactMarkdown children={`
| SDK                                                                               |           Latest version           |
| :-------------------------------------------------------------------------------- | :--------------------------------: |
| [Scala](/docs/api-reference/analytics-sdk/analytics-sdk-scala/index.md)           |   ${versions.analyticsSdkScala}    |
| [Javascript](/docs/api-reference/analytics-sdk/analytics-sdk-javascript/index.md) | ${versions.analyticsSdkJavascript} |
| [Python](/docs/api-reference/analytics-sdk/analytics-sdk-python/index.md)         |   ${versions.analyticsSdkPython}   |
| [.NET](/docs/api-reference/analytics-sdk/analytics-sdk-net/index.md)              |   ${versions.analyticsSdkDotNet}   |
| [Go](/docs/api-reference/analytics-sdk/analytics-sdk-go/index.md)                 |     ${versions.analyticsSdkGo}     |
`} remarkPlugins={[remarkGfm]} />
