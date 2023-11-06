---
title: "Web"
sidebar_position: 100
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { DbtCongfigurationPage } from '@site/src/components/JsonSchemaValidator';
import { dump } from 'js-yaml';

export const packageVersions = ['0.16.2', '0.16.1']


export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variables:</h4>
    <CodeBlock language="yaml">{dump({vars: {"snowplow_web": data}}, { flowLevel: 3 })}</CodeBlock>
    </>
  )
}

<DbtCongfigurationPage schemaName='dbtWeb'  versions = {packageVersions} label = 'dbt web version' output={printYamlVariables} group /> 
```

:::info

Some variables are only available in the latest version of our package, or might have changed format from older versions. If you are unable to use the latest version, check the `dbt_project.yml` file of our package for the version you are using to see what options are available to you.

:::

## Package Configuration Variables

This package utilizes a set of variables that are configured to recommended values for optimal performance of the models. Depending on your use case, you might want to override these values by adding to your `dbt_project.yml` file.

:::note

All variables in Snowplow packages start with `snowplow__` but we have removed these in the below tables for brevity.

:::



:::tip

When modifying the `session/user_identifiers` or using `session/user_sql` in the web package these will overwrite the `domain_sessionid` and `domain_userid` fields in tables, rather than being `session/user_identifier` as in the core utils implementation. This is for historic reasons to mitigate breaking changes. Original values for these fields can be found in `original_domain_session/userid` in each table.

:::



## Output Schemas
```mdx-code-block
import DbtSchemas from "@site/docs/reusable/dbt-schemas/_index.md";
import CodeBlock from '@theme/CodeBlock';
import { SchemaSetterWSeeds } from '@site/src/components/DbtSchemaSelector';

<DbtSchemas/>

export const printSchemaVariables = (manifestSchema, scratchSchema, derivedSchema, seedSchema) => {
  return(
    <>
    <CodeBlock language="yaml">
    {`models:
  snowplow_web:
    base:
      manifest:
        +schema: ${manifestSchema}
      scratch:
        +schema: ${scratchSchema}
    sessions:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    user_mapping:
      +schema: ${derivedSchema}
    users:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
    page_views:
      +schema: ${derivedSchema}
      scratch:
        +schema: ${scratchSchema}
seeds:
  snowplow_web:
    +schema: ${seedSchema}`}
        </CodeBlock>
    </>
  )
}

```
<SchemaSetterWSeeds output={printSchemaVariables}/>



## Config Generator
You can use the below inputs to generate the code that you need to place into your `dbt_project.yml` file to configure the package as you require. Any values not specified will use their default values from the package.
