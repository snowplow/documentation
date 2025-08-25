<tr>
    <td><code>output.good.host</code></td>
    <td>Required, e.g. <code>https://&#123;workspace-id&#125;.cloud.databricks.com</code>.  URL of the Databricks workspace.</td>
</tr>
<tr>
    <td><code>output.good.catalog</code></td>
    <td>Required. Name of the Databricks catalog containing the volume.</td>
</tr>
<tr>
    <td><code>output.good.schema</code></td>
    <td>Required. Name of the Databricks schema containing the volume.</td>
</tr>
<tr>
    <td><code>output.good.volume</code></td>
    <td>Required. Name of the Databricks volume to which this loader will upload staging files.  This must be an [external](https://docs.databricks.com/aws/en/volumes/managed-vs-external) volume.</td>
</tr>
<tr>
    <td><code>output.good.token</code></td>
    <td>Required if using PAT authentication. A Databricks [personal access token](https://docs.databricks.com/aws/en/dev-tools/auth).</td>
</tr>
<tr>
    <td><code>output.good.oauth.clientId</code></td>
    <td>Required if using OAUTH authentication. The client ID for a Databricks [service principal](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m).</td>
</tr>
<tr>
    <td><code>output.good.oauth.clientSecret</code></td>
    <td>Required if using OAUTH authentication. The client  secret for a Databricks [service principal](https://docs.databricks.com/aws/en/dev-tools/auth/oauth-m2m).</td>
</tr>
<tr>
    <td><code>output.good.compression</code></td>
    <td>Optional. Default value <code>snappy</code>. Compression algorithm for the uploaded staging parquet files.</td>
</tr>
