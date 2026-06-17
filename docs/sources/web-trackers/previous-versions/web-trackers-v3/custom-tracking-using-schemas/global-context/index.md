---
title: "Declarative entities with Global Context"
date: "2022-08-30"
sidebar_position: 20
description: "Documentation for Declarative entities with Global Context in the web tracker."
keywords: ["tracker", "configuration"]
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

**Global context** lets you define your own contexts once (e.g. on tracker initialization) and then have this context sent with every single event subsequently recorded on the page. This saves having to manually build and send the context array with every single event fired.

Here is an example that adds a global context entity to all subsequently tracked events:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// Create a context entity and add it to global context
let contextEntity = {
  schema: 'iglu:com.acme/user_context/jsonschema/1-0-0',
  data: { userid: 1234, name: 'John Doe' }
};
window.snowplow('addGlobalContexts', [contextEntity]);

// The global context will be added to this page view event as well
window.snowplow('trackPageView');
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
import { addGlobalContexts } from "@snowplow/browser-tracker";

// Create a context entity and add it to global context
let contextEntity = {
  schema: 'iglu:com.acme/user_context/jsonschema/1-0-0',
  data: { userid: 1234, name: 'John Doe' }
};
addGlobalContexts([contextEntity]);

// The global context will be added to this page view event as well
trackPageView();
```
  </TabItem>
</Tabs>

You may not want to add the same context entity to all tracked events. There are several ways to make global context dynamic:

1. Using a **[context generator](#context-generators)** that generates context entities on the fly when events are sent.
2. Using **[filter functions](#filter-functions)** that filter which events to add global context entities to.
3. Using **[rulesets](#rulesets)** that define rules which types of events to accept or reject when generating global context entities.

### Context generators

Generating context on-the-fly is accomplished with **context generators**. A context generator is a callback that will be evaluated with an optional argument that contains useful information.

A sample context generator that conditionally generates a context entity could look like this:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
const contextGenerator = (args) => {
    if (args.eventType == 'pv') {
        return {
            schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
            data: { test: 1 },
        };
    }
};
window.snowplow('addGlobalContexts', [contextGenerator]);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
const contextGenerator = (args) => {
    if (args.eventType == 'pv') {
        return {
            schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
            data: { test: 1 },
        };
    }
};
addGlobalContexts([contextGenerator]);
```

  </TabItem>
</Tabs>

The optional input is an associative array that contains three elements:

- `event` : self-describing JSON
- `eventType` : string
- `eventSchema` : string (schema URI)

Keep in mind that the arguments `eventType` and `eventSchema` are data found in `event`. `eventType` and `eventSchema` are provided for convenience, so that simple tasks don't require users to search through the event payload.

#### `eventType`

This argument is a string taken from the event payload field, `e`.

`eventType` takes the following values:

| Type                           | `e`       |
| ------------------------------ | --------- |
| Pageview tracking              | pv        |
| Page pings                     | pp        |
| Link click                     | ue        |
| Ad impression tracking         | ue        |
| Ecommerce transaction tracking | tr and ti |
| Custom structured event        | se        |
| Custom self describing event   | ue        |

Further information about the event payload can be found in the [tracker protocol documentation](/docs/events/index.md).

#### `eventSchema`

Users should be aware of the behavior of the argument `eventSchema`. Since 'first-class events' (e.g. structured events, transactions, pageviews, etc.) lack a proper schema (their event type is determined by the `e` field), callbacks will be provided the upper-level schema that defines the payload of all events:

`iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4`

For self describing events, `eventSchema` will be the schema that describes the self describing event, not the event payload. Again, this behavior isn't necessarily uniform, but provides more utility to differentiate events.

### Conditional context providers

We can augment context primitives by allowing them to be sent conditionally. While it's possible to define this functionality within context generators (with conditional logic), conditional context providers simplify common ways of sending contexts that follow certain rules.

The general form is an array of two objects:

`[conditional part, context primitive or [array of primitives]]`

The conditional part is standardized into two options:

- a filter function
- a schema ruleset

### Filter functions

Filter functions take the standard callback arguments defined for context generators, but instead of returning a Self Describing JSON, return a boolean value. As should be expected: `true` will attach the context part, `false` will not attach the context part.

### Example

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
// A filter that will only attach contexts to structured events
function structuredEventFilter(args) {
  return args['eventType'] === 'se';
}
var globalContextDefinition = [structuredEventFilter, contextEntityToBeAdded];
window.snowplow('addGlobalContexts', [globalContextDefinition]);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
// A filter that will only attach contexts to structured events
function structuredEventFilter(args) {
  return args['eventType'] === 'se';
}
var globalContextDefinition = [structuredEventFilter, contextEntityToBeAdded];
addGlobalContexts([globalContextDefinition]);
```

  </TabItem>
</Tabs>

### Rulesets

Rulesets define when to attach context primitives based on the event schema. This follows the standard behavior for all callbacks (the schema used to evaluate is the same provided in `eventSchema`, namely the payload schema for "first-class events" and otherwise the schema found within the self describing event).

Here's the specific structure of a ruleset, it's an object with certain optional rules that take the form of fields, each holding an array of strings:

```json
{
    accept: [],
    reject: []
}
```

Some examples, take note that wild-card matching URI path components is defined with an asterisk, `*`, in place of the component:

```javascript
// Only attaches contexts to this one schema
var ruleSetAcceptOne = {
  accept: ['iglu:com.mailchimp/cleaned_email/jsonschema/1-0-0']
};

// Only attaches contexts to these schemas
var ruleSetAcceptTwo = {
  accept: ['iglu:com.mailchimp/cleaned_email/jsonschema/1-0-0',
  'iglu:com.mailchimp/subscribe/jsonschema/1-0-0']
};

// Only attaches contexts to schemas with mailchimp vendor
var ruleSetAcceptVendor = {
  accept: ['iglu:com.mailchimp/*/jsonschema/*-*-*']
};

// Only attaches contexts to schemas that aren't mailchimp vendor
var ruleSetRejectVendor = {
  reject: ['iglu:com.mailchimp/*/jsonschema/*-*-*']
};

// Only attach to Snowplow first class events
var ruleSet = {
  accept: ['iglu:com.snowplowanalytics.snowplow/payload_data/jsonschema/1-0-4']
};
```

You can add a global context entity with a ruleset as follows:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
var globalContextDefinition = [ruleSet, contextEntityToAdd];
window.snowplow('addGlobalContexts', [globalContextDefinition]);
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
var globalContextDefinition = [ruleSet, contextEntityToAdd];
addGlobalContexts([globalContextDefinition]);
```

  </TabItem>
</Tabs>

### Rule requirements

All rules and schemas follow a standard form:

`protocol:vendor/event_name/format/version`

And rules must meet some requirements to be considered valid:

- Two parts are invariant: protocol and format. They are always `iglu` and `jsonschema` respectively.
  - Wildcards can therefore be used only in `vendor`, `event_name` and `version`.
- Version matching must be specified like so: `*-*-*`, where any part of the versioning can be defined, e.g. `1-*-*`, but only sequential parts are to be wildcarded, e.g. `1-*-1` is invalid but `1-*-*` is valid.
- Vendors require the first two "larger parts":
  - `com.acme.*`
- Vendors cannot be defined with non-wildcarded parts between wildcarded parts:
  - `com.acme.*.marketing.*` is invalid
  - `com.acme.*.*` is valid

### Global contexts methods

These are the standard methods to add and remove global contexts:

#### `addGlobalContexts`
To add global contexts:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

`snowplow('addGlobalContexts', [array of global contexts])`

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

 `addGlobalContexts([array of global contexts])`

  </TabItem>
</Tabs>

#### `removeGlobalContexts`

To remove a global context:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

`snowplow('removeGlobalContexts', [array of global contexts])`

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

`removeGlobalContexts([array of global contexts])`.

  </TabItem>
</Tabs>

Global context entities are removed by doing a JSON match of the context to be removed with the added context. So the objects have to be the same in order for them to be matched.

For example:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

```javascript
var entity = {
  schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
  data: { test: 1 },
};
window.snowplow('addGlobalContexts', [entity]); // add a global context
window.snowplow('removeGlobalContexts', [entity]); // remove the global context
```

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

```javascript
var entity = {
  schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
  data: { test: 1 },
};
addGlobalContexts([entity]); // add a global context
removeGlobalContexts([entity]); // remove the global context
```

  </TabItem>
</Tabs>

#### `clearGlobalContexts`

To remove all global contexts:

<Tabs groupId="platform" queryString>
  <TabItem value="js" label="JavaScript (tag)" default>

`snowplow('clearGlobalContexts')`

  </TabItem>
  <TabItem value="browser" label="Browser (npm)">

`clearGlobalContexts()`

  </TabItem>
</Tabs>
