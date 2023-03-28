---
title: "Disabling modules"
sidebar_position: 500
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```


The e-commerce package creates tables that depend on the existence of certain entities that are a part of the [Snowplow e-commerce](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/snowplow-ecommerce/) JS plugin. If, for some reason, you have not implemented them and would like to streamline your data modeling not to create empty tables, then you need to add that configuration to your `dbt_project.yml` file. Below you can see an example of what that would look like if you wanted to disable the [cart entity](/docs/collecting-data/collecting-from-own-applications/javascript-trackers/javascript-tracker/javascript-tracker-v3/plugins/snowplow-ecommerce/#cart-entity)

## Disabling the cart module in `dbt_project.yml` (recommended)

```yml
# dbt_project.yml

...
vars:
    snowplow_ecommerce:
        snowplow__disable_ecommerce_carts: true
...
models:
    snowplow_ecommerce:
        carts:
            +enabled: false
```

Adding these two configurations to your `dbt_project.yml` will ensure that the carts module is disabled. 

## Disabling the cart module using `dbt run`
If you want to temporarily disable a module, or you just find it easier to use the command line, you can also do this in the command line when executing the `dbt run` command. You will need to run the following command to disable the cars module

```bash
dbt run --exclude carts --select snowplow_ecommerce --vars '{snowplow__disable_ecommerce_carts: true}'
```

