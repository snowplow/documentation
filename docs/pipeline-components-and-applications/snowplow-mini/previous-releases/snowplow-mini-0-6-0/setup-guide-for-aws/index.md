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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.6.0#large--xlarge--xxlarge)large & xlarge & xxlarge

Until today, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, `0.6.0` is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | L / t2.large | XL / t2.xlarge | XXL / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0a0ac33e5caea540d | ami-0e791ef9b00a86631 | ami-0ed18ac715373f655 |
| ap-northeast-2 | ami-0af1974ab4228ad6e | ami-04f66ae6e25b1ba44 | ami-03d93b4b24e65cd49 |
| ap-south-1 | ami-01307622247c5179b | ami-004ad8bfd15ed1b9b | ami-092a43af8b9cab958 |
| ap-southeast-1 | ami-08248abc830f08af4 | ami-08134a68e353058bb | ami-03af409aad0cb6f32 |
| ap-southeast-2 | ami-b7d576d5 | ami-62db7800 | ami-e6d47784 |
| ca-central-1 | ami-a3028fc7 | ami-d7028fb3 | ami-051c9161 |
| eu-central-1 | ami-066dc65768a022be9 | ami-07de0eadf1a5f4783 | ami-002199214c40803cc |
| eu-west-1 | ami-0029aa1a50b1bf4a8 | ami-0632c2bf62868f264 | ami-0895bc0b2a2cdacbc |
| eu-west-2 | ami-8d2dd8ea | ami-3622d751 | ami-df2fdab8 |
| sa-east-1 | ami-02e595e3c10ad4800 | ami-05cc714eaaa1512be | ami-0955c923a70d1fa97 |
| us-east-1 | ami-09e9b4ba16b4682a4 | ami-099c8cd9f5e7b1e66 | ami-047a036b175227385 |
| us-east-2 | ami-0602b1a675bc063bd | ami-087cb85849ace1b60 | ami-0abbe14666d04cf25 |
| us-west-1 | ami-41b95722 | ami-b3b856d0 | ami-4baa4428 |
| us-west-2 | ami-b890b6c0 | ami-379cba4f | ami-c79bbdbf |

The software stack installed:

- Snowplow Stream Collector NSQ 0.13.0
- Snowplow Stream Enrich NSQ 0.18.0
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.6.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.6.0` AMI names expilicitly specifies which instance type to use.

`0.6.0-large` needs `t2.large` `0.6.0-xlarge` needs `t2.xlarge` `0.6.0-xxlarge` needs `t2.2xlarge`

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
