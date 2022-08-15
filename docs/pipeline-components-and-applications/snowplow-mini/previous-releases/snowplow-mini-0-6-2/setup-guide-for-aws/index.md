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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.6.2#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-01d7bba5d66c4948b | ami-0ffaaa96e07342565 | ami-0b201a07cfb433128 |
| ap-northeast-2 | ami-0398515170df0f1a8 | ami-0fb4fbd0af834951e | ami-003e2a20033b543ab |
| ap-south-1 | ami-09ca8858947295c61 | ami-01aec12f54b2bdd12 | ami-0cdf48bbc42ece875 |
| ap-southeast-1 | ami-0a4e497f6b6a69166 | ami-03c9b64e48d5bfc72 | ami-056400d1161a82720 |
| ap-southeast-2 | ami-0e576a2c227e46dea | ami-0feceac18743f8212 | ami-067ce1df14d6dd691 |
| ca-central-1 | ami-0e9594ccf149f025e | ami-0c9e2a8dd86a4f434 | ami-01746d83094dc05f3 |
| eu-central-1 | ami-00141fb323ec7fe28 | ami-0c1fdf4dc14e4ac8a | ami-0862b8bcdbcfe843f |
| eu-west-1 | ami-0ea3418a953a2a168 | ami-0c5e9740c996bff07 | ami-04f38203eb1cd0b75 |
| eu-west-2 | ami-07f8e4e8b7dfeae5e | ami-075dd0cab665af500 | ami-0d816ee33b28fa317 |
| sa-east-1 | ami-02c0756299e7d363d | ami-01570a0fa2c017c62 | ami-047505112e6b9c455 |
| us-east-1 | ami-040292b66fd72efa0 | ami-059fc2cd4bd50079a | ami-09c831848aac6d52f |
| us-east-2 | ami-0c26c01b7f1274d14 | ami-0ae8b89a3664ba01d | ami-051898d5aae4c6094 |
| us-west-1 | ami-0b34d437c14f6f4e9 | ami-0ed3a3c1edbe302d0 | ami-0b52de6bcaaaa2036 |
| us-west-2 | ami-092e8c79ee298da34 | ami-03835b610c7bac652 | ami-0f271b1d79a2755c6 |

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.6.2` to find the needed AMI and then select it.

## Choose Instance Type

`0.6.2` AMI names expilicitly specifies which instance type to use.

`0.6.2-large` needs `t2.large` `0.6.2-xlarge` needs `t2.xlarge` `0.6.2-xxlarge` needs `t2.2xlarge`

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
