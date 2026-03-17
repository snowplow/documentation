---
title: "Migration guide for Attribution"
sidebar_label: "Attribution"
sidebar_position: 20
description: "Migration guide for upgrading the Snowplow Attribution dbt package including breaking changes and configuration updates."
keywords: ["attribution migration", "attribution upgrade", "dbt attribution version"]
---

### Upgrading to 0.6.0

- We had to introduce limitations for Redshift users:
  1. users are only allowed to have 1 path transformation defined within the `snowplow__path_transforms` variable
  2. the `snowplow__path_transforms` variable parameters only accept single-item arrays for `remove_if_last_and_not_all` and `remove_if_not_all`
- This is due to Redshift deprecating Python UDFs; the transformations now rely on native SQL, which allows less flexibility for automation.
- Existing users can stay on older versions of the package as long as their UDFs remain in the database.


```yml title="dbt_project.yml"
vars:
  snowplow_attribution:
    snowplow__path_transforms: {'exposure_path': null}
```


### Upgrading to 0.5.0
- From now on the `snowplow__path_transforms` variable parameters only accept non-empty arrays for `remove_if_last_and_not_all` and `remove_if_not_all` variables instead of strings, please your variable overwrites in your dbt_project.yml accordingly. Previously you could only remove one specific channel or campaign, now you can do multiple, if needed.

```yml title="dbt_project.yml"
vars:
  snowplow_attribution:
    snowplow__path_transforms: {'exposure_path': null, 'remove_if_last_and_not_all': ['channel_to_remove_1', 'campaign_to_remove_1, 'campaign_to_remove_2']}
  ```
