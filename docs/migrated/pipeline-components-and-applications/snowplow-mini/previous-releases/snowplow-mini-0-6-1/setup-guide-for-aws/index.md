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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.6.1#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-00aa20e47e9ac6fa2 | ami-032cc7aabc5a86534 | ami-07aa95032a39aee39 |
| ap-northeast-2 | ami-0eefd213a88c7675c | ami-058a18c59f4c4c49c | ami-09de4efcdbcb5cd21 |
| ap-south-1 | ami-0c3a2eb71df00b0c7 | ami-048794ac901cca67c | ami-0d35cadf961e41edc |
| ap-southeast-1 | ami-0aa5f2a006d0da8c6 | ami-0ddf43a2792c9c1ea | ami-0d278265fb7442fb0 |
| ap-southeast-2 | ami-09ed30ab1cdcbad5d | ami-0af8a3d6ad3a8bac7 | ami-05f8133382ed20753 |
| ca-central-1 | ami-02c1ed0a0e5f7d36c | ami-05cc5844fec948184 | ami-0768093c29d451758 |
| eu-central-1 | ami-0cfec76723b8d2814 | ami-072e37fed2c431f84 | ami-05b78fb7b858a49b3 |
| eu-west-1 | ami-0036d7f7a4bbd4a2c | ami-0737cf4b0d4000ccf | ami-031fb9073d972bf1b |
| eu-west-2 | ami-0e7d385ae12a4ef94 | ami-0ecc2301d5587915a | ami-09643a14d5f1d445c |
| sa-east-1 | ami-0d4e5bab166565154 | ami-0c0c6c36a346c3479 | ami-0ec70d173842069f2 |
| us-east-1 | ami-01ac3f142160a3c48 | ami-0ea0827d864149216 | ami-077d3ff2a22f3f2a9 |
| us-east-2 | ami-0bda7cda6af79b8c8 | ami-072ca01c3acbb1a84 | ami-0342c2e4f4e0da7a6 |
| us-west-1 | ami-02b6fd32597e8ed56 | ami-0a510c46c7de41609 | ami-0ab763155b00e1cc2 |
| us-west-2 | ami-01a8196dc9db1ae8e | ami-06f298aa23293d637 | ami-0efce9815a0be2aca |

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.6.1` to find the needed AMI and then select it.

## Choose Instance Type

`0.6.1` AMI names expilicitly specifies which instance type to use.

`0.6.1-large` needs `t2.large` `0.6.1-xlarge` needs `t2.xlarge` `0.6.1-xxlarge` needs `t2.2xlarge`

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
