---
title: "View the Unified Digital dbt package output data"
sidebar_label: "View the output data"
position: 4
description: "Query and analyze the Unified Digital dbt package output tables including views, sessions, and users. Explore aggregated metrics, engagement time calculations, and user interaction data."
keywords: ["dbt derived tables query", "snowplow sessions users analytics"]
---

The output data can now be reviewed, focusing on the `views`, `sessions`, and `users` tables. These tables contain detailed records of key metrics and interactions.

```yaml
select * from dbt_ryan_derived.snowplow_unified_views;
```

This query retrieves one row per view, detailing when each view started and ended, along with extensive information on where the event occurred.

```yaml
select * from dbt_ryan_derived.snowplow_unified_sessions;
```

The sessions table includes the engagement time in seconds, calculated using pings in comparison to absolute time. It also contains additional data, such as counts of page views and events.

```yaml
select * from dbt_ryan_derived.snowplow_unified_users;
```

The users table provides one row per user identifier, offering detailed information about each user.
