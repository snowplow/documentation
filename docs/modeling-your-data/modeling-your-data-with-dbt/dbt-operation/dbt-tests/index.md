---
title: "Tests for dbt packages"
sidebar_label: "Tests"
sidebar_position: 50
description: "Use dbt tests to validate data quality in Snowplow packages with test selection tags for scratch and derived models."
keywords: ["dbt tests", "data quality tests", "test selection"]
---

[Tests](https://docs.getdbt.com/docs/build/tests) are a useful feature in dbt to ensure that your data meets some expectations of it, such as certain fields should not be null. We provide a suite of tests with our packages to help test the output tables for any issues, however you could and should add your own as no one knows the required quality checks of your data better than you.


## Test Selection
The packages contain tests for both the scratch and derived models. Depending on your use case you might not want to run all tests in production, for example to save costs. There are several tags included in the packages to help select subsets of tests. Tags:

- `this_run`: Any model with the `_this_run` suffix
- `scratch`: Any model in the scratch sub directories.
- `derived`: Any of the derived models i.e. page views, sessions and users.
- `primary-key`: Any test on the primary keys of all models in this package.

For example if your derived tables are very large you may want to run the full test suite on the `this_run` tables, which act as the input for the derived tables, but only primary key schema tests on the derived tables to ensure no duplicates. If using such a set up, we would also recommend including the `page/screen_view_in_session_value` data test for the page/screen views derived tables.

This is our recommended approach to testing and can be implemented using the selector flag (see [YAML selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/model-selection/index.md) section for more details) as follows:


```bash
dbt test --selector snowplow_<package>_lean_tests
```

This is equivalent to:

```bash
dbt test --select snowplow_<package>,tag:this_run # Full tests on _this_run models
dbt test --select snowplow_<package>,tag:manifest # Full tests on manifest models
dbt test --select snowplow_<package>,tag:primary-key,tag:derived # Primary key tests only on derived tables.
dbt test --select snowplow_<package>,tag:derived,test_type:data  # Include the page/screen_view_in_session_value data test
```

Alternatively, if you wanted to run all available tests both in the Snowplow package, and your custom modules:

```bash
dbt test --selector snowplow_<package>
```

## Test Configuration
There are a number of configuration options on dbt tests, which are documented in the [dbt docs](https://docs.getdbt.com/reference/test-configs). You may want to apply some of these on the tests within the Snowplow dbt packages to ensure they're applicable to your data and use cases. The best way to achieve this is by editing the configuration within your project's root `dbt_project.yml` file.

For example, you may want to apply a severity threshold on all tests within the `snowplow_web` package. You can do this by updating your `dbt_project.yml` configuration as below:

```yml
# dbt_project.yml
# Example config applied to all tests in a package
...
tests:
  snowplow_web:
    +warn_if: ">10"
    +error_if: ">100"
```

Alternatively, you could apply a configuration to a specific, single instance of a test by calling out its resource path directly:

```yml
# dbt_project.yml
# Example config applied to a specific test
...
tests:
  snowplow_web:
    page_views:
      not_null_snowplow_web_page_views_domain_sessionid:
        +where: "app_id != '<app_id_to_exclude_from_test>'"
```
