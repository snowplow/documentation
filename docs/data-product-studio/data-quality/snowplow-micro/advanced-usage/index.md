---
title: "Advanced usage"
sidebar_position: 6
description: "Advanced Snowplow Micro configurations and workflows for complex behavioral data testing scenarios."
schema: "TechArticle"
keywords: ["Advanced Micro", "Micro Advanced", "Advanced Testing", "Power Features", "Expert Usage", "Advanced Features"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Enabling HTTPS

While in most cases HTTP is sufficient, you may want to enable HTTPS in Micro (for an example of when that’s useful, see [Locally resolving an existing domain name to Micro](/docs/data-product-studio/data-quality/snowplow-micro/remote-usage/index.md#locally-resolving-an-existing-domain-name-to-micro)).

You will need an SSL/TLS certificate in [PKCS 12](https://en.wikipedia.org/wiki/PKCS_12) format (`.p12`). Pass your certificate file and its password to the container (using a [bind mount](https://docs.docker.com/storage/bind-mounts/) and an [environment variable](https://docs.docker.com/compose/environment-variables/)). Don’t forget to expose the HTTPS port (by default, 9543):

<CodeBlock language="bash">{
`docker run -p 9090:9090 -p 9543:9543 \\
  --mount type=bind,source=$(pwd)/my-certificate.p12,destination=/config/ssl-certificate.p12 \\
  -e MICRO_SSL_CERT_PASSWORD=... \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

:::note

For the certificate, the path inside the container must be exactly `/config/ssl-certificate.p12`.

:::

You should see a message like this in the logs:

```
[INFO] com.snowplowanalytics.snowplow.micro.Main$ - HTTPS REST interface bound to /0.0.0.0:9543
```

As usual, you can change the ports to your liking (see [Running Micro](/docs/data-product-studio/data-quality/snowplow-micro/basic-usage/index.md#running)).

## Adding custom Iglu resolver configuration

If you’d like to tweak the Iglu registries Micro uses, the priority between them, the cache sizes, etc, you can provide your own [Iglu resolver configuration](/docs/api-reference/iglu/iglu-resolver/index.md) (`iglu.json`).

:::tip

If you are just looking to add custom schemas or connect to your private Iglu registry, check out [Adding custom schemas](/docs/data-product-studio/data-quality/snowplow-micro/adding-schemas/index.md) for simpler ways to achieve that.

:::

Pass your configuration file to the container (using a [bind mount](https://docs.docker.com/storage/bind-mounts/)) and instruct Micro to use it:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/iglu.json,destination=/config/iglu.json \\
  snowplow/snowplow-micro:${versions.snowplowMicro} \\
  --iglu /config/iglu.json`
}</CodeBlock>

That’s it. You can use the [the API](/docs/api-reference/snowplow-micro/api/index.md#microiglu) to check if Micro is able to reach your schemas (replace `com.example` and `my-schema` as appropriate).

```bash
curl localhost:9090/micro/iglu/com.example/my-schema/jsonschema/1-0-0
```

## Adding custom collector configuration

If you’d like to tweak the [collector configuration](/docs/api-reference/stream-collector/configure/index.md) inside Micro, the simplest approach is to override individual settings. For example, to change the cookie name:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  snowplow/snowplow-micro:${versions.snowplowMicro} \\
  -Dcollector.cookie.name=sp`
}</CodeBlock>

For more extensive changes, you can also bring your own configuration file (`micro.conf`).

<details>
<summary>Example</summary>

```hcl reference title="micro.conf"
https://github.com/snowplow-incubator/snowplow-micro/blob/master/example/micro.conf
```

</details>

Pass your configuration file to the container (using a [bind mount](https://docs.docker.com/storage/bind-mounts/)) and instruct Micro to use it:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/micro.conf,destination=/config/micro.conf \\
  snowplow/snowplow-micro:${versions.snowplowMicro} \\
  --collector-config /config/micro.conf`
}</CodeBlock>
