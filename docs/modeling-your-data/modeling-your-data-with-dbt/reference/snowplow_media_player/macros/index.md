---
title: "Snowplow Media Player Macros"
description: Reference for snowplow_media_player dbt macros developed by Snowplow
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
## Snowplow Media Player
### Get Percentage Boundaries {#macro.snowplow_media_player.get_percentage_boundaries}

<DbtDetails><summary>
<code>macros/get_percentage_boundaries.sql</code>
</summary>

#### Description
This macro does not currently have a description.

#### Details
<DbtDetails>
<summary>Code <a href="https://github.com/snowplow/dbt-snowplow-media-player/blob/main/macros/get_percentage_boundaries.sql">(source)</a></summary>

```jinja2
{% macro get_percentage_boundaries(tracked_boundaries) %}

   {% set percentage_boundaries = [] %}

   {% for element in var("snowplow__percent_progress_boundaries") %}
     {% if element < 0 or element > 100 %}
       {{ exceptions.raise_compiler_error("`snowplow__percent_progress_boundary` is outside the accepted range 0-100. Got: " ~ element) }}

     {% elif element % 1 != 0 %}
       {{ exceptions.raise_compiler_error("`snowplow__percent_progress_boundary` needs to be a whole number. Got: " ~ element) }}

     {% else %}
       {% do percentage_boundaries.append(element) %}
     {% endif %}
   {% endfor %}

   {% if 100 not in var("snowplow__percent_progress_boundaries") %}
     {% do percentage_boundaries.append('100') %}
   {% endif %}

   {{ return(percentage_boundaries) }}

 {% endmacro %}
```

</DbtDetails>


#### Referenced By
<Tabs groupId="reference">
<TabItem value="model" label="Models" default>

- [model.snowplow_media_player.snowplow_media_player_media_stats](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_media_stats)
- [model.snowplow_media_player.snowplow_media_player_pivot_base](/docs/modeling-your-data/modeling-your-data-with-dbt/reference/snowplow_media_player/models/index.md#model.snowplow_media_player.snowplow_media_player_pivot_base)

</TabItem>
</Tabs>
</DbtDetails>

