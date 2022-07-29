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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.6.4#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0e8c534a20438d5ba | ami-0a46450e56cbf0b8e | ami-022f8a50493e2eda6 |
| ap-northeast-2 | ami-09e41f4feac10bac7 | ami-02e09b2c10b598a17 | ami-02513f48e149076e9 |
| ap-south-1 | ami-06ce759186bfe4a52 | ami-0511af9c8b611efaf | ami-0046e6ef8dc753507 |
| ap-southeast-1 | ami-086feea6641dc6ef6 | ami-0014b7fc83a0f514f | ami-00d7a1a5ce45f910d |
| ap-southeast-2 | ami-012a659f1c693df0d | ami-02b66f26739ad78ad | ami-09abc62d6401eb2e2 |
| ca-central-1 | ami-0cd5e576df442c643 | ami-086e36e8aa1569b2b | ami-059bc4dba85ffa89d |
| eu-central-1 | ami-06b104b93cd14d858 | ami-02e752aac7a8798e5 | ami-08ee25637ff032b11 |
| eu-west-1 | ami-0ddae400e23117e47 | ami-0c41139c63d934a29 | ami-01e0e85f44c23b020 |
| eu-west-2 | ami-0f7ab74896e908c1c | ami-0c5a50517a7eda9d6 | ami-0465a2f816b4614ab |
| sa-east-1 | ami-0f3f2ac29f27c402b | ami-0bd50249904d20045 | ami-0328f28c53574c237 |
| us-east-1 | ami-0ec213a5c5cef2ac1 | ami-0b9fb0e2b04b37d36 | ami-0a91d9556fa7054d1 |
| us-east-2 | ami-06353294f56363617 | ami-0c378ce6ab24b5a00 | ami-0f68e8bca44dae59d |
| us-west-1 | ami-0b5a04e37f2f5e385 | ami-0a77fe3f4f771d27a | ami-052b041477c56c767 |
| us-west-2 | ami-0e7f2c8ac8d633f89 | ami-07252c8dd98df1775 | ami-08e9a55a37eb3f04c |

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.6.4` to find the needed AMI and then select it.

## Choose Instance Type

`0.6.4` AMI names expilicitly specifies which instance type to use.

`0.6.4-large` needs `t2.large` `0.6.4-xlarge` needs `t2.xlarge` `0.6.4-xxlarge` needs `t2.2xlarge`

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
