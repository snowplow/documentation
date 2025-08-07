---
title: Configure and run dbt package
position: 11
---

This step assumes you have data in a table named `ATOMIC.EVENTS` which will be used to run the snowplow-ecommerce dbt package to model Snowplow ecommerce data.

## Set up variables

The `snowplow_ecommerce` dbt package comes with a list of variables, each with a default value that you may need to overwrite in your own dbt project's `dbt_project.yml` file. For details you can have a look at our [docs](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-configuration/ecommerce/) which contains descriptions and default values of each variable.

For simplicity, here are the variables you will most likely need to overwrite:

- `snowplow__start_date`: The date of the first tracked event
- `snowplow__ecommerce_event_names`: List of event names to include in our ecommerce data, default is just `snowplow_ecommerce_action`
- `snowplow__events`: Variable to overwrite the events table in case it is named differently
- `snowplow__number_category_levels`: Variable to overwrite the maximum number of levels you have in your product categories e.g. `books/fiction/magical-fiction` has 3 levels
- `snowplow__number_checkout_steps`: The index of the checkout step which represents a completed transaction. This is required to enable working checkout funnel analysis
- `snowplow__enable_mobile_events`: Whether to look for mobile ecommerce events or not. Note that we overwrite the `domain_sessionid` and `page_view_id` fields with mobile fields in these cases

To overwrite these, add the following snippet to your `dbt_project.yml`:

```yml
vars:
  snowplow_ecommerce:
    snowplow__start_date: '2022-10-01'
    snowplow__ecommerce_event_names: ['snowplow_ecommerce_action']
    snowplow__events: 'atomic.events'
    snowplow__number_category_levels: 4
    snowplow__number_checkout_steps: 4
    # Set to false if you are not tracking any events on mobile
    snowplow__enable_mobile_events: true
```

## Add the selectors.yml to your project

The ecommerce package provides a suite of suggested selectors to help run and test the models, these group our (and any custom) models together in a single identifier.

These are defined in the [selectors.yml](https://github.com/snowplow/dbt-snowplow-ecommerce/blob/main/selectors.yml) file within the package, however to use these model selections you will need to copy this file into your own dbt project directory.

This is a top-level file and therefore should sit alongside your `dbt_project.yml` file.

## Run the model

Execute the following either through your CLI or from within dbt Cloud. If your data is spread over a period of more than 30 days you will need to run the model more than once to fully process your data.

```bash
dbt run --selector snowplow_ecommerce
```

This should take a couple of minutes to run each time, depending on how many events you have per day.

The model will create several derived tables that provide different views of your ecommerce data:

- **Sessions** - Aggregated session-level ecommerce metrics
- **Product interactions** - Product-level interaction and conversion data
- **Cart interactions** - Shopping cart behavior analysis
- **Checkout interactions** - Checkout funnel analysis
- **Transactions** - Complete transaction records with product details

These derived tables make it much easier to analyze ecommerce performance and customer behavior patterns.
