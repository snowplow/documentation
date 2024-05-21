<tr>
    <td><code>output.good.project</code></td>
    <td>Required. The GCP project to which the BigQuery dataset belongs</td>
</tr>
<tr>
    <td><code>output.good.dataset</code></td>
    <td>Required. The BigQuery dataset to which events will be loaded</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Optional. Default value <code>events</code>. Name to use for the events table</td>
</tr>
<tr>
    <td><code>output.good.credentials</code></td>
    <td>Optional. Service account credentials (JSON). If not set, default credentials will be sourced from the usual locations, e.g. file pointed to by the <code>GOOGLE_APPLICATION_CREDENTIALS</code> environment variable </td>
</tr>
