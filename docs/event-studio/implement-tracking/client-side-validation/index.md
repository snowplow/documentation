---
title: "Client-side schema and event specification validation"
sidebar_label: "Client-side validation for web"
sidebar_position: 4
description: "Enable real-time schema and event specification validation in the browser for JavaScript and TypeScript trackers to catch tracking errors before events are sent, using Snowtype."
keywords: ["snowtype", "client-side validation", "browser validation", "schema validation", "event specification validation", "JavaScript validation", "TypeScript validation", "instructions"]
---

Using Snowtype you can get notified, at runtime, if tracked events don't match their schema definitions, or the rules defined in their event specification. This allows you to catch errors before they reach production.

When enabled, every event sent through Snowtype generated code is checked at runtime against:

- **Schema rules**: does the event or entity data match the schema definition?
- **Cardinality rules**: does the event include the correct number of each entity, as defined in the event specification?
- **Property rules**: do entity values match the constraints defined in the event specification?

:::info[Only for Browser tracker]
This feature is available for the [Browser tracker](/docs/sources/web-trackers/quick-start-guide/index.md?platform=browser) only, in both JavaScript and TypeScript.
:::

## Generate code with validations

To use validation, you'll first need to install three [Ajv](https://ajv.js.org/) packages: `ajv@8`, `ajv-formats@2` and `ajv-draft-04@1`.

```bash
# Example using npm
npm install ajv@8 ajv-formats@2 ajv-draft-04@1
```

To opt-in to client-side validation, include the `--validations` flag when you are generating your code.

```bash
npx snowtype generate --validations
```

You can also enable validations permanently in your [configuration file](/docs/event-studio/implement-tracking/configuration-reference/index.md) instead of passing the flag each time.

Snowtype will generate:
* A `validations.ts` file that contains the schema details for all the listed sources
* Additional helper functions
* Additional processing for each `track` function
* Additional processing for each `trackXSpec` function

All the changes are under the hood, and don't affect how you call the generated functions. Continue to track events as normal, and any validation errors will appear in the browser console.

### Updated `track` functions

To validate schemas and data structures, Snowtype adds extra code to the [generated `track` functions](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#data-structures).

The highlighted lines in this example show the changed or additional code:

```typescript
// Ajv helper functions omitted for brevity

/**
 * Track a Snowplow event for WebPage.
 * Schema for a web page
 */
export function trackWebPage<T extends {} = any>(webPage: WebPage & ContextsOrTimestamp<T>, trackers?: string[]){
    // highlight-start
    const { context, timestamp, __esId, ...data } = webPage as typeof webPage & EventSpecIdInput;
    // highlight-end
    const event: SelfDescribingJson = {
        schema: 'iglu:com.snowplowanalytics.snowplow/web_page/jsonschema/1-0-0',
        data
    };
    // highlight-start
    [event].concat(context || []).forEach(s => validateSchema(s, __esId));
    // highlight-end
    trackSelfDescribingEvent({
        event,
        context,
        timestamp,
    }, trackers);
}
```

### Updated `trackXSpec` functions

To validate event specification instructions and cardinality rules, Snowtype adds extra code to the [generated `trackXSpec` functions](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#event-specifications).

The highlighted lines in this example show the changed or additional code:

```typescript
// Ajv helper functions omitted for brevity

/**
 * Tracks a UserLogIn event specification.
 * ID: a965caf1-88a6-4a89-9aea-cc92516a9d56
 */
export function trackUserLogInSpec(userLogIn: Login & ContextsOrTimestamp<User | UserAuthentication>, trackers?: string[]){
    const eventSpecificationContext = createEventSpecification({
        id: 'a965caf1-88a6-4a89-9aea-cc92516a9d56',
        version: 8,
        name: 'User Log In',
        data_product_id: '57471841-aa79-445d-b4f7-1cbd073a3188',
        data_product_name: 'Checkout Flow - Example',
        data_product_domain: 'Marketing'
    });
// highlight-start
    validateEntityRules(
        'a965caf1-88a6-4a89-9aea-cc92516a9d56' as keyof typeof entityRules,
        userLogIn.context as unknown as SelfDescribingJson[]
    );
    // highlight-end
    const context = Array.isArray(userLogIn.context)
        ? [...userLogIn.context, eventSpecificationContext]
        : [eventSpecificationContext];

    const modifiedUserLogIn = {
        ...userLogIn,
        context,
        // highlight-start
        /* Used for runtime validation only */
        __esId: 'a965caf1-88a6-4a89-9aea-cc92516a9d56'
        // highlight-end
    };

    trackLogin<User | UserAuthentication | EventSpecification>(modifiedUserLogIn, trackers);
}
```

### Bundle size consideration

Because of the additional libraries required for client-side validation, using validation will increase your application bundle size.

For this reason, we recommend using validation only in development and test environments.

## Schema validation

When you call a generated `trackX` function, it will validate the event data against the schema. It will also validate any attached entities, as long as Snowtype has a reference of their schemas in the `validations.ts` file.

For JavaScript projects, this type of validation is especially useful given the lack of types. For TypeScript, it's an additional layer of protection that can also catch mistakes in dynamic or loosely typed values.

Your app will raise a `Snowtype Schema Validation error` warning in the browser console if a property violates the schema. In this example, the property `id` is expected to be a string, but the value `1` is passed instead. The erroneous value can be found under `errors[n].data`, and a stack trace pointing to the calling function is also provided:

![Browser console showing a "Snowtype Schema Validation error" warning where the id property received 1 (a number) instead of the expected string type, with the invalid value shown under errors[n].data and a stack trace pointing to the calling function](./images/validation.png)

The validation checks against all your [JSON Schema requirements](/docs/api-reference/json-schema-reference/index.md). For example, it will confirm that your tracking matches `type`, `minLength`, `pattern`, `minimum`, or `additionalProperties` rules.

This validation applies to Iglu Central schemas, data structures, and event specifications.

## Entity cardinality rule validation

[Cardinality rules](/docs/event-studio/tracking-plans/index.md) define how many of a given entity an event specification expects. For example:
- Exactly 1
- At least 1
- Between 1 and 2

With client-side validation enabled, your Snowtype code will check these rules at runtime. If the event includes the wrong amount of a required entity, a `Snowtype Entity Cardinality Rules error` warning appears in the browser console.

For example, with a `product` entity that has a cardinality rule of "Exactly 1":

![Event specification in Snowplow Console showing a product entity with a cardinality rule set to "Exactly 1"](./images/cardinality-validation.png)

This code satisfies the rule:

```typescript
trackButtonClickSpec({
    label: "Product click",
    context: [createProduct({ name: "Product", price: 1, quantity: 1 })],
});
```

Adding a second `product` entity violates the rule:

```typescript
trackButtonClickSpec({
    label: "Product click",
    context: [
        createProduct({ name: "Product", price: 1, quantity: 1 }),
        // This violates the cardinality rule of Exactly 1
        createProduct({ name: "Product 2", price: 1, quantity: 1 }),
    ],
});
```

![Browser console showing a "Snowtype Entity Cardinality Rules error" warning with minCardinality, maxCardinality, and currentCardinality values listed, and a stack trace pointing to the calling function](./images/cardinality-browser.png)

The warning includes the `minCardinality` and `maxCardinality` expected, the `currentCardinality` i.e. how many were actually passed, and a stack trace.

A warning also appears when a required entity is missing entirely:

![Browser console showing a "Snowtype Entity Cardinality Rules error" warning for a required entity that was not included in the tracked event](./images/cardinality-empty.png)

## Property instructions validation

[Property rule](/docs/event-studio/tracking-plans/create-and-manage/index.md) instructions are constraints you define on event or entity properties within an event specification.

Snowtype creates [types for property rules](/docs/event-studio/implement-tracking/generate-tracking-code/index.md#property-rules-and-instructions) for all trackers. This additional runtime validation layer can catch any mistakes that slip through, such as when using dynamic values.

In this example event specification, the `category` property of the `product` entity must be either `"related"` or `"cross-sell"`.

![Event specification in Snowplow Console showing the category property of a product entity with allowed values restricted to "related" and "cross-sell"](./images/property-rules-browser.png)

This code satisfies the property rule:

```typescript
trackRelatedSpec({
    label: "Related product",
    context: [
        createProductRelated({
            category: "cross-sell",
            name: "product",
            quantity: 1,
            price: 10,
        }),
    ],
});
```

Passing a value outside the allowed set triggers a `Snowtype Schema Validation error` warning:

```typescript
trackRelatedSpec({
    label: "Related product",
    context: [
        createProductRelated({
            // "cross-sells" has a typo and is not a valid category
            category: "cross-sells",
            name: "product",
            quantity: 1,
            price: 10,
        }),
    ],
});
```

![Browser console showing a "Snowtype Schema Validation error" warning triggered by passing "cross-sells" for a category property that only accepts "related" or "cross-sell"](./images/property-rules-enum-error.png)

## Custom violation handlers

By default, violations are logged to the browser console using `console.warn`. You can override this behavior with a custom `violationsHandler` using the `snowtype.setOptions` API:

```typescript
import { snowtype } from "{{outpath}}/snowplow";

function myViolationsHandler(error) {
    // Custom violation handling logic
}

snowtype.setOptions({ violationsHandler: myViolationsHandler });
```

The `error` argument has the following shape:

```typescript
type ErrorType = {
    /** Error code number (e.g. 100, 200, 201) */
    code: number;
    /** Error message */
    message: string;
    /** Description of the violation */
    description: string;
    /** Details of the violations */
    errors: (ErrorObject | Record<string, unknown>)[];
};
```

This is useful for:
- Unit testing: throw an `Error` so that tests fail automatically when a violation occurs
- Error monitoring: report violations to a service like Sentry in staging or production

:::tip[Automatic errors]
When `NODE_ENV` is set to `test`, as many testing libraries do automatically, the default handler throws an `Error` instead of logging a warning. This means tracking violations will cause your tests to fail without any extra configuration.
:::

## Pipeline validation and `pattern`

When you run `snowtype generate`, Snowtype will print a warning if it detects [`pattern` (regex)](https://json-schema.org/understanding-json-schema/reference/string#regexp) properties in any of your schemas:

```bash
✔: Code generated, writing...
⚠ Warning: Some schemas appear to have attributes that can have inconsistent validations between the pipeline and client-side validation.
```

The Snowplow pipeline uses Java/Scala regex, while client-side validation uses JavaScript regex. This can lead to differences in validation results, especially for complex regex patterns. In most cases, you can ignore this warning.
