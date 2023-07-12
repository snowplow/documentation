---
title: "Versioning Data Structures in BDP Cloud"
date: "2023-03-01"
sidebar_label: "Using the Data Structures Builder"
sidebar_position: 20
sidebar_custom_props:
  offerings:
    - cloud
---

# Versioning in BDP Cloud

If you are a BDP Cloud customer, you will have used our Data Structure Builder to create your custom [Data Structures](/docs/understanding-your-pipeline/schemas/index.md) for your [Events](/docs/understanding-your-pipeline/events/index.md) and [Entities](/docs/understanding-your-pipeline/entities/index.md).

![](../../managing-your-data-structures/builder/images/data-structures-2.png)

**Breaking and non-breaking changes**

At the point of publishing a data structure, there are two options for versioning:
- **Non-breaking** - a non-breaking change is backward compatible with historical data and your warehouse loader.
- **Breaking** - a breaking change is not backwards compatible with historical data and/or your warehouse loader.

The Data Structure builder will automatically select how to version up your data structure depending on the changes you have just made.

![](images/data-structures-1.png)
![](images/data-structures-2.png)