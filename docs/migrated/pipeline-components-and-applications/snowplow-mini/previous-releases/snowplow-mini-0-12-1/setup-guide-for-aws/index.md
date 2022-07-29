---
title: "Setup Guide for AWS"
date: "2021-02-04"
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

### large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-059f3a4311026af8a | ami-0a8cd96827daeed0b | ami-0f2f4eafb20c9cff3 |
| ap-northeast-2 | ami-0111362f74b301449 | ami-04a4b1f41343610c7 | ami-08c5ea9ac3a97784d |
| ap-south-1 | ami-0f4d7816bf1455763 | ami-0293afee753e2c014 | ami-0fbf47cdc34ba8442 |
| ap-southeast-1 | ami-028798054aef42716 | ami-03ddfdfea0342cb5e | ami-0124f012b3be08fb8 |
| ap-southeast-2 | ami-012f3ac61d612a0cb | ami-0057a88251ef4e08f | ami-09eb4d45154931978 |
| ca-central-1 | ami-09682fd8ca00a5852 | ami-0fa8ff7058d219c14 | ami-0a5cfba3d894e4f3c |
| eu-central-1 | ami-0369159a3895ce690 | ami-01a6eeee203e68f30 | ami-05eeb4bd3b1f60060 |
| eu-west-1 | ami-06f5aca62e916d89b | ami-081daf883e7be7ce5 | ami-0d80c3bf293423e8a |
| eu-west-2 | ami-0b73b1ec2df0652af | ami-0d20780de6e3f3d73 | ami-05038c1a4529a87d1 |
| sa-east-1 | ami-0ab92124fe9b279ff | ami-0f6776f29b10342db | ami-0bbcb4072052d6cfb |
| us-east-1 | ami-046d1254428848b9c | ami-09555bc6283fe3dbe | ami-04c1ada5ffcc133ed |
| us-east-2 | ami-01e5fdcdcd6ad2bce | ami-0ea77037e44b8c15f | ami-052b52ec8c9e2ff5d |
| us-west-1 | ami-0da78ba14bd3f5406 | ami-0f92915dc44db8287 | ami-02c379836813ec2c1 |
| us-west-2 | ami-08f175ce91b4363a2 | ami-0089060de483d7516 | ami-0a1c726e9dc781680 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.1.0
- Snowplow Stream Enrich NSQ 1.4.1
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.9
- Kibana-OSS 6.8.9
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.12.1` to find the needed AMI and then select it.

## Choose Instance Type

`0.12.1` AMI names explicitly specifies which instance type to use.

- `0.12.1-large` needs `t2.large`
- `0.12.1-xlarge` needs `t2.xlarge`
- `0.12.1-xxlarge` needs `t2.2xlarge`

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
