---
title: "Example custom dbt models"
sidebar_label: "Examples"
description: "Example custom models for Snowplow dbt packages including derived tables, aggregations, and sessionization patterns."
keywords: ["custom model examples", "dbt examples", "Snowplow customization examples"]
sidebar_position: 10
---

The following pages contain specific examples for building custom models to do specific things. They are meant to help you understand how to go about building certain types of custom models and are by no means an exhaustive list of what you can do, and you can mix and match elements to fit your needs.

If you would like to see an example of how this implementation works in practice, check out our [example dbt project](https://github.com/snowplow-incubator/dbt-example-project/tree/main/custom_event_table_unified) on Github. It demonstrates how the Unified Digital package can be used as a base for customizations, allowing you modify its behavior without forking the package (e.g. macro overwrite, adding custom data models, overwriting variables etc.).
