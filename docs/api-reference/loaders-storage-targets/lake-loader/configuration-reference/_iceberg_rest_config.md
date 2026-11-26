```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>output.good.type</code></td>
    <td>Required, set this to <code>Iceberg</code></td>
</tr>
<tr>
    <td><code>output.good.catalog.type</code></td>
    <td>Required, set this to <code>Rest</code></td>
</tr>
<tr>
    <td><code>output.good.catalog.uri</code></td>
    <td>Required. URI of the REST catalog server, e.g. <code>http://localhost:8080</code></td>
</tr>
<tr>
    <td><code>output.good.catalog.name</code></td>
    <td>Required. Name of the catalog</td>
</tr>
<tr>
    <td><code>output.good.location</code></td>
    <td>Optional. URI of the bucket location to which to write Snowplow enriched events in Iceberg format. The URI should start with <code>s3a://</code>, <code>gs://</code>, or <code>abfs://</code>, depending on where your bucket is. Since 0.15.0, the loader can write to any of these, regardless of which cloud it runs in. If not provided, the catalog's default warehouse location will be used.</td>
</tr>
<tr>
    <td><code>output.good.database</code></td>
    <td>Required. Name of the database in the catalog</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Required. The name of the table in the database</td>
</tr>
<tr>
    <td><code>output.good.icebergTableProperties.*</code></td>
    <td>
    Optional. A map of key/value strings corresponding to Iceberg's table properties.
    These can be anything <Link to="https://iceberg.apache.org/docs/latest/configuration/">from the Iceberg table properties documentation</Link>.
    The default properties include configuring Iceberg's column-level statistics for the important Snowplow timestamp columns: <code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>, and <code>true_tstamp</code>.
    </td>
</tr>
<tr>
    <td><code>output.good.partitionColumn</code> <AppliesTo feature="lake-loader-table-layout" /></td>
    <td>
      <p>Optional. Default value <code>event_name</code>. Sets the <Link to="/docs/api-reference/loaders-storage-targets/lake-loader/table-layout/">table layout</Link>:</p>
      <ul>
        <li><code>event_name</code>: the table is partitioned by <code>day(load_tstamp)</code> and <code>event_name</code></li>
        <li><code>app_id</code>: the table is partitioned by <code>day(load_tstamp)</code> and <code>app_id</code></li>
      </ul>
      <p>The loader applies the layout when it creates the table. If the table already exists and its partitioning doesn't match this setting, the loader stops with a setup error.</p>
    </td>
</tr>
<tr>
    <td><code>output.good.catalog.options.*</code></td>
    <td>
    Optional. A map of key/value strings which are passed to the catalog configuration.
    These can be anything <Link to="https://iceberg.apache.org/rest-catalog-spec/">from the Iceberg REST catalog documentation</Link>, such as authentication credentials.
    </td>
</tr>
