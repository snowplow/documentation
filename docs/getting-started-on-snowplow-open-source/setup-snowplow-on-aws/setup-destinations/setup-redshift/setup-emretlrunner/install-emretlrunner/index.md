---
title: "Install EmrEtlRunner"
date: "2020-02-26"
sidebar_position: 20
---

## 1\. Assumptions

This guide assumes that you have administrator access to a Unix-based server (e.g. Ubuntu, OS X, Fedora) on which you can install EmrEtlRunner and schedule a regular cronjob.

You might wish to try out the [steps](https://github.com/snowplow/snowplow/wiki/Setting-up-EC2-instance-for-EmrEtlRunner-and-StorageLoader) showing you how an EC2 instance could be set up via [AWS CLI](https://aws.amazon.com/cli/).

_In theory EmrEtlRunner can be deployed onto a Windows-based server, using the Windows Task Scheduler instead of cron, but this has not been tested or documented._

## 2\. Dependencies

### 2.1 Hardware

You will need to setup EmrEtlRunner on your own server. A number of people choose to do so on an EC2 instance (thereby keeping all of Snowplow in the Amazon Cloud). If you do so, please note that you **must not use a `t1.micro` instance**. You should at the very least use an `m1.small` instance.

### 2.2 Software

The EmrEtlRunner jar is available for download. For more information, see the [Hosted assets](https://github.com/snowplow/snowplow/wiki/Hosted-assets) page.

\* If you prefer, an alternative Ruby manager such as chruby or rbenv should work fine too.

### 2.3 EC2 key

You will also need an **EC2 key pair** setup in your Amazon EMR account.

For details on how to do this, please see [Create a Key Pair](http://docs.aws.amazon.com/ElasticMapReduce/latest/DeveloperGuide/EMR_SetUp_KeyPair.html). Make sure that you setup the EC2 key pair inside the region in which you will be running your ETL jobs.

### 2.4 S3 locations

EmrEtlRunner processes data through three distinct states:

1. **:enriched** - This is the location on S3 that the enriched data (outputed by the enricher into the enriched Kinesis stream) is then loaded onto S3. (Specified in the config file deployed in the snowplow-s3-loader.)
2. **:shredded** - EmrEtlRunner runs 'RDB Shredder', which 'shreds' the JSONs found in enriched events into a CSV format suitable for loading into dedicated Redshift tables.

For `:enriched:in`, specify the Amazon S3 path you configured

For all other S3 locations, you can specify paths within a single S3 bucket that you setup now.

An example configuration for EmrEtlRunner is given [here](https://github.com/snowplow/snowplow/blob/master/3-enrich/emr-etl-runner/config/stream_config.yml.sample).

Done? Right, now we can install EmrEtlRunner.

## 3\. Installation

We host EmrEtlRunner on the distribution platform [JFrog Bintray](https://bintray.com/). You can get a copy of it as shown below.

**Note**: follow [this link](http://dl.bintray.com/snowplow/snowplow-generic/) to choose your version of the EmrEtlRunner. The distribution name follows the pattern `snowplow_emr_{{RELEASE_VERSION}}.zip`.

```bash
$ wget http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_{{RELEASE_VERSION}}.zip
```

The archive contains both EmrEtlRunner and [StorageLoader](https://github.com/snowplow/snowplow/wiki/1-Installing-the-StorageLoader). Unzip the archive:

```bash
$ unzip snowplow_emr_{{RELEASE_VERSION}}.zip
```

The archive should contain a `snowplow-emr-etl-runner` file.

## 4\. Configuration

EmrEtlRunner requires a YAML format configuration file to run. There is a configuration file template available in the Snowplow GitHub repository at [`/3-enrich/emr-etl-runner/config/stream_config.yml.sample`](https://github.com/snowplow/snowplow/blob/master/3-enrich/emr-etl-runner/config/stream_config.yml.sample). See [Common configuration](/docs/open-source/section-1/setup-destinations/setup-redshift/setup-emretlrunner/configuring-emretlrunner/) more information on how to write this file.

### Storage targets

In order to load Redshift, in addition to configuring the config file described above, it is also necessary to provide a JSON file with the details of the Redshift cluster, database and schema to be loaded. An example is given [here](https://github.com/snowplow/snowplow/blob/master/4-storage/config/targets/redshift.json), and provided below:

```json
{
    "schema": "iglu:com.snowplowanalytics.snowplow.storage/redshift_config/jsonschema/2-1-0",
    "data": {
        "name": "AWS Redshift enriched events storage",
        "host": "ADD HERE",
        "database": "ADD HERE",
        "port": 5439,
        "sslMode": "DISABLE",
        "username": "ADD HERE",
        "password": "ADD HERE",
        "roleArn": "ADD HERE",
        "schema": "atomic",
        "maxError": 1,
        "compRows": 20000,
        "sshTunnel": null,
        "purpose": "ENRICHED_EVENTS"
    }
}
```

### Iglu

Lastly, you will also need an Iglu resolver configuration file. This is where we list the schema repositories to use to retrieve JSON Schemas for validation.

The `iglu_resolver.[json](https://github.com/snowplow/snowplow/blob/master/3-enrich/config/iglu_resolver.json)` file looks as follows:

```json
{
  "schema": "iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-0",
  "data": {
    "cacheSize": 500,
    "repositories": [
      {
        "name": "Iglu Central",
        "priority": 0,
        "vendorPrefixes": [ "com.snowplowanalytics" ],
        "connection": {
          "http": {
            "uri": "http://iglucentral.com"
          }
        }
      }
      #custom section starts here -->
      ,
      {
       ...
      }
      #custom section ends here <--
    ]
  }
}
```

You must add an extra entr(-y/ies) in the `repositories:` array pointing to your own Iglu schema registry. If you are not submitting custom events and contexts and are not interested in shredding then there's no need in adding the custom section but the `iglu_resolver.json` file is still required and is referenced with `--resolver` option to EmrEtlRunner.

For more information on how to customize the `iglu_resolver.json` file, please review the [Iglu client configuration](https://github.com/snowplow/iglu/wiki/Iglu-client-configuration) wiki page.
