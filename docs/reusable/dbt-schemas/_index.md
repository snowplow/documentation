By default all scratch/staging tables will be created in the `<target.schema>_scratch` schema, the derived tables, will be created in `<target.schema>_derived` and all manifest tables in `<target.schema>_snowplow_manifest`. Some of these schemas are only used by specific packages, ensure you add the correct configurations for each packages you are using. To change, please add the following to your `dbt_project.yml` file:

:::tip

If you want to use just your connection schema with no suffixes, set the `+schema:` values to `null`

:::
