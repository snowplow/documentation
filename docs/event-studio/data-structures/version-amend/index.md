---
title: "Versioning data structures"
date: "2020-02-25"
sidebar_position: 2
sidebar_label: "Version and amend"
---

Snowplow is designed to make it easy for you to change your tracking design in a safe and backwards-compatible way as your organisational data needs evolve.

Data structures are used to describe the structure your data should be delivered in. The structure itself is described by a [JSON schemas](/docs/fundamentals/schemas/index.md). Each schema carries a version number expressed as three numeric digits. As your schema evolves, all previous versions of that schema remain available to ensure backwards-compatibility.

## Why is versioning important?

As well as good practice, versioning has an important role in telling Snowplow Loaders how to handle the changes when loading into your data warehouse(s).

For example, for certain changes there will be a need to create new columns, update columns or even create whole new tables. For this reason, it's important you understand when your change is breaking and version correctly.
