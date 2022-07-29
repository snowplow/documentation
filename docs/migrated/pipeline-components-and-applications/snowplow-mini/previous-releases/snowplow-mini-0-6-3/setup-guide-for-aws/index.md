---
title: "Setup guide for AWS"
date: "2020-04-03"
sidebar_position: 10
---

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates (because they can)

All setup for Snowplow Mini is done within the AWS Console and will incur small amounts of running costs, depending on the size of the EC2 instance you select.

As of `0.6.0`, we offer 3 different images for 3 new sizes of Snowplow Mini.

To decide on which size of Snowplow Mini to choose, read on.

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.6.3#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0e9b9bd42ca09c47d | ami-088f63064ae27e920 | ami-06b807ee13254e7e3 |
| ap-northeast-2 | ami-0a3f996541189232a | ami-0f9591113ea13cbb2 | ami-0b8f16f39965a8894 |
| ap-south-1 | ami-036c4db5fcffb439c | ami-070475e7e88254e32 | ami-00f5d973dc0af8d1d |
| ap-southeast-1 | ami-09b2512c653e5eb02 | ami-0b01cb3e838758f72 | ami-0ec723990092f2246 |
| ap-southeast-2 | ami-04160000840212f3e | ami-05649443fc8e86935 | ami-01f580423d5e844f5 |
| ca-central-1 | ami-048d9caee988189ce | ami-0a1705657ecc581bd | ami-03ad1ade8ff719b17 |
| eu-central-1 | ami-0fa92e73e24e205d4 | ami-031f91edd2f07490c | ami-0b55d0b05e033a0ea |
| eu-west-1 | ami-03585406c7bd3d489 | ami-0a70a603b8bd5fa72 | ami-0039be6f1b2bbff84 |
| eu-west-2 | ami-0365093be7dd4a999 | ami-07c57b538aff81a45 | ami-0d69fbe2bb7b21856 |
| sa-east-1 | ami-0942c89e98d7d0fad | ami-07ee36bce37ddb410 | ami-03fada9b4b747a0a6 |
| us-east-1 | ami-0f5c1eefc5095352b | ami-00f7e589539525078 | ami-0301867ccd506c804 |
| us-east-2 | ami-0ffc7c3d2e2087b11 | ami-00cae007cf47b051e | ami-07f34334697cf5a26 |
| us-west-1 | ami-0977120803f37b8a0 | ami-06f88d63be0e0697c | ami-08531dc51d3b5fd88 |
| us-west-2 | ami-0a5f4c3eb1f3987d2 | ami-03cd743821a119182 | ami-05ba7aad350c8852c |

The software stack installed:

- Snowplow Stream Collector NSQ 0.13.0
- Snowplow Stream Enrich NSQ 0.21.0
- Snowplow Elasticsearch Loader 0.10.2
- Snowplow Iglu Server 0.3.0
- Elasticsearch-OSS 6.3.1
- Kibana-OSS 6.3.1
- Postgresql 9.5
- NSQ v1.0.0-compat

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![snowplow-mini-topology](images/snowplow-mini-topology.jpg)

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.6.3` to find the needed AMI and then select it.

## Choose Instance Type

`0.6.3` AMI names expilicitly specifies which instance type to use.

`0.6.3-large` needs `t2.large` `0.6.3-xlarge` needs `t2.xlarge` `0.6.3-xxlarge` needs `t2.2xlarge`

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
