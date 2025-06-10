---
position: 2
title: Schema implementation
---

The Snowplow pipeline must be able to access an appropriate schema to validate the discount event.

This accelerator uses a single custom schema for both discount types—time-based and visit-based.

## Schema definition

Here is the full schema used for the custom [self-describing](/docs/fundamentals/events/#self-describing-events) discount event. The URI is `com.snowplow/shopper_discount_applied/jsonschema/1-0-0`.

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Schema for tracking shopper discounts based on user behavior",
  "self": {
    "vendor": "com.snowplow",
    "name": "shopper_discount_applied",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    "discount": {
      "type": "object",
      "description": "Discount configuration and trigger conditions",
      "properties": {
        "rate": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Discount rate as decimal (e.g., 0.1 for 10%)"
        },
        "by_view_time": {
          "type": "object",
          "description": "Discount triggered by viewing duration",
          "properties": {
            "duration_in_seconds": {
              "type": "number",
              "minimum": 0,
              "description": "Duration in seconds that triggered the discount"
            }
          },
          "required": [
            "duration_in_seconds"
          ],
          "additionalProperties": false
        },
        "by_number_of_views": {
          "type": "object",
          "description": "Discount triggered by number of views",
          "properties": {
            "views": {
              "type": "number",
              "minimum": 1,
              "description": "Number of views that triggered the discount"
            },
            "duration_in_seconds": {
              "type": "number",
              "minimum": 0,
              "description": "Duration in seconds that triggered the discount"
            }
          },
          "required": [
            "views",
            "duration_in_seconds"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "rate"
      ],
      "oneOf": [
        {
          "required": [
            "by_view_time"
          ]
        },
        {
          "required": [
            "by_number_of_views"
          ]
        }
      ],
      "additionalProperties": false
    },
    "user_id": {
      "type": "string",
      "minLength": 1,
      "description": "The ID of the user who received the discount"
    },
    "product_id": {
      "type": "string",
      "minLength": 1,
      "description": "The product SKU that received the discount"
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp when the discount was generated"
    }
  },
  "required": [
    "discount",
    "user_id",
    "product_id",
    "generated_at"
  ],
  "additionalProperties": false
}
```

### Example events

A discount event triggered by view duration for a product:

```json
{
  "discount": {
    "rate": 0.1,
    "by_view_time": {
      "duration_in_seconds": 130
    }
  },
  "user_id": "user1",
  "product_id": "product3",
  "generated_at": "2025-04-26T19:04:37.949Z"
}
```

A discount event triggered by number of visits to a product:

```json
{
  "discount": {
    "rate": 0.1,
    "by_number_of_views": {
      "views": 5,
      "duration_in_seconds": 130
    }
  },
  "user_id": "user1",
  "product_id": "product1",
  "generated_at": "2025-05-02T01:50:24.813Z"
}
```

## Registering the schema

You will need to register the schema in the Iglu Server schema registry, so that it's available to the Snowplow pipeline.

The script `./register.sh` enables this. It uses a `curl` command to POST the schema file (located at `com.snowplow/shopper_discount_applied/jsonschema/1-0-0`) to the Iglu Server's `/api/schemas` endpoint, authenticating with the API key defined by the `IGLU_SERVER_API_KEY` environment variable (see `../docker/compose.snowplow.yaml`).

For demonstration purposes, the Iglu Server configuration is set to use the "dummy" database mode, which means all schemas are stored only in memory. **Any schema registered will be lost if the Iglu Server container is restarted.** This setup is ideal for local development and testing, but not for production.

To register the schema, run the `register.sh` script.

## Testing

After registering the schema, you can use the `./validate_events.sh` script, which calls `./validate_events.js`, to verify two things:

* The schema is available in the Iglu Server (the script fetches it via HTTP)
* The discount event examples shown above are valid according to the registered schema

This simulates the validation that will occur in the Snowplow pipeline. The script will:

* Fetch the schema from the Iglu Server using the configured URL and API key
* Validate each event file against the fetched schema using the Ajv JSON Schema validator (with support for formats like `"date-time"`)
* Print a message for each event indicating whether it's valid or, if not, what validation errors it found

To run the validation, run the `validate_events.sh` script.
