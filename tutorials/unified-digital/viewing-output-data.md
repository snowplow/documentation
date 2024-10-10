---
title: Viewing the Output Data
position: 5
---

We can go ahead and look at some of those outputs, so I've selected the views, sessions and users table and if we go and look at those we can see really kind of detailed tables.

```yaml
select * from dbt_ryan_derived.snowplow_unified_views;
```

So this is one row per view. When did that view start and end? Lots of information about where the event took place.

```yaml
select * from dbt_ryan_derived.snowplow_unified_sessions;
```

The engage time in seconds using pings compared to the absolute time. Similar kind of thing in sessions with additional information in there as well.
Counts of page views, counts of events and that kind of stuff. And then the users table which is one row per user identifier and provides information

```yaml
select * from dbt_ryan_derived.snowplow_unified_users;
```
