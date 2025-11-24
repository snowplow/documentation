---
title: "Declarative entities with global context for React Native tracker"
sidebar_label: "Declarative entities with Global Context"
date: "2022-08-30"
sidebar_position: 20
---

**Global context** lets you define your own contexts once (e.g. on tracker initialization) and then have this context sent with every single event subsequently recorded in the app. This saves having to manually build and send the context array with every single event fired.

Here is an example that adds a global context entity to all subsequently tracked events:

```typescript
// Create a context entity and add it to global context
let contextEntity = {
  schema: 'iglu:com.acme/user_context/jsonschema/1-0-0',
  data: { userid: 1234, name: 'John Doe' }
};
tracker.addGlobalContexts([contextEntity]);

// The global context will be added to this screen view event as well
tracker.trackScreenViewEvent({ name: 'my-screen-name' });
```

You may not want to add the same context entity to all tracked events. There are several ways to make global context dynamic:

1. Using a **[context generator](#context-generators)** that generates context entities on the fly when events are sent.
2. Using **[filter functions](#filter-functions)** that filter which events to add global context entities to.
3. Using **[rulesets](#rulesets)** that define rules which types of events to accept or reject when generating global context entities.

### Context generators

Generating context on-the-fly is accomplished with **context generators**. A context generator is a callback that will be evaluated with an optional argument that contains useful information.

A sample context generator that conditionally generates a context entity could look like this:

```javascript
const contextGenerator = (args) => {
    if (args.eventType == 'pv') {
        return {
            schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
            data: { test: 1 },
        };
    }
};
tracker.addGlobalContexts([contextGenerator]);
```

The optional input is an associative array that contains three elements:

- `event` : self-describing JSON
- `eventType` : string
- `eventSchema` : string (schema URI)

Keep in mind that the arguments `eventType` and `eventSchema` are data found in `event`. `eventType` and `eventSchema` are provided for convenience, so that simple tasks don't require users to search through the event payload.

#### `eventType`

This argument is a string taken from the event payload field, `e`.

`eventType` takes the following values:

| Type                         | `e` |
| ---------------------------- | --- |
| Screen view tracking         | ue  |
| Pageview tracking            | pv  |
| Custom structured event      | se  |
| Custom self describing event | ue  |

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

```javascript
// A filter that will only attach contexts to structured events
function structuredEventFilter(args) {
  return args['eventType'] === 'se';
}
var globalContextDefinition = [structuredEventFilter, contextEntityToBeAdded];
tracker.addGlobalContexts([globalContextDefinition]);
```

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

```javascript
var globalContextDefinition = [ruleSet, contextEntityToAdd];
tracker.addGlobalContexts([globalContextDefinition]);
```

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

### Named global entities

From version 4 onwards, you can alternatively supply the definitions as a mapping object.
This associates each global entity with a "name" or "tag" that can be used to reference it in future calls.

For example, in the below we associate a global entity definition with the name `example`, and can then update or remove it by name in later calls.

```javascript
// add the entity defined by `globalContextDefinition` with the name "example"
var globalContextDefinition = [ruleSet, contextEntityToAdd];
tracker.addGlobalContexts({ example: globalContextDefinition });

// update the global entity named "example"; this replaces the entity from `globalContextDefinition`
var globalContextDefinition2 = [ruleSet, differentContextEntity];
tracker.addGlobalContexts({ example: globalContextDefinition2 });

// remove the global entity named "example"; it will no longer appear on subsequent events
tracker.removeGlobalContexts(["example"]);
```

Names can be whatever makes sense to you, but each name can only be associated with a single entity definition at a time (additions with the same name will replace the previous value).
The value for the named entity can be the same as unnamed global entities defined with the array method, including generator functions, filter functions, and rulesets and are processed equivalently.

### Global contexts methods

These are the standard methods to add and remove global context entities:

#### `addGlobalContexts`
To add global contexts:

```javascript
// unnamed global entities
tracker.addGlobalContexts([array of global contexts]);

// named global entities
tracker.addGlobalContexts({
  name: globalContext1,
  name2: globalContext2,
});
```

#### `removeGlobalContexts`

To remove a global context:

```javascript
// unnamed global entities
tracker.removeGlobalContexts([array of global contexts])

// named global entities
tracker.removeGlobalContexts(["name", "name2"]) // array of entity names
```

Unnamed global context entities are removed by doing a JSON match of the context to be removed with the added context. So the objects have to be the same in order for them to be matched.

For example:

```javascript
var entity = {
  schema: 'iglu:com.acme.marketing/some_event/jsonschema/1-0-0',
  data: { test: 1 },
};
tracker.addGlobalContexts([entity]); // add a global context
tracker.removeGlobalContexts([entity]); // remove the global context
```

#### `clearGlobalContexts`

To remove all named and unnamed global context entities:

```javascript
tracker.clearGlobalContexts();
```
