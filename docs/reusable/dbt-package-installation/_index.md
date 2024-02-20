```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Check [dbt Hub](https://hub.getdbt.com/snowplow/) for the latest installation instructions, or read the [dbt docs](https://docs.getdbt.com/docs/building-a-dbt-project/package-management) for more information on installing packages. If you are using multiple packages you may need to up/downgrade a specific package to ensure compatibility.

<CodeBlock language='yaml' title='packages.yml'>{`
packages:
  - package: snowplow/snowplow_${props.package}
    version: ${versions[props.fullname]}
`}</CodeBlock>

:::note

Make sure to run the `dbt deps` command after updating your `packages.yml` to ensure you have the specified version of each package installed in your project.

:::
