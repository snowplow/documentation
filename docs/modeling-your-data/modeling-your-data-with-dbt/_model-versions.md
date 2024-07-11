```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import {versions} from '@site/src/componentVersions';
```

<!-- Note the following tables are wrapped in the additional tags to correctly render the package version, but work the same as normal markdown tables -->

<Tabs groupId="dbt-packages" queryString>

<TabItem value="unified" label="Snowplow Unified Digital" default>

| snowplow-unified version       | dbt versions        | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------- | ------------------- | :------: | :--------: | :------: | :-------: | :------: |
| {versions.dbtSnowplowUnified} | >=1.6.0 to \<2.0.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |

</TabItem>

<TabItem value="media" label="Snowplow Media Player">

| snowplow-media-player version      | snowplow-web version | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ---------------------------------- | -------------------- | ------------------ | :------: | :--------: | :------: | :-------: | :------: |
| {versions.dbtSnowplowMediaPlayer} |                      | >=1.4.0 to \<2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.5.3                              | >=0.14.0 to \<0.16.0  | >=1.4.0 to \<2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.4.2                              | >=0.13.0 to \<0.14.0  | >=1.3.0 to \<2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.4.1                              | >=0.12.0 to \<0.13.0  | >=1.3.0 to \<2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.3.4                              | >=0.9.0 to \<0.12.0   | >=1.0.0 to \<1.3.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.1.0                              | >=0.6.0 to \<0.7.0    | >=0.20.0 to \<1.1.0 |    ❌     |     ❌      |    ✅     |     ❌     |    ✅     |

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

| snowplow-normalize version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| {versions.dbtSnowplowNormalize} | >=1.4.0 to \<2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.2.3                            | >=1.3.0 to \<2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.1.0                            | >=1.0.0 to \<2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

| snowplow-ecommerce version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| {versions.dbtSnowplowEcommerce} | >=1.4.0 to \<2.0.0 |    ✅     |     ✅      |    ✅     |     ✅     |    ⚠️     |
| 0.3.0                            | >=1.3.0 to \<2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.2.1                            | >=1.0.0 to \<2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |

> _Postgres is technically supported in the models within the package, however one of the contexts’ names is too long to be loaded via the Postgres Loader._


</TabItem>


<TabItem value="attribution" label="Snowplow Attribution">

| snowplow-attribution version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ------------------------------------ | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| {versions.dbtSnowplowAttribution} | >=1.6.0 to \<2.0.0 |    ✅     |     ✅      |    ✅     |     ✅     |    ❌     |

</TabItem>
</Tabs>
