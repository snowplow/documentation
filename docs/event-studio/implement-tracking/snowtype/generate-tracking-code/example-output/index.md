---
title: "Example outputs"
sidebar_label: "Example outputs"
sidebar_position: 1
description: "Example configuration files and generated output for each Snowtype-supported tracker and language."
keywords: ["Snowtype", "code generation", "output", "example", "tracker"]
date: "2026-03-19"
---

The following examples show the Snowtype configuration file and generated output for the [Iglu Central](https://iglucentral.com) schema `web_page`, and a custom data structure, `product`. The `tracker` and `language` fields in your configuration determine the language and structure of the output.

These are the example schemas:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "self": {
    "vendor": "com.snowplowanalytics.snowplow",
    "name": "web_page",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "description": "Schema for a web page",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$"
    }
  },
  "type": "object",
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "type": "object",
  "self": {
    "vendor": "com.example",
    "name": "product",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "description": "Schema for a product entity",
  "properties": {
    "id": {
      "type": "string",
      "description": "The product ID (SKU)."
    },
    "name": {
      "type": "string",
      "description": "The product name."
    },
    "currency": {
      "type": "string",
      "description": "The currency the product is listed in."
    },
    "price": {
      "type": "number",
      "description": "The price of the product."
    },
    "category": {
      "type": "string",
      "description": "The product category."
    }
  },
  "required": [
    "id",
    "name",
    "currency",
    "price",
    "category"
  ],
  "additionalProperties": false
}
```





## Web trackers

### Browser (TypeScript)


### Browser (JavaScript)


### JavaScript tag


## iOS (Swift)


## Android (Kotlin)


## React Native (TypeScript)


## Flutter (Dart)


## Node.js

### TypeScript


### JavaScript


## Golang


## Java
