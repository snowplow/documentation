---
title: "JSON Schema reference"
sidebar_position: 10
description: "Complete reference for JSON Schema features supported in Snowplow schemas"
---

Snowplow schemas are based on the [JSON Schema](https://json-schema.org/) standard ([draft 4](https://datatracker.ietf.org/doc/html/draft-fge-json-schema-validation-00)). This reference provides comprehensive documentation for all JSON Schema features that are supported in Snowplow.

Understanding the full capabilities of JSON Schema allows you to create more precise and robust [data structures](/docs/fundamentals/schemas/index.md) that ensure your data quality and provide clear documentation for your tracking implementation.

## Schema structure

Every Snowplow schema must follow this basic structure with Snowplow-specific metadata and JSON Schema validation rules:

```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "description": "Human-readable description of the schema purpose",
  "self": {
    "vendor": "com.example",
    "name": "schema_name",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "type": "object",
  "properties": {
    // Field definitions go here
  },
  "additionalProperties": false,
  "required": ["required_field_name"]
}
```

## Core validation keywords

### Type validation

The `type` keyword specifies the expected data type for a value. Snowplow supports all JSON Schema primitive types:

#### String type

```json
{
  "user_name": {
    "type": "string",
    "description": "The user's display name"
  }
}
```

#### Number and integer types

```json
{
  "price": {
    "type": "number",
    "description": "Product price in USD"
  },
  "quantity": {
    "type": "integer",
    "description": "Number of items purchased"
  }
}
```

#### Boolean type

```json
{
  "is_premium": {
    "type": "boolean",
    "description": "Whether the user has a premium account"
  }
}
```

#### Array type

```json
{
  "tags": {
    "type": "array",
    "description": "Product tags",
    "items": {
      "type": "string"
    }
  }
}
```

#### Object type

```json
{
  "address": {
    "type": "object",
    "description": "User's shipping address",
    "properties": {
      "street": {"type": "string"},
      "city": {"type": "string"},
      "postal_code": {"type": "string"}
    }
  }
}
```

#### Null type

```json
{
  "middle_name": {
    "type": ["string", "null"],
    "description": "User's middle name (optional)"
  }
}
```

### Multiple types

You can specify multiple acceptable types using an array:

```json
{
  "user_id": {
    "type": ["string", "integer"],
    "description": "User identifier (string or numeric)"
  },
  "optional_field": {
    "type": ["string", "null"],
    "description": "Optional text field"
  }
}
```

## String validation

### Length constraints

Control the minimum and maximum length of string values:

```json
{
  "username": {
    "type": "string",
    "minLength": 3,
    "maxLength": 20,
    "description": "Username between 3-20 characters"
  },
  "password": {
    "type": "string",
    "minLength": 8,
    "description": "Password must be at least 8 characters"
  }
}
```

### Pattern matching

Use regular expressions to validate string format:

```json
{
  "product_code": {
    "type": "string",
    "pattern": "^[A-Z]{2}-\\d{4}$",
    "description": "Product code format (e.g., AB-1234)"
  },
  "phone_number": {
    "type": "string",
    "pattern": "^\\+?[1-9]\\d{1,14}$",
    "description": "International phone number format"
  }
}
```

:::tip

For common formats like email addresses, URLs, and dates, prefer using the `format` keyword instead of regular expressions for better readability and standardized validation.

:::

### Enumeration

Restrict values to a specific set of allowed strings:

```json
{
  "status": {
    "type": "string",
    "enum": ["active", "inactive", "pending", "suspended"],
    "description": "Account status"
  },
  "color": {
    "type": "string",
    "enum": ["red", "green", "blue", "yellow"],
    "description": "Primary color selection"
  }
}
```

### Format validation

Use the `format` keyword to validate common string formats:

```json
{
  "email": {
    "type": "string",
    "format": "email",
    "description": "Valid email address"
  },
  "website": {
    "type": "string",
    "format": "uri",
    "description": "Website URL"
  },
  "server_ip": {
    "type": "string",
    "format": "ipv4",
    "description": "IPv4 address of the server"
  },
  "created_at": {
    "type": "string",
    "format": "date-time",
    "description": "ISO 8601 timestamp"
  },
  "user_id": {
    "type": "string",
    "format": "uuid",
    "description": "UUID identifier"
  }
}
```

#### Supported format values

* **`uri`**: Uniform Resource Identifier
* **`ipv4`**: IPv4 address (e.g., "192.168.1.1")
* **`ipv6`**: IPv6 address
* **`email`**: Email address
* **`date-time`**: ISO 8601 date-time (e.g., "2023-12-25T10:30:00Z")
* **`date`**: ISO 8601 date (e.g., "2023-12-25")
* **`hostname`**: Internet hostname
* **`uuid`**: UUID string

## Numeric validation

### Range constraints

Set minimum and maximum values for numbers and integers:

```json
{
  "age": {
    "type": "integer",
    "minimum": 0,
    "maximum": 150,
    "description": "Person's age in years"
  },
  "discount_rate": {
    "type": "number",
    "minimum": 0,
    "maximum": 1,
    "description": "Discount rate between 0 and 1"
  }
}
```

### Multiple constraints

Combine multiple numeric validations:

```json
{
  "rating": {
    "type": "number",
    "minimum": 1,
    "maximum": 5,
    "multipleOf": 0.5,
    "description": "Star rating in half-point increments"
  }
}
```

## Array validation

### Length constraints

Control the size of arrays:

```json
{
  "favorite_colors": {
    "type": "array",
    "minItems": 1,
    "maxItems": 5,
    "description": "User's favorite colors (1-5 selections)",
    "items": {
      "type": "string",
      "enum": ["red", "blue", "green", "yellow", "purple", "orange"]
    }
  }
}
```

### Item validation

Define validation rules for array items:

```json
{
  "purchase_items": {
    "type": "array",
    "description": "Items in the purchase",
    "items": {
      "type": "object",
      "properties": {
        "product_id": {"type": "string"},
        "quantity": {"type": "integer", "minimum": 1},
        "price": {"type": "number", "minimum": 0}
      },
      "required": ["product_id", "quantity", "price"],
      "additionalProperties": false
    }
  }
}
```

### Unique items

Ensure all array items are unique:

```json
{
  "user_tags": {
    "type": "array",
    "uniqueItems": true,
    "description": "Unique tags assigned to user",
    "items": {
      "type": "string"
    }
  }
}
```

## Object validation

### Property requirements

Specify which object properties are required:

```json
{
  "user_profile": {
    "type": "object",
    "properties": {
      "first_name": {"type": "string"},
      "last_name": {"type": "string"},
      "email": {"type": "string"},
      "phone": {"type": ["string", "null"]}
    },
    "required": ["first_name", "last_name", "email"],
    "additionalProperties": false
  }
}
```

### Additional properties

Control whether additional properties are allowed:

```json
{
  "strict_object": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "value": {"type": "number"}
    },
    "additionalProperties": false,
    "description": "Only name and value properties allowed"
  },
  "flexible_object": {
    "type": "object",
    "properties": {
      "core_field": {"type": "string"}
    },
    "additionalProperties": true,
    "description": "Additional properties are permitted"
  }
}
```

### Property count constraints

Limit the number of properties in an object:

```json
{
  "metadata": {
    "type": "object",
    "minProperties": 1,
    "maxProperties": 10,
    "additionalProperties": {"type": "string"},
    "description": "Metadata with 1-10 string properties"
  }
}
```

## Advanced validation patterns

### Schema composition

Use `oneOf` and `anyOf` to create flexible validation rules:

#### Using oneOf

Validate that data matches exactly one of several schemas:

```json
{
  "contact_info": {
    "type": "object",
    "oneOf": [
      {
        "properties": {
          "type": {"enum": ["email"]},
          "email": {"type": "string", "format": "email"}
        },
        "required": ["type", "email"],
        "additionalProperties": false
      },
      {
        "properties": {
          "type": {"enum": ["phone"]},
          "phone": {"type": "string", "pattern": "^\\+?[1-9]\\d{1,14}$"}
        },
        "required": ["type", "phone"],
        "additionalProperties": false
      },
      {
        "properties": {
          "type": {"enum": ["address"]},
          "street": {"type": "string"},
          "city": {"type": "string"},
          "postal_code": {"type": "string"}
        },
        "required": ["type", "street", "city", "postal_code"],
        "additionalProperties": false
      }
    ]
  }
}
```

#### Using anyOf

Validate that data matches one or more of several schemas:

```json
{
  "user_permissions": {
    "type": "object",
    "anyOf": [
      {
        "properties": {
          "can_read": {"type": "boolean"}
        },
        "required": ["can_read"]
      },
      {
        "properties": {
          "can_write": {"type": "boolean"}
        },
        "required": ["can_write"]
      },
      {
        "properties": {
          "can_admin": {"type": "boolean"}
        },
        "required": ["can_admin"]
      }
    ]
  }
}
```

### Conditional validation

For more complex conditional logic, combine schema composition with careful property design:

```json
{
  "contact_info": {
    "type": "object",
    "properties": {
      "contact_method": {
        "type": "string",
        "enum": ["email", "phone", "mail"]
      },
      "email_address": {
        "type": ["string", "null"],
        "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      },
      "phone_number": {
        "type": ["string", "null"],
        "pattern": "^\\+?[1-9]\\d{1,14}$"
      },
      "mailing_address": {
        "type": ["object", "null"],
        "properties": {
          "street": {"type": "string"},
          "city": {"type": "string"},
          "postal_code": {"type": "string"}
        }
      }
    },
    "required": ["contact_method"]
  }
}
```

### Complex nested structures

Create sophisticated data structures with multiple levels of nesting:

```json
{
  "e_commerce_event": {
    "type": "object",
    "properties": {
      "transaction_id": {"type": "string"},
      "items": {
        "type": "array",
        "minItems": 1,
        "items": {
          "type": "object",
          "properties": {
            "product": {
              "type": "object",
              "properties": {
                "sku": {"type": "string"},
                "name": {"type": "string"},
                "category": {"type": "string"},
                "brand": {"type": ["string", "null"]}
              },
              "required": ["sku", "name", "category"],
              "additionalProperties": false
            },
            "quantity": {"type": "integer", "minimum": 1},
            "price": {"type": "number", "minimum": 0},
            "discount": {"type": ["number", "null"], "minimum": 0}
          },
          "required": ["product", "quantity", "price"],
          "additionalProperties": false
        }
      },
      "payment_method": {
        "type": "string",
        "enum": ["credit_card", "debit_card", "paypal", "bank_transfer"]
      }
    },
    "required": ["transaction_id", "items", "payment_method"],
    "additionalProperties": false
  }
}
```

## Best practices

### Descriptive documentation

Always include meaningful descriptions for schemas and fields:

```json
{
  "video_play": {
    "description": "Tracks when a video starts playing",
    "type": "object",
    "properties": {
      "video_id": {
        "type": "string",
        "description": "Unique identifier for the video content"
      },
      "duration_seconds": {
        "type": "integer",
        "minimum": 1,
        "description": "Total duration of the video in seconds"
      },
      "quality": {
        "type": "string",
        "enum": ["240p", "360p", "480p", "720p", "1080p", "4K"],
        "description": "Video quality setting selected by user"
      },
      "autoplay": {
        "type": "boolean",
        "description": "Whether the video started automatically or was manually initiated"
      }
    },
    "required": ["video_id", "duration_seconds"],
    "additionalProperties": false
  }
}
```

### Consistent naming conventions

Use consistent naming patterns across your schemas:

```json
{
  "properties": {
    "user_id": {"type": "string"},
    "session_id": {"type": "string"},
    "page_url": {"type": "string"},
    "timestamp_utc": {"type": "string"},
    "is_authenticated": {"type": "boolean"}
  }
}
```

### Performance considerations

Keep schemas focused and avoid unnecessary complexity:

```json
{
  // Good: Focused schema for specific event
  "search_event": {
    "type": "object",
    "properties": {
      "query": {"type": "string", "maxLength": 256},
      "results_count": {"type": "integer", "minimum": 0},
      "category": {"type": ["string", "null"]}
    },
    "required": ["query", "results_count"],
    "additionalProperties": false
  }
}
```

## Limitations and unsupported features

While Snowplow supports most JSON Schema Draft 4 features, there are some limitations to be aware of:

### Unsupported JSON Schema features

* **`$ref`**: Schema references are not supported in property definitions
* **`allOf`**: Schema intersection is not supported
* **`not`**: Negation validation is not supported
* **`dependencies`**: Property dependencies are not supported
* **`exclusiveMinimum`** and **`exclusiveMaximum`**: Exclusive bounds are not supported

### Recommended alternatives

Instead of unsupported features, use these approaches:

```json
{
  // Instead of $ref, define inline schemas
  "address": {
    "type": "object",
    "properties": {
      "street": {"type": "string"},
      "city": {"type": "string"},
      "country": {"type": "string", "enum": ["US", "CA", "UK", "DE"]}
    },
    "required": ["street", "city", "country"],
    "additionalProperties": false
  },

  // Instead of exclusiveMinimum/exclusiveMaximum, use minimum/maximum with adjusted values
  "percentage": {
    "type": "number",
    "minimum": 0,
    "maximum": 99.99,
    "description": "Percentage value (0 to less than 100)"
  },

  // Use format validation for common patterns
  "created_date": {
    "type": "string",
    "format": "date-time",
    "description": "ISO 8601 timestamp"
  }
}
```