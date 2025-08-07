---
title: "Install dbt package"
position: 3
---

In this section, you'll add the snowplow-mobile dbt package to your project. This package transforms the raw mobile event data into modeled tables that are easier to analyze and query.

The dbt package creates derived tables for screen views, sessions, users, and user mappings. These higher-level entities make it much simpler to understand user behavior patterns and calculate key mobile app metrics.

Ensure you have set up a new dbt project using [`dbt init`](https://docs.getdbt.com/reference/commands/init) and validated your connection using [`dbt debug`](https://docs.getdbt.com/reference/commands/debug) before proceeding.

## Step 1: Add the snowplow-mobile package

Create a `packages.yml` file at the same level as your `dbt_project.yml` file (if you don't already have one) and add the snowplow-mobile package:

```yaml
packages:
  - package: snowplow/snowplow_mobile
    version: [">=0.6.0","<0.7.0"]
```

Check the [dbt Hub](https://hub.getdbt.com/snowplow/snowplow_mobile/latest/) for the latest version number.

## Step 2: Install the package

Install the package and its dependencies by running:

```bash
dbt deps
```

Once this completes, you'll find the snowplow-mobile package in the newly created `dbt_packages` folder. The package is now available for your project to use, but remains cleanly separated in its own directory.

## Step 3: Configure package variables

The snowplow-mobile package includes several variables that you need to configure for your specific data and requirements. Add these variables to your `dbt_project.yml` file:

```yaml
vars:
  snowplow_mobile:
    snowplow__start_date: '2021-09-01'
    snowplow__backfill_limit_days: 400
    snowplow__enable_mobile_context: true
    snowplow__enable_geolocation_context: true
    snowplow__enable_application_context: true
    snowplow__enable_screen_context: true
    snowplow__events: 'atomic.sample_events_mobile'
```

Here's what each variable controls:

- **snowplow__start_date**: The date of the first tracked event in your dataset
- **snowplow__backfill_limit_days**: Number of days to process in a single run (set to 400 to process the full sample dataset)
- **snowplow__enable_mobile_context**: Enables device information from mobile context
- **snowplow__enable_geolocation_context**: Enables location data processing
- **snowplow__enable_application_context**: Enables app-specific context data
- **snowplow__enable_screen_context**: Enables screen view context information
- **snowplow__events**: Points to your events table (updated to use the sample data table)

## Step 4: Add selectors file

The mobile package provides a `selectors.yml` file that groups the models together for easier execution and testing. Copy the [selectors.yml](https://github.com/snowplow/dbt-snowplow-mobile/blob/main/selectors.yml) file from the package into your dbt project directory (at the same level as your `dbt_project.yml` file).

This file defines model selections like `snowplow_mobile` that let you run all related models with a single command.

Your project structure should now look like this:

```
your_dbt_project/
├── dbt_project.yml
├── packages.yml
├── selectors.yml
├── dbt_packages/
│   └── snowplow_mobile/
├── models/
└── ...
```

With the package installed and configured, you're ready to run the modeling process.
