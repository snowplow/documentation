---
title: "Fractribution"
sidebar_position: 106
---

### Upgrading to 0.2.0
- Variable names are now prefixed with `snowplow__`, please align the new ones found in the `dbt_project.yml` file
- `snowplow__path_transforms` variable is a dictionary instead of an array and that the path transform names have also changed (e.g: `Exposure` -> `exposure_path`). See docs for the latest values
- Version 1.3.0 of `dbt-core` now required
- The python scripts have changed and been renamed per warehouse, please ensure you run the correct version and/or pull the latest docker image
