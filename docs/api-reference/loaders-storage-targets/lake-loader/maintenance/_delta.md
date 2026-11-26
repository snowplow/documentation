The [Delta documentation](https://docs.delta.io/latest/best-practices.html#-delta-compact-files) makes recommendations for running regular maintenance jobs to get the best performance from your lake.
This guide expands on those recommendations specifically for your Snowplow events lake.

The Snowplow Lake Loader **does not** automatically run the maintenance tasks described below.

## Compact data files

We recommend that you schedule a compaction job to run once per day.

The compaction command depends on your table's [layout](/docs/api-reference/loaders-storage-targets/lake-loader/table-layout/index.md).

On a table partitioned by `event_name` or `app_id`, your daily compaction job should operate on files that were loaded in the previous calendar day, i.e. the last completed timestamp partition.  For example, if you run the job via SQL, then use a `WHERE` clause on `load_tstamp_date < current_date()`:

```sql
OPTIMIZE <your_table> WHERE load_tstamp_date < current_date()
```

On a time-only table, which uses liquid clustering, run `OPTIMIZE` without a `WHERE` clause. A clustered table has no `load_tstamp_date` column, and `OPTIMIZE` on a clustered table doesn't accept a `WHERE` clause. Liquid clustering is incremental: each run mostly rewrites the files written since the previous run, so the job doesn't grow with the size of your table:

```sql
OPTIMIZE <your_table>
```

On a time-only table, `OPTIMIZE` groups rows by the table's clustering keys. A table clustered by `load_tstamp` alone is the cheapest to compact. If you've added `event_name` or `app_id` as a clustering key, each `OPTIMIZE` costs more compute, and in return event-specific queries over compacted data read much less. See [Add a clustering key to a time-only table](/docs/api-reference/loaders-storage-targets/lake-loader/table-layout/index.md#add-a-clustering-key-to-a-time-only-table).

Data compaction has two benefits for Snowplow data:

1. Queries are more efficient when the underlying parquet files are large.  After you compact your files, you will benefit from this whenever you run queries over your historic data, i.e. not just the most recently loaded events.
2. When there are fewer data files, the size of the table's delta log files is smaller.  This reduces the overhead of creating a new delta log file, and thus improves the performance of the Lake Loader when committing new events into the lake.  This becomes especially important as your lake grows in size over time.


## Vacuum data files

We recommend that you schedule a Vacuum job to run once per week.

A vacuum is needed to clean up unreferenced data files that were logically deleted by the daily compaction jobs.

```sql
VACUUM <your_table>;
```

Unreferenced data files do not negatively impact query performance or write performance.  But they do contribute to storage costs.

Vacuum jobs need to list every file in the lake directory. In large lakes, there might be a lot of files, requiring the job to use a lot of Spark compute resources. This is why we recommend to run it infrequently to offset this impact.
