---
title: "Snowplow dbt Unified v0.5.2 released"
description: "We’re happy to announce a new release for Unified."
date: "2025-02-26"
update_type:
  - "Release notes"
components:
  - "Data models"
---
We’re happy to announce a new [release](https://github.com/snowplow/dbt-snowplow-unified/releases/tag/0.5.2) for Unified

### **Summary**

This patch release targets two issues existing users reported: adding a deduplication layer on the iso_639_3 seed that by default contains some duplicates to avoid possible duplicates in the sessions table, and using row_number based deduplicating instead of qualify for Redshift that on certain versions can slow or halt the query processing.

### **Fixes**

* Deduplicate iso_639_3 seed (Close #99)
* Use row_number to deduplicate in Redshift

### **Upgrading**

* Update the snowplow-unified version in your `packages.yml` file.
