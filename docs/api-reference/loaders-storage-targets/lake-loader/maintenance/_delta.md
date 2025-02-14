The [Delta documentation](https://docs.delta.io/latest/best-practices.html#-delta-compact-files) makes recommendations for running regular maintenance jobs to get the best performance from your lake.
This guide expands on those recommendations specifically for your Snowplow events lake.

The Snowplow Lake Loader does not automatically run the maintenance tasks described below.

## Compact data files

We recommend that you schedule a compaction job run once per day.

Your daily compaction job should operate on files that were loaded in the previous calendar day, i.e. the last completed timestamp partition.  For example, if you run the job via SQL, then use a `WHERE` clause on `load_tstamp_date < current_date()`:

```sql
OPTIMIZE <your_table> WHERE load_tstamp_date < current_date()
```
Data compaction has two benefits for Snowplow data:

1. Queries are more efficient when the underlying parquet files are large.  After you compact your files, you will benefit from this whenever you run queries over your historic data; i.e. not just the most recently loaded events.
2. When there are fewer data files, then the size of the table's delta log files are also smaller.  This reduces the overhead of creating a new delta log file, and so it improves the performance of the Lake Loader when committing new events into the lake.  This becomes especially important as your lake grows in size over time.


## Vacuum data files

We recommend that you schedule a Vacuum job to run once per week.

A vacuum is needed to clean up unreferenced data files that were logically deleted by the daily compaction jobs.

```sql
VACUUM <your_table>;
```

Unreferenced data files do not negatively impact query performance or write performance.  But they do contribute to storage costs.

Vacuum jobs need to list every file in the lake directory, and on large lakes that might be a very large number of files.  This is why we recommend to run it on an infrequent schedule.
