---
title: "Testing your enrichment"
sidebar_position: 2
description: "How to test and debug your enrichment code."
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

You can (and should!) test your enrichment with [Snowplow Micro](/docs/getting-started-with-micro/what-is-micro/index.md) before adding it to your production pipeline.

## Basic setup

If you haven’t worked with Micro before, take a look at the [usage guide](/docs/getting-started-with-micro/basic-usage/index.md). Adding the JavaScript enrichment to Micro is similar to [adding other enrichments](/docs/getting-started-with-micro/configuring-enrichments/index.md).

:::tip Testing `.js` files directly

One trick up Micro’s sleeve is that while you can add the full enrichment configuration in a JSON file (with your JavaScript encoded in base64), you can also just drop a `.js` file in your enrichments folder. Micro will interpret it as JavaScript enrichment code. This way, you don’t need to keep converting your enrichment to base64 as you iterate on it. _(Make sure to either use a `.json` or a `.js` file, but not both.)_

:::

For example, if your enrichment code is in `script.js` in the current directory, you can execute the following command to run it in Micro:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/script.js,destination=/config/enrichments/script.js \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

Next, point your tracking code to `localhost:9090` (see the [usage guide](/docs/getting-started-with-micro/basic-usage/index.md#sending-events-to-micro) for more details). Now the events you send to Micro will go through your enrichment code.

## Debugging

When debugging a JavaScript enrichment with Micro, there are two sources of useful information: Micro’s logs and its [REST API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md).

### Logs

The logs will quickly show you any failure. For example, if you forgot to add your schema:

```
[WARN] EventLog - BAD {
  "schemaKey" : "iglu:com.my-company/my-schema/jsonschema/1-0-0",
  "error" : {
    "error" : "ResolutionError",
    ...
```

Or if you made a typo in a function name:

```
[WARN] EventLog - BAD {
  "error" : "Error during execution of JavaScript function: [TypeError: event.getLongtitude is not a function in <eval> at line number 2]"
}
```

:::note

If you `throw` in your JavaScript code to [discard the event](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#discarding-the-event), you will get a similar failure message in the logs, but it would be expected.

:::

### Tracing

You can also add temporary `print` statements to your code to inspect certain values.

:::caution

Make sure to remove all debug printing when adding the enrichment to a production pipeline.

:::

Here’s an example:

```js
print(`--- URL is: ${event.getPage_url()}`);
```

This will be printed directly to the output from Micro.

Note that `console.log` and `console.dir` familiar to JavaScript developers _will not_ work in this context. If you want to pretty-print an object or array, the best approach is to use `JSON.stringify`:

```js
const myEvent = JSON.parse(event.getUnstruct_event());
print(JSON.stringify(myEvent.data, null, 2));
```

### REST API

Using Micro’s [REST API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md), you can verify that your code modifies event fields or adds entities as expected. The most useful endpoint is `/micro/good`, which will return all successfully processed events:

```bash
curl localhost:9090/micro/good
```

For example, if your code adds some entities, you will find them in the output from the REST API, under `derived_contexts` field for each event:

```json
...
"derived_contexts": {
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      "schema": "...",
      "data": { ... }
    },
    ...
  ]
}
...
```

## Iterating on code and schemas

If your enrichment [adds extra entities to the event](/docs/enriching-your-data/available-enrichments/custom-javascript-enrichment/writing/index.md#adding-extra-entities-to-the-event), you might be iterating on the schemas for those entities at the same time you are iterating on your enrichment code.

You can simplify your development and testing flow by [adding schemas to Micro](/docs/getting-started-with-micro/adding-schemas/index.md#adding-schemas-directly-to-micro) as local files. For example, your current directory might look like this:

```
script.js
schemas
└── com.my-company
    └── my-schema
        └── jsonschema
            └── 1-0-0
```

This command will add both the script and the schema to Micro:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/schemas,destination=/config/iglu-client-embedded/schemas \\
  --mount type=bind,source=$(pwd)/script.js,destination=/config/enrichments/script.js \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

## Testing with more complete events

Here are two more tips on getting the most of Micro when testing your JavaScript enrichment.

* If your enrichment uses fields filled by other enrichments, you will want to [enable those](/docs/getting-started-with-micro/configuring-enrichments/index.md) as well.

* If your enrichment relies on the `user_ipaddress` field or the `geo_*` fields, you will discover that `user_ipaddress` is your local one (e.g. something like `192.168.0.42`), and subsequently the `geo_*` fields are all `null`. That’s because you have both Micro and your tracking code running locally on the same machine. There is a way around that. Check out the section on [exposing Micro to the world](/docs/getting-started-with-micro/advanced-usage/index.md#exposing-micro-to-the-outside-world) — with this approach you can get a public URL for your Micro, to which you can point your tracking code. Now the interaction between your tracking and your Micro will go through the internet, and you will get a realistic IP address in your events.