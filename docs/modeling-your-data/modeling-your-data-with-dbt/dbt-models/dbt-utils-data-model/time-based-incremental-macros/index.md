---
title: "Time Based Incremental Macros"
sidebar_position: 20
hide_title: true
---
# Time Based Incremental Macros

The process flow of these macros and the tables generated is shown below:

![Utils Time Based Incremental Package data flow](../images/time-based.png)

## The need for an alternative incrementalization method
For a long time, Snowplow data has been processed based on sessions, after all that is the core of Snowplow data, especially web behavioral data that is most often evaluated in the context of a user session. However, as the use cases grew, the need for third party data integration became increasingly more important, and we have learned about several data challenges from our customers that highlighted the limitations the session based incrementalization brings with itself. Let's list a few of them to understand it better:


### Drawbacks of session based incremental processing:
- lack of control on data processing: run limits are calculated automatically through a combination of intricate web of variables that mean that model users can't predict how far the package really goes back in time for each run and we might be requerying the events table directly over and over for the same period
    - it may be every three days every hour (if within the last hour we have events arriving to sessions that started 3 days ago due to bots, long-running sessions and later arriving data unless it is capped at one day for instance)
- models need to be kept in sync, if a newly introduced model has issues, and it gets backfilled we can't move forward in processing
    - this in practice may mean that some of the business critical models have to wait until the data is backfilled, or other workarounds need to be made to avoid this that is a bit more tedious than liked
- hard to understand (both as a developer and as an end user, especially if there is a need to create custom models on top of the package)
- models produced by packages relying on session based incrementalization can't have custom partial backfills that are between two past dates
- it was developed at a time when load_tstamp field did not exist, which lead to complications and timestamp buffers in processing, which is not cost-effective, there are workarounds in the other package, but a lot of the code can be refactored

## How it works
On a high level, the macros work for an incremental data model structure where the first layer of incremental aggregation is a denormalized, `filtered events` table, with relevant event types (exactly the same way as the `snowplow_normalize` package works for those familiar with it). It also provides a mechanism to automatically create `daily aggregate` tables, which get processed and reprocessed automatically based on the filtered events tables. Finally, there is also a possibility to have a `features` table, where the daily aggregate metrics are aggregated into lifetime or last_x_day type metric calculations based on the same grain. E.g. if the daily aggregate table is based on daily user data, then the features generated will be user features, but it may be other entities e.g. products.

Similarly to the session based processing, here there is also an incremental_manifest table which keeps record of which model ran between which dates, with both upper and lower limits to facilitate custom backfills (this is not fully implemented yet). This is, however, exclusively happening based on load_tstamp and therefore this solution is for all those users with relatively recent pipelines where the events table is partitioned on load_tstamp. The models can run with whatever frequency required, we recommend running it on an hourly basis for general use cases. It will only take new events since the last time it ran, no need to reprocess anything further back in time as it is based on load_tstamp. Late arriving data is handled automatically based on some variables for optimization, more on this below.

There are plans to potentially allow for calculating daily metrics without a filtered events table directly, which would need overnight full day runs and those would also need to be part of the manifest but as they would run on a different schedule, there is no need to keep them in sync with the filtered events models.

Once the new events are deduplicated, denormalized and added to the filtered events table(s) the respective daily_aggregate table needs be updated next. The filtered_events_this run table will most likely contain events that happened in the last day or two. The timestamp we use for this is the `derived_tstamp`, which is the most accurate timestamp that denotes when the event actually happened. To avoid having to reprocess large periods due to odd late sent data (e.g. due to bots) we have included two variables to play with to reduce reprocessing and re-scanning the filtered events table and recalculating the daily metrics again:

One is called the `snowplow__reprocess_days` variable which will dictate how many days we allow to reprocess for late arriving data in the daily_aggregate tables. The other is called `snowplow__min_rows_to_process` which will indicate the threshold for reprocessing late arriving data when it reaches this amount of skipped events.

Once the daily aggregate incremental tables are ready, the final features table can be processed, which is just a drop and recompute style table by default. This is made possible in this model as the data is already quite condensed due to the daily aggregate layer which it is calculated off of, however, there is some possibility of custom optimization options if needs to be (e.g maybe customer lifetime value type calculations can be moved to a separate features table which could be excluded for most of the runs and only process it once a day in an overnight run, and the last x days type metrics can be left for more frequent updates).

There is a separate `daily_aggregation_manifest` which keeps track of how many events were arriving late and therefore skipped in the calculations. The great thing about having the `snowplow__reprocess_days` and the `snowplow__min_rows_to_process` variables is that that users will be able to dictate what to ignore and what to process, and even change these variables for one run specifically. For instance, in case of an unexpected pipeline issue, users can alway check the manifest if they see a large event volume getting skipped, and temporarily adjusting the variables to process them as a one-off.

There is a variable called `snowplow__run_type` that we currently do not make use of and it is defualted to `incremental`, however, it is planned that we will add the option to create a separate daily aggregate table for those metrics that do not rely on filtered events table. For that we will most likely add a new run type called `last_x_days` which will dictate how many days to reprocess fully compared to the current date, skipping late arriving events from days prior. This could be altered for an overnight run and it will likely dictate the update of those models that rely on this type of processing only.
