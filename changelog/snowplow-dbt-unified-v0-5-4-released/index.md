---
title: "Snowplow dbt Unified v0.5.4 released"
description: "We’re pleased to announce a new release for Unified."
date: "2025-07-04"
update_type:
  - "Release notes"
components:
  - "Data modeling"
---
We’re pleased to announce a new [release](https://github.com/snowplow/dbt-snowplow-unified/releases/tag/0.5.4) for Unified.

### **Summary**

This release updates the `channel_group_query()` macro so that the new `chatbot` referer medium category is recognised and classified as a separate channel category.

### **Upgrading**

Update the snowplow-unified version in your `packages.yml` file. If you have a custom version of this macro overridden in your project, please review and update it accordingly to ensure the new chatbot category is handled correctly.
