---
title: "Custom JavaScript enrichment"
sidebar_position: 13
sidebar_label: Custom JavaScript
description: "Write custom JavaScript code to transform and enrich events with flexible data manipulation logic."
keywords: ["JavaScript enrichment", "custom enrichment", "event transformation"]
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

With this enrichment, you can write a JavaScript function to be executed for each event. Use this enrichment to apply your own business logic to your events, including:
* Adding extra data to the event in the form of [entities](/docs/fundamentals/entities/index.md)
* Modifying event fields directly
* Discarding the event so that it goes to [failed events](/docs/fundamentals/failed-events/index.md) rather than your data destination

## Requirements

Key considerations when writing your own JavaScript enrichment:
* Make sure your code works for _all_ of your events, not just the particular types of events you're interested in. Unhandled exceptions will result in [failed events](/docs/fundamentals/failed-events/index.md).
* Don't try to share state across multiple enriched events. Enrichments run inside a highly parallel application with multiple independent instances, so this won't work.
* In your enrichment code, avoid CPU-intensive tasks such as encryption, or IO-intensive tasks such as requests to an external service, without thoroughly benchmarking the impact they might have on your event processing time.
* The enrichment code has access to the Java standard library, and therefore to the filesystem of the machine it's running on. Proceed with caution when copying code from untrusted sources.

Your JavaScript enrichment code should contain a function called `process`:
* This function will receive each event as its first argument
* It can optionally return an array of [entities](/docs/fundamentals/entities/index.md) to be added to the event
* Any uncaught exceptions will result in [failed events](/docs/fundamentals/failed-events/index.md)

```js
function process(event) {
  // do something with the event...
  ...

  // add entities to the event
  return [ ... ];
}
```

You can split more complex logic into multiple helper functions and variables as you see fit, as long as you comply with this interface.

You can only have _one_ JavaScript enrichment, and hence a single `process` function for your pipeline.

:::tip[JavaScript language features]

The JavaScript enrichment uses the standalone [Nashorn engine](https://github.com/openjdk/nashorn) with ES6 support.

Not all ES6 features are guaranteed to work. If you are unsure whether a specific feature is available, [test it in a local environment](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/testing/index.md) before deploying.
:::

## Configuration

<SchemaProperties
  overview={{ enrichment: true }}
  example={{
    schema: "iglu:com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-0",
    data: {
      vendor: "com.snowplowanalytics.snowplow",
      name: "javascript_script_config",
      enabled: false,
      parameters: {
        script: "ZnVuY3Rpb24gcHJvY2VzcyhldmVudCkgew0KDQogIHZhciBwbGF0Zm9ybSA9IGV2ZW50LmdldFBsYXRmb3JtKCksDQogICAgICBhcHBJZCAgICA9IGV2ZW50LmdldEFwcF9pZCgpOw0KDQogIGlmIChwbGF0Zm9ybSA9PSAic2VydmVyIiAmJiBhcHBJZCAhPSAic2VjcmV0Iikgew0KICAgIHRocm93ICJTZXJ2ZXItc2lkZSBldmVudCBoYXMgaW52YWxpZCBhcHBfaWQ6ICIgKyBhcHBJZDsNCiAgfQ0KICANCiAgaWYgKGFwcElkID09IG51bGwpIHsNCiAgICByZXR1cm4gW107DQogIH0NCg0KICAvLyBVc2UgbmV3IFN0cmluZygpIGJlY2F1c2UgaHR0cDovL25lbHNvbndlbGxzLm5ldC8yMDEyLzAyL2pzb24tc3RyaW5naWZ5LXdpdGgtbWFwcGVkLXZhcmlhYmxlcy8NCiAgdmFyIGFwcElkVXBwZXIgPSBuZXcgU3RyaW5nKGFwcElkLnRvVXBwZXJDYXNlKCkpOw0KDQogIHJldHVybiBbIHsgc2NoZW1hOiAiaWdsdTpjb20uYWNtZS9mb28vanNvbnNjaGVtYS8xLTAtMCIsDQogICAgICAgICAgICAgICBkYXRhOiB7IGFwcElkVXBwZXI6IGFwcElkVXBwZXIgfQ0KICAgICAgICAgICB9IF07DQp9"
      }
    }
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for configuration of a JavaScript dynamic scripting enrichment", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "javascript_script_config", "format": "jsonschema", "version": "1-0-1" }, "type": "object", "properties": { "vendor": { "type": "string" }, "name": { "type": "string" }, "enabled": { "type": "boolean" }, "parameters": { "type": "object", "properties": { "script": { "type": "string" }, "config": { "type": "object", "description": "Parameters to pass to the enrichment" } }, "required": ["script"], "additionalProperties": false } }, "required": ["name", "vendor", "enabled", "parameters"], "additionalProperties": false }} />

:::note[base64 encoding]

You will need to provide the JavaScript code encoded in base64.

:::

The JavaScript in this example decodes to:

```javascript
function process(event) {

  var platform = event.getPlatform(),
      appId    = event.getApp_id();

  if (platform == "server" && appId != "secret") {
    throw "Server-side event has invalid app_id: " + appId;
  }

  if (appId == null) {
    return [];
  }

  // Use new String() because http://nelsonwells.net/2012/02/json-stringify-with-mapped-variables/
  var appIdUpper = new String(appId.toUpperCase());

  return [ { schema: "iglu:com.acme/foo/jsonschema/1-0-0",
               data: { appIdUpper: appIdUpper }
           } ];
}
```

## Available properties and methods

Your JavaScript enrichment code has access to the entire event payload, including request headers, plus any parameters you define. You can also access standard Java methods.

### Atomic fields

Each of the [atomic event fields](/docs/fundamentals/canonical-event/index.md) has its own getter. The name is the capitalized field name prepended with `get`, for example `event.getUser_ipaddress()` or `event.getGeo_country()`.

This example shows how to get the `app_id` field:

```js
function process(event) {
  const appId = event.getApp_id();

  ...
```

:::note[Referrer timestamp field]
One exception is `refr_device_tstamp`, where the getter method is called `getRefr_dvce_tstamp` and _not_ `getRefr_device_tstamp`.
:::

### Event properties

To access [self-describing event](/docs/fundamentals/events/index.md#self-describing-events) fields, use `event.getUnstruct_event()`. This will return the self-describing event as a JSON string. Parse it to access the schema at `.data.schema` and the individual fields at `.data.data`.

```js
function process(event) {
  ...

  const myEvent = JSON.parse(event.getUnstruct_event());

  if (myEvent) {
    // the event schema
    const mySchema = myEvent.data.schema;

    // the event data
    const myData = myEvent.data.data;

    ...
```

For [baked-in events](/docs/fundamentals/events/index.md#baked-in-events) with no schema, `getUnstruct_event()` will return `null`. The pattern here still works, as `null` is a valid input for `JSON.parse`.

### Entity properties

Access any tracker-defined entities via `event.getContexts()`. Parse the returned JSON string to access the individual entities in the array.

For entities added by other enrichments, use `event.getDerived_contexts()` instead. This feature is supported since Enrich 3.8.0 (and Snowplow Micro 1.7.1). In prior versions, this function always returns `null`.

```js
function process(event) {
  ...

  const trackerEntities = JSON.parse(event.getContexts());

  if (trackerEntities) {
    // loop through the entities
    for (const entity of trackerEntities.data) {
      if (entity.schema.startsWith('iglu:org.my-company/my-schema/jsonschema/1')) {
        // work with the entity
        const myField = entity.data.myField;

        ...
      }
    }
  }

  ...
```

For events with no entities attached, `getContexts()` will return `null`. The pattern above works, as `null` is a valid input for `JSON.parse`.

### Passed parameters

Use the `config` configuration property to pass an object of parameters to the enrichment. This can be useful when you want to quickly reconfigure the enrichment without updating the JavaScript code.

For example, to pass `"foo": 3` and `"nested": {"bar": "test"}`:

```json
{
	"schema": "iglu:com.snowplowanalytics.snowplow/javascript_script_config/jsonschema/1-0-1",
	"data": {
		"vendor": "com.snowplowanalytics.snowplow",
		"name": "javascript_script_config",
		"enabled": true,
		"parameters": {
			"script": "script in base64",
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

Access your provided parameters using the second argument of the `process` function. For example, to set the `app_id` field to the value of the `nested.bar` parameter:

```js
function process(event, params) {
  event.setApp_id(params.nested.bar);
}
```

If you don't provide any parameters, the second argument will be an empty object `{}`.

This feature is available since Enrich 4.1.0.

### HTTP request headers

Your script can access the HTTP headers that came with the original request to the Collector. This can be useful to apply different logic to events depending on the presence or value of certain headers.

Access the array of headers in the third argument to the `process` function. Each header is a string in the format `HEADER:value`.

For example, to pass a token via a custom `X-JWT` header and then use it in the enrichment:

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

:::tip[Formatting]
Headers aren't case sensitive, so we recommend using a case insensitive match, as shown in the example.

It's also good practice to trim whitespace from the value, as there could be some space around the `:` character.
:::

Accessing request headers is supported since Enrich 5.1.1.

### Java methods

:::note[Availability]

For security reasons, this feature isn't available to [Snowplow CDI Cloud](/docs/get-started/index.md) customers.

:::

Because the JavaScript enrichment runs inside the Enrich application, it has access to the Java standard library, as well as the Java libraries used by Enrich. You can call Java methods via their fully qualified path, for example:

```js
function process(event) {
  ...

  const salt = 'pepper';
  const hashedIp = org.apache.commons.codec.digest.DigestUtils.sha256Hex(event.getUser_ipaddress() + salt);
  ...
}
```

This example shows how to hash a user's IP address. You could do this automatically using the [PII pseudonymization enrichment](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md).

## Edit properties

Your script can modify any of the event fields. The old value won't be stored or saved at all. If you want to preserve the original value, consider adding a new entity instead.

Editing fields can be particularly useful when you want to apply logic based on the value of another field.

### Atomic fields

Each of the [atomic fields](/docs/fundamentals/canonical-event/index.md) has its own setter method, with the name being the capitalized field name prepended with `set`, for example `setApp_id('myAppId')` or `setGeo_country('US')`.

You can use this to edit an existing value, to set a value that is currently `null`, or to erase a field.

```js
function process(event) {
  event.setMkt_source('Facegoog');

  if (event.getGeo_country() === 'US') {
    event.setGeo_latitude(null);
    event.setGeo_longitude(null);
  }

  ...
```

:::note[Referrer timestamp field]

One exception is `refr_device_tstamp`, where the setter method is called `setRefr_dvce_tstamp` and _not_ `setRefr_device_tstamp`.

:::

### Event properties

To modify fields of a self-describing event, you'll need to unpack them, make the modification, and then set the whole modified object using `setUnstruct_event`.

For example, to update a field called `myField` inside the event:

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

### Entity properties

To modify fields of an entity, you'll need to unpack them, make the modification, and then set the whole modified object using `setContexts`. You can only edit fields in tracker-set entities with this method.

You can also use this approach to delete tracker entities, by filtering them out from the array.

For example, to delete unwanted entities and update a field called `myField` inside an entity:

```js
function process(event) {
  ...

  // unpack the entities
  const entities = JSON.parse(event.getContexts());

  if (entities) {
    // remove entities with a specific schema
    entities.data = entities.data.filter(e => e.schema !== 'iglu:com.my-company/unwanted/jsonschema/1-0-0');

    // loop through the remaining entities
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

For entities added by enrichments, see the [Delete entities](#delete-entities) section on this page for details of how to edit or delete them.

## Add or delete entities

Your script can add new entities to the event, or delete existing entities.

### Add entities

The optional return value of the `process` function is an array of extra entities to add to the event.

In this example, the events are given an entity that distinguishes traffic from internal and external systems:

```js
const internalIPs = new Set([
  "1.2.3.4",
  "2.3.4.5"
]);

function process(event) {
  const ip = event.getUser_ipaddress();
  const traffic_source = internalIPs.has(ip) ? 'internal' : 'external';

  return [{
    schema: "iglu:com.my-company/traffic_source/jsonschema/1-0-0",
    data: { traffic_source }
  }];
}
```

Check out the [testing guide](/docs/pipeline/enrichments/available-enrichments/custom-javascript-enrichment/testing/index.md#iterating-on-code-and-schemas) for advice on iterating on your schema and JavaScript script together.

:::warning

Make sure that the schemas of your entities are defined and accessible to your pipeline. If the enrichment can't find a schema, this will cause a [failed event](/docs/fundamentals/failed-events/index.md).

:::

Your array of entities will be passed to `JSON.stringify()` before being attached to the event. If your new entity has a `NaN` value, it will become `null`. If it has an `undefined` value, it will be dropped. If it has circular references, an exception will be thrown and the event will become a failed event.

### Delete entities

To delete tracker-set entities, use the same approach as for editing them.

To edit or delete entities added by enrichments, use `getDerived_contexts()` with `eraseDerived_contexts()`. The `eraseDerived_contexts()` method will delete all the enrichment entities from the event. You can then return a modified array of entities to replace them:

```js
function process(event) {
  const enrichmentEntities = JSON.parse(event.getDerived_contexts())

  // delete the existing enrichment entities array from the event
  event.eraseDerived_contexts()

  // modify the entities
  for (const entity of enrichmentEntities.data) {
    if (entity.schema === ...) {
      // update a field inside
      entity.data.myField = entity.data.myField + 1
    }
  }

  // remove entities with a specific schema
  const filtered = enrichmentEntities.data.filter(e => e.schema !== 'iglu:com.my-company/unwanted/jsonschema/1-0-0')

  // returned the updated array of enrichment entities
  // this will replace the original one
  return filtered
}
```

The `eraseDerived_contexts()` method is available since Enrich 5.4.0.

## Discard events

Sometimes you don't want the event to appear in your data warehouse or lake, e.g. because you suspect it comes from a bot and not a real user.

### Cause a failed event

You can send an event to [failed events](/docs/fundamentals/failed-events/index.md) by deliberately throwing an unhandled exception.

This will create an "enrichment failure" failed event, which may be tricky to distinguish from genuine failures in your enrichment code.

For example, to filter out events with a user agent containing "Googlebot":

```js
const botPattern = /.*Googlebot.*/;

function process(event) {
  const useragent = event.getUseragent();

  if (useragent !== null && botPattern.test(useragent)) {
    throw "Filtered event produced by Googlebot";
  }
}
```

The [IAB enrichment](/docs/pipeline/enrichments/available-enrichments/iab-enrichment/index.md) is one way to identify bots. This example uses the IAB entity to send bot events to failed events:

```js
function process(event) {
  const entities = JSON.parse(event.getDerived_contexts());
  if (entities) {
    for (const entity of entities.data) {
      if (entity.schema.startsWith('iglu:com.iab.snowplow/spiders_and_robots/jsonschema/1') &&
          entity.data.spiderOrRobot) {
        throw "Filtered a spider/bot event";
      }
    }
  }
}
```

### Drop completely

You can also drop any event, using `event.drop()`. This is a destructive operation: dropped events won't be stored or sent to any stream or destination.

For example, to drop events with a user agent containing "Googlebot":

```js
const botPattern = /.*Googlebot.*/;

function process(event) {
  const useragent = event.getUseragent();

  if (useragent !== null && botPattern.test(useragent)) {
    event.drop();
  }
}
```

:::warning[Irreversible]
There's no way to recover dropped events.
:::

This feature is available since Enrich 5.3.0.
