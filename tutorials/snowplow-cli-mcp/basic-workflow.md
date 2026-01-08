---
position: 4
title: "Create and publish a data structure using the Snowplow CLI MCP tool"
sidebar_label: "Create and publish a data product"
---

This page shows a typical interaction pattern. In this example, the AI assistant is helping build a new [data product](/docs/fundamentals/data-products), with new [data structures](/docs/fundamentals/schemas) and [source application](/docs/data-product-studio/source-applications).

## Import Snowplow context

Always ensure `get_context` is called at the start of your conversation. If you don't see it happen, then ask for it.

Example prompt:

```txt
Please call get_context before we start working.
```

The assistant will retrieve the built-in schemas and rules that define how Snowplow components should be structured.

## Create a new data structure

Example prompt:

```txt
Create a data structure for tracking when users view a product page.

Include properties for product ID, product name, category, and price.
```

The assistant will:
- Generate a proper UUID for the data structure
- Create a valid event schema following Snowplow conventions
- Save the file **locally** to the appropriate location
- Automatically validate the created structure and report any issues

You can iterate if needed. Example prompt:

```txt
The price should be optional, not required.

Also add a description field.
```

The assistant will modify the structure, and validate again.

## Create a new data product

Example prompt:

```txt
Create a data product for ecommerce product interactions. Include:
- The existing product page views that you just made
- Add to cart events
- A source application for our website
- Proper validation of all components
```

The assistant will:
* Create the necessary additional data structures for events
* Create a source application definition
* Create a data product linking everything together
* Validate and cross-reference all the components together


## Publish to Console

All files are created **locally**. When you're ready to publish to [Console](https://console.snowplowanalytics.com), use the standard Snowplow CLI commands:

```bash
snowplow-cli data-structures publish
snowplow-cli data-products publish
```
