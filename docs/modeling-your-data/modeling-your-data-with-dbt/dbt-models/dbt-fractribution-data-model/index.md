---
title: "Fractribution"
sidebar_position: 105
---

```mdx-code-block
import ThemedImage from '@theme/ThemedImage';
```

# Snowplow Fractribution Package

**The package source code can be found in the [snowplow/dbt-snowplow-fractribution repo](https://github.com/snowplow/dbt-snowplow-fractribution), and the docs for the [macro design are here](https://snowplow.github.io/dbt-snowplow-fractribution/#/overview/snowplow_fractribution).**

## Overview

Snowplow Fractribution is a marketing attribution model for dbt. The name itself comes from `Fractional attribution`, which allows you to attribute the value of a conversion to one or more channels depending on the conversion pathway. As a result, it becomes possible to determine the revenue per channel, as well as ROAS (the amount of revenue that is earned for every dollar spent on advertising) once you have cost data for each marketing channel.

This package consists of a series of dbt models that produce the following tables:

- `snowplow_fractribution_channel_counts`: Number of sessions grouped by channel, campaign, source and medium
- `snowplow_fractribution_channel_spend`: Spend on each channel, used in ROAS calculations
- `snowplow_fractribution_conversions_by_customer_id`: Conversion revenue for each conversion, along with the associated customerid
- `snowplow_fractribution_path_summary`: Summary of different path combinations and associated conversion/non-conversions
- `snowplow_fractribution_paths_to_conversion`: Path combinations leading to conversion
- `snowplow_fractribution_paths_to_non_conversion`: Path combinations leading to non-conversion
- `snowplow_fractribution_sessions_by_customer_id`: Channel information by session timestamp, where an event timestamp is considered as the session start

Once the models are generated, the next step is to run a python script which is included in the package to run the fractribution calculations. In the [Quick Start](/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/index.md) section you will find a detailed step-by-step guide on how to operate the package as a whole.

### Intrasession Channels

In Google Analytics (Universal Analytics) a new session is started if a campaign source changes (referrer of campaign tagged URL) which is used in Fractribution. Snowplow utilizes activity based sessionization rather than campaign based sessionization. Setting `consider_intrasession_channels` to `false` will take only the campaign information from the first page view in a given Snowplow session and not give credit to other channels in the converting session if they occur after the initial page view.

 ### Path Transform Options

 Paths to conversion are often similar, but not identical. As such, path transforms reduce unnecessary complexity in similar paths before running the attribution algorithm.

 1. **Exposure** *(default)*: the same events in succession are reduced to one: `A → A → B` becomes `A → B`, a compromise between first and unique
 2. **Unique**: all events in a path are treated as unique (no reduction of complexity). Best for smaller datasets (small lookback window) without a lot of retargeting
 3. **First**: keep only the first occurrence of any event: `A → B → A` becomes `A → B`, best for brand awareness marketing
 4. **Frequency**: keep a count of the events’ frequency: `A → A → B` becomes `A(2) → B`, best when there is a lot of retargeting


### Attribution Models
- **shapley** *(default)*: Takes the weighted average of the marginal contributions of each channel to a conversion
- **first_touch**: Assigns 100% attribution to the first channel in each path.
- **last_touch**: Assigns 100% attribution to the last channel in each path.
- **position_based**: The first and last channels get 40% of the credit each, with the remaining channels getting the leftover 20% distributed evenly.
- **linear**: Assigns attribution evenly between all channels on the path.

***
**Attribution models:**
<ThemedImage
        alt='Data processing model for the normalize package'
        sources={{
          light: require('./images/attribution_models_light.png').default,
          dark: require('./images/attribution_models_dark.png').default
          }}
      />

### Differences to Google's Fractribution

For those familiar with [Google's](https://github.com/google/fractribution) Fractribution code, there are a few changes for efficiency and functionality which are been noted below.

- Temporary UDFs have been converted to persistent / permanent UDFs
- Some temporary tables converted to permanent tables
- Users without a user_id are treated as 'anonymous' ('f') users and the domain_userid is used to identify these sessions
- Users with a user_id are treated as identified ('u') users
- Templating is now run almost entirely within dbt rather than the custom SQL / Jinja templating in the original Fractribution project
- Channel changes and contributions within a session can be considered using the `consider_intrasession_channels` variable
