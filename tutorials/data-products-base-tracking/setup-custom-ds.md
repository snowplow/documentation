---
position: 6
title: Setup custom Data Structures
description: "Set up custom data structures for specialized behavioral event tracking and validation requirements."
schema: "HowTo"
keywords: ["Custom Data Structure", "Schema Setup", "Custom Schema", "Data Structure", "Schema Creation", "Custom DS"]
---

Before you create the custom Data Product for these interactions, you need to create a couple of Data Structures, `todo` and `todo_action`, fitting the use case of the Todo web application.

#### Todo action Data Structure
```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "type": "object",
  "self": {
    "vendor": "com.your.organization",
    "name": "todo_action",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "description": "Event Data Structure representing an action taken for a todo",
  "properties": {
    "action": {
      "type": "string",
      "enum": [
        "add",
        "remove",
        "complete"
      ],
      "description": "The action taken for a specific todo item"
    }
  },
  "required": [
    "action"
  ],
  "additionalProperties": false
}
```

#### Todo Data Structure
```json
{
  "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#",
  "type": "object",
  "self": {
    "vendor": "com.your.organization",
    "name": "todo",
    "format": "jsonschema",
    "version": "1-0-0"
  },
  "description": "Entity Data Structure representing a todo",
  "properties": {
    "title": {
      "type": "string",
      "description": "The title of the Todo"
    }
  },
  "required": [
    "title"
  ],
  "additionalProperties": false
}
```

_Note: You might need to publish those to the production environment depending on the pipeline you are using._
