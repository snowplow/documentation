```mdx-code-block
import ReactMarkdown from 'react-markdown';
import CodeBlock from '@theme/CodeBlock';
```

### App Errors

Assuming your tracker is capturing `application_error` events, the module can be enabled by configuring the `dbt_project.yml` file:

<CodeBlock language='yaml' title="dbt_project.yml">{`
vars:
  snowplow_${props.packageName}:
    ${props.variable}: true
    `}
</CodeBlock>
