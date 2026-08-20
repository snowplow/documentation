---
title: "Snowplow dbt Normalize v0.4.1 released"
description: "We’re pleased to announce a new release for Normalize."
date: "2025-07-30"
update_type:
  - "Release notes"
components:
  - "Data modeling"
---
We’re pleased to announce a new [release](https://github.com/snowplow/dbt-snowplow-normalize/releases/tag/0.4.1) for Normalize.

### **Summary**

This release introduces the requirement for the user to explicitly accept the snowplow user license.

### **Features**

* A new boolean variable `snowplow__license_accepted` has been introduced in the main dbt package's `dbt_project.yml` file.
* The default value of variable `snowplow__license_accepted` has been set to `false`.
* To use this dbt package, the user is required accept the Snowplow Personal and Academic License or have a commercial agreement with Snowplow. See: /personal-and-academic-license-1.0.
* To accept, the user needs to set variable `snowplow__license_accepted` to `true` in their project's `dbt_project.yml`.

### **Upgrading**

To upgrade simply bump the snowplow-normalize version in your `packages.yml` file.
