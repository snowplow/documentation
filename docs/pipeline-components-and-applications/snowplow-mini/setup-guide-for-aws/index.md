---
title: "Setup Guide for AWS"
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

[v0.14.0](#tab-v0140)[0.14.1 (Recommended)](#tab-0141-recommended)

| x | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0699981675ed9c999 | ami-052d2961881572b1c | ami-0830ef1492f21619c |
| ap-northeast-2 | ami-01b7ff49f875c81b8 | ami-026db46f90551456d | ami-017322572dc921b27 |
| ap-south-1 | ami-0ef4b9fbc0ff690ba | ami-067b623a0216e1e44 | ami-05a6488a6bcff8284 |
| ap-southeast-1 | ami-0feda6596272eca7f | ami-00a90053879a821d4 | ami-00ec336f4855596dd |
| ap-southeast-2 | ami-0588f96c4863ffe0a | ami-0c610428ba781090e | ami-0b692272c582a3eb8 |
| ca-central-1 | ami-03b4c06845bf1eba1 | ami-0ab6a6999bf1d6d2e | ami-02d422ca47f0dfbc7 |
| eu-central-1 | ami-0549a2f67320524a3 | ami-0dff8d91520c7fa25 | ami-0c35885318c16d662 |
| eu-west-1 | ami-020cf106511665857 | ami-0e10f2f3407d8d4c5 | ami-02799220aac034fd3 |
| eu-west-2 | ami-03bb6cea6158aed2d | ami-064f02a9989c461ad | ami-08a2d46db6cdfbd65 |
| sa-east-1 | ami-0099a70b2f9890cb8 | ami-0c95ab97669b9c637 | ami-0127389c36e1db013 |
| us-east-1 | ami-0697c73ca0f870443 | ami-077617d1114766f26 | ami-010d69261c5646db6 |
| us-east-2 | ami-0296ed3f8cdd53d74 | ami-08ffe776fcf2a038e | ami-0e0386a0b1d15bd1c |
| us-west-1 | ami-031de8095ebc535ee | ami-0bb614a0f3a39a260 | ami-0c42abafd5bf4a4a9 |
| us-west-2 | ami-0f02a9ced0c909656 | ami-05dec128295c05ee9 | ami-04c8d25c2a9dd0499 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.6.0
- Snowplow Stream Enrich NSQ 3.0.2
- Snowplow Elasticsearch Loader 1.0.4
- Snowplow Iglu Server 0.8.4
- Elasticsearch-OSS 6.8.23
- Kibana-OSS 6.8.20
- Postgresql 14.2
- NSQ v1.2.1

| x | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0699981675ed9c999 | ami-052d2961881572b1c | ami-0830ef1492f21619c |
| ap-northeast-2 | ami-01b7ff49f875c81b8 | ami-026db46f90551456d | ami-017322572dc921b27 |
| ap-south-1 | ami-0ef4b9fbc0ff690ba | ami-067b623a0216e1e44 | ami-05a6488a6bcff8284 |
| ap-southeast-1 | ami-0feda6596272eca7f | ami-00a90053879a821d4 | ami-00ec336f4855596dd |
| ap-southeast-2 | ami-0588f96c4863ffe0a | ami-0c610428ba781090e | ami-0b692272c582a3eb8 |
| ca-central-1 | ami-03b4c06845bf1eba1 | ami-0ab6a6999bf1d6d2e | ami-02d422ca47f0dfbc7 |
| eu-central-1 | ami-0549a2f67320524a3 | ami-0dff8d91520c7fa25 | ami-0c35885318c16d662 |
| eu-west-1 | ami-020cf106511665857 | ami-0e10f2f3407d8d4c5 | ami-02799220aac034fd3 |
| eu-west-2 | ami-03bb6cea6158aed2d | ami-064f02a9989c461ad | ami-08a2d46db6cdfbd65 |
| sa-east-1 | ami-0099a70b2f9890cb8 | ami-0c95ab97669b9c637 | ami-0127389c36e1db013 |
| us-east-1 | ami-0697c73ca0f870443 | ami-077617d1114766f26 | ami-010d69261c5646db6 |
| us-east-2 | ami-0296ed3f8cdd53d74 | ami-08ffe776fcf2a038e | ami-0e0386a0b1d15bd1c |
| us-west-1 | ami-031de8095ebc535ee | ami-0bb614a0f3a39a260 | ami-0c42abafd5bf4a4a9 |
| us-west-2 | ami-0f02a9ced0c909656 | ami-05dec128295c05ee9 | ami-04c8d25c2a9dd0499 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.6.0
- Snowplow Stream Enrich NSQ 3.0.2
- Snowplow Elasticsearch Loader 1.0.4
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

In the EC2 Console UI select the `Launch Instance` button then select the `Community AMIs` button. In the search bar enter `snowplow-mini-0.`14.0 to find the needed AMI and then select it.

## Choose Instance Type

`0.14.0` AMI names explicitly specifies which instance type to use.

- `0.14.0-large` needs `t2.large`
- `0.14.0-xlarge` needs `t2.xlarge`
- `0.14.0-xxlarge` needs `t2.2xlarge`

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
