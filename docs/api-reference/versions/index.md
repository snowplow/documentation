---
title: "Snowplow component versions and compatibility matrix"
sidebar_label: "Versions and compatibility"
date: "2021-04-29"
sidebar_position: -1000
description: "Latest versions of Snowplow components including collectors, enrichment, loaders, trackers, Iglu, data models, and analytics SDKs with compatibility and upgrade information."
keywords: ["component versions", "version compatibility", "latest versions", "upgrade guides", "deprecation"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {versions} from '@site/src/componentVersions';
```

In short, almost everything is compatible with almost everything. We rarely change the core protocols that various components use to communicate.

You might encounter specific restrictions when following the documentation, for example, some of our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md) might call for a reasonably recent version of the [warehouse loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md).

## Upgrades and deprecation

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to deal with upgrading your pipeline. We'll perform upgrades for you.

:::

Some major upgrades might have breaking changes. In this case, we provide upgrade guides, such as the ones for [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/upgrade-guides/index.md).

From time to time, we develop better applications for certain tasks and deprecate the old ones. Deprecations are announced on [Community](https://community.snowplow.io/).

---

## Latest versions

### Core pipeline

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install any of the core pipeline components yourself. We'll deploy your pipeline and keep it up to date.

:::

<Tabs groupId="cloud" queryString>
<TabItem value="aws" label="AWS" default>

| Component                                                                                                                |           Latest version              |
| :----------------------------------------------------------------------------------------------------------------------- | :-----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                                        |        {versions.collector}           |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                             |          {versions.enrich}            |
| [RDB Loader (Redshift, Snowflake, Databricks)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) |        {versions.rdbLoader}           |
| [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                                  |         {versions.bqLoader}           |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                          |        {versions.lakeLoader}          |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)            | {versions.snowflakeStreamingLoader}   |
| [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md)          | {versions.databricksStreamingLoader}  |
| [S3 Loader](/docs/api-reference/loaders-storage-targets/s3-loader/index.md)                                              |         {versions.s3Loader}           |
| [Snowbridge](/docs/api-reference/snowbridge/index.md)                                                                    |        {versions.snowbridge}          |
| [Elasticsearch Loader](/docs/api-reference/loaders-storage-targets/elasticsearch/index.md)                               |         {versions.esLoader}           |
| [Dataflow Runner](/docs/api-reference/dataflow-runner/index.md)                                                          |      {versions.dataflowRunner}        |

</TabItem>
<TabItem value="gcp" label="GCP">

| Component                                                                                                       |           Latest version             |
| :-------------------------------------------------------------------------------------------------------------- | :----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                               |        {versions.collector}          |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                    |          {versions.enrich}           |
| [RDB Loader (Snowflake, Databricks)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)  |        {versions.rdbLoader}          |
| [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                         |         {versions.bqLoader}          |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                 |        {versions.lakeLoader}         |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)   | {versions.snowflakeStreamingLoader}  |
| [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) | {versions.databricksStreamingLoader} |
| [GCS Loader](/docs/api-reference/loaders-storage-targets/google-cloud-storage-loader/index.md)                  |        {versions.gcsLoader}          |
| [Snowbridge](/docs/api-reference/snowbridge/index.md)                                                           |        {versions.snowbridge}         |

</TabItem>
<TabItem value="azure" label="Azure">

| Component                                                                                                       |           Latest version             |
| :-------------------------------------------------------------------------------------------------------------- | :----------------------------------: |
| [Stream Collector](/docs/api-reference/stream-collector/index.md)                                               |        {versions.collector}          |
| [Enrich](/docs/api-reference/enrichment-components/index.md)                                                    |          {versions.enrich}           |
| [RDB Loader (Snowflake)](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md)              |        {versions.rdbLoader}          |
| [BigQuery Loader](/docs/api-reference/loaders-storage-targets/bigquery-loader/index.md)                         |         {versions.bqLoader}          |
| [Lake Loader](/docs/api-reference/loaders-storage-targets/lake-loader/index.md)                                 |        {versions.lakeLoader}         |
| [Snowflake Streaming Loader](/docs/api-reference/loaders-storage-targets/snowflake-streaming-loader/index.md)   | {versions.snowflakeStreamingLoader}  |
| [Databricks Streaming Loader](/docs/api-reference/loaders-storage-targets/databricks-streaming-loader/index.md) | {versions.databricksStreamingLoader} |


</TabItem>
</Tabs>

### Iglu (schema registry)

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install Iglu Server yourself. It's also unlikely that you need to use any of the other components in this section. You can manage your data structures [in the UI or via the API](/docs/event-studio/data-structures/manage/index.md).

:::

| Component                                                                              |       Latest version       |
| :------------------------------------------------------------------------------------- | :------------------------: |
| [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)         |   {versions.igluServer}    |
| [`igluctl` utility](/docs/api-reference/iglu/igluctl-2/index.md)                       |     {versions.igluctl}     |
| [Iglu Scala client](/docs/api-reference/iglu/iglu-clients/scala-client-setup/index.md) | {versions.igluScalaClient} |
| [Iglu Objective-C client](/docs/api-reference/iglu/iglu-clients/objc-client/index.md)  | {versions.igluObjCClient}  |

### Trackers

| Tracker                                                                      |        Latest version        |
| :--------------------------------------------------------------------------- | :--------------------------: |
| [JavaScript (Web and Node.js)](/docs/sources/web-trackers/index.md) | {versions.javaScriptTracker} |
| [iOS](/docs/sources/mobile-trackers/index.md)                       |    {versions.iosTracker}     |
| [Android](/docs/sources/mobile-trackers/index.md)                   |  {versions.androidTracker}   |
| [React Native](/docs/sources/react-native-tracker/index.md)         | {versions.javaScriptTracker} |
| [Flutter](/docs/sources/flutter-tracker/index.md)                   |  {versions.flutterTracker}   |
| [WebView](/docs/sources/webview-tracker/index.md)                   |  {versions.webViewTracker}   |
| [Roku](/docs/sources/roku-tracker/index.md)                         |    {versions.rokuTracker}    |
| [Google AMP](/docs/sources/google-amp-tracker/index.md)             | {versions.googleAmpTracker}  |
| [Pixel](/docs/sources/pixel-tracker/index.md)                       |   {versions.pixelTracker}    |
| [Golang](/docs/sources/golang-tracker/index.md)                     |   {versions.golangTracker}   |
| [.NET](/docs/sources/net-tracker/index.md)                          |   {versions.dotNetTracker}   |
| [Java](/docs/sources/java-tracker/index.md)                         |    {versions.javaTracker}    |
| [Python](/docs/sources/python-tracker/index.md)                     |   {versions.pythonTracker}   |
| [Scala](/docs/sources/scala-tracker/index.md)                       |   {versions.scalaTracker}    |
| [Ruby](/docs/sources/ruby-tracker/index.md)                         |    {versions.rubyTracker}    |
| [Rust](/docs/sources/rust-tracker/index.md)                         |    {versions.rustTracker}    |
| [PHP](/docs/sources/php-tracker/index.md)                           |    {versions.phpTracker}     |
| [C++](/docs/sources/c-tracker/index.md)                             |    {versions.cppTracker}     |
| [Unity](/docs/sources/unity-tracker/index.md)                       |   {versions.unityTracker}    |
| [Lua](/docs/sources/lua-tracker/index.md)                           |    {versions.luaTracker}     |

### Data models

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

The latest version of [SQL Runner](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md) itself is **{versions.sqlRunner}**.

```mdx-code-block
import ModelVersionsSqlRunner from '@site/docs/modeling-your-data/modeling-your-data-with-sql-runner/_model-versions.md'

<ModelVersionsSqlRunner/>
```

### Testing and debugging

:::info Snowplow CDI

If you are a Snowplow CDI customer, rather than self-hosted, you don't need to install Snowplow Mini yourself. We can deploy it as required, and keep it up to date for you.

:::

| Application                                                             |      Latest version      |
| :---------------------------------------------------------------------- | :----------------------: |
| [Snowplow Micro](/docs/testing/snowplow-micro/index.md)                 | {versions.snowplowMicro} |
| [Snowplow Mini](/docs/api-reference/snowplow-mini/usage-guide/index.md) | {versions.snowplowMini}  |

### Analytics SDKs

| SDK                                                                               |          Latest version           |
| :-------------------------------------------------------------------------------- | :-------------------------------: |
| [Scala](/docs/api-reference/analytics-sdk/analytics-sdk-scala/index.md)           |   {versions.analyticsSdkScala}    |
| [Javascript](/docs/api-reference/analytics-sdk/analytics-sdk-javascript/index.md) | {versions.analyticsSdkJavascript} |
| [Python](/docs/api-reference/analytics-sdk/analytics-sdk-python/index.md)         |   {versions.analyticsSdkPython}   |
| [.NET](/docs/api-reference/analytics-sdk/analytics-sdk-net/index.md)              |   {versions.analyticsSdkDotNet}   |
| [Go](/docs/api-reference/analytics-sdk/analytics-sdk-go/index.md)                 |     {versions.analyticsSdkGo}     |
