---
title: "Setup guide for AWS"
date: "2020-04-16"
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
| ap-northeast-1 | ami-011c8edf461a88ede | ami-0ededdc753f56ea04 | ami-07ff699bcaaab7594 |
| ap-northeast-2 | ami-09d7f68c9c637716e | ami-07bf253a1b1ad60c8 | ami-0132caa56a68dcce2 |
| ap-south-1 | ami-06f08498bf52e7158 | ami-0b398354ff711aeec | ami-08e1b97134772bd8e |
| ap-southeast-1 | ami-04b68be842eea6280 | ami-0ad232df52a7c3af3 | ami-05a0a36e5026c27a8 |
| ap-southeast-2 | ami-0a658c6da9a185acf | ami-02b48e489602ef5bd | ami-0020ab2a31f73b4af |
| ca-central-1 | ami-0a0cf316c2e3c1b5a | ami-0fc80b66bc52cd7f3 | ami-0258dd89f55f70908 |
| eu-central-1 | ami-0b0ddc83ebec4aee4 | ami-05c688c80bab61cc9 | ami-03f67ccdef2cbed96 |
| eu-west-1 | ami-0fda57a57bf013006 | ami-031145f9295bada2e | ami-002214facdb6bcb72 |
| eu-west-2 | ami-05c82c77a0eac43f7 | ami-0cbc7636a7cecbafe | ami-0138e9339657b9be4 |
| sa-east-1 | ami-0c912b12606bd4560 | ami-01466dc8d409e2e23 | ami-0d4f952067de72018 |
| us-east-1 | ami-0e3be79e15e933202 | ami-0f850067b7533ffd1 | ami-09ea9d25468f5fce5 |
| us-east-2 | ami-04cf82ee3ce6ed4be | ami-0112caee8b5dd5774 | ami-075f69f884e76239e |
| us-west-1 | ami-01d793e9b37243069 | ami-0c7d48ec8f494b2bb | ami-02103da1cb250d5f5 |
| us-west-2 | ami-06c37c02b8899b736 | ami-0941c1762b021d83a | ami-0d62266264aac12ac |

The software stack installed:

- Snowplow Stream Collector NSQ 1.0.0
- Snowplow Stream Enrich NSQ 1.0.0
- Snowplow Elasticsearch Loader 0.12.0
- Snowplow Iglu Server 0.6.1
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.8.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.8.0` AMI names explicitly specifies which instance type to use.

- `0.8.0-large` needs `t2.large`
- `0.8.0-xlarge` needs `t2.xlarge`
- `0.8.0-xxlarge` needs `t2.2xlarge`

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
