---
title: "Managing data structures in the console"
date: "2020-02-15"
sidebar_position: 80
---

:::info
Managing data structures in the console is only available for BDP Enterprise customers.

For BDP Cloud, see [Managing data structures with the Data Structures Builder](/docs/understanding-tracking-design/managing-data-structures-with-data-structures-builder/index.md). For Snowplow Open Source, see [Managing data structures using Iglu](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md).
:::

## Creating a new data structure

To create a new Data Structure, first navigate to **Data Structures** in the menu and click the **'Create a Data Structure'** button.

![](images/image-1.png)

Now select whether you'd like to create [an Event or an Entity](/docs/understanding-tracking-design/understanding-events-entities/index.md). You can always change this selection at a later date.

![](images/image-2.png)

You can now write the first version of your JSON schema for this Data Structure. Some template JSON is provided in the code window to start you off.

![](images/image-3.png)

Once you are done, click the **'Validate'** button and we'll validate that your schema is valid JSON markup. Assuming it passes validation the 'Publish' button will activate.

Click **'Publish to development environment'** to publish your Data Structure to your development environment. As this is the first version of your data structure it will be created as version `1-0-0`. Click publish again on the modal dialog to confirm the action.

Your new Data Structure will be published to your development environment ready [for you to test](/docs/managing-data-quality/testing-and-qa-workflows/index.md).

* * *

## Editing a data structure

To edit an existing data structure, navigate to **'Data Structures'** and locate the data structure you wish to edit. You can more easily find your Data Structure by:

- Using the search facility to search by name
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located either click on the name to view the Data Structure and then click the **'Edit'** button, or click the three dots to bring up the action menu where you can select **'Create new version'**.

![](images/image-4.png)

Make the required edits to the JSON schema. You can use the 'Difference' toggle above the editor to see a 'diff' view against the latest Production version of your data structure.

In the example below we have changed the `maxLength` of `example_field_1`.

![](images/image-5.png)

Once you are happy with your changes, click **'Validate'** to ensure you have valid JSON markup. Then click **'Publish to development environment'** to save your changes to your development environment.

![](images/image-7.png)

The versioning modal dialog will appear, at this point you have three options:

- Increment a minor version to indicate a non-breaking change to the schema. In our example, we would increment the schema to from `1-0-1` to `1-0-2`.
- Increment a major version to indicate a breaking change to the schema. In our example, we would increment the schema from `1-0-1` to `2-0-0`.
- Patch the current version, this will overwrite the existing schema without increasing the version. In our example, we would leave the schema at 1-0-1.

Warning: Versioning existing Data Structures with patches

When you create a new Data Structure we generally recommend you patch at version 1-0-0 until you are ready to make your first deploy to Production.

Once you have version 1-0-0 in Production we then advise against patching as a versioning strategy. When deploying a subsequent iteration to Production you will be forced to increment the version.

For more information see [Versioning your data structures](/docs/understanding-tracking-design/versioning-your-data-structures/index.md).

Once you have selected the appropriate version, click **'Publish to development environment'** and your edits will be published to your development environment ready [for you to test](/docs/managing-data-quality/testing-and-qa-workflows/index.md).

You can identify Data Structures where the Development version is ahead of the Production version by the yellow background on the version number. In this example both `user` and `alert` have been edited on development.

![](images/image-10.png)

* * *

## Promoting a data structure

So far we have learned how to create a new schema, and how to edit an existing schema. Both of these operations result in a schema being published to your development environment for testing.

Once you are happy with your changes you will want to promote these changes to your production environment.

Note

The action of promoting data structures is only available to Admin users.

Navigate to **Data Structures** and locate the Data Structure you wish to promote. You can more easily find your Data Structure by:

- Using the search facility to search by name
- Ordering the Name column alphabetically
- Filtering the listing by Type and / or Vendor

Once located either click on the name to view the Data Structure and then click the '**Migrate to production**' button, or click the three dots to bring up the action menu where you can select **'**Migrate to production****'.

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

Note

Hiding a Data Structure will not remove it from the registry, it simply hides it from the console listing, this means:

(1) events can still be sent against this structure  
(2) you cannot create a new structure of the same name

### Restoring a hidden Data Structure

If you have hidden a Data Structure and wish to restore it, navigate to the bottom of the list of Data Structures and locate the 'View hidden data structures' link.

![](images/image-9.png)

This will take you to a list of hidden Data Structures, locate the one you wish to restore and click **'Restore data structure'** to show it in the main listing.
