---
title: "Managing data structures with the Data Structures Builder"
sidebar_position: 85
---

:::info
The Data Structures Builder is only available for BDP Cloud customers.

For BDP Enterprise, see [Managing data structures in the console](/docs/understanding-tracking-design/managing-data-structures/index.md). For Snowplow Open Source, see [Managing data structures using Iglu](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md).
:::

To create a new Data Structure, first navigate to **Data Structures** in the menu and click the **'Create a Data Structure'** button.

![](images/data-structures-1.png)

Populate the general information, such as *Name,* and a *Description* and *Vendor*. *Vendor* allows you to organise your data structures, for example, by teams. Snowplow will automatically generate the Tracking Url to be referenced in your tracking code.

You can then add one or multiple properties. For each property, you can set a name, description, its type, a possible enumeration of allowed values. You can also set additional constraints to define if this property should be optional or mandatory, and if *null* values are allowed.

![](images/data-structures-2.png)

Click “Save” on the Property dialog box and this will save your property changes.

Clicking “Save” on the Data Structure page will publish your Data Structure to your Iglu Server.

For information about editing and versioning your Data Structure, please see [Versioning](/docs/understanding-tracking-design/versioning-your-data-structures/cloud/index.md) in BDP Cloud section.
