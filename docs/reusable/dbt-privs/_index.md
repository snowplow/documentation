In addition to the standard [privileges required by dbt](https://docs.getdbt.com/faqs/warehouse/database-privileges), our packages by default write to additional schemas beyond just your profile schema. If your connected user does not have `create schema` privileges, you will need to ensure that the following schemas exist in your warehouse and the user can create tables in them:

- `<profile_schema>_derived`
- `<profile_schema>_scratch`
- `<profile_schema>_snowplow_manifest`


Alternatively, you can override the output schemas our models write to, see the relevant package [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/index.md) for how to do this.
