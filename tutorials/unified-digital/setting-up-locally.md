---
id: setting-up-locally
title: Setting up locally
position: 3
---


### Installing the package

1. Run the following command in a new directory to create a new DBT project

    ```bash
    dbt init
    ```

2. Set up a profile to connect to the warehouse where you have your Snowplow events.

    ```yaml
    profile: 'demo_project'
    ```

3. Create a new `packages.yml` file.
4. Paste the latest version of the Snowplow Unified package. You could also use a range here if you want to keep up to date with more recent versions or you can you can hard pin to a specific version.

    ```bash
    
    packages:
      - package: snowplow/snowplow_unified
        version: [">=0.4.0"]
    ```

5. Type the following to install the package into this project:

    ```bash
    dbt deps
    ```

6. In your `project.yml` copy across our dispatch piece so that you're using our macros over the dbt core ones. We do this because we have a slightly more optimized upsert which saves you time and cost on your on your cloud warehouse bill.

    ```bash
    dispatch:
      - macro_namespace: dbt
        search_order: ['snowplow_utils', 'dbt']
    ```

7. Delete some of the other default pieces that are in the default project as they are not needed.

![](./screenshots/Screenshot_2024-07-04_at_17.14.37.png)

### Setting Variables

Now we’ll get to using our variables, which is how you enable the parts of the model that are relevant to your use-case.

1. Define the location of your source data within your `vars` block where your raw events are being loaded into.
If you're using Databricks you might need to also manage the Hive catalogue [LINK]. Make sure to update these with your actual table names!

    ```yaml
    vars:
      snowplow_unified:
        snowplow__atomic_schema: schema_with_snowplow_events
        snowplow__database: database_with_snowplow_events
    ```

2. Choose web and/or mobile data. In many cases you’ll only be tracking web data.

    ```yaml
    vars:
      snowplow_unified:
        snowplow__enable_mobile: false
        snowplow__enable_web: true
    ```

3. Enable contexts to make sure that they're processed within the package - this means they will be un-nested from the atomic columns and made available in the derived tables. Make sure to only enable the ones you need.

    ```yaml
    vars:
      snowplow_unified:
        snowplow__enable_iab: true
        snowplow__enable_ua: true
        snowplow__enable_yauaa: true
        snowplow__enable_browser_context: true
        snowplow__enable_mobile_context: true
        snowplow__enable_geolocation_context: true
        snowplow__enable_application_context: true
        snowplow__enable_screen_context: true
        snowplow__enable_deep_link_context: true
        snowplow__enable_consent: true
        snowplow__enable_cwv: true
        snowplow__enable_app_errors: true
        snowplow__enable_screen_summary_context: true
    ```

4. Set up some initial conditions for our app. So we need to go in here and we need to just set the start date to be whenever you've started tracking your data from:

    ```yaml
    vars:
      snowplow_unified:
        snowplow__start_date: 'yyyy-mm-dd'
    ```

5. Configure more vars as necessary - theoretically this is all you need just to get started.
6. Run dbt_seed to make sure you see some data, so we have some seeds in our packages, run that in there, and then run the actual model.

    ```yaml
    dbt seed --select snowplow_unified --full-refresh
    dbt run --selector snowplow_unified
    ```
