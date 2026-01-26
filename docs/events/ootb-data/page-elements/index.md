---
title: "Page element tracking"
sidebar_label: "Page elements"
sidebar_position: 140
description: "Track page element visibility, button clicks, and form interactions to understand how users engage with specific components on your web pages."
keywords: ["element tracking", "button clicks", "form tracking", "visibility tracking", "page elements"]
date: "2026-01-15"
---

import SchemaProperties from "@site/docs/reusable/schema-properties/_index.md"

Page element tracking captures user interactions with specific elements on your web pages, including buttons, forms, and any other visible components.

Use page element tracking to:

- Measure button click engagement across your site
- Track form interactions including focus, changes, and submissions
- Understand which page sections users actually see
- Build funnel analysis based on element visibility and interactions
- Measure content consumption and scroll depth

## Button clicks

Button click tracking automatically captures clicks on `<button>` and `<input type="button">` elements.

This table shows the support for button click tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                                           | Supported | Since version | Auto-tracking | Notes                               |
| --------------------------------------------------------------------------------- | --------- | ------------- | ------------- | ----------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/button-click/index.md)           | ✅         | 3.18.0        | ✅             | Requires button click plugin        |
| iOS                                                                               | ❌         |               |               |                                     |
| Android                                                                           | ❌         |               |               |                                     |
| React Native                                                                      | ❌         |               |               |                                     |
| Flutter                                                                           | ❌         |               |               |                                     |
| Roku                                                                              | ❌         |               |               |                                     |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md) | ✅         | v4            | ✅             | Integrates with button click plugin |

We recommend using the [Base web data product template](/docs/data-product-studio/data-products/data-product-templates/index.md#base-web) for web tracking. It includes button clicks.

<SchemaProperties
  overview={{event: true}}
  example={{
    label: "Submit",
    id: "submit-btn",
    classes: ["btn", "btn-primary"],
    name: "submit"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a button click event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "button_click", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "label": { "type": "string", "description": "The text on the button, or a user-provided override" }, "id": { "type": "string", "description": "The ID of the button" }, "classes": { "type": "array", "items": { "type": "string" }, "description": "The classes of the button" }, "name": { "type": "string", "description": "The name attribute of the button" } }, "required": ["label"], "additionalProperties": false }} />

## Form interactions

Form tracking captures three types of events: when a user focuses on a form field, when a field value changes, and when a form is submitted.

This table shows the support for form tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                                           | Supported | Since version                       | Auto-tracking | Notes                                                                                             |
| --------------------------------------------------------------------------------- | --------- | ----------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| [Web](/docs/sources/web-trackers/tracking-events/form-tracking/index.md)          | ✅         | 2.1.0 (directly), 3.0.0 (as plugin) | ✅             | Requires form tracking plugin                                                                     |
| iOS                                                                               | ❌         |                                     |               |                                                                                                   |
| Android                                                                           | ❌         |                                     |               |                                                                                                   |
| React Native                                                                      | ❌         |                                     |               |                                                                                                   |
| Flutter                                                                           | ❌         |                                     |               |                                                                                                   |
| Roku                                                                              | ❌         |                                     |               |                                                                                                   |
| Python                                                                            | ❌         |                                     |               | The Python tracker has deprecated form tracking APIs; use custom events with form schemas instead |
| [Google Tag Manager](/docs/sources/google-tag-manager/snowplow-template/index.md) | ✅         | v3                                  | ✅             | Integrates with form tracking plugin                                                              |


### Focus form event

Triggered when a user focuses on a form field.

<SchemaProperties
  overview={{event: true}}
  example={{
    formId: "contact-form",
    elementId: "email",
    nodeName: "INPUT",
    elementType: "email",
    elementClasses: ["form-control"],
    value: ""
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a form field focus event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "focus_form", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "formId": { "type": "string", "description": "The ID of the form" }, "elementId": { "type": "string", "description": "The ID of the element" }, "nodeName": { "type": "string", "enum": ["INPUT", "TEXTAREA", "SELECT"], "description": "The node name of the element" }, "elementType": { "type": ["string", "null"], "description": "The type of the element" }, "elementClasses": { "type": "array", "items": { "type": "string" }, "description": "The classes of the element" }, "value": { "type": ["string", "null"], "description": "The value of the element" } }, "required": ["formId", "nodeName", "elementClasses"], "additionalProperties": false }} />

### Change form event

Triggered when a user changes the value of a form field.

<SchemaProperties
  overview={{event: true}}
  example={{
    formId: "contact-form",
    elementId: "email",
    nodeName: "INPUT",
    elementType: "email",
    elementClasses: ["form-control"],
    value: "user@example.com"
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a form field change event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "change_form", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "formId": { "type": "string", "description": "The ID of the form" }, "elementId": { "type": "string", "description": "The ID of the element" }, "nodeName": { "type": "string", "enum": ["INPUT", "TEXTAREA", "SELECT"], "description": "The node name of the element" }, "elementType": { "type": ["string", "null"], "description": "The type of the element" }, "elementClasses": { "type": "array", "items": { "type": "string" }, "description": "The classes of the element" }, "value": { "type": ["string", "null"], "description": "The value of the element" } }, "required": ["formId", "nodeName", "elementClasses", "value"], "additionalProperties": false }} />

### Submit form event

Triggered when a user submits a form. Contains data about all form fields.

<SchemaProperties
  overview={{event: true}}
  example={{
    formId: "contact-form",
    formClasses: ["contact-form", "validated"],
    elements: [
      { name: "email", value: "user@example.com", nodeName: "INPUT", type: "email" },
      { name: "message", value: "Hello", nodeName: "TEXTAREA", type: null }
    ]
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for a form submission event", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "submit_form", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "formId": { "type": "string", "description": "The ID of the form" }, "formClasses": { "type": "array", "items": { "type": "string" }, "description": "The classes of the form" }, "elements": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string" }, "value": { "type": ["string", "null"] }, "nodeName": { "type": "string", "enum": ["INPUT", "TEXTAREA", "SELECT"] }, "type": { "type": ["string", "null"] } }, "required": ["name", "nodeName"], "additionalProperties": false }, "description": "The form elements and their values" } }, "required": ["formId", "formClasses", "elements"], "additionalProperties": false }} />

## Page element visibility and lifecycle

Element tracking enables declarative tracking of page elements as they are created, become visible, leave view, or are removed from the page. It's only available for web.

This table shows the support for page element tracking across the main client-side [Snowplow tracker SDKs](/docs/sources/index.md):

| Tracker                                                                     | Supported | Since version | Auto-tracking |
| --------------------------------------------------------------------------- | --------- | ------------- | ------------- |
| [Web](/docs/sources/web-trackers/tracking-events/element-tracking/index.md) | ✅         | 4.6.0         | ✅             |
| iOS                                                                         | ❌         |               |               |
| Android                                                                     | ❌         |               |               |
| React Native                                                                | ❌         |               |               |
| Flutter                                                                     | ❌         |               |               |
| Roku                                                                        | ❌         |               |               |
| Google Tag Manager                                                          | ❌         |               |               |  |

### Available events

The element tracking plugin generates four event types:

- `create_element`: when a matching element is added to the page
- `expose_element`: when a matching element scrolls into view
- `obscure_element`: when a matching element scrolls out of view
- `destroy_element`: when a matching element is removed from the page

Create element:

<SchemaProperties
  overview={{event: true}}
  example={{
    element_name: "newsletter signup"
  }}
  schema={{"description": "Event that fires when an element matching a named configuration is detected as existing in or being added to a document.","properties": {  "element_name": {    "description": "The name of the element that was created. Should match the element name field in entities that describe this particular element.",    "type": "string",    "maxLength": 255  }},"additionalProperties": false,"type": "object","required": ["element_name"],"self": {  "vendor": "com.snowplowanalytics.snowplow",  "name": "create_element",  "format": "jsonschema",  "version": "1-0-0"},"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}
} />

Expose element:

<SchemaProperties
  overview={{event: true}}
  example={{
    element_name: "newsletter signup"
  }}
  schema={{"description": "Event that fires when an element matching a named configuration is detected as intersecting with the viewport, becoming visible to the user.","properties": {  "element_name": {    "description": "The name of the element that was exposed. Should match the element name field in entities that describe this particular element.",    "type": "string",    "maxLength": 255  }},"additionalProperties": false,"type": "object","required": ["element_name"],"self": {  "vendor": "com.snowplowanalytics.snowplow",  "name": "expose_element",  "format": "jsonschema",  "version": "1-0-0"},"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}} />

Obscure element:

<SchemaProperties
  overview={{event: true}}
  example={{
    element_name: "newsletter signup"
  }}
  schema={{"description": "Event that fires when an element matching a named configuration is detected as becoming hidden from a user or moving out of the viewport.","properties": {  "element_name": {    "description": "The name of the element that was obscured. Should match the element name field in entities that describe this particular element.",    "type": "string",    "maxLength": 255  }},"additionalProperties": false,"type": "object","required": ["element_name"],"self": {  "vendor": "com.snowplowanalytics.snowplow",  "name": "obscure_element",  "format": "jsonschema",  "version": "1-0-0"},"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}} />

Destroy element:

<SchemaProperties
  overview={{event: true}}
  example={{
    element_name: "newsletter signup"
  }}
  schema={{"description": "Event that fires when an element matching a named configuration is detected as being removed from a document.","properties": {  "element_name": {    "description": "The name of the element that was destroyed. Should match the element name field in entities that describe this particular element.",    "type": "string",    "maxLength": 255  }},"additionalProperties": false,"type": "object","required": ["element_name"],"self": {  "vendor": "com.snowplowanalytics.snowplow",  "name": "destroy_element",  "format": "jsonschema",  "version": "1-0-0"},"$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#"
}} />

### Available entities

All element events include an `element` entity with information about the tracked element.

<SchemaProperties
  overview={{event: false}}
  example={{
    element_name: "newsletter signup",
    width: 560,
    height: 137,
    position_x: 320,
    position_y: 1953.5,
    doc_position_x: 320,
    doc_position_y: 5392.5,
    element_index: 2,
    element_matches: 2,
    originating_page_view: "02e30714-a84a-42f8-8b07-df106d669db0",
    attributes: []
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for element context", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "element", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "element_name": { "type": "string", "description": "The name of the element" }, "width": { "type": "number", "description": "The width of the element" }, "height": { "type": "number", "description": "The height of the element" }, "position_x": { "type": "number", "description": "The x position of the element in the viewport" }, "position_y": { "type": "number", "description": "The y position of the element in the viewport" }, "doc_position_x": { "type": "number", "description": "The x position of the element in the document" }, "doc_position_y": { "type": "number", "description": "The y position of the element in the document" }, "element_index": { "type": "integer", "description": "The index of this element among all matching elements" }, "element_matches": { "type": "integer", "description": "The total number of elements matching the rule" }, "originating_page_view": { "type": "string", "description": "The page view ID when the element was first observed" }, "attributes": { "type": "array", "description": "Custom attributes extracted from the element" } }, "required": ["element_name"], "additionalProperties": false }} />

You can optionally configure the tracker to attach element statistics to any event type, providing information about element visibility and scroll depth, using the `element_statistics` entity.

<SchemaProperties
  overview={{event: false}}
  example={{
    element_name: "blog content",
    element_index: 1,
    element_matches: 1,
    current_state: "unknown",
    min_size: "800x3928",
    current_size: "800x3928",
    max_size: "800x3928",
    y_depth_ratio: 0.203,
    max_y_depth_ratio: 0.493,
    max_y_depth: "1937/3928",
    element_age_ms: 298379,
    times_in_view: 0,
    total_time_visible_ms: 0
  }}
  schema={{ "$schema": "http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#", "description": "Schema for element statistics", "self": { "vendor": "com.snowplowanalytics.snowplow", "name": "element_statistics", "format": "jsonschema", "version": "1-0-0" }, "type": "object", "properties": { "element_name": { "type": "string" }, "element_index": { "type": "integer" }, "element_matches": { "type": "integer" }, "current_state": { "type": "string" }, "min_size": { "type": "string" }, "current_size": { "type": "string" }, "max_size": { "type": "string" }, "y_depth_ratio": { "type": "number" }, "max_y_depth_ratio": { "type": "number" }, "max_y_depth": { "type": "string" }, "element_age_ms": { "type": "integer" }, "times_in_view": { "type": "integer" }, "total_time_visible_ms": { "type": "integer" } }, "required": ["element_name"], "additionalProperties": false }} />
