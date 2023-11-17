---
title: "Identity Stitching"
description: "Details on mapping between `domain_userid` and `user_id` in our packages."
sidebar_position: 30
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
```

:::tip
On this page, `<package>` can be one of: `web`, `mobile`, `unified`

:::

**Identity stitching is the process of taking various user identifiers and combining them into a single user identifier, to better identify and track users throughout their journey on your site/app.**

Stitching users together is not an easy task: depending on the typical user journey the complexity can range from having individually identified (logged in) users, thus not having to do any extra modelling to never identified users mainly using the same common public device (e.g. school or library) where it is technically impossible to do any user stitching. As stitching is a reiterative process as it constantly needs to be updated after each incremental run for a desirably large range of data, compute power and extra expenses as well as time constraints may limit and dictate the best course of action.

#### Session stitching

For the out-of-the-box user stitching we opted for the sweet spot method: applying a logic that the majority of our users will benefit from while keeping in mind not to introduce compute-heavy calculations still reaping ideal benefits.

How this works is that the unified, web, and mobile packages contain a `User Mapping` module that aims to lin non-permanent user identifiers, which is typically the `domain_userid`/`device_user_id` (but it can be altered to be any custom user identifier) to the "official" identifier stored within the `user_id` field. The logic is to take the latest `user_id` per `domain_userid`/`device_user_id`.

The `domain_userid`/`device_user_id` is cookie/device based and therefore expires/changes over time, where as `user_id` is typically populated when a user logs in with your own internal identifier (dependent on your tracking implementation). If you do not currently set a `user_id` as part of your tracking for logged-in users, we recommend that you begin doing this as without some assigned ID it is not possible to stitch `domain_userid` together.

This mapping is applied to the sessions table by a post-hook which updates the `stitched_user_id` column with the latest mapping. If no mapping is present, the default value for `stitched_user_id` is the `domain_userid`/`device_user_id`. This process is known as session stitching, and effectively allows you to attribute logged-in and non-logged-in sessions back to a single user.



<Tabs groupId="dbt-packages" queryString>

<TabItem value="unified" label="Snowplow Unified" default>
  <p align="center">
  <ThemedImage
  alt='Session stitching in the unified package'
  sources={{
    light: require('./images/session_stitching_light_unified.drawio.png').default,
    dark: require('./images/session_stitching_dark_unified.drawio.png').default
  }}
  />
  </p>
</TabItem>

<TabItem value="web" label="Snowplow Web">
  <p align="center">
  <ThemedImage
  alt='Session stitching in the web package'
  sources={{
    light: require('./images/session_stitching_light_web.drawio.png').default,
    dark: require('./images/session_stitching_dark_web.drawio.png').default
  }}
  />
  </p>
</TabItem>

<TabItem value="mobile" label="Snowplow Mobile">
  <p align="center">
  <ThemedImage
  alt='Session stitching in the mobile package'
  sources={{
    light: require('./images/session_stitching_light_mobile.drawio.png').default,
    dark: require('./images/session_stitching_dark_mobile.drawio.png').default
  }}
  />
  </p>
</TabItem>

</Tabs>


If required, this update operation can be disabled by setting in your `dbt_project.yml` file (selecting one of web/mobile, or both, as appropriate):

```yml title="dbt_project.yml"
vars:
  snowplow_<package>:
    snowplow__session_stitching: false
```

In the unified package and also in the web package, since version 0.16.0, it is also possible to stitch onto the page views table by setting the value of `snowplow__page_view_stitching` to `true`. It may be enough to apply this with less frequency than on sessions to keep costs down, by only enabling this at runtime (on the command line) on only some of the runs.

#### Cross platform stitching

Since the arrival of the `snowplow_unified` package all the user data is modelled in one place. This makes it easy to effectively perform cross-platform stitching, which means that as soon as a user identifies themselves by logging in as the same user on separate platforms, all the user data will be found within one package making it really convenient for perform further analysis.

#### Custom solutions

User mapping is typically not a 'one size fits all' exercise. Depending on your tracking implementation, business needs and desired level of sophistication you may want to write bespoke logic. Please refer to this [blog post](https://snowplow.io/blog/developing-a-single-customer-view-with-snowplow/) for ideas. In addition, the web and unified packages offer the possibility to change what field is used as your stitched user id, so instead of `user_id` you can use any field you wish (note that it will still be called `user_id` in your mapping table), and by taking advantage of the [custom sessionization and users](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-web-data-model/custom-sessionization-and-users/index.md) you can also change the field used as the `domain_user_id` (for the web model) or user_identifier (unified model). We plan to add support for these features to the mobile package in the future.

#### Overview

<p align="center">
<ThemedImage
alt='Overview of stitching scenarios'
sources={{
light: require('./images/stitching_scenarios.drawio.png').default,
dark: require('./images/stitching_scenarios.drawio.png').default
}}
/>
</p>

(1) it is most convenient to use the unified package so that all of these events will be modelled into the same derived tables regardless of platform

(2) if it is the same mobile/web device and the user identifies by logging in at a later stage while still retaining the same domain_userid/device_user_id, the model will update the stitched_user_id during session_stitching
 
(3) if it is the same mobile/web device and the user identifies by logging in while still retaining the same domain_userid/device_user_id, the model will update the stitched_user_id during session_stitching 

(4) if it is the same mobile device cross-navigation tracking and stitching can be applied (coming soon!)
