---
title: "Right to be Forgotten Spark Application Setup Guide"
date: "2021-03-26"
sidebar_position: 10
---

# Setup and running guide

## Building

Assuming you already have SBT installed:

```
$ git clone git://github.com/snowplow-incubator/right-to-be-forgotten-spark-job.git
..
$ sbt assembly
..
```

The 'fat jar' is now available as:

```
target/snowplow-right-to-be-forgotten-job-x.x.x.jar
```

## Deploying

Deploying will depend on where you have chosen to run the spark job. Assuming that are running on \[Amazon Elastic MapReduce\]\[emr\], then deploying is consists of copying the jar to S3 or directly to the master node.

The example on running below assumes that you have copied the jar to the master node.

## Running

Running R2F requires a "removal criteria" file in order to match the rows to be erased. The file consists of rows of a single JSON self-describing datum which conforms to the \[iglu schema here\]\[removal-criteria-iglu-schema\].  
As can be seen from the schema, it expects a single criterion of either `json` or `pojo` fields. Special care needs to be taken that the value uniquely identifies an individual as there is a chance (e.g. when using an IP address) that it does not and more data than intended is erased.  
To avoid that, an additional argument needs to be provided to the spark job that specifies the maximum proportion of rows from the archive that you expect to be matched in that execution (e.g. 0.5 for half), as a safeguard. The job will fail if that number is exceeded.

So in your spark installation (assumed to be EMR for this example) all you would need to do is:

```
spark-submit \
    --master yarn \
    --deploy-mode client ./snowplow-right-to-be-forgotten-job-0.1.0.jar \
    --removal-criteria s3://snowplow-data-<mycompany>/config/to_be_forgotten.json \
    --input-directory s3://snowplow-data-<mycompany>/enriched/archive/ \
    --non-matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --matching-output-directory s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS> \
    --maximum-matching-proportion 0.01
```

The R2F arguments are:

- `--removal-criteria` (in this example `s3://snowplow-data-<mycompany>/config/to_be_forgotten.json`):  
    This is the URL of the removal criteria file containing the criteria for which an event will be removed form the archive.
- `--input-directory` (in this example `s3://snowplow-data-<mycompany>/enriched/archive/`):  
    The directory that contains the snowplow data input
- `--non-matching-output-directory` (in this case `s3://snowplow-data-<mycompany>/r2f-test/non-matching/runid=<yyyy-mm-dd-HH-MM-SS>`):  
    The directory that contains all data that do not match the criteria
- (Optional) `--matching-output-directory` (in this case `s3://snowplow-data-<mycompany>/r2f-test/matching/runid=<yyyy-mm-dd-HH-MM-SS>`):  
    The directory that contains the matching output
- `--maximum-matching-proportion` (In this case `0.01`):  
    The maximum proportion of the input events that are allowed to match. If the actual proportion is higher the job will fail.

This process does not preserve the directory structure under the `enriched archive` (namely the `run=<runid>` sub-folders).

## Verifying

Successful execution means that the folders that you have specified above, contain the data that you expect, and that the job exited without an exception.

In the case that the proportion of matched records was higher than that specified, for instance there will be an exception thrown.
