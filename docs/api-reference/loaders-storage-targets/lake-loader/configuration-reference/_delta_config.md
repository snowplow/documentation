```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>output.good.location</code></td>
    <td>
      Required, e.g. <code>gs://mybucket/events</code>.  URI of the bucket location to which to write Snowplow enriched events in Delta format.  The URI should start with the following prefix:
      <ul>
        <li><code>s3a://</code> for S3</li>
        <li><code>gs://</code> for GCS</li>
        <li><code>abfs://</code> for ADLS Gen2</li>
      </ul>
      Since 0.15.0, the loader can write to any of these, regardless of which cloud it runs in.
    </td>
</tr>
<tr>
    <td><code>output.good.deltaTableProperties.*</code></td>
    <td>
      Optional. A map of key/value strings corresponding to Delta's table properties.
      These can be anything <Link to="https://docs.delta.io/latest/table-properties.html">from the Delta table properties documentation</Link>.
      The default properties include configuring Delta's <Link to="https://docs.delta.io/latest/optimizations-oss.html#data-skipping">data skipping feature</Link> for the important Snowplow timestamp columns (<code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>, and <code>true_tstamp</code>) and for <code>event_name</code> and <code>app_id</code>.
      When the loader creates the table, it leaves the table's partition columns out of the data skipping columns, because Delta doesn't collect statistics on partition columns.
    </td>
</tr>
<tr>
    <td><code>output.good.partitionColumn</code> <AppliesTo feature="lake-loader-table-layout" /></td>
    <td>
      <p>Optional. Default value <code>event_name</code>. Sets the <Link to="/docs/api-reference/loaders-storage-targets/lake-loader/table-layout/">table layout</Link>:</p>
      <ul>
        <li><code>event_name</code>: the table is partitioned by <code>load_tstamp_date</code> and <code>event_name</code></li>
        <li><code>app_id</code>: the table is partitioned by <code>load_tstamp_date</code> and <code>app_id</code></li>
        <li><code>null</code>: the table isn't partitioned, and uses liquid clustering on <code>load_tstamp</code></li>
      </ul>
      <p>Only an explicit <code>null</code> turns partitioning off. If you leave the setting out, the loader partitions by <code>event_name</code>.</p>
      <p>The loader applies the layout when it creates the table. If the table already exists and its partitioning doesn't match this setting, the loader stops with a setup error. The loader never checks a time-only table's clustering keys, so you can change them in Databricks without changing this setting.</p>
    </td>
</tr>
