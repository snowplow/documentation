---
title: "Backpopulate the manifest"
date: "2020-04-25"
sidebar_position: 30
---

In order to pre-populate manifest with run ids that have to be never loaded you can use `backfill.py` script.

Script requires to have Python 3, Snowplow Python Analytics SDK 0.2.3+ and boto3:

```bash
$ pip install boto3 snowplow_analytics_sdk
$ wget https://raw.githubusercontent.com/snowplow-incubator/snowplow-snowflake-loader/release/0.4.0/backfill.py   # Won't actually be downloaded as repository is private
```

Script accepts 6 required arguments. Notice `startdate`, this is the date since which (inclusive) transformer should process run ids:

```bash
$ ./backfill.py \
    --startdate 2017-08-22-01-01-01 \
    --region $AWS_REGION \
    --manifest-table-name $DYNAMODB_MANIFEST \
    --enriched-archive $TRANSFORMER_INPUT \
    --aws-access-key-id=$AWS_ACCESS_KEY_ID \
    --aws-secret-access-key=$AWS_SECRET_KEY
```
