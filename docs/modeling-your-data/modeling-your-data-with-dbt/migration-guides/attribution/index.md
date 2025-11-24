---
title: "Migration guide for Attribution"
sidebar_label: "Attribution"
sidebar_position: 20
---

### Upgrading to 0.5.0
- From now on the `snowplow__path_transforms` variable parameters only accept non-empty arrays for `remove_if_last_and_not_all` and `remove_if_not_all` variables instead of strings, please your variable overwrites in your dbt_project.yml accordingly. Previously you could only remove one specific channel or campaign, now you can do multiple, if needed.

```yml title="dbt_project.yml"
vars:
  snowplow_attribution:
    snowplow__path_transforms: {'exposure_path': null, 'remove_if_last_and_not_all': ['channel_to_remove_1', 'campaign_to_remove_1, 'campaign_to_remove_2']}
  ```
