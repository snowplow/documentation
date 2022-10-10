---
title: "Tests in the Snowplow dbt packages"
date: "2022-10-05"
sidebar_position: 400
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

The packages contains tests for both the scratch and derived models. Depending on your use case you might not want to run all tests in production, for example to save costs. There are several tags included in the packages to help select subsets of tests. Tags:

- `this_run`: Any model with the `_this_run` suffix
- `scratch`: Any model in the scratch sub directories.
- `derived`: Any of the derived models i.e. page views, sessions and users.
- `primary-key`: Any test on the primary keys of all models in this package.

For example if your derived tables are very large you may want to run the full test suite on the `this_run` tables, which act as the input for the derived tables, but only primary key schema tests on the derived tables to ensure no duplicates. If using such a set up, we would also recommend including the `page/screen_view_in_session_value` data test for the page/screen views derived tables. For Media Player tests depending on the selector chosen it will include the web tests as well as the bespoke media tests.

This is our recommended approach to testing and can be implemented using the selector flag (see [YAML selectors](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/index.md#yaml-selectors) section for more details) as follows:

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

```bash
dbt test --selector snowplow_web_lean_tests
```

This is equivalent to:

```bash
dbt test --select snowplow_web,tag:this_run # Full tests on _this_run models
dbt test --select snowplow_web,tag:manifest # Full tests on manifest models
dbt test --select snowplow_web,tag:primary-key,tag:derived # Primary key tests only on derived tables.
dbt test --select snowplow_web,tag:derived,test_type:data  # Include the page_view_in_session_value data test
```

Alternatively, if you wanted to run all available tests in both the Snowplow web package and your custom modules:

```bash
dbt test --selector snowplow_web
```

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

```bash
dbt test --selector snowplow_mobile_lean_tests
```

This is equivalent to:

```bash
dbt test --select snowplow_mobile,tag:this_run # Full tests on _this_run models
dbt test --select snowplow_mobile,tag:manifest # Full tests on manifest models
dbt test --select snowplow_mobile,tag:primary-key,tag:derived # Primary key tests only on derived tables.
dbt test --select snowplow_mobile,tag:derived,test_type:data  # Include the screen_view_in_session_values data test
```

Alternatively, if you wanted to run all available tests in both the Snowplow web package and your custom modules:

```bash
dbt test --selector snowplow_mobile
```

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

```bash
dbt test --selector snowplow_web_lean_and_media_player_tests
```

This is equivalent to running the lean tests on the web-model as well as all media_player tests and any tests on any custom models tagged `snowplow_media_player`.

Alternatively, if you wanted to run all available tests in both the Snowplow Web and Media Player package (plus any tests on any custom models tagged `snowplow_media_player`):

```bash
dbt test --selector snowplow_media_player_tests
```

</TabItem>
</Tabs>
