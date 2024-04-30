<tr>
    <td><code>output.good.type</code></td>
    <td>Required, set this to <code>Iceberg</code>.</td>
</tr>
<tr>
    <td><code>output.good.catalog.type</code></td>
    <td>Required, set this to <code>BigLake</code></td>
</tr>
<tr>
    <td><code>output.good.location</code></td>
    <td>Required, e.g. <code>gs://mybucket/</code>.  URI of the bucket location to which to write Snowplow enriched events in Iceberg format.  The URI should start with <code>gs://</code>.</td>
</tr>
<tr>
    <td><code>output.good.database</code></td>
    <td>Required. Name of the database in the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Required. The name of the table in the BigLake database</td>
</tr>
<tr>
    <td><code>output.good.catalog.project</code></td>
    <td>Required. The GCP project owning the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.catalog.name</code></td>
    <td>Required. The name of the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.catalog.region</code></td>
    <td>Required. GCP region of the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.catalog.options.*</code></td>
    <td>Optional. A map of key/value strings which are passed to the catalog configuration.</td>
</tr>
