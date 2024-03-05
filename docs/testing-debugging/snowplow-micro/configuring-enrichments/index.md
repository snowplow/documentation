---
title: "Configuring enrichments"
sidebar_position: 3
description: "How to add enrichments to Snowplow Micro."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

By default, Micro does not come with any [enrichments](/docs/enriching-your-data/available-enrichments/index.md) enabled — this helps us keep the docker image smaller. You can enable any enrichments you like by passing corresponding configuration files to Micro.

<details>
<summary>Limitations for enrichments that rely on data files</summary>

Some enrichments require data files (e.g. a database of IPs).

The Enrich application in a full Snowplow pipeline will automatically download and periodically update these files. However, Micro will only download them once. You can always restart Micro to get a fresher copy of the files.

Also, the Enrich application supports files located in S3 and GCS with the `s3://` and `gs://` schemes respectively. Micro currently only supports `http://` and `https://`. You can often rewrite the URL to make it work:
* `s3://my-bucket/x/y` → `https://my-bucket.s3.amazonaws.com/x/y`
* `gs://my-bucket/x/y` → `https://storage.googleapis.com/my-bucket/x/y`

</details>

For example, let’s say that you want to configure the [IP Lookup enrichment](/docs/enriching-your-data/available-enrichments/ip-lookup-enrichment/index.md). The default configuration file looks like this:

```json reference
https://github.com/snowplow/enrich/blob/master/config/enrichments/ip_lookups.json
```

Put this file somewhere on the machine where you are running Micro, let’s say `my-enrichments/ip_lookups.json`. (Feel free to add any other configurations to `my-enrichments`).

Now you will need to pass this directory to the Docker container (using a [bind mount](https://docs.docker.com/storage/bind-mounts/)):

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/my-enrichments,destination=/config/enrichments \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

:::note

The directory _inside_ the container (what goes after `destination=`) must be exactly `/config/enrichments`.

:::

Once Micro starts, you should see messages like these:

```
[INFO] com.snowplowanalytics.snowplow.micro.Run - Downloading http://snowplow-hosted-assets.s3.amazonaws.com/third-party/maxmind/GeoLite2-City.mmdb...
[INFO] com.snowplowanalytics.snowplow.micro.Run - Enabled enrichments: IpLookupsEnrichment
```

:::tip

Micro is especially great for [testing the JavaScript enrichment](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/testing/index.md).

:::
