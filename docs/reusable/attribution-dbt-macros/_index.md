
:::tip

To overwrite these macros correctly with those in your project, ensure you prefix the macro name by `default__` in the definition e.g.
```jinja2
{% macro default__conversion_value() %}
    tr_total/100
{% endmacro %}
```
:::

#### `channel_classification` macro

> The [`channel_classification`](https://github.com/snowplow/dbt-snowplow-attribution/blob/main/macros/channel_classification.sql) macro is used to perform channel classifications. We encourage users to define this at the upstream source level already, if possible. If you are using `snowplow_unified_views` or `sessions` as a base for the path source you can just leave this untouched, and the Attribution package will take the `default_channel_group` field as is. Alternatively, you can overwrite the logic based on the fields you may have in your source table. It is highly recommended that you examine and configure this or the upstream macro when using your own data, as the ROAS calculations and attribution calculations will run against these channel definitions, and the default values will not consider any custom marketing parameters.

#### `attribution_overview` macro

> Defines the sql for the view called attribution overview which provides the main report calculating the return on advertising spend (ROAS). In order to do that you would need a marketing spend table as an additional source which will contain the spend information by channel and or campaign with a timestamp to filter on the period. If you are happy with the logic of the macro, you can just define your spend table in the `snowplow__spend_source` variable and let it run.

#### `paths_to_conversion` macro

> Macro to allow flexibility for users to modify the definition of the paths_to_conversion incremental table. By default the incremental table uses the `snowplow_unified_views` and `snowplow_unified_conversions` source tables but this macro allows for flexibility around that. You can also restrict which conversion events to take

