---
title: "Setup guide for AWS"
date: "2020-04-03"
sidebar_position: 10
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
| ap-northeast-1 | ami-07c0bffa4c3fb9bbf | ami-05f5c8a62c3f02985 | ami-0df9563f5866aa273 |
| ap-northeast-2 | ami-0b255ea2cd6d920c6 | ami-09495f42b685ca3d5 | ami-0ddad461c211a0583 |
| ap-south-1 | ami-0b2678abdbb8236c9 | ami-0c4ebc02e18aa3853 | ami-01b7f19d176b93332 |
| ap-southeast-1 | ami-0ae68bf3c31f274dc | ami-0ba5ecedd1c184bbe | ami-032f7b6ac10b3364c |
| ap-southeast-2 | ami-01ee98bf6ceb6a535 | ami-00acfa0af6bb536e4 | ami-08900acd0362ff596 |
| ca-central-1 | ami-06a0fabeb5122703a | ami-06920970e1ce04eea | ami-04a81a31c0dfcb73d |
| eu-central-1 | ami-091a8bf03f4e5b0b6 | ami-08921229bcad94e7b | ami-0184fcefb1c17aaab |
| eu-west-1 | ami-08c04f28792e92c53 | ami-026c45f41b38eb905 | ami-02d5feffe753f72ed |
| eu-west-2 | ami-0edff86b9f02beb57 | ami-06183aa108f08497f | ami-0d3ab77d06437f29b |
| sa-east-1 | ami-0509d04dfa4433147 | ami-0881e0490eb01fdf4 | ami-0c55b5a497eacb635 |
| us-east-1 | ami-0c6dead97ee62be74 | ami-0d6a94a6f5d9a421f | ami-0cf0138d9e7b884a7 |
| us-east-2 | ami-01fa5d9d6b3c126bd | ami-00742facfe656fa6c | ami-07fffab9bb4ded439 |
| us-west-1 | ami-012e2479c6d2e07ad | ami-06d2e1ccddc0be513 | ami-0e13f83e3369c07c5 |
| us-west-2 | ami-09532b20927102f11 | ami-09d26423ea3c98d24 | ami-0399692a82ff53f56 |

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
