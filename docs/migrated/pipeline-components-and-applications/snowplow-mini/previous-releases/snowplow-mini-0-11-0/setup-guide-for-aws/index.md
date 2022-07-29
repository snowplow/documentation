---
title: "Setup Guide for AWS"
date: "2020-11-11"
sidebar_position: 150
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
| ap-northeast-1 | ami-0f47a24d0b67b81fc | ami-0ae82ab7fb972c6f9 | ami-053a0af5ec733fc82 |
| ap-northeast-2 | ami-00b7a1a93910b2736 | ami-04b58b263a56674e7 | ami-0a35bbfc02f286eef |
| ap-south-1 | ami-072d5ed8234e0f1df | ami-0a7748eb2f29e9ef7 | ami-03bfeb0d77f49b92b |
| ap-southeast-1 | ami-07bf7731a13cb6b19 | ami-06e59e0cc111cf3f2 | ami-0815ba3ce4045018f |
| ap-southeast-2 | ami-0d0e46c1048e764ec | ami-06247f7a4fffa8017 | ami-06565918e815d4a94 |
| ca-central-1 | ami-043a60f1d7761bbd9 | ami-011d0115ae2040b8e | ami-0ef9b3413182212dc |
| eu-central-1 | ami-0f5d879f05a1b5860 | ami-065634c1e99a4ed2c | ami-05647811011c942b8 |
| eu-west-1 | ami-00e922476b51bc68e | ami-062994aa043fbc4db | ami-019cdc6fa2552c803 |
| eu-west-2 | ami-039f290ccecafb227 | ami-09871832eb89efab2 | ami-0110bbabf0c3d2c92 |
| sa-east-1 | ami-067e4a0e2b0eb86d6 | ami-035e76bce69e1b4c3 | ami-02b3999d5883d9f3c |
| us-east-1 | ami-024f75f27d10e33c9 | ami-08180550f2db82fb5 | ami-07d6f67e45a5cb9b9 |
| us-east-2 | ami-027f5ccb8904d6a91 | ami-07cbc2caff2fe683f | ami-068a0d348d04d8dfd |
| us-west-1 | ami-00e926f45dd694af6 | ami-0aff4c3b39e3bda0d | ami-0d3358b6486d39f6a |
| us-west-2 | ami-0e1b983c6229b8520 | ami-083cff30a7ecadbd8 | ami-013a9d2fdebd03b0d |

The software stack installed:

- Snowplow Stream Collector NSQ 2.0.0
- Snowplow Stream Enrich NSQ 1.4.1
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.3.1
- Kibana-OSS 6.3.1
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.11.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.11.0` AMI names explicitly specifies which instance type to use.

- `0.11.0-large` needs `t2.large`
- `0.11.0-xlarge` needs `t2.xlarge`
- `0.11.0-xxlarge` needs `t2.2xlarge`

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
