---
title: "Adding custom schemas"
sidebar_position: 4
description: "How to add custom schemas to Snowplow Micro."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

One of the benefits of using Snowplow is that you can design your own schemas for your events.

:::tip

See [our explanation](/docs/fundamentals/schemas/index.md) on what schemas are for and what they look like.

:::

To track an event with a custom schema, you would need code like this (using the [Browser tracker](/docs/sources/trackers/web-trackers/tracking-events/index.md#tracking-custom-self-describing-events) as an example):

```js
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';

trackSelfDescribingEvent({
  event: {
    schema: 'iglu:com.example/my-schema/jsonschema/1-0-0',
    data: {
        ...
    }
  }
});
```

For Micro to understand this event, it will need to know about `com.example/my-schema/jsonschema/1-0-0` or any other relevant schemas. There are two ways you can achieve this:

* **Point Micro to an Iglu registry that contains your schemas.** This is a good option if you use Snowplow [Console](/docs/data-product-studio/data-structures/manage/index.md) UI or [API](/docs/data-product-studio/data-structures/manage/api/index.md) to create schemas, or if you have deployed your own Iglu registry.
* **Add schemas to Micro directly.** This can be handy for quickly testing a schema.

Whichever approach you choose, you can use the [the API](/docs/api-reference/snowplow-micro/api/index.md#microiglu) to check if Micro is able to reach your schemas (replace `com.example` and `my-schema` as appropriate).

```bash
curl localhost:9090/micro/iglu/com.example/my-schema/jsonschema/1-0-0
```

## Pointing Micro to an Iglu registry

Place your Iglu registry URL and API key (if any) into two [environment variables](https://en.wikipedia.org/wiki/Environment_variable): `MICRO_IGLU_REGISTRY_URL` and `MICRO_IGLU_API_KEY`.

Make sure to fully spell out the URL, including the protocol (`http://` or `https://`). For most Iglu registries, including those provided by Snowplow CDI, the URL will end with `/api` — make sure to include that part too, for example: `https://com-example.iglu.snplow.net/api`. [Static registries](/docs/api-reference/iglu/iglu-repositories/static-repo/index.md), such as `http://iglucentral.com`, are an exception — you don’t need to append `/api` to the URL. <--TODO check this re. self-hosted -->

:::tip

You can find your Iglu registry URLs and generate API keys [via the console](https://console.snowplowanalytics.com/iglu-keys).

:::

The following Docker command will pick up the environment variables and pass them to Micro:

<CodeBlock language="bash">{
` export MICRO_IGLU_REGISTRY_URL=https://com-example.iglu.snplow.net/api
 export MICRO_IGLU_API_KEY=abcdef123456
${"\n"}
docker run -p 9090:9090 \\
  -e MICRO_IGLU_REGISTRY_URL \\
  -e MICRO_IGLU_API_KEY \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

This will ensure Micro uses your Iglu registry, in addition to [Iglu Central](/docs/api-reference/iglu/iglu-repositories/iglu-central/index.md).

For more flexibility, see [Advanced usage](/docs/data-product-studio/data-quality/snowplow-micro/advanced-usage/index.md#adding-custom-iglu-resolver-configuration).

## Adding schemas directly to Micro

:::note Limitations

Currently, this method does not work for [marking schemas as superseded](/docs/data-product-studio/data-structures/version-amend/amending/index.md#marking-the-schema-as-superseded).

:::

Structure your schema file or files like so:

```
schemas
└── com.example
    └── my-schema
        └── jsonschema
            ├── 1-0-0
            └── 1-0-1
```

:::note

This folder structure is significant. Also note that the schema files must be named `1-0-0`, `1-0-1`, and so on, **not** `1-0-0.json` or `1-0-1.json`.

:::

Next, you will need to place the schemas in `/config/iglu-client-embedded/` inside the container.

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/schemas,destination=/config/iglu-client-embedded/schemas \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

:::tip

You can read more about bind mounts in the [Docker documentation](https://docs.docker.com/storage/bind-mounts/).

:::

Alternatively, if you are running Micro as a Java application, place your schemas — using the same structure as above — in `some-directory/iglu-client-embedded` on your machine (`iglu-client-embedded` must be called exactly that) and use the following command:

<CodeBlock language="bash">{
`java -cp micro-${versions.snowplowMicro}.jar:some-directory com.snowplowanalytics.snowplow.micro.Main`
}</CodeBlock>
