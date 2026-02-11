---
title: "Data structure management overview"
sidebar_label: "Data structures"
date: "2024-12-04"
sidebar_position: 40
description: "Create, manage, and update data structures (schemas) using Snowplow Console UI, Data Structures API, Snowplow CLI, or Iglu for community users."
keywords: ["data structures", "schemas", "JSON schemas", "schema management"]
---

import ThemedImage from '@theme/ThemedImage';

This section explains how to create, manage, and update [data structures](/docs/fundamentals/schemas/index.md) (schemas). Snowplow provides different options for data structure management:
* Snowplow Console UI
* [Data structures API](/docs/event-studio/programmatic-management/data-structures-api/index.md)
* [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/index.md)
* For Community users: [Iglu](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md)

## Create a data structure

To create a data structure within Console, go to **Data collection** > **Data structures** and click the **Create data structure** button. You can use the builder to create simple data structures with basic types and validation rules, or the JSON editor for more complex data structures.

:::info Supported properties
The data structure builder supports the following types:

- String
- Enumerated list
- Integer
- Decimal
- Boolean

For more complex data structures that require nesting or more advanced data types, use the [JSON editor](/docs/event-studio/data-structures/json-editor/index.md). To understand all available JSON Schema validation options, see the [JSON Schema reference](/docs/api-reference/json-schema-reference/index.md).
:::

Populate the general information, such as Name, and a Description and Vendor. Vendor allows you to organize your data structures, for example, by teams. Snowplow will automatically generate the Tracking Url to be referenced in your tracking code.

![](images/data-structures-1.png)

When creating a new [data structure](/docs/fundamentals/schemas/index.md), you can add one or multiple properties. For each property, you can set a name, description, its type and a possible enumeration of allowed values (for type `string`). You can also set additional constraints to define if this property should be optional or mandatory, and if `null` values are allowed.

![](images/data-structures-2.png)

Click **Save** on the Property dialog box to save your property changes.

Clicking **Save** on the data structure page will save your data structure as a draft. At this point, your data structure is not yet deployed to your development environment and cannot be used for event validation. When you're ready to test your data structure, you'll need to deploy it from the draft state to your development environment.

## Working with drafts

When you create a new data structure your changes are initially saved as a **draft**. Drafts allow you to:

- Make multiple changes without worrying about version numbers
- Experiment freely before committing to a final version
- Review and refine your data structure before deployment

**Important**: Draft data structures are not deployed to your development environment and will not be available for event validation. You must deploy your draft to the development environment when you're ready to test it.

This workflow gives you the flexibility to iterate on your data structure design without the overhead of managing version increments for every small change.

## Edit a data structure

To edit an existing data structure, navigate to **Data Structures** and locate the data structure you wish to edit. You can more easily find your data structure by:

- Using the search facility to search by name or vendor
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located, click on the name to view the data structure. You can then select from two options to edit the data structure: **Edit with builder** or **Edit with JSON editor**.

:::note Options depend on the data structure
The **Edit with builder** option will be unavailable if the data structure you're viewing is not supported. More complex data structures must be edited with the **JSON Editor**.
:::

On the edit page, under the General Information panel, you can update the data structure type or its description. To add a new property, cick the "Add Property" button. To edit or delete an existing property, click the three dots next to the property name to open the action menu, and then select the appropriate option.

![](images/edit-data-structure.png)

When you modify the data structure, the builder will mark your changes in yellow, and automatically determine the new version of your data structure based on these modifications. You can reset the data structure and erase all changes at any moment by clicking the **Clear Changes** button found in the alert beneath the properties.

If you are satisfied with your changes, click **Save** and make sure to note the newly updated tracking URL.

![](images/data-structure-version.png)

## Promote a data structure

When you're ready to use your data structure, you need to publish it from draft status to your development environment for testing.

Once you are happy with your changes in the development environment, you will want to migrate these changes to your production environment.

:::note Permissions needed
The action of migrating data structures to production is only available to Admin users.
:::

Navigate to **Data structures** and locate the data structure you wish to migrate. You can more easily find your data structure by:

- Using the search facility to search by name or vendor
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located, either click on the name to view the data structure and then click the "Migrate to production" button, or click the three dots to bring up the action menu where you can select "Migrate to production".

![](images/image-8.png)

At this stage you will see the publish dialog, and depending on how you versioned your edits you will see one of two messages:

If you are **publishing a new schema**, or **have incremented** the version whilst editing then you will see a confirmation of the action. Click **Migrate to Production** to migrate the data structure.

If you **have patched** the version whilst editing then you will see a warning that you must increment before publishing. Patching the version on Production is not a permitted action. [Increment the version number according to the changes you have made](/docs/event-studio/data-structures/versioning/index.md) and click **Migrate to production** to migrate the latest version of your data structure to your production environment.

Your data structure will now be available in your production environment to send events against.

## Hide a data structure

Sometimes you will make errors when creating a data structure, or simply be creating new data structures as part of a quick experiment. On these occasions you may wish to hide the schema to clean up the listing in Console.

Navigate to **Data structures** and locate the data structure you wish to hide. You can more easily find your data structure by:

- Using the search facility to search by name
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located either click on the name to view the data structure and then click the **Hide** button, or click the three dots to bring up the action menu where you can select **Hide data structure**.

Follow the dialog instructions to confirm the action.

:::note Hidden data structures are not deleted

Hiding a data structure will not remove it from the registry, it simply hides it from the console listing. This means:

(1) events can still be sent against this structure
(2) you cannot create a new structure of the same name

:::

### Restore a hidden data structure

If you have hidden a data structure and wish to restore it, navigate to the bottom of the list of data structures and locate the 'View hidden data structures' link.

![](images/image-9.png)

This will take you to a list of hidden data structures, locate the one you wish to restore and click **Restore data structure** to show it in the main listing.

## Externally managed data structures

Data structures can be managed from an external repository using [Snowplow CLI](/docs/event-studio/programmatic-management/snowplow-cli/data-structures/index.md).

When a data structure is managed this way it becomes locked in the UI, disabling all editing. You will see a banner explaining the situation and giving people with the 'publish to production' (default for admin users) capability the ability to unlock.

![](images/locked-ds.png)

:::warning
Having a single source of truth for a data structure is a good idea. If your source of truth is an external repository then unlocking and editing will cause conflicts.
:::
