<tr>
    <td><code>output.good.location</code></td>
    <td>Required, e.g. <code>gs://mybucket/events</code>.  URI of the bucket location to which to write Snowplow enriched events in Delta format. For GCP use a <code>gs://</code> URI and for Azure use a <code>abfs://</code> URI.</td>
</tr>
<tr>
    <td><code>output.good.dataSkippingColumns</code></td>
    <td>Optional. A list of column names which will be brought to the "left-hand-side" of the events table, to enable Delta's <a href="https://docs.delta.io/latest/optimizations-oss.html#data-skipping" target="_blank">data skipping feature</a>.  Defaults to the important Snowplow timestamp columns: <code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>.</td>
</tr>

