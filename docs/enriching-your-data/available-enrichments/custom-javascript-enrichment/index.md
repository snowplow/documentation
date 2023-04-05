---
title: "Custom JavaScript enrichment"
date: "2020-02-14"
sidebar_position: 10
---


```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Description

This enrichment lets you write a JavaScript function which is executed in the enrichment process for each enriched event. Use this enrichment to apply your own business logic to your enriched events at the row level.

## Overview

The custom JavaScript enrichment is a great example of the power of Snowplow.

Through this functionality the ability to “data widen” your events at the row level, means that if you have access to a unique data set that can be used to give a higher level of detail and context around certain events you are collecting, you can insert them at this enrichment step before writing to your data store.

Since your company has a unique set of customers and likely a unique set of data points that speak towards the behavioural interactions customers have with your site or applications, the more information you can capture at the time of the event means the more insight you can find in the analysis of those events.

:::tip JavaScript Language Features

JavaScript enrichment uses [Nashorn Engine](https://docs.oracle.com/javase/10/nashorn/introduction.htm) and since version 3.0.0 of Enrich, many features of ECMAScript 6 are supported. Please refer to [this page](http://openjdk.java.net/jeps/292) to know what is supported. About the uncertainty mentioned, our testing shows that classes and generators don't work, but tail calls do.

:::

## Configuration

- [schema](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-0)
- [example](https://github.com/snowplow/enrich/blob/master/config/enrichments/javascript_script_enrichment.json)

## Simple Example

Although the use cases for this enrichment can be endless, they don’t need to only serve analytics purposes. A very useful case might be in anti-spoofing for instance. You might want to make sure that the events being sent over are from your app or website rather than one spoofed by a hacker.

To do so you might write a Javascript function that checks if a secret key is valid server side, and only then set the event with the correct “app_id” variable that denotes it is a valid event from your property.

Taking this example further, you could do something like notify the user that sent the event that they are likely on a spoofing website.

Here’s an example snippet of code relating to the above:

```javascript
var SECRET_APP_ID = "Joshua";
    
/**
 * Performs two roles:
 * 1. If this is a server-side event, we
 *    validate that the app_id is our
 *    valid secret. Prevents spoofing of
 *    our server-side events
 * 2. If app_id is not null, return a new
 *    Acme context, derived_app_id, which
 *    contains the upper-cased app_id
 */
 
function process(event) {
    var appId = event.getApp_id();
  
    if (platform == "server" && appId != SECRET_APP_ID) {
        throw "Server-side event has invalid app_id: " + appId;
    }
  
    if (appId == null) {
        return [];
    }
  
    var appIdUpper = new String(appId.toUpperCase());
    return [ { schema: "iglu:com.acme/derived_app_id/jsonschema/1-0-0",
               data:  { appIdUpper: appIdUpper } } ];
}
```

## Working with event data

The event variable that is provided to the JavaScript function can be queried to retrieve any information stored in the event. The example below provides an example on how to retrieve a [custom event](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracking-specific-events/index.md#Tracking_custom_self-describing_unstructured_events) and a [custom context](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v2/tracking-specific-events/index.md#Custom_contexts) from an event. A full list of the available information can be found by looking at the [class definition of an Event](https://github.com/snowplow/enrich/blob/81d108152b54961867cd1f6218b22465afb5c083/modules/common/src/main/scala/com.snowplowanalytics.snowplow.enrich/common/outputs/EnrichedEvent.scala).

The JavaScript enrichment can be used to add additional contextual information into the Snowplow event. This is defined as a JSON array where each entry of the array is a custom context. See the example below for how this is formatted.

```javascript
/**
* process()
* Entry point for the Javascript enrichment function. Executed using Nashorn
* @param {EnrichedEvent} event Snowplow event to perform enrichment on.
* @returns {JSON Array} additional custom context to add to the event
*/
function process(event) {

    // get a custom event (if available) in JSON format from the snowplow event
    var customEvent = JSON.parse(event.getUnstruct_event());

    // get the schema from the custom event
    var customEventSchema = customEvent.data.schema;
    // get the data from the custom event
    var customEventData = customEvent.data.data;

    // get contexts (if available) in JSON format from the snowplow event
    var contexts = JSON.parse(event.getContexts());
    var contextArray = contexts.data;
    // get the schema for the first custom context
    var firstCustomContextSchema = contextArray[0].schema;

    // default response to return if not adding any additional custom contexts
    var responseJSON = [];

    // add a custom context to the array
    responseString = '{"schema": "iglu:com.example/example_entity/jsonschema/1-0-0", "data": {"content": "content", "task_id": "a439e001-c058-4f06-b975-89733096df35", "timestamp": "2020-09-25 15:47:25"}}';
    responseJSON.push(JSON.parse(responseString));

    // return the new custom contexts to Snowplow for validation
    return responseJSON;
}
```

## Working with JavaScript

The JavaScript enrichment in Snowplow is executed using Nashorn. This provides many [libraries and functions](https://docs.oracle.com/javase/8/docs/technotes/guides/scripting/nashorn/) to power complex use cases.

## Do's and Don'ts

Manipulating your event stream with Javascript is powerful, but can be dangerous.

### Do:

- use [Snowplow version tags](https://github.com/snowplow/snowplow/tags) to confirm the fields available in your Snowplow version’s enriched event POJO
- return as many contexts as you want
- throw an exception if you want this enriched event to end up in the Bad Bucket or Bad Stream
- include minified, self-contained JavaScript libraries that your `process(event)` function needs
- test this enrichment on sample sets of events before putting it into production
- ensure your new contexts are defined in Iglu, Redshift, JSON Paths etc

### Don’t:

- mutate existing fields in the supplied enriched event – return a new context instead
- try to share state across multiple enriched events – write your own Scalding or Spark job instead
- include CPU-intensive tasks without being aware of the impact on your event processing time
- allow untrusted parties to write your script – the script has access to the Java standard library and therefore to your filesystem.

## Testing your enrichment

You can test your enrichment with [Snowplow Micro](/docs/getting-started-with-micro/what-is-micro/index.md) before adding it to your production pipeline. Follow the Micro [usage guide](/docs/getting-started-with-micro/configuring-enrichments/index.md) to set up Micro and configure it to use your enrichment.

:::tip Testing `.js` files directly

One trick up Micro’s sleeve is that while you can add the full enrichment configuration in a JSON file (with your JavaScript encoded in base64), you can also just drop a `.js` file in your enrichments folder. Micro will interpret it as JavaScript enrichment code. This way, you don’t need to keep converting your enrichment to base64 as you iterate on it. _(Make sure to either use a `.json` or a `.js` file, but not both.)_

:::

Let’s walk through an example.

### Step 1. Write your enrichment

Suppose you want to add avocados to all your events:

```js title="avocado.js"
function process(event) {
    return [{
        schema: "iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0",
        data:  { sku: "avocado", quantity: "a lot" }
    }]
}
```

### Step 2. Run Micro

Run this command:

<CodeBlock language="bash">{
`docker run -p 9090:9090 \\
  --mount type=bind,source=$(pwd)/avocado.js,destination=/config/enrichments/avocado.js \\
  snowplow/snowplow-micro:${versions.snowplowMicro}`
}</CodeBlock>

You should see this line in the output:

```
[INFO] com.snowplowanalytics.snowplow.micro.Main$ - Enabled enrichments: JavascriptScriptEnrichment
```

### Step 3. Send some events

Point some tracking code at `localhost:9090` and fire some events. There are more details on this in the Micro [usage guide](/docs/getting-started-with-micro/basic-usage/index.md#sending-events-to-micro).

### Step 4. Look at the results

If you followed these steps, you will discover that the enrichment is wrong! The `quantity` field in the `add_to_cart` schema has to be a number. A look at the output from Micro confirms this:

```
[WARN] EventLog - BAD {
  "schemaKey" : "iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0",
  "error" : {
    "error" : "ValidationError",
    "dataReports" : [
      {
        "message" : "$.quantity: string found, number expected",
        "path" : "$.quantity",
        "keyword" : "type",
        "targets" : [
          "string",
          "number"
        ]
      }
    ]
  }
}
```

### Step 5. Fix the code

Let’s scale this down to just 1 avocado:

```js title="avocado.js"
function process(event) {
    return [{
        schema: "iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0",
        data:  { sku: "avocado", quantity: 1 }
    }]
}
```

### Step 6. Confirm everything works

Restart Micro and send more events. You can use the [Micro API](/docs/pipeline-components-and-applications/snowplow-micro/api/index.md) to inspect the events in detail:

```bash
curl localhost:9090/micro/good
```

You should see the new context being added:

```json
...
"derived_contexts": {
  "schema": "iglu:com.snowplowanalytics.snowplow/contexts/jsonschema/1-0-0",
  "data": [
    {
      "schema": "iglu:com.snowplowanalytics.snowplow/add_to_cart/jsonschema/1-0-0",
      "data": {
        "sku": "avocado",
        "quantity": 1
      }
    }
  ]
}
...
```

Et voilà!

## Uploading a custom JavaScript enrichment to Snowplow BDP

The Snowplow BDP Console can be used to upload a custom JavaScript enrichment to your Snowplow Mini(s) and pipeline(s).

You will need to convert your Javascript code to base64, and add it to the script parameter in the configuration.

Then follow the [documentation on uploading enrichments](/docs/enriching-your-data/configuring-enrichments/index.md).

## Output

This enrichment is the only one that can both update fields of the atomic event in-place or/and add derived contexts to the enriched event.
