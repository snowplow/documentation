```mdx-code-block
import Link from '@docusaurus/Link';
```

:::note

The REST catalog integration has been tested with Snowflake Open Catalog.

:::

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
    <td>Optional. URI of the bucket location to which to write Snowplow enriched events in Iceberg format. The URI should start with <code>s3a://</code>, <code>gs://</code>, or <code>abfs://</code> depending on your cloud provider. If not provided, the catalog's default warehouse location will be used.</td>
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
    The default properties include configuring Iceberg's column-level statistics for the important Snowplow timestamp columns: <code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>.
    </td>
</tr>
<tr>
    <td><code>output.good.catalog.options.*</code></td>
    <td>
    Optional. A map of key/value strings which are passed to the catalog configuration.
    These can be anything <Link to="https://iceberg.apache.org/docs/latest/rest-catalog/">from the Iceberg REST catalog documentation</Link>, such as authentication credentials.
    </td>
</tr>
