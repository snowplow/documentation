```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>output.good.type</code></td>
    <td>Required, set this to <code>Iceberg</code></td>
</tr>
<tr>
    <td><code>output.good.catalog.type</code></td>
    <td>Required, set this to <code>Glue</code></td>
</tr>
<tr>
    <td><code>output.good.location</code></td>
    <td>Optional, e.g. <code>s3a://mybucket/events</code>.  URI of the bucket location to which to write Snowplow enriched events in Iceberg format.  The URI should start with <code>s3a://</code>. If not provided, the catalog's default warehouse location will be used.</td>
</tr>
<tr>
    <td><code>output.good.database</code></td>
    <td>Required. Name of the database in the Glue catalog</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Required. The name of the table in the Glue database</td>
</tr>
<tr>
    <td><code>output.good.icebergTableProperties.*</code></td>
    <td>
    Optional. A map of key/value strings corresponding to Iceberg's table properties.
    These can be anything <Link to="https://iceberg.apache.org/docs/latest/configuration/">from the Iceberg table properties documentation</Link>.
    The default properties include configuring Iceberg's column-level statistics for the important Snowplow timestamp columns: <code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>.
    </td>
</tr>
<tr>
    <td><code>output.good.catalog.options.*</code></td>
    <td>
    Optional. A map of key/value strings which are passed to the catalog configuration.
    These can be anything <Link to="https://iceberg.apache.org/docs/latest/aws/">from the Iceberg catalog documentation</Link> e.g. <code>"glue.id": "1234567"</code>
    </td>
</tr>
