---
title: "What is the Quick Start for Open Source?"
date: "2021-07-08"
sidebar_position: 50
---

Snowplow is an Open-Core Behavioral Data Platform that helps businesses of all sizes collect, govern and model [behavioral data](https://snowplowanalytics.com/what-is-behavioral-data/). This product is built on the world's largest [open source project](https://github.com/snowplow/snowplow) for collecting behavioral data.

This quick start guide will get you up and running with a Snowplow open source pipeline - and deliver rich behavioural data to stream, lake and warehouse in less than an hour. 

The data pipeline that you will have set up by the end of this guide will look similar to the following (this will vary by cloud and can be designed to suit your needs due to our modular approach):

![](images/image-3.png)

We have built a set of [terraform](https://www.terraform.io/docs/language/modules/develop/index.html) modules, which automates the setting up & deployment of the required infrastructure & applications for an operational Snowplow open source pipeline, with just a handful of input variables required on your side. 

By the end of this guide,  you will be able to: 

- Collect granular, well-structured data with our suite of web, mobile and server side [SDKs](/docs/collecting-data/collecting-from-own-applications/index.md)
- Create your own [custom events and entities](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md) 
- Easily enable and disable our suite of [out-of-the-box enrichments](/docs/enriching-your-data/available-enrichments/index.md) 
- Consume your rich data in real time from a choice of over 5 supported destinations (kinesis, pubsub, S3, Postgres or ElasticSearch)

## How does the quick start edition compare? 

Out-of-the-box, the quick start edition will: 

- Handle up to ~100 events per second (~9 million events per day)
- Cost ~$200 (depending on data transfer costs) per month for ~100 events per second in AWS infrastructure costs, and ~$240 on GCP

It will get you up and running as quickly as possible with Snowplow's open source product so that you can start exploring how to run & manage a Snowplow pipeline that will help you to deliver value with rich, high quality behavioural data to power multiple use cases.

Check the [feature comparison](/docs/which-version-to-pick/index.md#free-trial) for more details.
