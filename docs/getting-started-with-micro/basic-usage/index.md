---
title: "Basic usage"
sidebar_position: 1
description: "How to run Snowplow Micro and send events to it."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
import Badges from '@site/src/components/Badges';
```

## Running

The easiest way to run Micro is through [Docker](https://www.docker.com/). <Badges badgeType="Docker Pulls" repo="snowplow/snowplow-micro" />

Run the following command:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

You should see output like this:
```
[INFO] akka.event.slf4j.Slf4jLogger - Slf4jLogger started
[INFO] com.snowplowanalytics.snowplow.micro.Main$ - REST interface bound to /0.0.0.0:9090
```

<details>
<summary>A note on ports...</summary>

The command above will route port `9090` on your machine to Micro.
If that port is already taken, you will want to change it, like so:

<CodeBlock language="bash">{
`docker run -p 5000:9090 snowplow/snowplow-micro:${versions.snowplowMicro}
              ↑↑↑↑`
}</CodeBlock>

Note that Micro will still log `REST interface bound to /0.0.0.0:9090` — `9090` here refers to the port _inside_ the container.

We will use `9090` in the examples below, but remember to substitute the port of your choosing.

</details>

:::tip

We also provide a _distroless_ image of Micro. Because it only includes the bare minimum, it’s smaller and more secure. However, the downside of using the distroless image is that basic utilities (such as a shell) are not available.

To use this image, add `-distroless` to the tag:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro}-distroless`
}</CodeBlock>

:::

## Sending events to Micro

Follow the documentation for one of [our trackers](/docs/collecting-data/collecting-from-own-applications/index.md) to implement some tracking code on your website or application.

You can then point it to `localhost:9090` where Micro is listening. For example, using the [Browser tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/index.md):

```js
import { newTracker, trackPageView, enableActivityTracking } from '@snowplow/browser-tracker';

// highlight-next-line
newTracker('snowplow', 'localhost:9090', {
  appId: 'my-app-id',
  plugins: [],
});

trackPageView();
enableActivityTracking({
  heartbeatDelay: 10,
  minimumVisitLength: 10,
});
```

## Checking the results

Once you have the tracking code and the events are flowing in, you should see something like this in the Micro logs:

```
[INFO] EventLog - GOOD id:4bfd5b32-d02a-4f83-a731-4339898437e1 app_id:test type:page_view (iglu:com.snowplowanalytics.snowplow/page_view/jsonschema/1-0-0)
[INFO] EventLog - GOOD id:e7a5c64d-d0f7-48d9-9a50-be044db7d2f6 app_id:test type:page_ping (iglu:com.snowplowanalytics.snowplow/page_ping/jsonschema/1-0-0)
[INFO] EventLog - GOOD id:1608ca85-f5f9-4948-898a-728aa8f1131b app_id:test type:page_ping (iglu:com.snowplowanalytics.snowplow/page_ping/jsonschema/1-0-0)
```

This means your tracking is set up correctly and your events are valid (`GOOD`).

If you wish to inspect the events further, you can use [the API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md). For example, try:

```bash
curl localhost:9090/micro/good
```

## Exporting events to TSV

Snowplow pipelines output data in the [_enriched TSV format_](/docs/understanding-your-pipeline/canonical-event/understanding-the-enriched-tsv-format/index.md). Typically, this is picked up by one of our [loaders](/docs/destinations/warehouses-and-lakes/index.md) or by tools such as [Snowbridge](/docs/destinations/forwarding-events/snowbridge/index.md).

With Micro, you can see what your data would look like in this format — useful if you want to test any logic that is parsing this data. 

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv`
}</CodeBlock>

<details>
<summary>Output vs logs</summary>

The TSV data will be printed to the [standard output](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)). As you saw above, Micro also prints logs, which go into the [standard error stream](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_(stderr)).

Depending on how you are running Micro, you might find the logs distracting. If so, you can turn off event logs with an extra option:

<CodeBlock language="bash">{
`docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv \\
  -Dorg.slf4j.simpleLogger.log.EventLog=off`
}</CodeBlock>

Or just discard the standard error stream entirely using the syntax appropriate for your shell:

<CodeBlock language="bash">{
`# for bash
docker run -p 9090:9090 snowplow/snowplow-micro:${versions.snowplowMicro} --output-tsv \\
  2>/dev/null`
}</CodeBlock>

</details>

## Adding custom schemas

One of the benefits of using Snowplow is that you can design your own schemas for your events.

:::tip

See [our explanation](/docs/understanding-tracking-design/understanding-schemas-and-validation/index.md) on what schemas are for and what they look like.

:::

To track an event with a custom schema, you would need code like this (using the [Browser tracker](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/browser-tracker/browser-tracker-v3-reference/tracking-events/index.md#tracking-custom-self-describing-events) as an example):

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

* **Point Micro to an Iglu registry that contains your schemas.** This is a good option if you use Snowplow BDP [UI](/docs/understanding-tracking-design/managing-data-structures/index.md) or [API](/docs/understanding-tracking-design/managing-data-structures-via-the-api-2/index.md) to create schemas, or if you have deployed your own Iglu registry.
* **Add schemas to Micro directly.** This can be handy for quickly testing a schema.

Whichever approach you choose, you can use the [the API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md#microiglu) to check if Micro is able to reach your schemas (replace `com.example` and `my-schema` as appropriate).

```bash
curl localhost:9090/micro/iglu/com.example/my-schema/jsonschema/1-0-0
```

### Pointing Micro to an Iglu registry

Place your Iglu registry URL and API key (if any) into two [environment variables](https://en.wikipedia.org/wiki/Environment_variable): `MICRO_IGLU_REGISTRY_URL` and `MICRO_IGLU_API_KEY`. Make sure to fully spell out the URL, including the protocol (`http://` or `https://`), for example `https://com-example.iglu.snplow.net/api` or `http://custom-iglu-registry.example.com`.

:::tip

In Snowplow BDP, you can find your Iglu registry URLs and generate API keys [via the console](https://console.snowplowanalytics.com/iglu-keys).

:::

The following Docker command will pick up the environment variables and pass them to Micro:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  -e MICRO_IGLU_REGISTRY_URL \\
  -e MICRO_IGLU_API_KEY \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

This will ensure Micro uses your Iglu registry, in addition to [Iglu Central](/docs/pipeline-components-and-applications/iglu/iglu-repositories/iglu-central/index.md).

For more flexibility, see [Advanced usage](/docs/getting-started-with-micro/advanced-usage/index.md#adding-custom-iglu-resolver-configuration).

### Adding schemas directly to Micro

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
