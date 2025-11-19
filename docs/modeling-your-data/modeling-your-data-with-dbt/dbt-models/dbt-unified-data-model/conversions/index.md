---
title: "Conversions module for the unified data model"
sidebar_label: "Conversions"
sidebar_position: 100
hide_title: true
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

<Badges badgeType="dbt-package Release" pkg="unified"></Badges>

# Conversions

Conversion events are a type of event that's important to your business, be that a transaction, a sign up to a newsletter, or the view of a specific page. Whatever type of event matters to you, so long as it can be determined from a single event record, you'll be able to model and aggregate these conversions at a session level with our package.

Because we know that each user may have a different concept of what a conversion means to them, for example it could be a specific type of event such as a `page_view` on a specific url, a self-describing event such as `sign_up`, or even a bespoke `conversion` event type with some attached context, the way we model conversions is also flexible and allows you to change your definition over time. This allows you to track multiple types of conversions, with varying logic, even retrospectively.

There are two ways that you can model conversions in the Unified package:

1. In the **sessions table only**
2. In the **optional conversions module**

## 1. Enabling conversions in the sessions table only

By configuring the conversion specifications through the `snowplow__conversion_events` variable you can enable conversion events to be modelled in the derived sessions table.

:::warning

Because this is part of the sessions table within the Unified dbt package, we still expect your sessions to contain at least one `page_view`, a `page_ping` or a `screen_view` event, and the events must all have a `session_identifier` to be included in the `base_events_this_run_table`. Without a `session_identifier` the event will not be visible to the model, and without a `page_view`, a `page_ping` or a `screen_view` in the session there will be no session record for the model to attach the conversions to.

:::

### Conversion Columns
For every type of conversion you provide a configuration for, the package will add up to 6 columns to the `snowplow_unified_sessions` table, depending on what you provide in your configuration. All columns start with `cv_{name}_` based on the name of your conversion and will be placed at the end of the table.

| Column                       | Description                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `cv_{name}_volume`           | An integer column with the total number of conversions in the session                        |
| `cv_{name}_values`           | An array of values for each conversion, if provided in the configuration                     |
| `cv_{name}_total`            | The total of the values for each conversion, if provided in the configuration                |
| `cv_{name}_events`           | An array of `event_id`s for each conversion, if `list_events` is `true` in the configuration |
| `cv_{name}_first_conversion` | The `derived_tstamp` of the first conversion event                                           |
| `cv_{name}_converted`        | A boolean for if there was a conversion in the session                                       |

:::tip

If you only want to take into account the first conversion in a session then use the `_converted` column and the first element of the `_values` array in any downstream analysis.

:::

Finally, if `snowplow__total_all_conversions` is set to `true` two additional columns will be added that total the volume and value across all conversions.

| Column           | Description                                  |
| ---------------- | -------------------------------------------- |
| `cv__all_volume` | The sum of volume across all conversions     |
| `cv__all_total`  | The sum of total value across all conversion |


:::tip

If you are using these columns make sure that all your conversion values are in the same units e.g. $ or stock volume.

:::

### The conversion configuration dictionary
The `snowplow__conversion_events` variable in our project takes a list of dictionaries to determine what events count as a conversion. These dictionaries are expected to have certain keys and form what we call a conversion configuration. The keys are:

| Key             | Required | Description                                                                                                                                                         | Example value                                              |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `name`          | Yes      | The name of the conversion, to be used in the column names for this conversion                                                                                      | `sign_up`                                                  |
| `condition`     | Yes      | The (valid sql) condition that identifies if the event is a conversion. Must return true or false, and will be used in a `case when ...` statement.                 | `event_name = 'page_view' and page_url like '%signed_up%'` |
| `value`         | No       | The field name or sql to select the value associated with the conversion. If not provided the `cv_{name}_value` and `cv_{name}_total` fields will not be generated. | `tr_total_base/100`                                        |
| `default_value` | No       | The default value to use when a conversion is identified but the value returned is `null`. The type should match value. Default `0`                                 | `1`                                                        |
| `list_events`   | No       | A boolean to determine whether to add the `cv_{name}_events` column to the output.                                                                                  | `true`                                                     |

:::tip

Because the sessions table builds from our `_events_this_run` table, and both the `condition` and `value` fields will accept any valid sql that can go in a `case when...` and `select` block respectively, this means you can use any fields in a `contexts_` or `unstruct_` column in addition to the default `atomic.events` fields. However, it will not accept dbt code so you need to extract the relevant field yourself. You can see an example of this below.

For Redshift and Postgres we have added the variable `snowplow__entities_or_sdes` that you can use to bring in all the fields from any self describing events or entities. For more details on this check out the [Custom entities & Events section](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/modeling-entities/index.md#custom-entities--events).

:::

#### Example configurations

<details>
<summary>All ids of page views on a particular url</summary>

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__conversion_events:
      [
        {
          "name": "contact_page_view",
          "condition": "event_name = 'page_view' and page_url like '%contact-us%",
          "list_events": true
        }
      ]
```

</details>


<details>
<summary>Using a self describing event name</summary>

For some self-describing event with a name of `sign_up`, where we do not want to attribute a value:

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__conversion_events:
      [
        {
          "name": "transact",
          "condition": "event_name = 'sign_up'",
        }
      ]
```

</details>


<details>
<summary>Using a self-describing event and a context name</summary>


Using our [Snowplow e-commerce tracking](/docs/sources/trackers/web-trackers/tracking-events/ecommerce/index.md):

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__conversion_events:
      [
        {
          "name": "transact",
          "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1:type::varchar = 'transaction'",
          "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1[0]:revenue::decimal(22,2)",
          "default_value":0
        }
      ]
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__conversion_events:
      [
        {
          "name": "transact",
          "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1_0_0.type = 'transaction'",
          "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1_0_0[SAFE_OFFSET(0)].revenue",
          "default_value":0
        }
      ]
```

</TabItem>
<TabItem value="databricks" label="Databricks">

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__conversion_events:
      [
        {
          "name": "transact",
          "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1.type = 'transaction'",
          "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1[0].revenue",
          "default_value":0
        }
      ]
```

</TabItem>
<TabItem value="redshift" label="Redshift">

```yml title="dbt_project.yml"
vars:
  snowplow_unified:
    snowplow__entities_or_sdes:
      [
        {
          'schema': 'com_snowplowanalytics_snowplow_ecommerce_transaction_1',
          'prefix': 'trans_entity',
          'alias': 'tr',
          'single_entity': true
        },
        {
          'schema': 'com_snowplowanalytics_snowplow_ecommerce_snowplow_ecommerce_action_1',
          'prefix': 'trans_event',
          'alias': 'trev',
          'single_entity': true
        }
      ]
    snowplow__conversion_events:
      [
        {
          "name": "transact",
          "condition": "event_name = 'snowplow_ecommerce_action' and trans_event_type = 'transaction'",
          "value":"trans_entity_revenue"
        }
      ]
```

</TabItem>
</Tabs>


</details>

<details>
<summary>Defining multiple conversions</summary>

When defining multiple conversion types just follow the  (list of dictionaries) format:

```yml
    snowplow__conversion_events:
      [
        {
          "name": "...",
          "condition": "...",
          ...(add more definitions optionally)
        },
        {
          "name": "...",
          "condition": "...",
          ...(add more definitions optionally)
        }
      ]
  ```

</details>
### Configuration Generator

You can use the below generator to generate the conversion events variable, make sure you combine this with existing conversions if you have any already. You can also use the full config generator on the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/unified/index.mdx) to help you generate all your package variables.

```mdx-code-block
import CodeBlock from '@theme/CodeBlock';
import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useColorMode } from '@docusaurus/theme-common';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';

export const schema = {
  "recommendFullRefresh": false,
      "title": "Conversion Definition",
      "description": "> Click the plus sign to add a new entry",
      "type": "array",
      "minItems": 0,
      "items": {
        "type": "object",
        "required": [
          "name",
          "condition"
        ],
        "title": "",
        "description": "Conversion Event",
        "properties": {
          "name": {
            "type": "string",
            "title": "Name",
            "description": "Name of your conversion type"
          },
          "condition": {
            "type": "string",
            "title": "Condition",
            "description": "SQL condition e.g. event_name = 'page_view'"
          },
          "value": {
            "type": "string",
            "title": "Value",
            "description": "SQL value e.g. tr_total_base"
          },
          "default_value": {
            "type": "number",
            "title": "Default value",
            "description": "Default value e.g. 0"
          },
          "list_events": {
            "type": "boolean",
            "title": "List all event ids?"
          }
        }
      },
      "uniqueItems": true
};

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variable:</h4>
    <CodeBlock language="yaml">{`vars:
  snowplow_unified:
    snowplow__conversion_events: ${JSON.stringify(data, null, 4)}`}</CodeBlock>
    </>
  )
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

export const JsonSchemaGenerator = ({ output, children, schema }) => {
  const [formData, setFormData] = useState(null)
  const { colorMode, setColorMode } = useColorMode()
  return (
    <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      <div className="JsonValidator">
            <Form
              schema={schema}
              formData={formData}
              onChange={(e) => setFormData(e.formData)}
              validator={validator}
              showErrorList="bottom"
              liveValidate
              uiSchema={{
                    "ui:submitButtonOptions": { norender: true },
                }}
            />
      </div>
      {output(formData)}
    </ThemeProvider>
  )
};
```

<JsonSchemaGenerator schema={schema} output={printYamlVariables} />


## 2. Enabling conversions in the Conversions Module

If you need a conversions source table for your downstream model (e.g. for the snowplow-attribution package), you can enable the optional Conversions module by setting the `snowplow__enable_conversions` variable to `true` to model that for you. You will also need to make sure you define your conversion events using the `snowplow__conversion_events` variable in case you have not already done so for the sessions table.

This would produce an incremental conversions table where you will see the most important fields related to your conversion events based on your definitions. If you defined multiple conversion types, you will see them all in one table.

| event_id | session_identifier | user_identifier      | user_id | cv_id | cv_value | cv_tstamp               | dvce_created_tstamp     | cv_type      |
| -------- | ------------------ | -------------------- | ------- | ----- | -------- | ----------------------- | ----------------------- | ------------ |
| event_1  | session_1          | f000170187170673177  | user_1  | cv_1  | 50.00    | 2023-06-08 20:18:32.000 | 2023-06-08 20:18:32.000 | transactions |
| event_2  | session_2          | f0009028775170427694 | user_2  | cv_2  | 20.42    | 2023-06-11 15:33:03.000 | 2023-06-11 15:33:03.000 | transactions |
| event_3  | session_3          | f0008284662789123943 | user_3  | cv_3  | 200.00   | 2023-07-07 13:05:55.000 | 2023-07-07 13:05:55.000 | transactions |

:::note

On Databricks targets, this table should also have a `cv_tstamp_date` column; this is used as the partition key for the table and should be the `DATE()` of the `cv_tstamp` value.

:::

You can also apply user-stitching to your conversions table by setting the `snowplow__conversion_stitching` variable to `true`. In this case a new field called `stitched_user_id` will be added to the table. For more details please refer to our guide on [Identity Stitching](/docs/modeling-your-data/modeling-your-data-with-dbt/package-features/identity-stitching/index.md).
