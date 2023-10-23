```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export function containsCamelCase(example) {
    for (var key in example) {
      if (key.toLowerCase() != key) return true;
    }
    return false;
}

export function process(example, wh) {
  if (wh == 'other') {
    let converted = {};
    for (var key in example) {
      converted[key.replace( /([A-Z])/g, "_$1" ).toLowerCase()] = example[key];
    }
    return converted;
  } else {
    return example;
  }
}
```

<>{containsCamelCase(props.example) ? (<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake">

<CodeBlock language="json">
{JSON.stringify(process(props.example, 'snowflake'), null, 2)}
</CodeBlock>

</TabItem>

<TabItem value="other" label="Databricks & BigQuery & Redshift & Postgres" default>

<CodeBlock language="json">
{JSON.stringify(process(props.example, 'other'), null, 2)}
</CodeBlock>

</TabItem>

</Tabs>) : (<CodeBlock language="json">
{JSON.stringify(process(props.example, 'other'), null, 2)}
</CodeBlock>)}</>
