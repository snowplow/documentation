<tr>
    <td><code>output.good.location</code></td>
    <td>Required, e.g. <code>gs://mybucket/events</code>.  URI of the bucket location to which to write Snowplow enriched events in Hudi format.  The URI should start with the following prefix:
    <ul>
      <li><code>s3a://</code> on AWS</li>
      <li><code>gs://</code> on GCP</li>
      <li><code>abfs://</code> on Azure</li>
    </ul>
    </td>
</tr>
<tr>
    <td><code>output.good.hudiWriteOptions.*</code></td>
    <td>Optional. A map of key/value strings corresponding to Hudi's configuration options for writing into a table. The default options configure <code>load_tstamp</code> as the table's partition field.</td>
</tr>
<tr>
    <td><code>output.good.hudiTableProperties.*</code></td>
    <td>Optional. A map of key/value strings corresponding to Hudi's configuration options for creating a table. The default options configure <code>load_tstamp</code> as the table's partition field.</td>
</tr>
