---
title: "Using multi-valued entities"
sidebar_position: 10
---

RHTODO

## Redshift

```jinja2

{%- set lower_limit, upper_limit = snowplow_utils.return_limits_from_model(ref('snowplow_<package_name>_base_sessions_this_run'),
                                                                            'start_tstamp',
                                                                            'end_tstamp') %}

with {{ snowplow_utils.get_sde_or_context('atomic', 'nl_basjes_yauaa_context_1', lower_limit, upper_limit, 'yauaa', single_entity = false) }},

select
    a.*,
    b.yauaa_agent_name_version
from {{ ref('snowplow_<package_name>_base_events_this_run') }} a
left join nl_basjenl_basjes_yauaa_context_1s_yauaa_1 b on 
    a.event_id = b.yauaa__id 
    and a.collector_tstamp = b.yauaa__tstamp
    and mod(b.yauaa__index, a.event_id_dedupe_count) = 0 -- ensure one version of each potentially duplicated entity in context
```
