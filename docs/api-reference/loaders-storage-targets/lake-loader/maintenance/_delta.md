The [Delta documentation](https://docs.delta.io/latest/best-practices.html#-delta-compact-files) makes recommendations for running regular maintenance jobs to get the best performance from your lake.
This guide expands on those recommendations specifically for your Snowplow events lake.

The Snowplow Lake Loader **does not** automatically run the maintenance tasks described below.

## Compact data files

We recommend that you schedule a compaction job to run once per day.

The compaction command depends on your table's [layout](/docs/api-reference/loaders-storage-targets/lake-loader/table-layout/index.md).

On a table partitioned by `load_tstamp_date` and `event_name` or `app_id`, your daily compaction job should operate on files that were loaded in the previous calendar day, i.e. the last completed timestamp partition.  For example, if you run the job via SQL, then use a `WHERE` clause on `load_tstamp_date < current_date()`:

```sql
OPTIMIZE <your_table> WHERE load_tstamp_date < current_date()
```

On a table with the liquid clustering layout, which isn't partitioned, run `OPTIMIZE` on the whole table. Liquid clustering is incremental: each run mostly rewrites the files written since the previous run, so the daily job doesn't grow with the size of your table:

```sql
OPTIMIZE <your_table>
```

Data compaction has two benefits for Snowplow data:

1. Queries are more efficient when the underlying parquet files are large.  After you compact your files, you will benefit from this whenever you run queries over your historic data, i.e. not just the most recently loaded events.
2. When there are fewer data files, the size of the table's delta log files is smaller.  This reduces the overhead of creating a new delta log file, and thus improves the performance of the Lake Loader when committing new events into the lake.  This becomes especially important as your lake grows in size over time.


## Cluster by event type as well as time

A table with the liquid clustering layout starts out clustered by `load_tstamp` alone. That suits models that read every event type. If you later run models that target specific events, add `event_name` (or `app_id`) as a second clustering key:

```sql
ALTER TABLE <your_table> CLUSTER BY (load_tstamp, event_name)
```

From then on, every `OPTIMIZE` groups files by event type as well as by time. Once compacted, event-specific queries read about as little as they do on a compacted partitioned table, and a query that mixes `event_name` with another column in an `OR` can skip files too, which it can't do on a partitioned Delta table. The trade-off is compaction cost: clustering on two keys costs several times as much compute as compacting a partitioned table. Freshly loaded data isn't clustered until `OPTIMIZE` runs, so a second clustering key helps queries over older data more than queries over the last few hours.

The Lake Loader doesn't check a table's clustering keys, so you can change them without stopping the loader or changing its configuration.

Don't cluster on `event_name` alone. Without `load_tstamp` as a clustering key, compacted files lose their time order, and every incremental query opens every recent file.

## Vacuum data files

We recommend that you schedule a Vacuum job to run once per week.

A vacuum is needed to clean up unreferenced data files that were logically deleted by the daily compaction jobs.

```sql
VACUUM <your_table>;
```

Unreferenced data files do not negatively impact query performance or write performance.  But they do contribute to storage costs.

Vacuum jobs need to list every file in the lake directory. In large lakes, there might be a lot of files, requiring the job to use a lot of Spark compute resources. This is why we recommend to run it infrequently to offset this impact.
