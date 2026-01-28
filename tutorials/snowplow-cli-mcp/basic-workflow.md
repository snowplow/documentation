---
position: 3
title: "Create and publish a data structure using the Snowplow CLI MCP tool"
sidebar_label: "Create and publish a data structure"
---

Here's a typical interaction pattern for creating a data structure.

## 1. Get context

:::note Important
Always ensure `get_context` is called at the start of your conversation. If you don't see it happen, then ask for it.
:::

```
Please call get_context before we start working.
```

The assistant will retrieve the built-in schema and rules that define how Snowplow components should be structured. This provides the structural templates and requirements for your tracking implementation.

## 2. Create a data structure

```
Create a data structure for tracking when users view a product page.

Include properties for product ID, product name, category, and price.
```

The assistant will:
- Generate a proper UUID for the data structure
- Create a valid event schema following Snowplow conventions
- Save the file locally to the appropriate location

**Note**: Files are created locally only. Use `snowplow-cli data-structures publish` to sync to Console when ready.

## 3. Validate (automatic)

The assistant should automatically call `validate_data_structures` on the created file and report any validation issues.

## 4. Iterate if needed

```
The price should be optional, not required.

Also add a description field.
```

The assistant will modify the structure and re-validate.


## 5. Tracking plan creation

```
Create a tracking plan for ecommerce product interactions. Include:
- The existing product page views
- Add to cart events
- A source application for our website
- Proper validation of all components
```

The assistant will:
1. Create the necessary data structures for events (locally)
2. Create a source application definition (locally)
3. Create a tracking plan linking everything together (locally)
4. Validate all components together (including cross-references)


## 6. Publish to Console

Use `snowplow-cli data-structures publish` and `snowplow-cli data-products publish` to push changes to Console.
