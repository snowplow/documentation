```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export function fieldName(props, wh) {
    return (
        (wh == 'redshift' ? '' : 'unstruct_event_') +
        props.vendor.replaceAll('.', '_') +
        '_' +
        props.name +
        '_' +
        (
          wh == 'bigquery' ?
          props.version.replaceAll('-', '_') :
          props.version.split('-')[0]
        )
    );
}
export function alias(props) {
    return props.name + '_' + props.version.split('-')[0];
}
```

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake">

<CodeBlock language="sql">
{`select
  ${fieldName(props, 'snowflake')} ${alias(props)}
from
  atomic.events
where
  events.collector_tstamp > getdate() - interval '1 hour'
  and events.event = 'unstruct'
  and events.event_name = '${props.name}'
  and events.event_vendor = '${props.vendor}'
`}
</CodeBlock>

</TabItem>

<TabItem value="bigquery" label="BigQuery" default>

<CodeBlock language="sql">
{`select
  ${fieldName(props, 'bigquery')}
from
  PIPELINE_NAME.events events
where
  events.collector_tstamp > timestamp_sub(current_timestamp(), interval 1 hour)
  and events.event = 'unstruct'
  and events.event_name = '${props.name}'
  and events.event_vendor = '${props.vendor}'
`}
</CodeBlock>

</TabItem>
<TabItem value="databricks" label="Databricks">

<CodeBlock language="sql">
{`select
  ${fieldName(props, 'databricks')}
from
  atomic.events events
where
  events.collector_tstamp > timestampadd(HOUR, -1, current_timestamp())
  and events.event = 'unstruct'
  and events.event_name = '${props.name}'
  and events.event_vendor = '${props.vendor}'
  and ${fieldName(props)} is not null
`}
</CodeBlock>

</TabItem>

<TabItem value="redshift" label="Redshift & Postgres">

<CodeBlock language="sql">
{`select
  "${alias(props)}".*
from
  atomic.events events
  join atomic.${fieldName(props, 'redshift')} "${alias(props)}"
    on "${alias(props)}".root_id = events.event_id and "${alias(props)}".root_tstamp = events.collector_tstamp
where
  events.collector_tstamp > getdate() - interval '1 hour'
  and "${alias(props)}".root_tstamp > getdate() - interval '1 hour'
  and events.event = 'unstruct'
  and events.event_name = '${props.name}'
  and events.event_vendor = '${props.vendor}'
`}
</CodeBlock>

</TabItem>

</Tabs>
