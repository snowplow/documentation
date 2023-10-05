```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {versions} from '@site/src/componentVersions';
```

<!-- Note the following tables are wrapped in the additional tags to correctly render the package version, but work the same as normal markdown tables -->

<Tabs groupId="dbt-packages" queryString>

<TabItem value="unified" label="Snowplow Unified" default>


<ReactMarkdown children={`
| snowplow-unified version       | dbt versions        | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------- | ------------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowUnified} | >=1.6.0 to <2.0.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
`} remarkPlugins={[remarkGfm]} />


</TabItem>

<TabItem value="web" label="Snowplow Web" default>


<ReactMarkdown children={`
| snowplow-web version       | dbt versions        | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------- | ------------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowWeb} | >=1.5.0 to <2.0.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.15.2                     | >=1.4.0 to <2.0.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.13.3*                     | >=1.3.0 to <2.0.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.11.0                     | >=1.0.0 to <1.3.0   |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.5.1                      | >=0.20.0 to <1.0.0  |    ✅     |     ❌      |    ✅     |     ✅     |    ✅     |
| 0.4.1                      | >=0.18.0 to <0.20.0 |    ✅     |     ❌      |    ✅     |     ✅     |    ❌     |
`} remarkPlugins={[remarkGfm]} />

<span style={{'font-size':'80%'}}>

^ Since version 0.15.0 of `snowplow_web` at least version 15.0 of Postgres is required, otherwise you will need to [overwrite](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-operation/macros-and-keys/index.md#overriding-macros) the `default_channel_group` macro to not use the `regexp_like` function.

\* From version v0.13.0 onwards we use the `load_tstamp` field so you must be using [RDB Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) v4.0.0 and above, or [BigQuery Loader](/docs/pipeline-components-and-applications/loaders-storage-targets/snowplow-rdb-loader/index.md) v1.0.0 and above. If you do not have this field because you are not using these versions, or you are using the Postgres loader, you will need to set `snowplow__enable_load_tstamp` to `false` in your `dbt_project.yml` and will not be able to use the consent models.
</span>

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

<ReactMarkdown children={`
| snowplow-mobile version       | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ----------------------------- | ------------------ | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowMobile} | >=1.3.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.6.3                         | >=1.3.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.5.5                         | >=1.0.0 to <1.3.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.2.0                         | >=0.20.0 to <1.0.0 |    ✅     |     ❌      |    ✅     |     ✅     |    ✅     |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

<ReactMarkdown children={`
| snowplow-media-player version      | snowplow-web version | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ---------------------------------- | -------------------- | ------------------ | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowMediaPlayer} |                      | >=1.4.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.5.3                              | >=0.14.0 to <0.16.0  | >=1.4.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.4.2                              | >=0.13.0 to <0.14.0  | >=1.3.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.4.1                              | >=0.12.0 to <0.13.0  | >=1.3.0 to <2.0.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.3.4                              | >=0.9.0 to <0.12.0   | >=1.0.0 to <1.3.0  |    ✅     |     ✅      |    ✅     |     ✅     |    ✅     |
| 0.1.0                              | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 |    ❌     |     ❌      |    ✅     |     ❌     |    ✅     |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

<ReactMarkdown children={`
| snowplow-normalize version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowNormalize} | >=1.4.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.2.3                            | >=1.3.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.1.0                            | >=1.0.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

<ReactMarkdown children={`
| snowplow-ecommerce version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowEcommerce} | >=1.4.0 to <2.0.0 |    ✅     |     ✅      |    ✅     |     ✅     |    ⚠️     |
| 0.3.0                            | >=1.3.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.2.1                            | >=1.0.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
`} remarkPlugins={[remarkGfm]} />

> _Postgres is technically supported in the models within the package, however one of the contexts’ names is too long to be loaded via the Postgres Loader._


</TabItem>

<TabItem value="fractribution" label="Snowplow Fractribution">

<ReactMarkdown children={`
| snowplow-fractribution version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ------------------------------------ | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowFractribution} | >=1.4.0 to <2.0.0 |    ✅     |     ✅      |    ✅     |     ✅     |    ❌     |
| 0.3.0                                | >=1.4.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.2.0                                | >=1.3.0 to <2.0.0 |    ✅     |     ✅      |    ❌     |     ✅     |    ❌     |
| 0.1.0                                | >=1.0.0 to <2.0.0 |    ❌     |     ❌      |    ❌     |     ✅     |    ❌     |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
</Tabs>
