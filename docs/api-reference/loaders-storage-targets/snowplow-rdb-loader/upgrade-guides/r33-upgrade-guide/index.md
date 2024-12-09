---
title: "R33/R34 Upgrade Guide"
date: "2020-12-01"
sidebar_position: 400
---

R34 is a release with bugfixes and performance improvements. R33 was almost identical reelase with major bug preventing some long text properties from loading.

## Updating assets

1. Upgrade EmrEtlRunner to 1.0.4 or higher
2. Your `redshift_config.json` should have 4-0-0 version
3. Update your `config.yml` file

```yaml
aws:
  emr:
    ami_version: 6.1.0     # was 5.19.0; Required by Spark 3
storage:
  versions:
    rdb_loader: 0.18.2      # was 0.17.0
    rdb_shredder: 0.18.2    # was 0.16.0
```
