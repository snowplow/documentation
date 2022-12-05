---
title: "The Fractribution data model"
date: "2022-12-01"
sidebar_position: 105
---

# Snowplow Fractribution Package


## Overview

Snowplow Fractribution is a marketing attribution model for dbt. The name itself comes from `Fractional attribution`, which allows you to attribute the value of a conversion to one or more channels depending on the conversion pathway. As a result, it becomes possible to determine the revenue per channel, as well as ROAS once you have cost data for each marketing channel.

This package consists of a series of dbt models with the goal to produce the following models:

- **snowplow_fractribution_channel_counts**: Number of sessions grouped by channel, campaign, source and medium.
- **snowplow_fractribution_channel_spend**: Spend on each channel, used in ROAS calculations.
- **snowplow_fractribution_conversions_by_customer_id**: Conversion revenue for each conversion, along with the associated customerid.
- **snowplow_fractribution_path_summary**: Summary of different path combinations and associated conversion/non-conversions.
- **snowplow_fractribution_paths_to_conversion**: Path combinations leading to conversion.
- **snowplow_fractribution_paths_to_non_conversion**: Path combinations leading to non-conversion.
- **snowplow_fractribution_sessions_by_customer_id**: Channel information by session timestamp, where an event timestamp is considered as the session start.

Once the models are generated, the next step is to run a python script which is included in the package to run the fractribution calculations.
### Differences to Fractribution

There are some changes from the [original](https://github.com/google/fractribution) Fractribution code that have been noted below.

- Temporary UDFs have been converted to persistent / permanent UDFs
- Some temporary tables converted to permanent tables
- Users without a user_id are treated as 'anonymous' ('f') users and the domain_userid is used to identify these sessions
- Users with a user_id are treated as identified ('u') users
- Templating is now run almost entirely within dbt rather than the custom SQL / Jinja templating in the original Fractribution project
- Channel changes and contributions within a session can be considered using the `consider_intrasession_channels` variable.

### Intrasession channels

In Google Analytics (Universal Analytics) a new session is started if a campaign source changes (referrer of campaign tagged URL) which is used in Fractribution. Snowplow utilises activity based sessionisation rather than campaign based sessionisation. Setting `consider_intrasession_channels` to `false` will take only the campaign information from the first page view in a given Snowplow session and not give credit to other channels in the converting session if they occur after the initial page view.
