:::note Catalog options

We support different catalog options for Iceberg lakes.
The instructions below are not necessary when using Snowflake Open Catalog.

:::

The [Iceberg documentation](https://iceberg.apache.org/docs/latest/maintenance/) makes recommendations for running regular maintenance jobs to get the best performance from your lake.  This guide expands on those recommendations specifically for your Snowplow events lake.

The Snowplow Lake Loader **does not** automatically run the maintenance tasks described below.

## Expire snapshots

We recommend that you schedule the `expireSnapshots` Iceberg action to run once per day.

The Snowplow Lake Loader is a continuously-running streaming loader, so it creates new snapshots very frequently, each time it commits more events into the lake.  So it is especially important to manage the total number of snapshots held by the Iceberg metadata.

There are two benefits of expiring snapshots in your Snowplow lake:

1. The snapshot metadata files can be much smaller, because the list of metadata files to track is much smaller.  This reduces the overhead of creating a new snapshot file, and thus improves the performance of the Lake Loader when committing new events into the lake.  This becomes especially important as your lake grows in size over time.
2. If you regularly run compaction jobs (see below) then you will amass lots of small parquet files, which have since been rewritten into larger parquet files.  By expiring snapshots, you will delete the redundant small data files, which will save you some storage cost.

For example, if you run the action via a Spark SQL procedure:

```sql
CALL catalog_name.system.expire_snapshots(
    table => 'snowplow.events',
    stream_results => true
)
```

## Compact data files

We recommend that you schedule the `rewriteDataFiles` Iceberg action to run once per day.

Your daily compaction job should operate on files that were loaded in the previous calendar day, i.e. the last completed timestamp partition.  For example, if you run the action via a Spark SQL procedure, then use a `where` clause on `load_tstamp < current_date()`:

```sql
CALL catalog_name.system.rewrite_data_files(
    table => 'snowplow.events',
    where => 'load_tstamp < current_date()'
);
```

The `rewriteDataFiles` action has two benefits for Snowplow data:

1. Queries are more efficient when the underlying parquet files are large.  After you compact your files, you will benefit from this whenever you run queries over your historic data, i.e. not just the most recently loaded events.
2. When there are fewer data files, the size of the table's manifest files is smaller.  This reduces the overhead of creating a new manifest file, and thus improves the performance of the Lake Loader when committing new events into the lake.  This becomes especially important as your lake grows in size over time.

## Remove orphan files

We recommend that you schedule the `removeOrphanFiles` Iceberg action to run once per month.

:::tip delete-after-commit
Your Iceberg table should have `write.metadata.delete-after-commit.enabled=true` set in the table properties. If your Iceberg table was originally created by a Lake Loader older than version 0.7.0, then please run:

```sql
ALTER TABLE <your_table>
SET TBLPROPERTIES ('write.metadata.delete-after-commit.enabled'='true')
```
:::

As long as `delete-after-commit` is enabled in the table properties, the Snowplow Lake Loader should not create orphan files under normal circumstances.  But it is technically still possible for the loader to create orphan files under rare exceptional circumstances, e.g. transient network errors, or if the loader exits without completing a graceful shutdown.  Orphan files do not negatively impact query performance or write performance.  But they do contribute to storage costs.

This action needs to list every file in the lake directory. In large lakes that might be a very large number of files. In large lakes, there might be a lot of files, requiring the job to use a lot of Spark compute resources. This is why we recommend to run it infrequently to offset this impact.

```sql
CALL catalog_name.system.remove_orphan_files(
    table => 'snowplow.events'
);
```
