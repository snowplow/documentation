---
title: "Lake Loader Azure configuration reference"
date: "2023-09-18"
sidebar_position: 2
---


```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

<p>The configuration reference in this page is written for Lake Loader <code>{`${versions.lakeLoader}`}</code></p>

## Delta config options

```mdx-code-block
import DeltaConfig from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/reusable/_delta_config.mdx"


<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <DeltaConfig example="abfs://snowplow@example.dfs.core.windows.net/events"/>
    </tbody>
</table>
```

## Kafka config options

```mdx-code-block
import KafkaConfig from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/reusable/_kafka_config.mdx"


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
```

:::info Event Hubs Authentication

You can use the `input.consumerConf` and `output.bad.producerConf` options to configure authentication to Azure event hubs using SASL.  For example:

<CodeBlock>{`\
input.consumerConf: {
    "security.protocol": "SASL_SSL"
    "sasl.mechanism": "PLAIN"
    "sasl.jaas.config": "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"\$ConnectionString\" password=<PASSWORD>;"
}`}</CodeBlock>

:::


## Other processing config options

```mdx-code-block
import CommonConfig from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/reusable/_common_config.mdx"


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
```
