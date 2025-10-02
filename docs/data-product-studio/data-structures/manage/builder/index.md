---
title: "Managing data structures with the Data Structures Builder"
description: "The Data Structures Builder is ideal for quickly creating an event or entity with our guided setup and automated versioning."
sidebar_label: "Console: data structures builder"
sidebar_position: 1
sidebar_custom_props:
  offerings:
    - cdi
---

:::info Supported properties
The [data structures builder](/docs/data-product-studio/data-structures/manage/builder/index.md) only supports the following types:

- String
- Enumerated list
- Integer
- Decimal
- Boolean

For more complex data structures that require nesting or more advanced data types, use the [JSON editor](/docs/data-product-studio/data-structures/manage/json-editor/index.md). To understand all available JSON Schema validation options, see the [JSON Schema reference](/docs/fundamentals/schemas/json-schema-reference/index.md).
:::

***

## Creating a new data structure

Populate the general information, such as Name, and a Description and Vendor. Vendor allows you to organize your data structures, for example, by teams. Snowplow will automatically generate the Tracking Url to be referenced in your tracking code.

![](images/data-structures-1.png)

When creating a new [data structure](/docs/fundamentals/schemas/index.md), you can add one or multiple properties. For each property, you can set a name, description, its type and a possible enumeration of allowed values (for type `string`). You can also set additional constraints to define if this property should be optional or mandatory, and if `null` values are allowed.

![](images/data-structures-2.png)

Click **Save** on the Property dialog box to save your property changes.

Clicking **Save** on the data structure page will save your data structure as a draft. At this point, your data structure is not yet deployed to your development environment and cannot be used for event validation. When you're ready to test your data structure, you'll need to deploy it from the draft state to your development environment.

## Editing a data structure

On the edit page, under the General Information panel, you can update the data structure type or its description. To add a new property, cick the "Add Property" button. To edit or delete an existing property, click the three dots next to the property name to open the action menu, and then select the appropriate option.

![](images/edit-data-structure.png)

When you modify the data structure, the builder will mark your changes in yellow, and automatically determine the new version of your data structure based on these modifications. You can reset the data structure and erase all changes at any moment by clicking the **Clear Changes** button found in the alert beneath the properties.

If you are satisfied with your changes, click "Save" and make sure to note the newly updated tracking URL.

![](images/data-structure-version.png)
