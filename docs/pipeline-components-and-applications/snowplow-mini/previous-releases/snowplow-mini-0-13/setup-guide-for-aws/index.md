---
title: "Setup Guide for AWS"
date: "2022-04-25"
sidebar_position: 20
---

## Overview

Snowplow Mini is, in essence, the Snowplow real time stack inside of a single image. It is an easily-deployable, single instance version of Snowplow that serves three use cases:

1. Giving a Snowplow consumer (e.g. an analyst / data team / marketing team) a way to quickly understand what Snowplow "does" i.e. what you put it at one end and take out of the other
2. Giving developers new to Snowplow an easy way to start with Snowplow and understand how the different pieces fit together
3. Giving people running Snowplow a quick way to debug tracker updates

All setup for Snowplow Mini is done within the AWS Console and will incur small amounts of running costs, depending on the size of the EC2 instance you select.

We offer Snowplow Mini in 3 different sizes. To decide on which size of Snowplow Mini to choose, read on.

### large & xlarge & xxlarge

Until `0.6.0`, Snowplow Mini was being used inside AWS `t2.medium`, `n1-standard-1` in GCP, instances and it served well for demonstration purposes. However, we observed that Snowplow Mini started exceeding its initial motivation and machine resources started to become an obstacle, causing issues with Elasticsearch etc. This is why, Mini is available at 3 different sizes.

- `large` : Same image published so far. Elasticsearch has `4g` heap size and Snowplow apps has `0.5g` heap size. Recommended machine RAM is `8g`.
- `xlarge` : Double the large image. Elasticsearch has `8g` heap size and Snowplow apps has `1.5g` heap size. Recommended machine RAM is `16g`.
- `xxlarge` : Double the xlarge image. Elasticsearch has `16g` heap size and Snowplow apps has `3g` heap size. Recommended machine RAM is `32g`.

This service is available as an EC2 image within the AWS Community AMIs in the following regions:

Version 0.13.5 (Recommended)

|                | large / t2.large      | xlarge / t2.xlarge    | xxlarge / t2.xxlarge  |
| -------------- | --------------------- | --------------------- | --------------------- |
| ap-northeast-1 | ami-0b998030bcb246d2a | ami-0e00375205b1312af | ami-07b9b4aad780ab926 |
| ap-northeast-2 | ami-0ee6fb654958b68bc | ami-05a0e4fabf0c6a58d | ami-01ff52fadaaa80c59 |
| ap-south-1     | ami-08eec435e7aae1309 | ami-03a68cdc5f4ec1b3c | ami-0eff78e40bc1c6746 |
| ap-southeast-1 | ami-0c67f13daab0c00a4 | ami-0bfce74fd1926be01 | ami-090df3c82c7076269 |
| ap-southeast-2 | ami-0e7a3363bfb29a301 | ami-0e739b890a08d1aaf | ami-03b0a762d7cae8513 |
| ca-central-1   | ami-050ce4447089edb1b | ami-048e203115f264a08 | ami-0956541c5fb585e2b |
| eu-central-1   | ami-0fcbb911c8df4c913 | ami-0ffe36b2ad05ed9ca | ami-09fa209fa03c3bd14 |
| eu-west-1      | ami-056a3df8d97c3aa1e | ami-083735ad33fb59d1d | ami-07ec8739cec3109c0 |
| eu-west-2      | ami-09db0d9a9a97f9feb | ami-05cc1549857edf2d7 | ami-03adf56e7562bcfed |
| sa-east-1      | ami-0e7212fc5f84dd1bb | ami-07159002b2c284384 | ami-01e4f39375c78340e |
| us-east-1      | ami-067a9ebc93850bc58 | ami-0f5b572b63b07af90 | ami-02138989e754cb7ff |
| us-east-2      | ami-0ebe570b24306d5a2 | ami-014952c0f594f0ed0 | ami-06e67b80bc00dcb78 |
| us-west-1      | ami-092cb4be1975d8fc1 | ami-01a161a94fe8255a6 | ami-06fb662db882996b4 |
| us-west-2      | ami-02d86bfe49056128e | ami-00f70b4c5b84c8590 | ami-0a7fd3a9abcefdae5 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.5
- Snowplow Stream Enrich NSQ 2.0.5
- Snowplow Elasticsearch Loader 1.0.4
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![This image has an empty alt attribute; its file name is snowplow-mini-topology.jpg](images/snowplow-mini-topology.jpg)

**IAM**

Create a role with the following configuration

- Step 1: For `Select type of trusted entity` , select `EC2`
- Step 2.1: For `Attach permissions policies` , create a policy with the following

```
{
  "Version" : "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": ["*"]
    }
  ]
}
```

- Step 2.2: In step 2 of role creation, select the policy created in the previous step
- Step 3: Tags are optional
- Step 4: Fill in the role name and create it.

**CloudWatch**

Create a log group named `snowplow-mini` so that Mini can emit logs to this log group.

Mini will not function properly if a log group with that name isn't found.

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.13.2` to find the needed AMI and then select it.

## Choose Instance Type

`0.13.2` AMI names explicitly specifies which instance type to use.

- `0.13.2-large` needs `t2.large`
- `0.13.2-xlarge` needs `t2.xlarge`
- `0.13.2-xxlarge` needs `t2.2xlarge`

## Configure Instance

- Select the IAM role created above.

- If you created your Security Group in a different VPC than the default you will need to select the same VPC in the Network field.

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
