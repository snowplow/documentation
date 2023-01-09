---
title: "1.0.0 Upgrade Guide"
date: "2021-04-14"
sidebar_position: 200
---

This is a release adding a new experimental Stream Shredder asset and improving independent Loader architecture, introduced in R35.

[Official announcement.](https://discourse.snowplow.io/t/snowplow-rdb-loader-1-0-0-released/5017)

This is the first release in 1.x branch and no breaking changes will be introduced until 2.x release. If you're upgrading from R34 or earlier it's strictly recommended to follow [R35 Upgrade Guide](/docs/destinations/warehouses-and-lakes/rdb/upgrade-guides/r35-upgrade-guide/index.md) first.

## Assets

RDB Loader, RDB Shredder and Stream RDB Shredder all have 1.o.0 version, despite last one being an experimental asset. RDB Shredder is published on S3:

- `s3://snowplow-hosted-assets-eu-central-1/4-storage/rdb-shredder/snowplow-rdb-shredder-1.0.1.jar`

RDB Loader and RDB Stream Shredder distributed as Docker images, published on DockerHub:

- `snowplow/snowplow-rdb-loader:1.0.1`
- `snowplow/snowplow-rdb-stream-shredder:1.0.1`

## Configuration changes

All configuration changes are scoped to `shredder` property.

Since we added another type of a shredder, one has to specify the type explicitly:

```json

"shredder": {
  "type" : "batch",                                  # Was not necessary in R35
  "input": "s3://snowplow-enriched-archive/path/",   # Remains the same
  "output": ...                                      # Explained below
}
```

_

The major API change in 1.0.0 is the new partitioning scheme unifying `good` and `bad` output. Whereas previously it was necessary to specify `output` and `outputBad`, now there's only `path` in `shredder.output` object:

_

_`"output": {                                  # Was a string in R35
  "path": "s3://snowplow-shredded-archive/", # Path to shredded output
  "compression": "GZIP"                      # Output compression, GZIP or NONE`_ `}`

In Dataflow Runner playbook you have to specify new Main classpath for RDB Shredder:

```text
"--class", "com.snowplowanalytics.snowplow.rdbloader.shredder.batch.Main"
```

## Manifest

The new manifest table has the same name as previous one - `manifest`. In order to avoid a clash, RDB Loader 1.0.0 checks existence of the table every time it starts and if table exists checks if it's new or old one. If table exists and it's legacy - it will be renamed into `manifest_legacy` and can be removed manually later, new table will be created automatically. If table doesn't exist - it will be created.

No user actions necessary here.

## Stream Shredder

You only need to choose one Shredder: batch or stream. **For production environment we recommend using Batch Shredder.**

Stream Shredder is configured within same configuration file as RDB Loader and RDB Batch Shredder, but using following properties:

```json
  "shredder": {       
    # A batch loader would fail, if stream type encountered
    "type" : "stream",       
    # Input stream information         
    "input": {                
      # file is another option, but used for debugging only               
      "type": "kinesis",        
      # KCL app name - a DynamoDB table will be created with the same name       
      "appName": "acme-rdb-shredder",       
      # Kinesis Stream name, must exist     
      "streamName": "enriched-events",       
      # Kinesis region       
      "region": "us-east-1",       
      # Kinesis position: LATEST or TRIM_HORIZON
      "position": "LATEST"       
    },       
                
    # A frequency to emit loading finished message - 5,10,15,20,30,60 etc minutes, this is what controls how often your data will be loaded
    "windowing": "10 minutes",       
                
    # Path to shredded archive, same as for batch      
    "output": {       
      # Path to shredded output       
      "path": "s3://bucket/good/",       
      # Shredder output compression, GZIP or NONE       
      "compression": "GZIP"       
    }
}
```

## Directory structure

There is a major change in shredder output directory structure, on top of what has changed in R35.

If you're using a 3rd-party query engine such as Amazon Athena to query shredded data, the new partitioning can break the schema. And thus it's recommended to create a new root for shredded data.

Structure of the typical shredded folder now looks like following:

```text
run=2021-03-29-15-40-30/
    shredding_complete.json
    output=good/
            vendor=com.snowplowanalytics.snowplow/
                name=atomic/
                    format=tsv/
                        model=1/
            vendor=com.acme/
                name=link_click/
                    format=json/
                        model=1/
    output=bad/
            vendor=com.snowplowanalytics.snowplow/
                name=loader_parsing_error/
                    format=json/
                        model=1/
```
