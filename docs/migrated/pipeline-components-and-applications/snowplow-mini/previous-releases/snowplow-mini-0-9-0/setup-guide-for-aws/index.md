---
title: "Setup guide for AWS"
date: "2020-05-25"
sidebar_position: 0
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

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0fdad6c29194b3b55 | ami-0da7f387d5e8124da | ami-0ae9ef40cb57d40f7 |
| ap-northeast-2 | ami-041af9ec0eb8926c5 | ami-077de10102e7bf451 | ami-00403fcca995e8c0e |
| ap-south-1 | ami-06236397820f9a5e9 | ami-083d33ce56445b2b9 | ami-0c83673152473d469 |
| ap-southeast-1 | ami-0ff0ad6cdc92a6bb4 | ami-0a109d715a60567cc | ami-0f5312d663533000d |
| ap-southeast-2 | ami-04bed01e9bf9d451e | ami-0e0de0fe9c466bc7c | ami-0b31a011e61e4f87b |
| ca-central-1 | ami-00170550e14a4b669 | ami-090ce107362645031 | ami-0d34e45d9b7c5b497 |
| eu-central-1 | ami-0bffe93f1e4ceabb0 | ami-012427f21041dcd9d | ami-06a050d777f155663 |
| eu-west-1 | ami-0ec1b0488ffb5540d | ami-0a2729f3e73a50de7 | ami-0a4cd2698810ae69a |
| eu-west-2 | ami-05fc6d4cc06638a79 | ami-0df4943b035152ffd | ami-0a7d6d0a30baaac32 |
| sa-east-1 | ami-09ec312657bc94409 | ami-0e0dbfaea63b8b983 | ami-0aebcbbf73cba3a77 |
| us-east-1 | ami-0c41643598e0a114f | ami-0528b96510ff83ec8 | ami-06e9fa1430f8fd226 |
| us-east-2 | ami-09b01038bc431e202 | ami-0f81f5cd09c72b5ce | ami-0b458282aa8ba1c24 |
| us-west-1 | ami-0b6411da18695d9f1 | ami-07b06d32f66c46783 | ami-068855a2b371c879a |
| us-west-2 | ami-046db59d76ac344a7 | ami-027c674db9d694b9c | ami-0211c3247713400c5 |

The software stack installed:

- Snowplow Stream Collector NSQ 1.0.1
- Snowplow Stream Enrich NSQ 1.1.0
- Snowplow Elasticsearch Loader 0.12.0
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.9.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.9.0` AMI names explicitly specifies which instance type to use.

- `0.9.0-large` needs `t2.large`
- `0.9.0-xlarge` needs `t2.xlarge`
- `0.9.0-xxlarge` needs `t2.2xlarge`

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

Press the `Launch` button and select an existing key-pair, or create a new one, if you want to be able to SSH onto the box.
