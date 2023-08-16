```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

In addition to the standard [privileges required by dbt](https://docs.getdbt.com/faqs/warehouse/database-privileges), our packages by default write to additional schemas beyond just your profile schema. If your connected user does not have `create schema` privileges, you will need to ensure that the following schemas exist in your warehouse and the user can create tables in them:

- `<profile_schema>_derived`
- `<profile_schema>_scratch`
- `<profile_schema>_snowplow_manifest`


Alternatively, you can override the output schemas our models write to, see the relevant package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for how to do this.

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake">

```sql
  grant create schema on database <database_name> to role <role_name>;

   --alternatively
   create schema <profile_schema>_derived;
   create schema <profile_schema>_scratch;
   create schema <profile_schema>_manifest;
   grant usage on schema <profile_schema>_derived to role <role_name>;
   grant usage on schema <profile_schema>_scratch to role <role_name>;
   grant usage on schema <profile_schema>_manifest to role <role_name>;
```
For more information, please refer to the [Official Guide](https://docs.snowflake.com/en/sql-reference/sql/grant-privilege) on setting up permissions.

</TabItem>

<TabItem value="bigquery" label="BigQuery" default>

Please refer to the [Official Guide](https://cloud.google.com/bigquery/docs/access-control) on setting up permissions.

</TabItem>
<TabItem value="databricks" label="Databricks">

```sql
   -- user with "use catalog" privilege on the catalog
   grant create schema on database <database_name> to role <role_name>;

   --alternatively
   create schema <profile_schema>_derived;
   create schema <profile_schema>_scratch;
   create schema <profile_schema>_manifest;
   grant usage on schema <profile_schema>_derived to <user_name>;
   grant usage on schema <profile_schema>_scratch to <user_name>;
   grant usage on schema <profile_schema>_manifest to <user_name>;
```

For more options (e.g.: granting to service principal, or group instead of users), please refer to the [Official Guide](https://docs.databricks.com/en/sql/language-manual/security-grant.html) on setting up permissions.

</TabItem>

<TabItem value="redshift" label="Redshift">

```sql
   -- someone with superuser access
   create schema authorization <user_name>;

   --alternatively
   create schema <profile_schema>_derived;
   create schema <profile_schema>_scratch;
   create schema <profile_schema>_manifest;
   grant usage on schema <profile_schema>_derived to <user_name>;
   grant usage on schema <profile_schema>_scratch to <user_name>;
   grant usage on schema <profile_schema>_manifest to <user_name>;
```

For more options (e.g.: granting to role, or group instead of users), please refer to the [Official Guide](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) on setting up permissions.

</TabItem>


<TabItem value="postgres" label="Postgres">

```sql
   -- someone with superuser access
   create schema authorization <user_name>;

   --alternatively
   create schema <profile_schema>_derived;
   create schema <profile_schema>_scratch;
   create schema <profile_schema>_manifest;
   grant usage on schema <profile_schema>_derived to <user_name>;
   grant usage on schema <profile_schema>_scratch to <user_name>;
   grant usage on schema <profile_schema>_manifest to <user_name>;
```
For more information, please refer to the [Official Guide](https://www.postgresql.org/docs/current/sql-createschema.html) on setting up permissions.

</TabItem>
</Tabs>
