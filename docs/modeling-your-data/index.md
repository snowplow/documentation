---
title: "Modeling data"
sidebar_position: 7
description: "Transform raw behavioral events into analytics-ready data models for business intelligence and data science."
schema: "TechArticle"
keywords: ["Data Modeling", "Analytics Models", "Data Transformation", "Data Engineering", "Analytics Engineering", "Data Pipeline"]
sidebar_label: "Data models"
---

At Snowplow, we define data modeling as the process of using business logic to, transform, aggregate, or otherwise process event level data. It occurs in the data warehouse, and allows you to extract value from your events data.

The Snowplow atomic data acts as an immutable log of all the actions that occurred across your digital products. The data model takes that data and transforms it into a set of derived tables optimized for analysis.

It is at the data modeling stage that you add your business logic to your Snowplow data; for example, how you define your marketing channels, what counts as a conversion, or how you segment your customers. As this logic is separate from the data you collect, you are able to update the logic and rerun it over your entire set of raw, immutable data to produce new derived data if you change your mind at a later stage. Not only can you add business logic to the data during modeling, you can also aggregate the same data into different tables based on the use cases the different teams in your organization have. Therefore, data modeling is a crucial step towards deriving insights from your data.

Snowplow provides [multiple dbt packages](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) to get you started modeling your data.
