---
title: "Setup Guide for AWS"
date: "2020-09-08"
sidebar_position: 140
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
| ap-northeast-1 | ami-0fa996a3d7684d118 | ami-0d86d12b488b7f363 | ami-0f7ce17b59a6ed225 |
| ap-northeast-2 | ami-06799558d30e656cc | ami-03936770c8cff957b | ami-0fd3e0a93df97a565 |
| ap-south-1 | ami-061451d260981c7c6 | ami-042609f39a0cdda1f | ami-08f49a54478db4184 |
| ap-southeast-1 | ami-0948fce6454f6599e | ami-00295ff50ec3284e2 | ami-07d29dfb394161c80 |
| ap-southeast-2 | ami-092059cb75d7ac91f | ami-0f1328aff8766e806 | ami-06ebabc69742e0d48 |
| ca-central-1 | ami-04fce03b0f5ba4cd5 | ami-0826c213bc41a7a9d | ami-09e36263be12718d1 |
| eu-central-1 | ami-06020e9a378448d4b | ami-0dc501ebc9273c9cf | ami-08d47cf9a1b77545a |
| eu-west-1 | ami-00e42dc58e3e3f036 | ami-030227e967a48f5b3 | ami-05bb5f584e6f62dc4 |
| eu-west-2 | ami-02cad0ed339b1d0b2 | ami-0ade4becf0e7fbdfe | ami-097ee620d25b7bd14 |
| sa-east-1 | ami-08754489c90cd328a | ami-0c8e1bc56d8f67fef | ami-0c07c79d45e085715 |
| us-east-1 | ami-00b2db4038e467c56 | ami-0332f30fa1be716a4 | ami-07467532589d75e91 |
| us-east-2 | ami-0590e8461a35f01e7 | ami-0b162a62145ae8464 | ami-06c20ca26db7ea8d6 |
| us-west-1 | ami-02e340d9571ed8cc4 | ami-04519ea5a4a6b6a7d | ami-07501bcda0421d522 |
| us-west-2 | ami-09498b3cd31b4f6d5 | ami-0620b864a3ed6f9f8 | ami-0d5ba6ee9b3c411a5 |

The software stack installed:

- Snowplow Stream Collector NSQ 1.0.1
- Snowplow Stream Enrich NSQ 1.3.2
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.10.1` to find the needed AMI and then select it.

## Choose Instance Type

`0.10.1` AMI names explicitly specifies which instance type to use.

- `0.10.1-large` needs `t2.large`
- `0.10.1-xlarge` needs `t2.xlarge`
- `0.10.1-xxlarge` needs `t2.2xlarge`

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
