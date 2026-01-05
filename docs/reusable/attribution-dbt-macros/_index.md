
:::tip

To overwrite these macros correctly with those in your project, ensure you prefix the macro name by `default__` in the definition e.g.
```jinja2
{% macro default__channel_classification() %}
    case when (...)
{% endmacro %}
```
:::

#### `channel_classification` macro

> The [`channel_classification`](https://github.com/snowplow/dbt-snowplow-attribution/blob/main/macros/channel_classification.sql) macro is used to classify each marketing touchpoint from your path source deciding which marketing channel it was driven by. Be default it expects an already classified field called `default_channel_group`. In case the Attribution package is used together with the Unified Digital package, it is advisable to classify your pageviews and sessions upstream using the `channel_group_guery()` macro. For an in-depth guide on how to achive this check the [channel group query](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-unified-data-model/overridable-macros/index.md) macro documentation.


#### `attribution_overview` macro

> Defines the sql for the view called attribution overview which provides the main report calculating the return on advertising spend (ROAS). In order to do that you would need a marketing spend table as an additional source which will contain the spend information by channel and or campaign with a timestamp to filter on the period. If you are happy with the logic of the macro, you can just define your spend table in the `snowplow__spend_source` variable and let it run.

#### `paths_to_conversion` macro

> Macro to allow flexibility for users to modify the definition of the paths_to_conversion incremental table. By default the incremental table uses the `snowplow_unified_views` and `snowplow_unified_conversions` source tables but this macro allows for flexibility around that. You can also restrict which conversion events to take
