---
title: "Setup guide for AWS"
date: "2020-06-17"
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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-00cf573cc2724bae6 | ami-0f1b64b0c51c23101 | ami-042ac0c0a6969d0ee |
| ap-northeast-2 | ami-0f3f9fa4f0dd84cd9 | ami-0081def3f0fc57043 | ami-0be8d873bc36dbd20 |
| ap-south-1 | ami-07c490d37c6b158c7 | ami-00d74ab1bc20f0091 | ami-0cd35d771332bc819 |
| ap-southeast-1 | ami-02a6bbc5fd4058068 | ami-0a033bb3b1f2ea7d0 | ami-0d3555a7482a6d0c6 |
| ap-southeast-2 | ami-087c800d389e3eab0 | ami-03238197d3650b0fa | ami-039f6ced297a84a50 |
| ca-central-1 | ami-072b0d114bbae9dd9 | ami-0cc30290fdd9eaec0 | ami-00e7b45147e916149 |
| eu-central-1 | ami-059c27611337d6901 | ami-08a31db18eb249565 | ami-068812aae63898faf |
| eu-west-1 | ami-0d33e6b86b05506ed | ami-0f4c93a7f632c73bc | ami-083d64747dc6f3a1f |
| eu-west-2 | ami-060ae0bda9f345c57 | ami-0ffaa210e6e937178 | ami-074a7272fd080b34d |
| sa-east-1 | ami-0059a4fe1ccd246f6 | ami-04ee23dd0f7e7af92 | ami-058f081edc91fdf64 |
| us-east-1 | ami-029b7badd74475588 | ami-047ac50fe93778f10 | ami-0c959b323e018e00e |
| us-east-2 | ami-045ae125bcf876956 | ami-0b6646e4aeeeaf076 | ami-0e3a1d9e1ad5a6b86 |
| us-west-1 | ami-006d25ad77c6ab7a7 | ami-086671a8c3d53ddb2 | ami-05c45161738e4f7b4 |
| us-west-2 | ami-0c9617c34092f4560 | ami-001861a4bab3d0d3d | ami-0a5140d75585bcd0a |

The software stack installed:

- Snowplow Stream Collector NSQ 1.0.1
- Snowplow Stream Enrich NSQ 1.1.3
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.9.1` to find the needed AMI and then select it.

## Choose Instance Type

`0.9.1` AMI names explicitly specifies which instance type to use.

- `0.9.1-large` needs `t2.large`
- `0.9.1-xlarge` needs `t2.xlarge`
- `0.9.1-xxlarge` needs `t2.2xlarge`

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
