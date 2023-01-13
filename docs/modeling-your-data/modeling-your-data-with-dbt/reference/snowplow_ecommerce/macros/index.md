---
title: "Snowplow E-Commerce Macros"
description: Reference for snowplow_ecommerce dbt macros developed by Snowplow
sidebar_position: 20
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';

export function DbtDetails(props) {
return <div className="dbt"><details>{props.children}</details></div>
}
```

:::caution

This page is auto-generated from our dbt packages, some information may be incomplete

:::
## Snowplow Ecommerce
### Allow Refresh {#macro.snowplow_ecommerce.allow_refresh}

<DbtDetails><summary>
<code>macros/allow_refresh.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/allow_refresh.sql">(source)</a></summary>

<Tabs groupId="dispatched_sql">
<TabItem value="raw" label="Raw" default>

```jinja2
{% macro allow_refresh() %}
  {{ return(adapter.dispatch('allow_refresh', 'snowplow_ecommerce')()) }}
{% endmacro %}
```
</TabItem>
<TabItem value="default" label="default">

```jinja2
{% macro default__allow_refresh() %}

  {% set allow_refresh = snowplow_utils.get_value_by_target(
                                    dev_value=none,
                                    default_value=var('snowplow__allow_refresh'),
                                    dev_target_name=var('snowplow__dev_target_name')
                                    ) %}

  {{ return(allow_refresh) }}

{% endmacro %}
```
</TabItem>
</Tabs>

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_value_by_target](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_value_by_target)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_quarantined_sessions)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)
- [model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_incremental_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Cart Fields {#macro.snowplow_ecommerce.cart_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro cart_fields() %}

  {% set cart_fields = [
      {'field': 'cart_id', 'dtype': 'string'},
      {'field': ('currency', 'cart_currency'), 'dtype': 'string'},
      {'field': ('total_value', 'cart_total_value'), 'dtype': 'numeric'},
    ] %}

  {{ return(cart_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Checkout Step Fields {#macro.snowplow_ecommerce.checkout_step_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro checkout_step_fields() %}

  {% set checkout_step_fields = [
      {'field': ('step', 'checkout_step_number'), 'dtype': 'integer'},
      {'field': ('account_type', 'checkout_account_type'), 'dtype': 'string'},
      {'field': ('billing_full_address', 'checkout_billing_full_address'), 'dtype': 'string'},
      {'field': ('billing_postcode', 'checkout_billing_postcode'), 'dtype': 'string'},
      {'field': ('coupon_code', 'checkout_coupon_code'), 'dtype': 'string'},
      {'field': ('delivery_method', 'checkout_delivery_method'), 'dtype': 'string'},
      {'field': ('delivery_provider', 'checkout_delivery_provider'), 'dtype': 'string'},
      {'field': ('marketing_opt_in', 'checkout_marketing_opt_in'), 'dtype': 'boolean'},
      {'field': ('payment_method', 'checkout_payment_method'), 'dtype': 'string'},
      {'field': ('proof_of_payment', 'checkout_proof_of_payment'), 'dtype': 'string'},
      {'field': ('shipping_full_address', 'checkout_shipping_full_address'), 'dtype': 'string'},
      {'field': ('shipping_postcode', 'checkout_shipping_postcode'), 'dtype': 'string'}
    ] %}

  {{ return(checkout_step_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Coalesce Columns By Prefix {#macro.snowplow_ecommerce.coalesce_columns_by_prefix}

<DbtDetails><summary>
<code>macros/bigquery/coalesce_columns_by_prefix.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/coalesce_columns_by_prefix.sql">(source)</a></summary>

```jinja2
{% macro coalesce_columns_by_prefix(model_ref, col_prefix) %}
    {% set all_column_objs = snowplow_utils.get_columns_in_relation_by_column_prefix(model_ref, col_prefix) %}
    {% set all_column_names = all_column_objs|map(attribute='name')|list %}
    {% set joined_paths = all_column_names|join(', ') %}
    {% set coalesced_field_paths = 'coalesce('~joined_paths~')' %}

    {{ return(coalesced_field_paths) }}
{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.get_columns_in_relation_by_column_prefix](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.get_columns_in_relation_by_column_prefix)


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_product_interactions_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Event Name Filter {#macro.snowplow_ecommerce.event_name_filter}

<DbtDetails><summary>
<code>macros/event_name_filter.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/event_name_filter.sql">(source)</a></summary>

```jinja2
{% macro event_name_filter(event_names) %}

  {%- if event_names|length -%}

    lower(event_name) in ('{{ event_names|map("lower")|join("','") }}') --filter on event_name if provided

  {%- else -%}

    true

  {%- endif -%}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)
- [model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_sessions_lifecycle_manifest)

</TabItem>
</Tabs>
</DbtDetails>

### Snowplow Ecommerce Delete From Manifest {#macro.snowplow_ecommerce.snowplow_ecommerce_delete_from_manifest}

<DbtDetails><summary>
<code>macros/snowplow_delete_from_manifest.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/snowplow_delete_from_manifest.sql">(source)</a></summary>

```jinja2
{% macro snowplow_ecommerce_delete_from_manifest(models) %}
    {{ snowplow_utils.snowplow_delete_from_manifest(models, ref('snowplow_ecommerce_incremental_manifest'))}}
{% endmacro %}
```

</DbtDetails>


#### Depends On
- [macro.snowplow_utils.snowplow_delete_from_manifest](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_utils/macros/index.md#macro.snowplow_utils.snowplow_delete_from_manifest)

</DbtDetails>

### Tracking Action Fields {#macro.snowplow_ecommerce.tracking_action_fields}

<DbtDetails><summary>
<code>macros/bigquery/unstruct_event_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/unstruct_event_fields.sql">(source)</a></summary>

```jinja2
{% macro tracking_action_fields() %}

  {% set tracking_action_fields = [
      {'field': ('type', 'ecommerce_action_type'), 'dtype': 'string'},
      {'field': ('name', 'ecommerce_action_name'), 'dtype': 'string'},
    ] %}

  {{ return(tracking_action_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Tracking Page Fields {#macro.snowplow_ecommerce.tracking_page_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro tracking_page_fields() %}

  {% set tracking_page_fields = [
      {'field': ('type', 'ecommerce_page_type'), 'dtype': 'string'},
      {'field': ('language', 'ecommerce_page_language'), 'dtype': 'string'},
      {'field': ('locale', 'ecommerce_page_locale'), 'dtype': 'string'},
    ] %}

  {{ return(tracking_page_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### Transaction Fields {#macro.snowplow_ecommerce.transaction_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro transaction_fields() %}

  {% set transaction_fields = [
      {'field': 'transaction_id', 'dtype': 'string'},
      {'field': ('currency', 'transaction_currency'), 'dtype': 'string'},
      {'field': ('payment_method', 'transaction_payment_method'), 'dtype': 'string'},
      {'field': ('revenue', 'transaction_revenue'), 'dtype': 'numeric'},
      {'field': ('total_quantity', 'transaction_total_quantity'), 'dtype': 'integer'},
      {'field': ('credit_order', 'transaction_credit_order'), 'dtype': 'boolean'},
      {'field': ('discount_amount', 'transaction_discount_amount'), 'dtype': 'numeric'},
      {'field': ('discount_code', 'transaction_discount_code'), 'dtype': 'string'},
      {'field': ('shipping', 'transaction_shipping'), 'dtype': 'numeric'},
      {'field': ('tax', 'transaction_tax'), 'dtype': 'numeric'},
    ] %}

  {{ return(transaction_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

### User Fields {#macro.snowplow_ecommerce.user_fields}

<DbtDetails><summary>
<code>macros/bigquery/context_fields.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/macros/bigquery/context_fields.sql">(source)</a></summary>

```jinja2
{% macro user_fields() %}

  {% set user_fields = [
      {'field':('id', 'ecommerce_user_id'), 'dtype':'string'},
      {'field':('email', 'ecommerce_user_email'), 'dtype':'string'},
      {'field':('is_guest', 'ecommerce_user_is_guest'), 'dtype':'boolean'}
    ] %}

  {{ return(user_fields) }}

{% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_ecommerce/models/index.md#model.snowplow_ecommerce.snowplow_ecommerce_base_events_this_run)

</TabItem>
</Tabs>
</DbtDetails>

