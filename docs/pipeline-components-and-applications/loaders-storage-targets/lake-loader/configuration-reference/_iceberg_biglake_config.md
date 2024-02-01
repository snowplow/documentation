<tr>
    <td><code>output.good.location</code></td>
    <td>Required, e.g. <code>gs://mybucket/</code>.  URI of the bucket location to which to write Snowplow enriched events in Iceberg format.  The URI should start with <code>gs://</code>.</td>
</tr>
<tr>
    <td><code>output.good.project</code></td>
    <td>Required. The GCP project hosting BigLake</td>
</tr>
<tr>
    <td><code>output.good.catalog</code></td>
    <td>Required. The name of the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.database</code></td>
    <td>Required. The name of the database in the BigLake catalog</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Required. The name of the table in the BigLake database</td>
</tr>
<tr>
    <td><code>output.good.connection</code></td>
    <td>Required. The name of the BigQuery connection which has permissions to access the lake</td>
</tr>
<tr>
    <td><code>output.good.bqDataset</code></td>
    <td>Required. The name of the BigQuery dataset to contain the Iceberg BigLake table</td>
</tr>
<tr>
    <td><code>output.good.region</code></td>
    <td>Required. GCP region of the BigLake</td>
</tr>
