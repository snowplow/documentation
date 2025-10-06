---
title: "Managing data structures with the JSON Editor"
description: "The JSON editor is best suited for defining complex data structures that require heavy nesting and advanced data types."
sidebar_label: "Console: JSON editor"
sidebar_position: 1
sidebar_custom_props:
  offerings:
    - cdi
---

:::info
The JSON editor is ideal for more complex data structures that require nesting or more advanced data types. For simple data structures, use the [Data Structures Builder](/docs/data-product-studio/data-structures/manage/builder/index.md).
:::

## Creating a new data structure

Select whether you'd like to create an [Event](/docs/fundamentals/events/index.md) or an [Entity](/docs/fundamentals/entities/index.md). You can always change this selection at a later date.

<ThemedImage
  alt="Choice between builder and JSON editor options"
  width="60%"
  sources={{
    light: require('./images/image-2.png').default,
    dark: require('./images/image-2.png').default
  }}
/>

You can now write the first version of your JSON schema for this data structure. Some template JSON is provided in the code window to start you off. For comprehensive guidance on all supported JSON Schema features and validation options, see the [JSON Schema reference](/docs/fundamentals/schemas/json-schema-reference/index.md).

![](images/json-template.png)

Once you are done, click the **Validate** button and we'll validate that your schema is valid JSON markup. Assuming it passes validation, you can save your data structure as a draft.

See the [Working with drafts](/docs/data-product-studio/data-structures/manage/index.md#working-with-drafts) section for more information about the draft workflow.

Click **Save as draft** to save your data structure as a draft. As this is the first version of your data structure, it will be created as version `1-0-0` when you later deploy it to your development environment.

## Editing a data structure

Make the required edits to the JSON schema. You can use the 'Difference' toggle above the editor to see a 'diff' view against the latest Production version of your data structure.

In the example below we have changed the `maxLength` of `example_field_1`.

![](images/image-5.png)

Once you are happy with your changes, click **Validate** to ensure you have valid JSON markup. Then click **Publish to development environment** to save your changes to your development environment.

![](images/image-7.png)

The versioning dialog will appear, at this point you have three options:

- Increment a minor version to indicate a non-breaking change to the schema. In our example, this would increment the schema to from `1-0-1` to `1-0-2`.
- Increment a major version to indicate a breaking change to the schema. In our example, this would increment the schema from `1-0-1` to `2-0-0`.
- [Patch the current version](/docs/data-product-studio/data-structures/version-amend/amending/index.md#patching-the-schema), this will overwrite the existing schema without increasing the version. In our example, this would leave the schema at 1-0-1.

:::caution Selecting the "patch" option

Patching can be useful in development environments, but should be done carefully and should never be done in production. See [amending schemas](/docs/data-product-studio/data-structures/version-amend/amending/index.md) for an explanation and some suggestions.

:::

For more information see [Versioning your data structures](/docs/data-product-studio/data-structures/version-amend/index.md).

Once you have selected the appropriate version, click **Deploy to development environment** and your data structure will be deployed to your development environment ready [for you to test](/docs/data-product-studio/data-quality/index.md).

You can identify data structures where the Development version is ahead of the Production version by the yellow background on the version number. In this example both `user` and `alert` have been edited on development.

***
