---
title: "Setup Guide for AWS"
date: "2021-12-16"
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

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-009a1d6f3cdc79df5 | ami-0e1b33e69ad45308d | ami-05042cb5acccb2431 |
| ap-northeast-2 | ami-0852e34a4eb7d69e6 | ami-0f82892b9c34188f3 | ami-003aa3243efa14d0f |
| ap-south-1 | ami-08801862338eee4c7 | ami-02d6fd313305c80a3 | ami-003fc9a9bbb0fa174 |
| ap-southeast-1 | ami-09513a918310e5cd1 | ami-0b1dccc72081ab134 | ami-002859e99f439f074 |
| ap-southeast-2 | ami-03cfcbeaabab1d7b6 | ami-06c7f149a52014601 | ami-08f67a4cf04fcafe3 |
| ca-central-1 | ami-0de7a9257cd031eb3 | ami-055f003317625f128 | ami-04351978e36a0c26a |
| eu-central-1 | ami-09d507e6dc940fa21 | ami-0a9c56e19c921dcd9 | ami-09dbd059d3b447766 |
| eu-west-1 | ami-0bd095d8d349081ca | ami-0390c713b4961e39a | ami-09adc9a332e82b4e7 |
| eu-west-2 | ami-0f5ec5ae7cc0e41a4 | ami-020c3bebfe933d861 | ami-0beea426cfa878384 |
| sa-east-1 | ami-0668c89191783d5f8 | ami-0644dfec0ea950295 | ami-00d5126c4ea88c646 |
| us-east-1 | ami-0325b0c997f6f57ee | ami-0bd1aac98a20d14dc | ami-0f3c8b7b623103250 |
| us-east-2 | ami-0973715ae5d5adb8a | ami-03fc97b1a03b7355e | ami-00679a0be5a652f93 |
| us-west-1 | ami-084a75de56b67e759 | ami-001cb30ba85f72c27 | ami-0a3018e66bdd21e70 |
| us-west-2 | ami-0cbbe71ea6813bf18 | ami-0f3b56055fa7bfaf7 | ami-03031d525cfdc6cdb |

The software stack installed:

- Snowplow Stream Collector NSQ 2.2.1
- Snowplow Stream Enrich NSQ 2.0.0
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.12.6` to find the needed AMI and then select it.

## Choose Instance Type

`0.12.6` AMI names explicitly specifies which instance type to use.

- `0.12.6-large` needs `t2.large`
- `0.12.6-xlarge` needs `t2.xlarge`
- `0.12.6-xxlarge` needs `t2.2xlarge`

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
