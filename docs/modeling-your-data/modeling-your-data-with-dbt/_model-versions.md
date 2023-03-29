```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {versions} from '@site/src/componentVersions';
```

<!-- Note the following tables are wrapped in the additional tags to correctly render the package version, but work the same as normal markdown tables -->

<Tabs groupId="dbt-packages">
<TabItem value="web" label="Snowplow Web" default>

From version v0.13.0 onwards you must be using [RDB Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) v4.0.0 and above, or [BigQuery Loader](/docs/destinations/warehouses-and-lakes/rdb/index.md) v1.0.0 and above. If you are not using these versions, or are using the Postgres loader, you will need to set `snowplow__enable_load_tstamp` to `false` in your `dbt_project.yml` and will not be able to use the consent models.

<ReactMarkdown children={`
| snowplow-web version       | dbt versions        | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------- | ------------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowWeb} | >=1.4.0 to <2.0.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.13.3                     | >=1.3.0 to <2.0.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.11.0                     | >=1.0.0 to <1.3.0   | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.5.1                      | >=0.20.0 to <1.0.0  | ✅        | ❌          | ✅        | ✅         | ✅        |
| 0.4.1                      | >=0.18.0 to <0.20.0 | ✅        | ❌          | ✅        | ✅         | ❌        |
`} remarkPlugins={[remarkGfm]} />

</TabItem>
<TabItem value="mobile" label="Snowplow Mobile">

<ReactMarkdown children={`
| snowplow-mobile version       | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ----------------------------- | ------------------ | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowMobile} | >=1.3.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.6.3                         | >=1.3.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.5.5                         | >=1.0.0 to <1.3.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.2.0                         | >=0.20.0 to <1.0.0 | ✅        | ❌          | ✅        | ✅         | ✅        |
`} remarkPlugins={[remarkGfm]} /> 

</TabItem>
<TabItem value="media" label="Snowplow Media Player">

<ReactMarkdown children={`
| snowplow-media-player version      | snowplow-web version | dbt versions       | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ---------------------------------- | -------------------- | ------------------ | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowMediaPlayer} | >=0.14.0 to <0.15.0  | >=1.4.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.4.2                              | >=0.13.0 to <0.14.0  | >=1.3.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.4.1                              | >=0.12.0 to <0.13.0  | >=1.3.0 to <2.0.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.3.4                              | >=0.9.0 to <0.12.0   | >=1.0.0 to <1.3.0  | ✅        | ✅          | ✅        | ✅         | ✅        |
| 0.1.0                              | >=0.6.0 to <0.7.0    | >=0.20.0 to <1.1.0 | ❌        | ❌          | ✅        | ❌         | ✅        |
`} remarkPlugins={[remarkGfm]} /> 

</TabItem>
<TabItem value="normalize" label="Snowplow Normalize">

<ReactMarkdown children={`
| snowplow-normalize version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowNormalize} | >=1.4.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.2.3                            | >=1.3.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.1.0                            | >=1.0.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
`} remarkPlugins={[remarkGfm]} /> 

</TabItem>
<TabItem value="ecommerce" label="Snowplow E-commerce">

<ReactMarkdown children={`
| snowplow-ecommerce version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| -------------------------------- | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowEcommerce} | >=1.4.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.3.0                            | >=1.3.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.2.1                            | >=1.0.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
`} remarkPlugins={[remarkGfm]} /> 

</TabItem>

<TabItem value="fractribution" label="Snowplow Fractribution">

<ReactMarkdown children={`
| snowplow-fractribution version       | dbt versions      | BigQuery | Databricks | Redshift | Snowflake | Postgres |
| ------------------------------------ | ----------------- | :------: | :--------: | :------: | :-------: | :------: |
| ${versions.dbtSnowplowFractribution} | >=1.4.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.2.0                                | >=1.3.0 to <2.0.0 | ✅        | ✅          | ❌        | ✅         | ❌        |
| 0.1.0                                | >=1.0.0 to <2.0.0 | ❌        | ❌          | ❌        | ✅         | ❌        |
`} remarkPlugins={[remarkGfm]} /> 

</TabItem>
</Tabs>
