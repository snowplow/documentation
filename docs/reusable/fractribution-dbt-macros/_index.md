
#### `conversion_clause` macro

> The [`conversion_clause`](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_clause.sql) macro specifies how to filter Snowplow events to only succesfful conversion events. How this is filtered will depend on your definition of a conversion. The default is filtering to events where `tr_total > 0`, but this could instead filter on `event_name = 'checkout'`, for example. If you are using the e-commerce model, you will still need to set this for the fractribution code to run (even though *all* events are conversions in the e-commerce model), in this case change it to `transaction_revenue > 0`.

#### `conversion_value` macro

>The [`conversion_value`](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/conversion_value.sql) macro specifies either a single column or a calculated value that represents the value associated with that conversion. The default is `tr_total`, but revenue or a calculation using revenue and discount_amount from the default e-commerce schema, for example, could similarly be used.

#### `channel_classification` macro

> The [`channel_classification`](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_classification.sql) macro is used to perform channel classifications. This can be altered to generate your expected channels if they differ from the channels generated in the default macro. It is highly recommended that you examine and configure this macro when using your own data, as the ROAS calculations and  attribution calculations will run against these channel definitions, and the default values will not consider any custom marketing parameters.

#### `channel_spend` macro

> The [`channel_spend`](https://github.com/snowplow/dbt-snowplow-fractribution/blob/main/macros/channel_spend.sql) macro is used to query the spend by channels. It requires a user supplied SQL script to extract the total ad spend by channel.
> 
> Required output format:
> - `channel`: STRING NOT NULL
> - `spend`: FLOAT64 *(or other warehouse equivalent)* (Use the same monetary units as conversion revenue, and NULL if unknown.)
