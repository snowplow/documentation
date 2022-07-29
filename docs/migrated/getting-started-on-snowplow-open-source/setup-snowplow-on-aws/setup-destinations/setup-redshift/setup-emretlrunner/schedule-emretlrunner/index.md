---
title: "Schedule EmrEtlRunner"
date: "2020-02-26"
sidebar_position: 30
---

## 1\. Overview

Once you have the EmrEtlRunner process working smoothly, you can schedule it to automate the regular load shredding and loading of data into Redshift.

We run our daily ETL jobs at 3 AM UTC so that we are sure that we have processed all of the events from the day before (CloudFront logs can take some time to arrive).

To consider your different scheduling options in turn:

## 2\. cron

|  | Running EmrEtlRunner as _Ruby_ (rather than _JRuby_ apps) is no longer actively supported. The latest version of the EmrEtlRunner is available from our Bintray [here](http://dl.bintray.com/snowplow/snowplow-generic/snowplow_emr_r91_stonehenge.zip). |
| --- | --- |

The recommended way of scheduling the ETL process is as a daily cronjob.

```bash
0 4   * * *   root    cronic /path/to/eer/snowplow-emr-etl-runner run -c config.yml
```

This will run the ETL job daily at 4 AM, emailing any failures to you via cronic.

## 3\. Jenkins

Some developers use the [Jenkins](http://jenkins-ci.org/) continuous integration server (or [Hudson](http://hudson-ci.org/), which is very similar) to schedule their Hadoop and Hive jobs.

Describing how to do this is out of scope for this guide, but the blog post [Lowtech Monitoring with Jenkins](http://blog.lusis.org/blog/2012/01/23/lowtech-monitoring-with-jenkins/) is a great tutorial on using Jenkins for non-CI-related tasks, and could be easily adapted to schedule EmrEtlRunner.
