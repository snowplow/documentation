---
title: "Setup Guide for AWS"
date: "2020-12-14"
sidebar_position: -10
---

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates

All setup for Snowplow Mini is done within the AWS Console and will incur small amounts of running costs, depending on the size of the EC2 instance you select.

As of `0.6.0`, we offer 3 different images for 3 new sizes of Snowplow Mini.

To decide on which size of Snowplow Mini to choose, read on.

### large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0e2bc25ba37e72ae1 | ami-00cbab2c2e52136e0 | ami-0201d013a1cf78670 |
| ap-northeast-2 | ami-0a6c1bfa904a9dbc9 | ami-074cc43748f8aeebf | ami-04048c3bb09b51895 |
| ap-south-1 | ami-043f9427d9f7cea94 | ami-07526edac4270fd29 | ami-0ad4e59756762bdd0 |
| ap-southeast-1 | ami-0dbc86f103f572902 | ami-0e5a3d85ce97b06cf | ami-07bde9e50f440496b |
| ap-southeast-2 | ami-06830cba6df1ea725 | ami-031e1143c5ca4f081 | ami-07aba34b77aec1e53 |
| ca-central-1 | ami-00d12585e73426200 | ami-0a399b85e0e1ec420 | ami-06f2646837f96dba1 |
| eu-central-1 | ami-064e5368618728297 | ami-03f2e9f54630f085f | ami-00813397068ad4cb5 |
| eu-west-1 | ami-013d7178b8d725575 | ami-08bc37c16516d7d06 | ami-05d65a8d887f45805 |
| eu-west-2 | ami-0fa8f36ad36c7ae7b | ami-0a4f85f7f45473bb5 | ami-031dd61f8e01c9ec7 |
| sa-east-1 | ami-023445b2cb065f5ec | ami-088c40f863ef3c252 | ami-04270cf0bb74052d9 |
| us-east-1 | ami-05852777fa77c0fdb | ami-033805f9adf10929d | ami-0e48ad22fe787912e |
| us-east-2 | ami-047903c77cd64a571 | ami-0ebab21b9cd14d6bc | ami-08a77d477cd29a30f |
| us-west-1 | ami-0535c82766bc5c688 | ami-058d2c0fdf5baf566 | ami-08bab76817d1aa9fd |
| us-west-2 | ami-0fa92dd9f7b5f9b00 | ami-0ed50e574a32dfc86 | ami-0ad9e58ef6405defb |

The software stack installed:

- Snowplow Stream Collector NSQ 2.1.0
- Snowplow Stream Enrich NSQ 1.4.1
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.9
- Kibana-OSS 6.8.9
- Postgresql 9.5
- NSQ v1.2.0

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![This image has an empty alt attribute; its file name is snowplow-mini-topology.jpg](images/snowplow-mini-topology.jpg)

## Security Group

In the EC2 Console UI select `Security Groups` from the panel on the left.

Select the `Create Security Group` button and fill in the name, description and what VPC you want to attach it to.

You will then need to add the following InBound rules:

![snowplow-mini-security-group-setup](images/security-groups-setup.png)

- Custom TCP Rule | Port Range (80)
- CIDR range `0.0.0.0/0`
- Custom TCP Rule | Port Range (443)
- CIDR range `0.0.0.0/0`
- SSH (optional):
    - Custom TCP Rule | Port Range (22)
    - CIDR range `{{ YOUR IP HERE }}/32`

For OutBound you can leave the default to allow everything out.

## Choose AMI

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.12.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.12.0` AMI names explicitly specifies which instance type to use.

- `0.12.0-large` needs `t2.large`
- `0.12.0-xlarge` needs `t2.xlarge`
- `0.12.0-xxlarge` needs `t2.2xlarge`

## Configure Instance

If you created your Security Group in a different VPC than the default you will need to select the same VPC in the Network field.

**NOTE**: If you select a custom VPC ensure that you select `Enable` for the Auto-assign Public IP option.

## Add Storage

Depending on how long you intend to run Snowplow Mini and how much data you intend to send/store you will need to change the size of the block store accordingly.

For basic testing and debugging;

- 20-50 Gb should suffice for `large`
- 50-100 Gb should suffice for `xlarge`
- 100-200 Gb should suffice for `xxlarge`

We also recommend changing the `Volume Type` to GP2 from Magnetic for a smoother experience.

## Tag Instance

Add any tags you like here.

## Configure Security Group

Select the Security Group you created in Step 2.

## Review

Press the `Launch` button and select an existing key-pair, or create a new one, if you want to be able to SSH into the box.
