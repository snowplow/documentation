---
title: "Setup Guide for AWS"
date: "2020-08-10"
sidebar_position: 130
---

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates

All setup for Snowplow Mini is done within the AWS Console and will incur small amounts of running costs, depending on the size of the EC2 instance you select.

As of `0.6.0`, we offer 3 different images for 3 new sizes of Snowplow Mini.

To decide on which size of Snowplow Mini to choose, read on.

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0ecffb68ef0d50c47 | ami-0b89d31f5c4cc3c21 | ami-015802496b9e8cae9 |
| ap-northeast-2 | ami-0a2b6b5e49811c5e5 | ami-032397f7dec350240 | ami-0cf9977f7ab5ad7df |
| ap-south-1 | ami-06876ed52577a69cf | ami-0b7fef4dbf5e5892e | ami-06f6d40dd54a30ef6 |
| ap-southeast-1 | ami-004f1d40fa2d6eabd | ami-046d2dfe999fc0f8b | ami-0b3680f6689b0a911 |
| ap-southeast-2 | ami-05ffd2e2c5ef0b4d0 | ami-0e5aad5ca5d11bf1b | ami-091b8824e93370fea |
| ca-central-1 | ami-0a463569b1dd6f20b | ami-019f3c19923134fc4 | ami-075c3d0388273fbd1 |
| eu-central-1 | ami-032becfcefdf3535d | ami-027ea9fe5f1ddd104 | ami-03605f8ba04ea3037 |
| eu-west-1 | ami-099416bb0b5fc03b3 | ami-0188a4057f612d329 | ami-08fd119176ad80805 |
| eu-west-2 | ami-0f6f7cfb6c50b3250 | ami-0d4d025e6474b5079 | ami-0aab17ee232a35aaf |
| sa-east-1 | ami-086eed9a1f1f6b42b | ami-0b6a83ee0fd507565 | ami-07afd4b5b8edf94b4 |
| us-east-1 | ami-0a469b936c1aaf29e | ami-008d2136a69160303 | ami-0d3f67e3ee34de7dc |
| us-east-2 | ami-0bcfa258157d67914 | ami-0948a4ec5a1e9ecea | ami-0a0d26168e14c6e0a |
| us-west-1 | ami-07f71f2adc8940897 | ami-038ff878afd9f5b24 | ami-0cbcaeb1c6aed777d |
| us-west-2 | ami-0f75ea7fddf6a162d | ami-08d3c08d83a6b4fda | ami-05e1d70de9ef648d9 |

The software stack installed:

- Snowplow Stream Collector NSQ 1.0.1
- Snowplow Stream Enrich NSQ 1.3.1
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.3.1
- Kibana-OSS 6.3.1
- Postgresql 9.5
- NSQ v1.2.0

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![](images/snowplow-mini-topology.jpg)

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.10.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.10.0` AMI names explicitly specifies which instance type to use.

- `0.10.0-large` needs `t2.large`
- `0.10.0-xlarge` needs `t2.xlarge`
- `0.10.0-xxlarge` needs `t2.2xlarge`

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
