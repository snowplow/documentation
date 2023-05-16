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

The package contains a handful of useful macros that can help speed up development, as well as some handy macros to rebuild the `base` level tables that each Snowplow dbt package uses internally. The process flow of these macros and the tables generated is shown below:

<p align="center">
<ThemedImage
alt='Utils Package data flow'
sources={{
light: require('./images/utils-process-light.drawio.png').default,
dark: require('./images/utils-process-dark.drawio.png').default
}}
/>
</p>

These macros can be used to build custom versions of `events_this_run` tables, which the out-of-the-box Snowplow dbt packages can then leverage alongside your own models. This allows you to benefit by generating custom logic that the standard dbt packages can take advantage of, as well as allowing you to build custom logic on top of the incremental framework that has already been built by Snowplow, ensuring you only process those events that are required without having to deal with the incremental logic yourself of sessionized data.

## Overview

This model consists of a series of models, together culminating in the `base_events_this_run` table which can be leveraged by other Snowplow packages. These models are:

- `snowplow_base_quarantined_sessions.sql`: This model contains a list of all quarantined sessions, where a session is quarantined if it's total duration exceeds the maximum specified in the `snowplow__max_session_days` variable which has a default value of 3.
- `snowplow_incremental_manifest.sql`: This model is a manifest which contains a list of all Snowplow related models that are enabled, and keeps track of the last timestamp of successfully parsed data for each model.
- `snowplow_base_new_event_limits.sql`: This model keeps track of the upper and lower limit of events that are going to be considered, which is referenced downstream in other models to limit table scans.
- `snowplow_base_sessions_lifecycle_manifest.sql`: This model maintains a session lifecycle manifest, outlining for each session (based on the specified `session_identifier` and `user_identifier`) the start and end timestamp of the session
- `snowplow_base_sessions_this_run.sql`: This model identifies which sessions are relevant to be processed for the current run, and picks only those sessions from the session lifecycle manifest outlined above.
- `snowplow_base_events_this_run.sql`: This model finally takes the output of the base sessions table and extracts all relevant events from the sessions identifed in the base sessions table, along with any custom contexts specified. This table can then be leveraged down the line by other Snowplow dbt packages or by a user's custom models.
