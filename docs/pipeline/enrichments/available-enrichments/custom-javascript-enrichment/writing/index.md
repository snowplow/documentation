---
title: "Write JavaScript enrichment functions"
sidebar_position: 1
description: "Write custom JavaScript functions to transform events with access to event properties and utility functions."
sidebar_label: "Writing"
keywords: ["write JavaScript enrichment", "enrichment functions", "event transformation"]
---

Your JavaScript enrichment code should contain a function called `process`:
* This function will receive each event as its only argument
* It can optionally return an array of [entities](/docs/fundamentals/entities/index.md) to be added to the event (under `derived_contexts`)
* Any uncaught exceptions will result in [failed events](/docs/fundamentals/failed-events/index.md)

```js
function process(event) {
  // do something with the event...
  ...

  // add entities to the event
  return [ ... ];
}
```

You can only have _one_ JavaScript enrichment, and hence a single `process` function for your pipeline. However, you can split more complex logic into multiple helper functions and variables as you see fit, as long as you comply with the above interface.

:::tip JavaScript Language Features

JavaScript enrichment uses the [Nashorn Engine](https://docs.oracle.com/en/java/javase/11/nashorn/introduction.html) and since version 3.0.0 of Enrich, many features of ECMAScript 6 are supported. For a list of those features, please refer to [this OpenJDK proposal](http://openjdk.java.net/jeps/292). Regarding the features the proposal says “might be feasible” in the future, as of 2023 our testing shows that classes and generators don't work, but tail calls do.

:::

## Best practices

Before we dive into it, here are a few general tips:
* Make sure your code works for _all_ of your events, not just the particular types of events you are interested in. Remember, unhandled exceptions will result in [failed events](/docs/fundamentals/failed-events/index.md).
* Don’t try to share state across multiple enriched events. Enrichments are run inside a highly parallel application with multiple independent instances, so this will not work.
* In your enrichment code, avoid CPU-intensive tasks (e.g. encryption) and IO-intensive tasks (e.g. requests to an external service) without thoroughly benchmarking the impact they might have on your event processing time.
* The enrichment code has access to the Java standard library and therefore to the filesystem of the machine it’s running on. Proceed with caution when copying code from untrusted sources.

## Inspecting the event fields

Regardless of what you want to do with the event, you will likely want to inspect some of the data within. For instance, to get the `app_id` field:

```js
function process(event) {
  const appId = event.getApp_id();

  ...
```

There are getter methods available for each of the [standard event fields](/docs/pipeline/enriched-tsv-format/index.md?fields=table) — just capitalize the first letter of the field and prepend it with `get`, for example `event.getUser_ipaddress()` or `event.getGeo_country()`.

:::note

One exception is `refr_device_tstamp`, where the getter method is called `getRefr_dvce_tstamp` and _not_ `getRefr_device_tstamp`.

:::

## Inspecting self-describing events and entities

If your event is a [self-describing event](/docs/fundamentals/events/index.md#self-describing-events), you might want to access its fields. Here’s how to do it:

```js
function process(event) {
  ...

  const myEvent = JSON.parse(event.getUnstruct_event());

  if (myEvent) {
    // the schema of your self-describing event
    const mySchema = myEvent.data.schema;

    // the custom data in your self-describing event
    const myData = myEvent.data.data;

    ...
```

:::note

For events other than self-describing events, `getUnstruct_event()` will return `null`. The pattern above works, as `null` is a valid input for `JSON.parse`.

:::

You can access any [entities](/docs/fundamentals/entities/index.md) in the event in a similar fashion:

```js
function process(event) {
  ...

  const entities = JSON.parse(event.getContexts());

  if (entities) {
    // loop through the entities
    for (const entity of entities.data) {
      if (entity.schema.startsWith('iglu:org.my-company/my-schema/jsonschema/1')) {
        // work with the entity
        const myField = entity.data.myField;

        ...
      }
    }
  }

  ...
```

:::note

For events with no entities attached, `getContexts()` will return `null`. The pattern above works, as `null` is a valid input for `JSON.parse`.

:::

:::note Derived entities

For derived entities (added by other enrichments), you can use `event.getDerived_contexts()` in the same way as above. Note that this is only supported since Enrich 3.8.0 (and Snowplow Micro 1.7.1). In prior versions, this function always returns `null`.

:::

## Adding extra entities to the event

:::tip

Adding entities is the preferred way of augmenting your events with extra information, because it preserves the original event fields intact.

In some cases, you might choose to update existing fields instead of adding entities. However, keep in mind that if you overwrite a field, you won’t have access to its original value in your data warehouse or lake.

:::

The (optional) return value of the `process` function is an array of extra entities to add to the event. So adding entities is as simple as returning them!

```js
function process(event) {
  ...

  return [
    {
      schema: 'iglu:com.my-company/traffic-source/jsonschema/1-0-0',
      data: {
        traffic_source: 'internal'
      }
    }
  ];
}
```

The entities you add with this method will be _derived_ entities, similar to what other enrichments add. You will find them in the `derived_contexts` field of the event.

<details>
<summary>Behavior for special values (e.g. <code>NaN</code>)</summary>

Your array of entities will be passed to `JSON.stringify()` before being attached to the event. This is irrelevant for you, unless your entities have `NaN` values (they will become `null`), or `undefined` values (they will be dropped), or circular references (an exception will be thrown).

</details>

If you are still iterating on the schema while writing the JavaScript code, you might find the setup described in the [testing guide](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/testing/index.md#iterating-on-code-and-schemas) very useful.

:::warning

Make sure that the schemas of your entities are defined and accessible to your pipeline.

:::

## Modifying event fields directly

Sometimes you will want to modify the original event fields directly.

:::warning

Keep in mind that the old value of a modified field will not be available in your data warehouse or lake. However, that might be your goal.

:::

Just like with getters, there are setter methods available for each of the [standard event fields](/docs/pipeline/enriched-tsv-format/index.md?fields=table):

```js
function process(event) {
  event.setMkt_source('Facegoog');
  event.setGeo_latitude(null);
  event.setGeo_longitude(null);

  ...
```

:::note

One exception is `refr_device_tstamp`, where the setter method is called `setRefr_dvce_tstamp` and _not_ `setRefr_device_tstamp`.

:::

## Modifying self-describing events and entities

If you want to modify the self-describing event fields or the entities attached to the event, you will need to reverse the steps you took to fetch them.

For self-describing events:

```js
function process(event) {
  ...

  // unpack the self-describing event
  const myEvent = JSON.parse(event.getUnstruct_event());

  if (myEvent && myEvent.data.schema === ...) {
    // update a field inside
    myEvent.data.data.myField = 'new value';

    // pack the self-describing event back
    event.setUnstruct_event(JSON.stringify(myEvent));
  }

  ...
```

For entities:

```js
function process(event) {
  ...

  // unpack the entities
  const entities = JSON.parse(event.getContexts());

  if (entities) {
    // loop through the entities
    for (const entity of entities.data) {
      if (entity.schema === ...) {
        // update a field inside
        entity.data.myField = entity.data.myField + 1;
      }
    }

    // pack the entities back
    event.setContexts(JSON.stringify(entities));
  }

  ...
```

:::note

You might be tempted to update derived entities in a similar way by using `event.setDerived_contexts()`. However, this is not supported (the function exists, but has no effect). Instead, refer to the [Erasing derived contexts](#erasing-derived-contexts) section.

:::

## Erasing derived contexts

Starting with Enrich 5.4.0, it is possible to erase derived contexts.

This feature can be used to update existing derived contexts as well. The way to do that is shown in the below example:

```js
function process(event) {
  const derived = JSON.parse(event.getDerived_contexts())

  // erase the existing contexts from the event
  event.eraseDerived_contexts()

  // modify the contexts
  for (const entity of derived.data) {
    if (entity.schema === ...) {
      // update a field inside
      entity.data.myField = entity.data.myField + 1
    }
  }

  // returned the updated array of derived contexts, which will replace the original one
  return derived.data
}
```

## Discarding the event

```mdx-code-block
import DiscardingEvents from "@site/docs/reusable/discarding-events/_index.md"

<DiscardingEvents/>
```


## Accessing Java methods

Because the JavaScript enrichment runs inside the Enrich application, it has access to the Java standard library, as well as _some_ Java libraries (the ones used by Enrich). You can call Java methods via their fully qualified path, for example:

```js
function process(event) {
  ...

  const salt = 'pepper';
  const hashedIp = org.apache.commons.codec.digest.DigestUtils.sha256Hex(event.getUser_ipaddress() + salt);

  ...
}
```

## Passing an object of parameters

Starting with Enrich 4.1.0, it is possible to pass an object of parameters to the JS enrichment.

You can pass these parameters in the enrichment configuration, for example:

```json
{
	"schema": "iglu:com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-1",

	"data": {

		"vendor": "com.snowplowanalytics.snowplow",
		"name": "javascript_script_config",
		"enabled": true,
		"parameters": {
			"script": "script",
			"config": {
				"foo": 3,
				"nested": {
					"bar": "test"
				}
			}
		}
	}
}
```

The parameter object can be accessed in JavaScript enrichment code via the _second_ parameter of the `process` function, for example:

```js
function process(event, params) {
  event.setApp_id(params.nested.bar);
  return [];
}
```

:::tip
This is useful when you want to quickly reconfigure the enrichment without updating the JavaScript code.
:::

## Accessing the HTTP request headers

Starting with Enrich 5.1.1, it is possible to access the HTTP headers that came with the original request to the Collector. The array of headers is passed in the _third_ argument to the `process` function. Each header is a string in the format `HEADER:value`.

:::tip formatting
Per the HTTP specification, headers are not case sensitive, so we recommend using a case insensitive match, like what is shown below.
It is also a good practice to trim whitespace from the value, as there might or might not be some space around the `:` character.
:::

For example, if you want to pass some token via a custom `X-JWT` header and then use it in the enrichment:

```js
function process(event, params, headers) {
  for (header of headers) {
    const token = header.match(/X-JWT:(.+)/i)
    if (token) {
      const value = token[1].trim()
      // do something with the value
    }
  }
}
```
