---
title: "Utils"
sidebar_position: 103
hide_title: true
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import ThemedImage from '@theme/ThemedImage';
```
<Badges badgeType="dbt-package Release" pkg="utils"></Badges>

# Snowplow Utils Package

**The package source code can be found in the [snowplow/dbt-snowplow-utils repo](https://github.com/snowplow/dbt-snowplow-utils).**

The package contains a handful of useful macros that can help speed up development, as well as some handy macros to rebuild the `base` level tables that each Snowplow dbt package uses internally.

:::info
This `base` functionality and the process flow described below is only available from `snowplow-utils v0.15.0` and above.
:::

The process flow of these macros and the tables generated is shown below:

<p align="center">
<ThemedImage
alt='Utils Package data flow'
sources={{
light: require('./images/utils-process-light.drawio.png').default,
dark: require('./images/utils-process-dark.drawio.png').default
}}
/>
</p>

You can utilize these macros to create customized versions of the `events_this_run` tables. The pre-built Snowplow dbt packages can then incorporate these tables in addition to your own models. This approach offers several benefits:

Firstly, it allows you to generate custom logic that can be leveraged by the standard dbt packages. This means you can take advantage of the existing functionality while incorporating your own specialized requirements.

Secondly, it enables you to develop custom logic on top of the incremental framework already provided by Snowplow. This ensures that you only process the events that are necessary for your use case, without having to handle the incremental logic yourself. The framework takes care of sessionizing the data, simplifying your workflow.

## Overview

This model consists of a series of macros that generate models, together culminating in the `base_events_this_run` table. This table is built in other projects, including the other Snowplow packages, which can then be leveraged to get insights into your Snowplow data. The models that are built in these other projects are:

- `snowplow_base_quarantined_sessions.sql`: This model contains a list of all quarantined sessions, where a session is quarantined if it's total duration exceeds the maximum specified in the `snowplow__max_session_days` variable which has a default value of 3.
- `snowplow_incremental_manifest.sql`: This model is a manifest which contains a list of all Snowplow related models that are enabled, and keeps track of the last timestamp of successfully parsed data for each model.
- `snowplow_base_new_event_limits.sql`: This model keeps track of the upper and lower limit of events that are going to be considered, which is referenced downstream in other models to limit table scans.
- `snowplow_base_sessions_lifecycle_manifest.sql`: This model maintains a session lifecycle manifest, outlining for each session (based on the specified `session_identifier` and `user_identifier`) the start and end timestamp of the session
- `snowplow_base_sessions_this_run.sql`: This model identifies which sessions are relevant to be processed for the current run, and picks only those sessions from the session lifecycle manifest outlined above.
- `snowplow_base_events_this_run.sql`: This model finally takes the output of the base sessions table and extracts all relevant events from the sessions identifed in the base sessions table, along with any custom contexts specified. This table can then be leveraged down the line by other Snowplow dbt packages or by a user's custom models.

With these macros, you can specify which columns get used as timestamps for incremental data processing, and which identifiers are used on a `session` and `user` level. By default, the `session_tstamp` is the `collector_tstamp`, the `session_identifier` is `domain_sessionid`, and the `user_identifier` is `domain_userid`. For a more in-depth explanation into how you can customize these values, you can read the [Utils quickstart](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/utils/index.md#6-setting-up-the-sessions-lifecycle-manifest-macro) docs.
