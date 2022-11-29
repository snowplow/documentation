---
title: "User Mapping"
date: "2022-10-05"
sidebar_position: 100
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

:::tip
On this page, `<package>` can be one of: `web`, `mobile`

:::

The web and mobile packages contains a User Mapping module that aims to link user identifiers, namely `domain_userid`/`device_user_id` to `user_id`. The logic is to take the latest `user_id` per `domain_userid`/`device_user_id`.

The `domain_userid`/`device_user_id` is cookie/device based and therefore expires/changes over time, where as `user_id` is typically populated when a user logs in with your own internal identifier (dependent on your tracking implementation).

This mapping is applied to the sessions table by a post-hook which updates the `stitched_user_id` column with the latest mapping. If no mapping is present, the default value for `stitched_user_id`  is the `domain_userid`/`device_user_id`. This process is known as session stitching, and effectively allows you to attribute logged-in and non-logged-in sessions back to a single user.

If required, this update operation can be disabled by setting in your `dbt_project.yml` file (selecting one of web/mobile, or both, as appropriate):

```yml
# dbt_project.yml
...
vars:
  snowplow_<package>:
    snowplow__session_stitching: false
```

User mapping is typically not a 'one size fits all' exercise. Depending on your tracking implementation, business needs and desired level of sophistication you may want to write bespoke logic. Please refer to this [blog post](https://snowplow.io/blog/developing-a-single-customer-view-with-snowplow/) for ideas.
