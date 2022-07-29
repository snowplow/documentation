---
title: "Querying your Try Snowplow data"
date: "2020-11-23"
sidebar_position: 30
---

## Accessing your data

Try Snowplow creates a Postgres database where any events you capture are stored. This database contains the standard Snowplow schemas: atomic (for raw data), bad\_rows (for data that has failed pipeline validation) and derived (for modeled tables).

Details for accessing this data are available in the Try Snowplow console. You will also need to request the password from within the UI - please bear in mind you will only be able to do this once for security reasons.

## Querying your data

Like Snowplow BDP, Try Snowplow encourages you to connect your your BI or query tool of choice to access the database and query your data.

You can either copy a sample query from the console tutorial, [check out the Recipes](/docs/migrated/try-snowplow/recipes/) or start exploring your data with your own queries.
