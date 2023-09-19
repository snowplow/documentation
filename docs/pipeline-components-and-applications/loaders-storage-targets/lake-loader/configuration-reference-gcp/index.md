---
title: "Lake Loader GCP configuration reference"
date: "2023-09-18"
sidebar_position: 1
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
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
      <DeltaConfig example="gs://my-snowplow-bucket/events"/>
    </tbody>
</table>
```

## Pubsub config options

```mdx-code-block
import PubsubConfig from "@site/docs/pipeline-components-and-applications/loaders-storage-targets/lake-loader/reusable/_pubsub_config.mdx"


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
```

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
