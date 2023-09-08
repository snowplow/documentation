---
title: "Identity Stitching"
description: "Details on mapping between `domain_userid` and `user_id` in our packages."
sidebar_position: 30
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::tip
On this page, `<package>` can be one of: `web`, `mobile`

:::

**Identity stitching is the process of taking various user identifiers and combining them into a single user identifier, to better identify and track users throughout their journey on your site/app.**

The web and mobile packages contains a User Mapping module that aims to link user identifiers, namely `domain_userid`/`device_user_id` to `user_id`. The logic is to take the latest `user_id` per `domain_userid`/`device_user_id`. 

The `domain_userid`/`device_user_id` is cookie/device based and therefore expires/changes over time, where as `user_id` is typically populated when a user logs in with your own internal identifier (dependent on your tracking implementation). If you do not currently set a `user_id` as part of your tracking for logged-in users, we recommend that you begin doing this as without some assigned ID it is not possible to stitch `domain_userid` together.

This mapping is applied to the sessions table by a post-hook which updates the `stitched_user_id` column with the latest mapping. If no mapping is present, the default value for `stitched_user_id` is the `domain_userid`/`device_user_id`. This process is known as session stitching, and effectively allows you to attribute logged-in and non-logged-in sessions back to a single user.

If required, this update operation can be disabled by setting in your `dbt_project.yml` file (selecting one of web/mobile, or both, as appropriate):

```yml title="dbt_project.yml"
vars:
  snowplow_<package>:
    snowplow__session_stitching: false
```

In the web package, since version 0.16.0, it is also possible to stitch onto the page views table by setting the value of `snowplow__page_view_stitching` to `true`. It may be enough to apply this with less frequency than on sessions to keep costs down, by only enabling this at runtime (on the command line) on only some of the runs.

User mapping is typically not a 'one size fits all' exercise. Depending on your tracking implementation, business needs and desired level of sophistication you may want to write bespoke logic. Please refer to this [blog post](https://snowplow.io/blog/developing-a-single-customer-view-with-snowplow/) for ideas. In addition, the web package offers the possibility to change what field is used as your stitched user id, so instead of `user_id` you can use any field you wish (note that it will still be called `user_id` in your mapping table), and by taking advantage of the [custom sessionization and users](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/custom-sessionization-and-users/index.md) you can also change the field used as the `domain_user_id`. We plan to add support for these features to the mobile package in the future.
