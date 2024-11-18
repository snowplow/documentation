<tr>
    <td><code>output.good.url</code></td>
    <td>Required, e.g. <code>https://orgname.accountname.snowflakecomputing.com</code>.  URI of the Snowflake account.</td>
</tr>
<tr>
    <td><code>output.good.user</code></td>
    <td>Required. Snowflake user who has necessary privileges</td>
</tr>
<tr>
    <td><code>output.good.privateKey</code></td>
    <td>Required. Snowflake private key, used to connect to the account</td>
</tr>
<tr>
    <td><code>output.good.privateKeyPassphrase</code></td>
    <td>Optional. Passphrase for the private key</td>
</tr>
<tr>
    <td><code>output.good.role</code></td>
    <td>Optional. Snowflake role which the Snowflake user should assume</td>
</tr>
<tr>
    <td><code>output.good.database</code></td>
    <td>Required. Name of the Snowflake database containing the events table</td>
</tr>
<tr>
    <td><code>output.good.schema</code></td>
    <td>Required. Name of the Snowflake schema containing the events table</td>
</tr>
<tr>
    <td><code>output.good.table</code></td>
    <td>Optional. Default value `events`. Name to use for the events table</td>
</tr>
<tr>
    <td><code>output.good.channel</code></td>
    <td>Optional. Default value `snowplow`. Name to use for the Snowflake channel.  If you run multiple loaders in parallel, then each channel must be given a unique name.</td>
</tr>
