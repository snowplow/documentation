---
title: "1.0.x upgrade guide"
date: "2021-10-07"
sidebar_position: 0
---

## Configuration

The only breaking change from the 0.6.x series is the new format of the configuration file. That used to be a self-describing JSON but is now HOCON. Additionally, some app-specific command-line arguments have been incorporated into the config, such as Repeater's `--failedInsertsSub` option. For more details, see the [setup guide](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/index.md#setup-guide) and [configuration reference](/docs/pipeline-components-and-applications/loaders-storage-targets/bigquery-loader/previous-versions/bigquery-loader-1.x/configuration-reference/index.md).

Using Repeater as an example, if your configuration for 0.6.x looked like this:

```json
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/bigquery_config/jsonschema/1-0-0",
  "data": {
    "name": "Alpha BigQuery test",
    "id": "31b1559d-d319-4023-aaae-97698238d808",
    "projectId": "com-acme",
    "datasetId": "snowplow",
    "tableId": "events",
    "input": "enriched-sub",
    "typesTopic": "types-topic",
    "typesSubscription": "types-sub",
    "badRows": "bad-topic",
    "failedInserts": "failed-inserts-topic",
    "load": {
      "mode": "STREAMING_INSERTS",
      "retry": false
     },
     "purpose": "ENRICHED_EVENTS"
  }
}
```

it will now look like this:

```json
{
  "projectId": "com-acme"

  "loader": {
    "input": {
      "subscription": "enriched-sub"
    }

    "output": {
      "good": {
        "datasetId": "snowplow"
        "tableId": "events"
      }

      "bad": {
        "topic": "bad-topic"
      }

      "types": {
        "topic": "types-topic"
      }

      "failedInserts": {
        "topic": "failed-inserts-topic"
      }
    }
  }

  "mutator": {
    "input": {
      "subscription": "types-sub"
    }

    "output": {
      "good": ${loader.output.good} # will be automatically inferred
    }
  }

  "repeater": {
    "input": {
      "subscription": "failed-inserts-sub"
    }

    "output": {
      "good": ${loader.output.good} # will be automatically inferred

      "deadLetters": {
        "bucket": "gs://dead-letter-bucket"
      }
    }
  }

  "monitoring": {} # disabled
}
```

And instead of running it like this:

```bash
$ ./snowplow-bigquery-repeater \
    --config=$CONFIG \
    --resolver=$RESOLVER \
    --failedInsertsSub="failed-inserts-sub" \
    --deadEndBucket="gs://dead-letter-bucket"
    --desperatesBufferSize=20 \
    --desperatesWindow=20 \  
    --backoffPeriod=900 \
    --verbose
```

you will run it like this:

```bash
$ docker run \
  -v /path/to/resolver.json:/resolver.json \
  snowplow/snowplow-bigquery-repeater:1.0.1 \
    --config=$CONFIG \
    --resolver=/resolver.json \
    --bufferSize=20 \
    --timeout=20 \
    --backoffPeriod=900 \
    --verbose
```

## New events table field

The first time you deploy Mutator 1.0.0 it will add a new column to your events table: `load_tstamp`. This represents the exact moment when the row was inserted into BigQuery. It shows you when events have arrived in the warehouse, which makes it possible to use incremental processing of newly arrived data in your downstream data modeling.

Depending on your traffic volume and pattern, there might be a short time period in which the loader app cannot write to BigQuery because the new column hasn't propagated and is not yet visible to all workers. For that reason, **we recommend that you upgrade Mutator first**.

## Migrating to StreamLoader

StreamLoader has been built as a standalone application, replacing Apache Beam and no longer requires you to use Dataflow.

Depending on your data volume and traffic patterns, this might lead to significant cost reductions. However, by migrating away from Dataflow, you no longer benefit from its exactly-once processing guarantees. As such, there could be a slight increase in the number of duplicate events loaded into BigQuery.

Duplicate events generally are to be expected in a Snowplow pipeline, which provides an at-least-once guarantee.

In our tests, we found that duplicates arise only during extreme autoscaling of the loader, eg if your pipeline has a sudden extreme spike in events. Aside from autoscaling events, we found the number of duplicate rows to be very low, however this depends on the type of worker infrastructure you use.
