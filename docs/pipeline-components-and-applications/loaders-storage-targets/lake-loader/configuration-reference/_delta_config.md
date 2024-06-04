```mdx-code-block
import Link from '@docusaurus/Link';
```

<tr>
    <td><code>output.good.location</code></td>
    <td>Required, e.g. <code>gs://mybucket/events</code>.  URI of the bucket location to which to write Snowplow enriched events in Delta format.  The URI should start with the following prefix:
    <ul>
      <li><code>s3a://</code> on AWS</li>
      <li><code>gs://</code> on GCP</li>
      <li><code>abfs://</code> on Azure</li>
    </ul>
    </td>
</tr>
<tr>
    <td><code>output.good.deltaTableProperties.*</code></td>
    <td>
    Optional. A map of key/value strings corresponding to Delta's table properties.
    These can be anything <Link to="https://docs.delta.io/latest/table-properties.html">from the Delta table properties documentation</Link>.
    The default properties include configuring Delta's <Link to="https://docs.delta.io/latest/optimizations-oss.html#data-skipping">data skipping feature</Link> for the important Snowplow timestamp columns: <code>load_tstamp</code>, <code>collector_tstamp</code>, <code>derived_tstamp</code>, <code>dvce_created_tstamp</code>.</td>
</tr>
