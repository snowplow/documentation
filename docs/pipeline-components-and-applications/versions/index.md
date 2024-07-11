---
title: "Versions and compatibility"
date: "2021-04-29"
sidebar_position: -1000
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {versions} from '@site/src/componentVersions';
```

## Compatibility

In short, almost everything is compatible with almost everything. We rarely change the core protocols that various components use to communicate.

You might encounter specific restrictions when following the documentation, for example, some of our [data models](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/index.md) might call for a reasonably recent version of the [warehouse loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md).

:::tip

When in doubt, feel free to start a thread on [Discourse](https://discourse.snowplow.io/).

:::

## Upgrades and deprecation

:::info Snowplow BDP

If you are using Snowplow BDP, you don’t need to deal with upgrading your pipeline, as we perform upgrades for you.

:::

Some major upgrades might have breaking changes. In this case, we provide upgrade guides, such as the ones for [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/upgrade-guides/index.md).

From time to time, we develop better applications for certain tasks and deprecate the old ones. Deprecations are announced on [Discourse](https://discourse.snowplow.io/).

We still keep the [documentation for legacy applications](/docs/pipeline-components-and-applications/legacy/index.md) for reference, along with guidance on what they have been replaced with.

---

## Latest versions

### Core pipeline

:::info Snowplow BDP

If you are using Snowplow BDP, you don’t need to install any of the core pipeline components yourself. We deploy your pipeline and keep it up to date.

:::

<Tabs groupId="cloud" queryString>
<TabItem value="aws" label="AWS" default>

Component | Latest version
:--|:-:
[Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) | {versions.collector}
[Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) | {versions.enrich}
[RDB Loader (Redshift, Snowflake, Databricks)](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | {versions.rdbLoader}
[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | {versions.lakeLoader}
[Snowflake Streaming Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/index.md) | {versions.snowflakeStreamingLoader}
[S3 Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/s3-loader/index.md) | {versions.s3Loader}
[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) | {versions.snowbridge}
[Elasticsearch Loader](/docs/pipeline-components-and-applications/elasticsearch/index.md) | {versions.esLoader}
[Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | {versions.postgresLoader}
[Dataflow Runner](/docs/pipeline-components-and-applications/dataflow-runner/index.md) | {versions.dataflowRunner}

</TabItem>
<TabItem value="gcp" label="GCP">

Component | Latest version
:--|:-:
[Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) | {versions.collector}
[Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) | {versions.enrich}
[RDB Loader (Snowflake, Databricks)](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | {versions.rdbLoader}
[BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md) | {versions.bqLoader}
[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | {versions.lakeLoader}
[Snowflake Streaming Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/index.md) | {versions.snowflakeStreamingLoader}
[GCS Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/google-cloud-storage-loader/index.md) | {versions.gcsLoader}
[Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md) | {versions.snowbridge}
[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | {versions.lakeLoader}
[Postgres Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-postgres-loader/index.md) | {versions.postgresLoader}

</TabItem>
<TabItem value="azure" label="Azure">

Component | Latest version
:--|:-:
[Stream Collector](/docs/pipeline-components-and-applications/stream-collector/index.md) | {versions.collector}
[Enrich](/docs/pipeline-components-and-applications/enrichment-components/index.md) | {versions.enrich}
[RDB Loader (Snowflake)](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) | {versions.rdbLoader}
[Lake Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/index.md) | {versions.lakeLoader}
[Snowflake Streaming Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowflake-streaming-loader/index.md) | {versions.snowflakeStreamingLoader}

</TabItem>
</Tabs>

### Iglu (schema registry)

:::info Snowplow BDP

If you are using Snowplow BDP, you don’t need to install Iglu Server yourself. It’s also unlikely that you need to use any of the other components in this section. You can manage your data structures [in the UI or via the API](/docs/understanding-tracking-design/managing-your-data-structures/index.md).

:::

Component | Latest version
:--|:-:
[Iglu Server](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-server/index.md) | {versions.igluServer}
[\`igluctl\` utility](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md) | {versions.igluctl}
[Iglu Scala client](/docs/pipeline-components-and-applications/iglu/iglu-clients/scala-client-setup/index.md) | {versions.igluScalaClient}
[Iglu Ruby client](/docs/pipeline-components-and-applications/iglu/iglu-clients/ruby-client/index.md) | {versions.igluRubyClient}
[Iglu Objective-C client](/docs/pipeline-components-and-applications/iglu/iglu-clients/objc-client/index.md) | {versions.igluObjCClient}

### Trackers

Tracker | Latest version
:--|:-:
[JavaScript (Web and Node.js)](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/index.md) | {versions.javaScriptTracker}
[iOS](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md) | {versions.iosTracker}
[Android](/docs/collecting-data/collecting-from-own-applications/mobile-trackers/index.md) | {versions.androidTracker}
[React Native](/docs/collecting-data/collecting-from-own-applications/react-native-tracker/index.md) | {versions.reactNativeTracker}
[Flutter](/docs/collecting-data/collecting-from-own-applications/flutter-tracker/index.md) | {versions.flutterTracker}
[WebView](/docs/collecting-data/collecting-from-own-applications/webview-tracker/index.md) | {versions.webViewTracker}
[Roku](/docs/collecting-data/collecting-from-own-applications/roku-tracker/index.md) | {versions.rokuTracker}
[Google AMP](/docs/collecting-data/collecting-from-own-applications/google-amp-tracker/index.md) | {versions.googleAmpTracker}
[Pixel](/docs/collecting-data/collecting-from-own-applications/pixel-tracker/index.md) | {versions.pixelTracker}
[Golang](/docs/collecting-data/collecting-from-own-applications/golang-tracker/index.md) | {versions.golangTracker}
[.NET](/docs/collecting-data/collecting-from-own-applications/net-tracker/index.md) | {versions.dotNetTracker}
[Java](/docs/collecting-data/collecting-from-own-applications/java-tracker/index.md) | {versions.javaTracker}
[Python](/docs/collecting-data/collecting-from-own-applications/python-tracker/index.md) | {versions.pythonTracker}
[Scala](/docs/collecting-data/collecting-from-own-applications/scala-tracker/index.md) | {versions.scalaTracker}
[Ruby](/docs/collecting-data/collecting-from-own-applications/ruby-tracker/index.md) | {versions.rubyTracker}
[Rust](/docs/collecting-data/collecting-from-own-applications/rust-tracker/index.md) | {versions.rustTracker}
[PHP](/docs/collecting-data/collecting-from-own-applications/php-tracker/index.md) | {versions.phpTracker}
[C++](/docs/collecting-data/collecting-from-own-applications/c-tracker/index.md) | {versions.cppTracker}
[Unity](/docs/collecting-data/collecting-from-own-applications/unity-tracker/index.md) | {versions.unityTracker}
[Lua](/docs/collecting-data/collecting-from-own-applications/lua-tracker/index.md) | {versions.luaTracker}

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

The latest version of [SQL Runner](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md) itself is **{versions.sqlRunner}**.

```mdx-code-block
import ModelVersionsSqlRunner from '@site/docs/modeling-your-data/modeling-your-data-with-sql-runner/_model-versions.md'

<ModelVersionsSqlRunner/>
```

### Testing and debugging

:::info Snowplow BDP

If you are using Snowplow BDP, you don’t need to install Snowplow Mini yourself. We (optionally) deploy it and keep it up to date for you.

:::

Application | Latest version
:--|:-:
[Snowplow Micro](/docs/testing-debugging/snowplow-micro/what-is-micro/index.md) | {versions.snowplowMicro}
[Snowplow Mini](/docs/pipeline-components-and-applications/snowplow-mini/usage-guide/index.md) | {versions.snowplowMini}

### Analytics SDKs

SDK | Latest version
:--|:-:
[Scala](/docs/destinations/analytics-sdk/analytics-sdk-scala/index.md) | {versions.analyticsSdkScala}
[Javascript](/docs/destinations/analytics-sdk/analytics-sdk-javascript/index.md) | {versions.analyticsSdkJavascript}
[Python](/docs/destinations/analytics-sdk/analytics-sdk-python/index.md) | {versions.analyticsSdkPython}
[.NET](/docs/destinations/analytics-sdk/analytics-sdk-net/index.md) | {versions.analyticsSdkDotNet}
[Go](/docs/destinations/analytics-sdk/analytics-sdk-go/index.md) | {versions.analyticsSdkGo}
