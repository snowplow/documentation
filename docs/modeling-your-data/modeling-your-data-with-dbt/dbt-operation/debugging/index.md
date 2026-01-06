---
title: "Debugging data modeling issues"
description: "Guide for debugging data modeling issues"
sidebar_position: 10
---

There will inevitably be times when you run into dbt errors or the output is not what you expected (e.g. a session is missing from the sessions table). This guide will try and help you get started with the most common issues and how to handle them, to help you get unblocked faster and avoid having to open a customer ticket to ask for help.


## Scenario 1. The model errors out during execution

### What is the specific error message?
The first thing to look for is the actual error message. Depending on how you run your package you might have different levels of access: e.g. running the dbt locally will give you access to the whole model run log and compiled sql code within the `target` folder, whereas in Console you will typically only be able to see the model's run log with the error message where it fails.

If you look at the run log, you may need to scroll down the output until you reach the error though (there may be more than one). You will also see which models ran successfully. Look for the full error message, if it starts with `Snowplow Error: ...` it is an error message specifically created by the Snowplow Package you run, and it should give you a context into where and why it is failing. It could also be a warehouse related issue, due to access rights, or temporary resource issues etc.

In case of a Snowplow Console based error message, an error output message such as a `connection refused` related message, or for example an `EOF` error is typically down to some external database process, or a network connection error. These errors often do not need any interaction to be resolved.

If it is a syntax issue, it may give a specific code fragment to help you debug. Note down which model fails and try to execute that particular model in debug mode locally by adding `-d` to your dbt run prompt. Dbt should display a more extensive log message potentially with the full compiled code it tries to run but fails that you can copy and take to your sql editor of choice to debug separately.

### Is this the first time running into this issue? Did the model run properly before?
If the error happens after the initial package setup, it may be related to specific configurations missing. This is especially true in case of the Unified package due to its extensive optional feature support. We added a specific config helper variable: `snowplow__enable_initial_checks` to help with errors resulting from wrong configurations. When enabled it should give you a more specific error log with respect to your config that might help in such cases.

If the model only ran once but not the second time, the issue is most likely related to the incrementalization, in many cases the second run of the model contains extra code related to the timeframe to take into account for incremental updates.

If the package was running fine several times, but all of a sudden stopped working, you may need to check what changes happened since the last run. Did you upgrade to a new dbt version? Can it be related to a snowplow package version change? Was there something implemented from the tracking side? Were there any recent pipeline issues?


## Scenario 2. Output is missing data
The most common scenario that may happen is there are certain session_identifiers or user_identifiers missing from the output tables. The reason behind this can be many, we will touch the most common ones.

We process the data based on sessions: for each run we take a look at the new events (with default 6 hours of lookback window) then look at the sessions manifest table and identify how far to look back in time to cover those sessions with new events as a whole. One overlooked common scenario is that in case of pipeline issues, if some data is getting processed by the model, but the rest are only added to the warehouse outside of that default 6 hour lookback window, then the package will leave those events behind unless the same session will have new events coming in, and it needs to be reprocessed as a whole again (unless the data modeling jobs were immediately paused after the pipeline went partially down). In such cases you need partial backfilling (see the [late loaded events](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/late-arriving-data/index.md#late-loaded-events) section).

The events can also be [late sent](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/late-arriving-data/index.md#late-sent-events), in which case if they fall out of the limit, they will not get processed.

We also "quarantine" the sessions at times, as however hard we may try to filter out bots, there could be odd outliers that keep sessions alive for days, for which we have the `snowplow__max_session_days` variable. If bots keep sending events for longer than defined in that variable, the package will only process the first of those in a subsequent run and archives the session_identifier in the [quarantine table](/docs/modeling-your-data/modeling-your-data-with-dbt/package-mechanics/manifest-tables/index.md#quarantine-table) after it runs. In such a case it is always best to look for the missing event's session_identifier (domain_userid as defaulted for web events) in the table to explain why the event is missing.

Other root causes may be missing timestamp fields (e.g. `dvce_created_tstamp`, `dvce_sent_tstamp` that are needed for the sessionization logic).

If the issue is not related to the session not being processed, but certain fields appear in the views table but not downstream in a more aggregated layer (e.g. the users table) it may simply be due to the nature of the aggregation. There are certain rules to which event per session the packages take a certain field (e.g. first based on collector_tstamp or derived_tstamp but only if it is a page_view event etc.).

To help debug it better, it is best to choose a sample session, select  all its events from the events table as a whole, and see based on the compiled model code (when executing dbt locally, you can find it in the target folder) how the joins work to figure out why certain things are not working the way there are "expected". There may be changes that need to take place in tracking or through a custom data model for it to work in a specific use case.

One recommendation when deep-diving into errors is to look at dbt's lineage graph to see the model evolution, and work your way upstream to find out where the data gets filtered out using the compiled sql code from the given run. Once you find the first source when the data starts appearing you know which is the model where it gets filtered out, and you can check the subsequent model's compiled code, then cte by cte you can execute the code. It should not impact the model as those will be select statements, and you will most likely be able to identify the root cause.

:::info Lineage Graph
You can inspect the lineage graph to verify this if you are unsure by using dbt's built in data lineage feature through dbt docs. We also update that for each of our latest releases on github: https://snowplow.github.io/dbt-snowplow-unified/#!/overview?g_v=1
:::
