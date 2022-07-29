---
title: "Versioning your data structures"
date: "2020-02-25"
sidebar_position: 90
---

Snowplow is designed to make it easy for you to change your tracking design in a safe and backwards-compatible way as your organisational data needs evolve.

Data structures are used to describe the structure your data should be delivered in. The structure itself is described by a [JSON schemas](/docs/migrated/understanding-tracking-design/understanding-schemas-and-validation/). Each schema carries a version number expressed as three numeric digits. As your schema evolves, all previous versions of that schema remain available to ensure backwards-compatibility.

## Why is versioning important?

As well as good practice, versioning has an important role in telling Snowplow Loaders how to handle the changes when loading into your data warehouse(s).

For example, for certain changes there will be a need to create new columns, update columns or even create whole new tables. For this reason, it's important you understand when your change is breaking and version correctly.

## How do I version?

### Breaking and non-breaking changes

In Data Structures UI at the point of publishing a schema you'll be asked to select which version you'd like to create. There are two options:

- **Non-breaking** - a non-breaking change is backward compatible with historical data and increments the `patch` number i.e. `1-0-0` -> `1-0-1`.
- **Breaking** - a breaking change is not backwards compatible with historical data and increments the `model` number i.e. `1-0-0` -> `2-0-0`.

### Should I choose breaking or non-breaking?

Different data warehouses handle schema evolution slightly differently. Use the table below as a guide to how to handle versioning in Data Structures for your warehouse.

<table><tbody><tr><td></td><td class="has-text-align-center" data-align="center"><strong>Redshift</strong></td><td class="has-text-align-center" data-align="center"><strong>Snowflake, BigQuery &amp; Databricks</strong></td></tr><tr><td><strong>Add / remove / rename an optional field</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-black-color">Non-breaking</span></td><td class="has-text-align-center" data-align="center">Non-breaking</td></tr><tr><td><strong><strong>Add / remove / rename</strong> a required field</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td></tr><tr><td><strong>Change a field from optional to required</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td></tr><tr><td><strong>Change a field from required to optional</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td><td class="has-text-align-center" data-align="center">Non-breaking</td></tr><tr><td><strong>Change the type of an existing field</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color">Breaking</span></td></tr><tr><td><strong>Change the size of an existing field</strong></td><td class="has-text-align-center" data-align="center"><span class="has-inline-color has-vivid-red-color"></span><span class="has-inline-color has-black-color">Non-breaking</span></td><td class="has-text-align-center" data-align="center">Non-breaking</td></tr></tbody></table>

### Overwriting schemas

Wherever possible we would advise always versioning the schema when making a change. However in cases where this isn't possible, Snowplow does allow you to overwrite a schema on your development environment, that is making a change and keeping the version the same.

Overwriting in your Production environment is forbidden due to the technology that auto-adjusts your tables, so when you promote an overwritten version to the Production environment you are required to increase the version as Breaking or Non-Breaking.

### Incrementing the middle digit

For particular workflows you may want to make use of the middle digital as part of your versioning strategy. For simplicity, the UI allows only breaking or non-breaking changes.

Should you wish to use the middle versioning digit this is possible [via the Data Structures API](/docs/migrated/understanding-tracking-design/managing-data-structures-via-the-api/).
