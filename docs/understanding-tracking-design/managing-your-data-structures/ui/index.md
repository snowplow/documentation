---
title: "Managing data structures in the console"
date: "2020-02-15"
sidebar_label: "Using the UI"
sidebar_position: 1
sidebar_custom_props:
  offerings:
    - enterprise
    - cloud

---

## Creating a new data structure

To create a new [Data Structure](/docs/understanding-your-pipeline/schemas/index.md), first navigate to **Data Structures** in the menu and click the **'Create a Data Structure'** button.

![](images/image-1.png)

Enterprise customers can select from two options: **Create using builder** or **Create using JSON**. The [Data Structures Builder](/docs/understanding-tracking-design/managing-your-data-structures/ui/builder/index.md) only supports the following types:

- string
- enumerated list
- integer
- decimal
- boolean

For more complex data structures that require heavy nesting and more advanced data types, use the [JSON Editor](/docs/understanding-tracking-design/managing-your-data-structures/ui/json-editor/index.md). BDP Cloud accounts will be automatically directed to the [Data Structures Builder](/docs/understanding-tracking-design/managing-your-data-structures/ui/builder/index.md).


```mdx-code-block
import DocCardList from '@theme/DocCardList';

<DocCardList />
```


![](images/builder-or-json.png)

## Editing a data structure

To edit an existing data structure, navigate to **'Data Structures'** and locate the data structure you wish to edit. You can more easily find your Data Structure by:

- Using the search facility to search by name or vendor
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located, click on the name to view the Data Structure. You can then select from two options to edit the Data Structure: [**Edit with builder**](./builder/index.md#editing-a-data-structure-with-the-data-structures-builder) or [**Edit with JSON editor**](./json-editor/index.md#editing-a-data-structure-with-the-json-editor).

:::note
The **Edit with builder** option will be unavailable if the Data Structure you're viewing is not supported. More complex Data Structures must be edited with the **JSON Editor**.
:::

![](images/disabled-builder.png)
***

## Promoting a data structure

So far we have learned how to create a new schema, and how to edit an existing schema. Both of these operations result in a schema being published to your development environment for testing.

Once you are happy with your changes you will want to promote these changes to your production environment.

:::note

The action of promoting data structures is only available to Admin users.

:::

Navigate to **Data Structures** and locate the Data Structure you wish to promote. You can more easily find your Data Structure by:

- Using the search facility to search by name or vendor
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located, either click on the name to view the Data Structure and then click the "Migrate to production" button, or click the three dots to bring up the action menu where you can select "Migrate to production".

![](images/image-8.png)

At this stage you will see the publish modal dialog, and depending on how you versioned your edits you will see one of two messages:

If you are **publishing a new schema,** or **have incremented** the version whilst editing then you will see a confirmation of the action. Click '**Migrate to Production**' to promote the data structure.

If you **have patched** the version whilst editing then you will see a warning that you must increment before publishing. Patching the version on Production is not a permitted action. [Increment the version number according to the changes you have made](/docs/understanding-tracking-design/versioning-your-data-structures/index.md) and click '**Migrate to production**' to promote the latest version of your Data Structure to your production environment.

Your data structure will now be available in your production environment to send events against.

* * *

## Hiding a data structure

Sometimes you will make errors when creating a Data Structure, or simply be creating new Data Structures as part of a quick experiment. On these occasions you may wish to hide the schema to clean up the listing in Console.

Navigate to **Data Structures** and locate the Data Structure you wish to hide. You can more easily find your Data Structure by:

- Using the search facility to search by name
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located either click on the name to view the Data Structure and then click the '**Hide**' button, or click the three dots to bring up the action menu where you can select **'**Hide Data Structure****'.

Follow the modal instructions to confirm the action.

:::note

Hiding a Data Structure will not remove it from the registry, it simply hides it from the console listing, this means:

(1) events can still be sent against this structure
(2) you cannot create a new structure of the same name

:::

### Restoring a hidden Data Structure

If you have hidden a Data Structure and wish to restore it, navigate to the bottom of the list of Data Structures and locate the 'View hidden data structures' link.

![](images/image-9.png)

This will take you to a list of hidden Data Structures, locate the one you wish to restore and click **'Restore data structure'** to show it in the main listing.
