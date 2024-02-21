---
title: "Identity Stitching"
description: "Details on mapping between `domain_userid` and `user_id` in our packages."
sidebar_position: 30
---
```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
```

**Identity stitching is the process of taking various user identifiers and combining them into a single user identifier, to better identify and track users throughout their journey on your site/app.**

Stitching users together is not an easy task: depending on the typical user journey the complexity can range from having individually identified (logged in) users, thus not having to do any extra modeling to never identified users mainly using the same common public device (e.g. school or library) where it is technically impossible to do any user stitching. As stitching is a reiterative process as it constantly needs to be updated after each incremental run for a desirably large range of data, compute power and extra expenses as well as time constraints may limit and dictate the best course of action.

## Session stitching

For the out-of-the-box user stitching we opt for the sweet spot method: applying a logic that the majority of our users will benefit from while not introducing compute-heavy calculations.

This works in many of our packages by having a `User Mapping` module that aims to link non-permanent user identifiers (typically the `domain_userid`/`device_user_id`) to the "official" identifier stored in the `user_id` field. The logic is to take the latest `user_id` per identifier.

The `domain_userid`/`device_user_id` is cookie/device based and therefore expires/changes over time, whereas `user_id` is typically populated when a user logs in with your own internal identifier (dependent on your tracking implementation). 

:::tip

You must set a `user_id` in your tracking at some point, otherwise is it not possible to stitch together sessions that take place across multiple user identifiers.

:::

This mapping is applied to the sessions table by a post-hook which updates the `stitched_user_id` column with the latest mapping. If no mapping is present, the default value for `stitched_user_id` is the user identifier. This process is known as session stitching, and effectively allows you to attribute logged-in and non-logged-in sessions back to a single user. The same process takes place on the users table.


  <p align="center">
  <ThemedImage
  alt='Session stitching in the Unified Digital Model'
  sources={{
    light: require('./images/session_stitching_light_unified.drawio.png').default,
    dark: require('./images/session_stitching_dark_unified.drawio.png').default
  }}
  />
  </p>


If required, this update operation can be disabled by setting in your `dbt_project.yml` file (selecting one of web/mobile, or both, as appropriate):

```yml title="dbt_project.yml"
vars:
  snowplow_<package>:
    snowplow__session_stitching: false
```

In Unified Digital package it is also possible to stitch onto the page views table by setting the value of `snowplow__view_stitching` to `true`. It may be enough to apply this with less frequency than on sessions to keep costs down, by only enabling this at runtime (on the command line) on only some of the runs.

:::tip

Because we update the `stitched_session_id` field this is the best field to user instead of `user_id` which requires the user to be logged in on the first event of that session.

:::

## Cross platform stitching

The `snowplow_unified` package means all the user data, from both web and mobile, is modeled in one place. This makes it easy to effectively perform cross-platform stitching, which means that as soon as a user identifies themselves by logging in as the same user on separate platforms, all the user data will be found within one package making it convenient for perform further analysis.

### Custom solutions

User mapping is typically not a one-size-fits-all exercise. Depending on your tracking implementation, business needs and desired level of sophistication you may want to write bespoke logic. Please refer to this [blog post](https://snowplow.io/blog/developing-a-single-customer-view-with-snowplow/) for ideas. The unified package offer the ability to change what field is used as your stitched user id, so instead of `user_id` you can use any field you wish (note that it will still be called `user_id` in your mapping table), and by taking advantage of the [custom sessionization and users](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/custom-identifiers/index.md) you can also change the field used as the user_identifier (unified model).

### Overview

The below diagram shows a potential flow your user may take across multiple devices. It does not matter if they are web or mobile events as Unified will correctly process and stitch both. As the user progresses through the (simplified) sessions table tracks their sessions, user identifier, user ID, and stitched user id. Once a user ID is identifier for specific user identifier it is backdated in the stitched column for all sessions with that identifier. Note that this is not possible _until_ the user logs in during a session.

<p align="center">
<ThemedImage
alt='Overview of stitching scenarios'
sources={{
light: require('./images/stitching_scenarios.drawio.png').default,
dark: require('./images/stitching_scenarios.drawio.png').default
}}
/>
</p>
