---
title: "Spark transformer configuration reference"
sidebar_label: "Spark transformer configuration reference"
date: "2022-10-13"
sidebar_position: 12
description: "Configure Spark batch transformer with EMR settings, S3 paths, output formats, and deduplication options for warehouse loading."
keywords: ["spark transformer config", "batch transformer config", "emr configuration", "deduplication config", "transformer settings"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
```

<p>The configuration reference in this page is written for Spark Transformer <code>{`${versions.rdbLoader}`}</code></p>

An example of the minimal required config for the Spark transformer can be found [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.batch.config.minimal.hocon) and a more detailed one [here](https://github.com/snowplow/snowplow-rdb-loader/tree/master/config/transformer/aws/transformer.batch.config.reference.hocon).

```mdx-code-block
import License from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/reusable/license/_index.mdx"

<License/>
```

```mdx-code-block
import BatchOnly from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/batch-only/_index.mdx"
import AwsOnly from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/aws-only/_index.mdx"
import Common from "@site/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/transforming-enriched-data/reusable/common/_index.mdx"

<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
      <BatchOnly/>
      <AwsOnly/>
      <Common/>
    </tbody>
</table>
```
