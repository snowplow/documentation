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

### [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.7.0#large--xlarge--xxlarge)large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-07aedde9dbeefb9a7 | ami-0b72120a9d7bbb413 | ami-0adf90839e6330282 |
| ap-northeast-2 | ami-0648f9de8fc7c78c0 | ami-029c44a306e4098fc | ami-06d7cd7be93da12a4 |
| ap-south-1 | ami-08cf21ce174d481c9 | ami-081c0565fc4431330 | ami-094cd27ae29e63a52 |
| ap-southeast-1 | ami-0f41618d3d5769b30 | ami-08064df67208222b1 | ami-083140bf1b3584f11 |
| ap-southeast-2 | ami-0c74122ff324fa86e | ami-0383b75aca7cbc4ae | ami-011ec488c547c2543 |
| ca-central-1 | ami-07b9f435caccbad41 | ami-0c61087ae21a3ad3e | ami-04c34d1c0a1628430 |
| eu-central-1 | ami-0b63b27aed541dcc0 | ami-088c1e179abfbeddd | ami-00642a95f4cb99eca |
| eu-west-1 | ami-04b2fa5cd2e5ad577 | ami-0efecda7f499952a2 | ami-0a19683c4c8ac6803 |
| eu-west-2 | ami-0f88606f10c70fc1f | ami-0d3d471a4862d6c74 | ami-0da86d131f1c64207 |
| sa-east-1 | ami-06e2d15f306ca7045 | ami-011309eabdd743130 | ami-090cf1fcaf3c3f7f4 |
| us-east-1 | ami-0d453aaffc4bdcae9 | ami-01e8ab8ef11662b13 | ami-04e6b1d3001059be0 |
| us-east-2 | ami-08e5a952a8acddf46 | ami-0a42fe0b03531cb00 | ami-0eaaf4734f2e05449 |
| us-west-1 | ami-0893ac7704f84584b | ami-0d907127224d69125 | ami-017cc753cc383f97f |
| us-west-2 | ami-0328c13766c13d1f1 | ami-09f24411724187566 | ami-00b5772148c981bf4 |

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

## [](https://github.com/snowplow/snowplow-mini/wiki/Setup-guide-AWS---0.7.0#2-security-group)2\. Security Group

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.7.0` to find the needed AMI and then select it.

## Choose Instance Type

`0.7.0` AMI names expilicitly specifies which instance type to use.

`0.7.0-large` needs `t2.large` `0.7.0-xlarge` needs `t2.xlarge` `0.7.0-xxlarge` needs `t2.2xlarge`

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
