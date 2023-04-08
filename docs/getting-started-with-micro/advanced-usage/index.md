---
title: "Advanced usage"
sidebar_position: 4
description: "How to fully configure Snowplow Micro and expose it to the world."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

## Adding custom Iglu resolver configuration

If you’d like to tweak the Iglu registries Micro uses, the priority between them, the cache sizes, etc, you can provide your own [Iglu resolver configuration](/docs/pipeline-components-and-applications/iglu/iglu-resolver/index.md) (`iglu.json`).

:::tip

If you are just looking to add custom schemas or connect to your private Iglu registry, check out [Adding custom schemas](/docs/getting-started-with-micro/adding-schemas/index.md) for simpler ways to achieve that.

:::

Pass your configuration file to the container (using a [bind mount](https://docs.docker.com/storage/bind-mounts/)) and instruct Micro to use it:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/iglu.json,destination=/config/iglu.json \\
  snowplow/snowplow-micro:${versions.snowplowMicro} \\
  --iglu /config/iglu.json`
}</CodeBlock>

That’s it. You can use the [the API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md#microiglu) to check if Micro is able to reach your schemas (replace `com.example` and `my-schema` as appropriate).

```bash
curl localhost:9090/micro/iglu/com.example/my-schema/jsonschema/1-0-0
```

## Adding custom collector configuration

If you’d like to tweak the [collector configuration](/docs/pipeline-components-and-applications/stream-collector/configure/index.md) inside Micro, you can bring your own configuration file (`micro.conf`).

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

## Exposing Micro to the outside world

Sometimes you might want to send events to Micro running on your machine from tracking code that isn’t running on your machine.

In this case, you will need a publicly accessible URL for your Micro to point the tracker to.
The easiest way to achieve it is with a tool like [ngrok](https://ngrok.com/) or [localtunnel](https://theboroer.github.io/localtunnel-www/).

After running Micro as above, you just need to expose the port:

<Tabs groupId="exposing-micro" queryString>
  <TabItem value="ngrok" label="ngrok" default>

[Sign up](https://dashboard.ngrok.com/signup), [download](https://ngrok.com/download) ngrok and follow the instructions to authenticate your client. Then run this command:

```bash
ngrok http 9090
```

You will see the publicly available URL in the output.

  </TabItem>
  <TabItem value="localtunnel" label="localtunnel">

Install:

```bash
npm install -g localtunnel
```

Then run this command:

```bash
lt --port 9090
```

You will see the publicly available URL in the output. Before use, visit this URL in your web browser and click “Continue”.

  </TabItem>
</Tabs>
