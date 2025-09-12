---
title: "Setup Guide for AWS"
description: "Setup guide for Snowplow Mini version 0.14 on Amazon Web Services for behavioral data testing."
schema: "TechArticle"
keywords: ["Mini V0.14 AWS", "Legacy Mini", "Previous Version", "AWS Setup", "Deprecated Mini", "Old Version"]
date: "2021-05-11"
sidebar_position: -10
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

Version 0.14.2 (Recommended)

| x | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-020941e2cfe18ec7f | ami-04e2a314ebce2e505 | ami-0325fc7baa2ad2a37 |
| ap-northeast-2 | ami-020739232d1708443 | ami-0dd7c16e431121bdb | ami-0ee6817d87f24ff27 |
| ap-south-1 | ami-0a5c581f991e93788 | ami-07422d9eaf9a95fa6 | ami-085f1e8a5a9b3a64c |
| ap-southeast-1 | ami-0531709d5e06b5791 | ami-071b4774e710614d3 | ami-097d7eda684f6a0ac |
| ap-southeast-2 | ami-0deef4cda93a9bace | ami-0ac2b7c7ac052a1d8 | ami-0c71a6914b19d1357 |
| ca-central-1 | ami-00d734156bf57a001 | ami-09e6ac4e9e12ad0ca | ami-0419f360eebe366d9 |
| eu-central-1 | ami-0d7974a188d3e1fbe | ami-0671ff45befaa2a1b | ami-06e3f8656a7611f5d |
| eu-west-1 | ami-0f8b9e4b4b2430868 | ami-04c8c169a68e037c4 | ami-0d19437520b62ce06 |
| eu-west-2 | ami-0a0b88482a763c81e | ami-069a7ffbf89675186 | ami-04f55c9619a9abc94 |
| sa-east-1 | ami-05e7e20bee8ae3a02 | ami-07839320cac17f697 | ami-0fb3afddb1f96bc11 |
| us-east-1 | ami-083cfadf3e69a5680 | ami-057b0494b8627f84a | ami-0a91bb07ad0a4c128 |
| us-east-2 | ami-0845224eed8a434be | ami-07eedc425e8e0a37b | ami-0f80ef8a2d47917f3 |
| us-west-1 | ami-0f0f64ee7295db1dc | ami-001ca8eb7dd1ed0c4 | ami-0d52c9ecacfb4e9e8 |
| us-west-2 | ami-04d7bad8655818b49 | ami-08c535279169fc84c | ami-00515341480fe60e9 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.7.0
- Snowplow Stream Enrich NSQ 3.2.5
- Snowplow Elasticsearch Loader 1.0.7
- Snowplow Iglu Server 0.8.4
- Elasticsearch-OSS 6.8.23
- Kibana-OSS 6.8.20
- Postgresql 14.2
- NSQ v1.2.1

Note: All services are configured to start automatically so everything should happily survive restarts/shutdowns.

To understand the flow of data please refer to the following diagram:

![This image has an empty alt attribute; its file name is snowplow-mini-topology.jpg](images/snowplow-mini-topology.jpg)

**IAM**

Create a role with the following configuration

- Step 1: For `Select type of trusted entity` , select `EC2`
- Step 2.1: For `Attach permissions policies` , create a policy with the following

```json
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.14.2` to find the needed AMI and then select it.

## Choose Instance Type

`0.14.2` AMI names explicitly specifies which instance type to use.

- `0.14.2-large` needs `t2.large`
- `0.14.2-xlarge` needs `t2.xlarge`
- `0.14.2-xxlarge` needs `t2.2xlarge`

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

Select the Security Group you created [above](#security-group).

## Review

Press the `Launch` button and select an existing key-pair, or create a new one, if you want to be able to SSH into the box.

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Mini" since="0.13.0">

  If you wish to disable telemetry, you can do so via the [API](../control-plane-api/#configuring-telemetry).

</Telemetry>
```
