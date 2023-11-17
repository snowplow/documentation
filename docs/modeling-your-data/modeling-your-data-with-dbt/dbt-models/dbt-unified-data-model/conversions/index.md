---
title: "Conversions"
sidebar_position: 100
hide_title: true
---

```mdx-code-block
import Badges from '@site/src/components/Badges';
import CodeBlock from '@theme/CodeBlock';
import { dump } from 'js-yaml';
import { ObjectFieldTemplateGroupsGenerator, JsonApp } from '@site/src/components/JsonSchemaValidator';

export const schema = {
  "title": "Conversion Definition",
  "type": "array",
  "default": [{}],
  "minItems": 1,
  "items": {
    "type": "object",
    "required": ["name", "condition"],
    "properties": {
      "name": { "type": "string", "title": "Name", "description": "Name of your conversion type" },
      "condition": { "type": "string", "title": "Condition", "description": "SQL condition e.g. event_name = 'page_view'" },
      "value": { "type": "string", "title": "Value", "description": "SQL value e.g. tr_total_base"  },
      "default_value": { "type": "number", "title": "Default value", "description": "Default value e.g. 0" },
      "list_events": { "type": "boolean", "title": "List all event ids?" }
    }
  }
};

export const printYamlVariables = (data) => {
  return(
    <>
    <h4>Project Variable:</h4>
    <CodeBlock language="yaml">snowplow__conversion_events: {JSON.stringify(data, null, 4)}</CodeBlock>
    </>
  )
}

```

<Badges badgeType="dbt-package Release" pkg="unified"></Badges>

# Conversions

Conversion events are a type of event that's important to your business, be that a transaction, a sign up to a newsletter, or the view of a specific page. Whatever type of event matters to you, so long as it can be determined from a single event record, you'll be able to model and aggregate these conversions at a session level with our package.

Because we know that each user may have a different concept of what a conversion means to them, for example it could be a specific type of event such as a `page_view` on a specific url, a self-describing event such as `sign_up`, or even a bespoke `conversion` event type with some attached context, the way we model conversions is also flexible and allows you to change your definition over time. This allows you to track multiple types of conversions, with varying logic, even retrospectively.

:::caution

Because this is part of the sessions table within the unified package, we still expect your sessions to contain at least one `page_view` or `page_ping` event, and the events must all have a `session_identifier` to be included in the `base_events_this_run_table`. Without a `session_identifier` the event will not be visible to the model, and without a `page_view` or `page_ping` in the session there will be no session record for the model to attach the conversions to.

:::

## Conversion Columns
For every type of conversion you provide a configuration for, the package will add up to 6 columns to the `snowplow_unified_sessions` table, depending on what you provide in your configuration. All columns start with `cv_{name}_` based on the name of your conversion and will be placed at the end of the table.

| Column                       | Description                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| `cv_{name}_volume`           | An integer column with the total number of conversions in the session                        |
| `cv_{name}_values`           | An array of values for each conversion, if provided in the configuration                     |
| `cv_{name}_total`            | The total of the values for each conversion, if provided in the configuration                |
| `cv_{name}_events`           | An array of `event_id`s for each conversion, if `list_events` is `true` in the configuration |
| `cv_{name}_first_conversion` | The `derived_tstamp` of the first conversion event                                         |
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

## The conversion configuration dictionary
The `snowplow__conversion_events` variable in our project takes a list of dictionaries to determine what events count as a conversion. These dictionaries are expected to have certain keys and form what we call a conversion configuration. The keys are:

| Key           | Required | Description                                                                                                                                                         | Example value                                              |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `name`          | Yes      | The name of the conversion, to be used in the column names for this conversion                                                                                      | `sign_up`                                                  |
| `condition`     | Yes      | The (valid sql) condition that identifies if the event is a conversion. Must return true or false, and will be used in a `case when ...` statement.                 | `event_name = 'page_view' and page_url like '%signed_up%'` |
| `value`         | No       | The field name or sql to select the value associated with the conversion. If not provided the `cv_{name}_value` and `cv_{name}_total` fields will not be generated. | `tr_total_base/100`                                            |
| `default_value` | No       | The default value to use when a conversion is identified but the value returned is `null`. The type should match value. Default `0`                                 | `1`                                                        |
| `list_events`   | No       | A boolean to determine whether to add the `cv_{name}_events` column to the output.                                                                                  | `true`                                                     |

:::tip

Because the sessions table builds from our `_events_this_run` table, and both the `condition` and `value` fields will accept any valid sql that can go in a `case when...` and `select` block respectively, this means you can use any fields in a `contexts_` or `unstruct_` column in addition to the default `atomic.events` fields. However, it will not accept dbt code so you need to extract the relevant field yourself. You can see an example of this below.

For Redshift and Postgres users currently you are limited to just the fields added by the IAB, UA, and YAUAA contexts without modifying the models yourself, however we plan to support adding arbitrary self-describing event and context fields to our base table in the future.

:::

### Example configurations

<details>
<summary>All ids of page views on a particular url</summary>

```json
    {
    "name": "contact_page_view",
    "condition": "event_name = 'page_view' and page_url like '%contact-us%",
    "list_events": true
    }
```

</details>


<details>
<summary>Using a self describing event name</summary>

For some self-describing event with a name of `sign_up`, where we do not want to attribute a value:

```json
    {
    "name": "transact",
    "condition": "event_name = 'sign_up'",
    }
```

</details>


<details>
<summary>Using a self-describing event and a context name</summary>


Using our [Snowplow e-commerce tracking](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/web-tracker/plugins/snowplow-ecommerce/index.md:

<Tabs groupId="warehouse" queryString>
<TabItem value="snowflake" label="Snowflake" default>

```json
    {
    "name": "transact",
    "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1:type::varchar = 'transaction'",
    "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1[0]:revenue::decimal(22,2)",
    "default_value":0
    }
```

</TabItem>
<TabItem value="bigquery" label="BigQuery">

```json
    {
    "name": "transact",
    "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1_0_0.type = 'transaction'",
    "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1_0_0[SAFE_OFFSET(0)].revenue",
    "default_value":0
    }
```

</TabItem>
<TabItem value="databricks" label="Databricks">

```json
    {
    "name": "transact",
    "condition": "UNSTRUCT_EVENT_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_SNOWPLOW_ECOMMERCE_ACTION_1.type = 'transaction'",
    "value": "CONTEXTS_COM_SNOWPLOWANALYTICS_SNOWPLOW_ECOMMERCE_TRANSACTION_1[0].revenue",
    "default_value":0
    }
```

</TabItem>
</Tabs>


</details>


## Configuration Generator

You can use the below to generate the project variable `snowplow__conversion_events`, or you can use our full config generator on the [configuration page](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/web/index.md).

<JsonApp schema={schema} output={printYamlVariables} />
