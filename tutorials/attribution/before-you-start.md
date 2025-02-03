---
title: Before you start
position: 2
---

Marketing Attribution Analysis can be done in many ways depending on your business and needs. Our aim has always been to make it flexible for users to make changes from selecting a different data source to reshaping how the customer journey to conversion will be adjusted for the analysis. We suggest taking the time to read the documentation before running the model and also readjust the configurations later on to fit your needs.

In the subsequent setup steps, we will only include the absolute minimum that's needed to be able to run it for the first time, but there are many other variables that should also be considered to fine-tune for the best outcome as the default values might not be the best for your specific analysis. Below we list a few optional variables that would dictate the modeled outcome to give you some examples:


- `snowplow__conversion_hosts`: url_hosts to process, if left empty it will include all
- `snowplow__conversion_clause`: A user defined sql script to filter on specific conversions if needed. Defaulted to 'cv_value > 0'
- `snowplow__path_transforms`: A dictionary of path transforms and their arguments (see [Transform Paths](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/#transform-paths) section which includes other relevant variable changes including changing the `snowplow_path_lookback_days` and `snowplow_path_lookback_steps` variables.)
- `snowplow__conversion_window_days`: By default the package processes the last complete n number of days (calculated from the last processed path in the path source) to dynamically define the conversion window for each incremental run
- `snowplow__enable_attribution_overview`. By default, the package creates a model called snowplow_attribution_overview which can be used directly for BI reporting. If you are using the Attribution Modeling Data Model Pack, this is not required to be enabled as the Data Model Pack will take care of querying this data for you

:::info
For an in-depth guide, follow our [package documentation](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-models/dbt-attribution-data-model/). For a full list of variables you can use and their definitions, check out the [Configurations](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/attribution) page.
:::
