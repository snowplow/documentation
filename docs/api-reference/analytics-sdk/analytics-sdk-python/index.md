---
title: "Python Analytics SDK"
sidebar_label: "Python"
date: "2020-11-03"
sidebar_position: 400
description: "Python SDK for processing Snowplow enriched events with run manifest support for idempotent data processing in PySpark and AWS Lambda."
keywords: ["python analytics sdk", "pyspark", "snowplow python", "run manifests"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## 1. Overview

The [Snowplow Analytics SDK for Python](https://github.com/snowplow/snowplow-python-analytics-sdk) lets you work with [Snowplow enriched events](/docs/fundamentals/canonical-event/index.md) in your Python event processing, data modeling and machine-learning jobs. You can use this SDK with [Apache Spark](http://spark.apache.org/), [AWS Lambda](https://aws.amazon.com/lambda/), and other Python-compatible data processing frameworks.

## 2. Compatibility

Snowplow Python Analytics SDK was tested with Python of versions: 2.7, 3.3, 3.4, 3.5.

As analytics SDKs supposed to be used heavily in conjunction with data-processing engines such as [Apache Spark](http://spark.apache.org/), our goal is to maintain compatibility with all versions that PySpark supports. Whenever possible we try to maintain compatibility with broader range of Python versions and computing environments. This is achieved mostly by minimazing and isolating third-party dependencies and libraries.

There are only one external dependency currently:

- [Boto3](https://aws.amazon.com/sdk-for-python/) - AWS Python SDK that used to provide access to Event Load Manifests.

These dependencies can be installed from the package manager of the host system or through PyPi.

## 3. Setup

### 3.1 PyPI

The Snowplow Python Analytics SDK is published to [PyPI](https://pypi.python.org/), the official third-party software repository for the Python programming language.

This makes it easy to either install the SDK locally, or to add it as a dependency into your own Python app or Spark job.

### 3.2 pip

To install the Snowplow Python Analytics SDK locally, assuming you already have Pip installed:

```bash
$ pip install snowplow_analytics_sdk --upgrade
```

To add the Snowplow Analytics SDK as a dependency to your own Python app, edit your `requirements.txt` and add:

<CodeBlock language="text">{
`snowplow_analytics_sdk==${versions.analyticsSdkPython}`
}</CodeBlock>

### 3.3 easy_install

If you are still using easy_install:

```bash
$ easy_install -U snowplow_analytics_sdk
```

## 4. Run Manifests

### 4.1 Overview

The [Snowplow Analytics SDK for Python](https://github.com/snowplow/snowplow-python-analytics-sdk) provides you an API to work with run manifests. Run manifests is simple way to mark chunk (particular run) of enriched data as being processed, by for example Apache Spark data-modeling job.

### 4.2 Usage

Run manifests functionality resides in new `snowplow_analytics_sdk.run_manifests` module.

Main class is `RunManifests`, that provides access to DynamoDB table via `contains` and `add`, as well as `create` method to initialize table with appropriate settings. Other commonly-used function is `list_runids` that is gives S3 client and path to folder such as `enriched.archive` or `shredded.archive` from `config.yml` lists all folders that match Snowplow run id format (`run-YYYY-mm-DD-hh-MM-SS`). Using `list_runids` and `RunManifests` you can list job runs and safely process them one by one without risk of reprocessing.

### 4.3 Example

Here's a short usage example:

```python
from boto3 import client
from snowplow_analytics_sdk.run_manifests import *

s3 = client('s3')
dynamodb = client('dynamodb')

dynamodb_run_manifests_table = 'snowplow-run-manifests'
enriched_events_archive = 's3://acme-snowplow-data/storage/enriched-archive/'
run_manifests = RunManifests(dynamodb, dynamodb_run_manifests_table)

run_manifests.create()   # This should be called only once

for run_id in list_runids(s3, enriched_events_archive):
    if not run_manifests.contains(run_id):
        process(run_id)
        run_manifests.add(run_id)
    else:
        pass
```

In above example, we create two AWS service clients for S3 (to list job runs) and for DynamoDB (to access manifests). These clients are provided via [boto3](https://aws.amazon.com/sdk-for-python/) Python AWS SDK and can be initialized with static credentials or with system-provided credentials.

Then we list all run ids in particular S3 path and process (by user-provided `process` function) only those that were not processed already. Note that `run_id` is simple string with S3 key of particular job run.

`RunManifests` class is a simple API wrapper to DynamoDB, using which you can:

- `create` DynamoDB table for manifests,
- `add` run to table
- check if table `contains` run id
