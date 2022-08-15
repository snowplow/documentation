---
title: "Common configuration"
date: "2021-03-26"
sidebar_position: 1000
---

### Overview

This page describes the format for the YAML file which is used to configure the EmrEtlRunner.

### Using environment variables

You can use environment variables rather than hardcoding strings in the configuration file. For example, load your AWS access key from an environment variable named "AWS\_SNOWPLOW\_SECRET\_KEY":

```
secret_access_key: <%= ENV['AWS_SNOWPLOW_SECRET_KEY'] %>
```

### Example configuration

```
aws:
  # Credentials can be hardcoded or set in environment variables
  access_key_id: <%= ENV['AWS_SNOWPLOW_ACCESS_KEY'] %>
  secret_access_key: <%= ENV['AWS_SNOWPLOW_SECRET_KEY'] %>
  s3:
    region: ADD HERE
    buckets:
      assets: s3://snowplow-hosted-assets # DO NOT CHANGE unless you are hosting the jarfiles etc yourself in your own bucket
      jsonpath_assets: # If you have defined your own JSON Schemas, add the s3:// path to your own JSON Path files in your own bucket here
      log: ADD HERE
      raw:
        in:                  # Multiple in buckets are permitted
          - ADD HERE          # e.g. s3://my-in-bucket
          - ADD HERE
        processing: ADD HERE
        archive: ADD HERE    # e.g. s3://my-archive-bucket/in
      enriched:
        good: ADD HERE       # e.g. s3://my-out-bucket/enriched/good
        bad: ADD HERE        # e.g. s3://my-out-bucket/enriched/bad
        errors: ADD HERE     # Leave blank unless continue_on_unexpected_error: set to true below
        archive: ADD HERE    # Where to archive enriched events to, e.g. s3://my-archive-bucket/enriched
      shredded:
        good: ADD HERE       # e.g. s3://my-out-bucket/shredded/good
        bad: ADD HERE        # e.g. s3://my-out-bucket/shredded/bad
        errors: ADD HERE     # Leave blank unless continue_on_unexpected_error: set to true below
        archive: ADD HERE    # Where to archive shredded events to, e.g. s3://my-archive-bucket/shredded
  emr:
    job_name: Snowplow ETL # Give your job a name
    ami_version: 5.9.0      # Don't change this
    region: ADD HERE        # Always set this
    jobflow_role: EMR_EC2_DefaultRole # Created using $ aws emr create-default-roles
    service_role: EMR_DefaultRole     # Created using $ aws emr create-default-roles
    placement: ADD HERE     # Set this if not running in VPC. Leave blank otherwise
    ec2_subnet_id: ADD HERE # Set this if running in VPC. Leave blank otherwise
    ec2_key_name: ADD HERE
    bootstrap: []           # Set this to specify custom boostrap actions. Leave empty otherwise
    software:
      hbase:                # Optional. To launch on cluster, provide version, "0.92.0", keep quotes. Leave empty otherwise.
      lingual:              # Optional. To launch on cluster, provide version, "1.1", keep quotes. Leave empty otherwise.
    # Adjust your Spark cluster below
    jobflow:
      master_instance_type: m1.medium
      core_instance_count: 2
      core_instance_type: m1.medium
      core_instance_ebs:    # Optional. Attach an EBS volume to each core instance.
        volume_size: 100    # Gigabytes
        volume_type: "gp2"
        volume_iops: 400    # Optional. Will only be used if volume_type is "io1"
        ebs_optimized: false # Optional. Will default to true
      task_instance_count: 0 # Increase to use spot instances
      task_instance_type: m1.medium
      task_instance_bid: 0.015 # In USD. Adjust bid, or leave blank for non-spot-priced (i.e. on-demand) task instances
    bootstrap_failure_tries: 3 # Number of times to attempt the job in the event of bootstrap failures
    additional_info:        # Optional JSON string for selecting additional features
collectors:
  format: cloudfront # Or 'clj-tomcat' for the Clojure Collector, or 'thrift' for Thrift records, or 'tsv/com.amazon.aws.cloudfront/wd_access_log' for Cloudfront access logs
enrich:
  versions:
    spark_enrich: 1.10.0 # Version of the Spark Enrichment process
  continue_on_unexpected_error: false # Set to 'true' (and set out_errors: above) if you don't want any exceptions thrown from ETL
  output_compression: NONE # Compression only supported with Redshift, set to NONE if you have Postgres targets. Allowed formats: NONE, GZIP
storage:
  versions:
    rdb_shredder: 0.13.0        # Version of the Relational Database Shredding process
    rdb_loader: 0.14.0          # Version of the Relational Database Loader app
    hadoop_elasticsearch: 0.1.0 # Version of the Hadoop to Elasticsearch copying process
monitoring:
  tags: {} # Name-value pairs describing this job
  logging:
    level: DEBUG # You can optionally switch to INFO for production
  snowplow:
    method: get
    app_id: ADD HERE # e.g. snowplow
    collector: ADD HERE # e.g. my-collector.cloudfront.net
```

### aws

#### Credentials

The `access_key_id` and `secret_access_key` variables should be self-explanatory - enter your AWS access key and secret here.

#### s3

The `region` variable should hold the AWS region in which your four data buckets (In Bucket, Processing Bucket etc) are located, e.g. "us-east-1" or "eu-west-1". Please note that Redshift can only load data from S3 buckets located in the same region as the Redshift instance, and Amazon has not to date launched Redshift in _every_ region. So make sure that if you're using Redshift, the bucket specified here is in a region that supports Redshift.

Within the `s3` section, the `buckets` variables are as follows:

- `assets:` holds the ETL job's static assets (HiveQL script plus Hive deserializer). You can leave this as-is (pointing to Snowplow Analytics' [own public bucket containing these assets](Hosted-assets)) or replace this with your own private bucket containing the assets
- `log:` is the bucket in which Amazon EMR will record processing information for this job run, including logging any errors
- `raw:` is where you specify the paths through which your raw Snowplow events will flow. `in` is an array of one or more buckets containing raw events. For `processing:`, **always include a sub-folder on this variable (see below for why)**. `archive:` is where your raw Snowplow events will be moved after they have been successfully processed by Elastic MapReduce
- `enriched:` is where you specify the paths through which your enriched Snowplow events will flow.
- `shredded:` is where you specify the paths through which your shredded types will flow

For `good:`, **always include a sub-folder on this variable (see below for why)**. If you are loading data into Redshift, the `good:` specified here **must** be located in a region where Amazon has launched Redshift, because Redshift can only bulk load data from S3 that is located in the same region as the Redshift instance, and Redshift has not, to-date, been launched across all Amazon regions

Each of the bucket variables must start with an S3 protocol - either `s3://` or `s3n://`. Each variable can include a sub-folder within the bucket as required, and a trailing slash is optional.

The `bad:` entries will store any raw Snowplow log lines which did not pass the enrichment or JSON validation, along with their validation errors. The `errors:` entries will contain any raw Snowplow log lines which caused an unexpected error, but only if you set continue\_on\_unexpected\_error to true (see below).

**Important 1:** there is a bug in Hive on Amazon EMR where Hive dies if you attempt to read or write data to the root of an S3 bucket. **Therefore always specify a sub-folder (e.g. `/events/`) for the `raw:processing`, `enriched:good` and `shredded:good` locations.**

**Important 2:** do not put your `raw:processing` inside your `raw:in` bucket, or your `enriched:good` inside your `raw:processing`, or you will create circular references which EmrEtlRunner cannot resolve when moving files.

**Example bucket settings**

Here is an example configuration:

```
buckets:
  assets: s3://snowplow-hosted-assets
  log: s3n://my-snowplow-etl/logs/
  raw:
    in: [s3n://my-snowplow-logs/]
    processing: s3n://my-snowplow-etl/processing/
    archive: s3://my-archive-bucket/raw
  enriched:
    good: s3://my-data-bucket/enriched/good
    bad: s3://my-data-bucket/enriched/bad
    errors: s3://my-data-bucket/enriched/errors
    archive: s3://my-data-bucket/enriched/archive
  shredded:
    good: s3://my-data-bucket/shredded/good
    bad: s3://my-data-bucket/shredded/bad
    errors: s3://my-data-bucket/shredded/errors
```

Please note that all buckets must exist prior to running EmrEtlRunner; trailing slashes are optional.

#### emr

The EmrEtlRunner makes use of Amazon Elastic Mapreduce (EMR) to process the raw log files and output the cleaned, enriched Snowplow events table.

This section of the config file is where we configure the operation of EMR. The variables with defaults can typically be left as-is, but you will need to set:

1. `region`, which is the Amazon EC2 region in which the job should run, e.g. "us-east-1" or "eu-west-1"
2. `ec2_key_name`, which is the name of the Amazon EC2 key that you  
    set up in the \[\[Dependencies|1-Installing-EmrEtlRunner#dependencies\]\] above

Make sure that the EC2 key you specify belongs in the region you specify, or else EMR won't be able to find the key. **It's strongly recommended that you choose the same Amazon region as your S3 buckets are located in.**

Since 6th April 2015, all new Elastic MapReduce users have been required to use IAM roles with EMR. You can leave the two `..._role` fields as they are, however you must first create these default EMR roles using the AWS Command Line Interface ([installation-instructions](http://docs.aws.amazon.com/cli/latest/userguide/installing.html)), like so:

```
$ aws emr create-default-roles
```

Additionally, fill in **one** of these two:

- `placement`, which is the Amazon EC2 region **and** availability zone  
    in which the job should run, e.g. "us-east-1a" or "eu-west-1b"
- `ec2_subnet_id`, which is the ID of the Amazon EC2 subnet you want  
    to run the job in

You only need to set one of these (they are mutually exclusive settings), but you must set one.

The `software:` section lets you start up Lingual and/or HBase when you start up your Elastic MapReduce cluster. This is the configuration to start up both, specifying the versions to start:

```
software:
  hbase: "0.92.0"
  lingual: "1.1"
```

### collectors

The `format` field describes the format of the EmrEtlRunner's input. The options are:

- "cloudfront" for the Cloudfront Collector
- "clj-tomcat" for the Clojure Collector
- "thrift" for Thrift raw events
- "tsv/com.amazon.aws.cloudfront/wd\_access\_log" for Cloudfront access logs

See the \[\[EmrEtlRunner Input Formats\]\] page.

### enrich

- `spark_enrich`: version of the Spark Enrich jar
- `continue_on_unexpected_error`: continue processing even on unexpected row-level errors, e.g. an input file not matching the expected CloudFront format. Off ("false") by default

### storage

#### versions

- `rdb_shredder`: version of the RDB Shredder jar
- `rdb_loader`: version of the RDB Loader jar
- `hadoop_elasticsearch`: version of the Hadoop Elasticsearch Sink

### monitoring

This section deals with metadata around the EmrEtlRunner and RDB Loader.

- `tags`: a dictionary of name-value pairs describing the job
- `logging`: how verbose/chatty the log output from EmrEtlRunner should be.

#### snowplow

The `snowplow` section allows the ETL apps to send Snowplow events describing their own progress. To disable this internal tracking, remove the "snowplow" field from the configuration.

- `method`: "get" or "post"
- `app_id`: ID for the pipeline
- `collector`: Endpoint to which events should be sent
