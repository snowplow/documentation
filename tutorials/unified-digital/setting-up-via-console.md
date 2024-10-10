---
title: Setting up via Snowplow Console
position: 2
---

# Setting up via Snowplow Console

Snowplow provides a fully managed service for running data models. We recommend this if you are just getting started out, or don’t anticipate needing to build your own custom models. To get started, follow these steps:

1. Navigate to the Data models section of the Snowplow Console and click `Add data model`
![](./screenshots/F8E9BF8C-47CF-48B7-9EDC-78D6EB1221D0_1_201_a.jpeg)

1. Select `Unified Digital`

![](./screenshots/Screenshot_2024-07-04_at_17.40.25.png)

1. Set a name, warehouse connection and owner who will receive failure alerts.

![](./screenshots/Screenshot_2024-07-04_at_17.41.51.png)

1. Edit your configuration variables, pay particular attention to web and mobile data, and the core enrichments e.g. IAB, YAUAA. This means they will be un-nested from the atomic columns and made available in the derived tables.

![](./screenshots//Screenshot_2024-07-04_at_17.43.22.png)

1. Set a schedule - use a CRON editor if necessary

![](./screenshots/Screenshot_2024-07-04_at_17.44.04.png)

2. Enable the model by clicking the Enable button in the top right

![](./screenshots/Screenshot_2024-07-04_at_17.44.26.png)
