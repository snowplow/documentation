---
title: "Setup Guide for AWS"
date: "2021-02-19"
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
| ap-northeast-1 | ami-06f8b91ff64698c54 | ami-017089e5c44bb7ddb | ami-0fb083612bbc635b1 |
| ap-northeast-2 | ami-0beac4f5700111b95 | ami-0cc1da9e6138e7190 | ami-0e41c017b11fe3373 |
| ap-south-1 | ami-0f1c691c9899aeda4 | ami-01c2f4a9d9aabcd14 | ami-0fd6869ae6e6660f0 |
| ap-southeast-1 | ami-018ba633c2744d790 | ami-0baa5a05ba10cf2d5 | ami-060168aac7b80b3f5 |
| ap-southeast-2 | ami-067baa2a0f013848d | ami-03db6fe40dab2ed69 | ami-0de2e2005abc3e75e |
| ca-central-1 | ami-019387754606f0ab2 | ami-01e965b7247331caa | ami-0731035bde3afab6e |
| eu-central-1 | ami-086480f3e3c17c3c3 | ami-0ad601c189d986fcc | ami-0e46a89ecd38a2382 |
| eu-west-1 | ami-090781903fdd21ecc | ami-093254fc0bbb99b0c | ami-08a19ab019c52a37c |
| eu-west-2 | ami-060c7ba13d9dac081 | ami-0628c7626b2b4276a | ami-007340ba39a05e822 |
| sa-east-1 | ami-06b5a2f1ce7e0f659 | ami-0b058be0bcca7f4d9 | ami-0a92bca34b6a0901f |
| us-east-1 | ami-0d9c23e6c4e856ea7 | ami-092eb2185df0fb568 | ami-0013cf42ee99ca69d |
| us-east-2 | ami-0adb1c8a3d20202b7 | ami-00bb2aa340ecd6708 | ami-02566841f1fd60842 |
| us-west-1 | ami-0c3d500241d65b6e4 | ami-07a7ff7b6f6a30a70 | ami-0ec14967a8962dfdf |
| us-west-2 | ami-087cf68a4e22e6dd2 | ami-0d121cd9e076a23cf | ami-0d90e10d3f8ec1c8b |

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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.12.1` to find the needed AMI and then select it.

## Choose Instance Type

`0.12.1` AMI names explicitly specifies which instance type to use.

- `0.12.1-large` needs `t2.large`
- `0.12.1-xlarge` needs `t2.xlarge`
- `0.12.1-xxlarge` needs `t2.2xlarge`

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
