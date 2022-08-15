---
title: "Setup Guide for AWS"
date: "2021-04-15"
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
| ap-northeast-1 | ami-0b9c05256c935587c | ami-0ca59b65d8319f133 | ami-092197fb8d6d5070c |
| ap-northeast-2 | ami-0dcb3d4dfc3ae2b08 | ami-03595cbaa3bb216ef | ami-078818d872133ed6e |
| ap-south-1 | ami-08d6c5613a59d7424 | ami-0bfad6bf81058ecc2 | ami-097e916a741bb2093 |
| ap-southeast-1 | ami-05f5e8c4316306c82 | ami-0f01062af2850a045 | ami-0398cf8fedb6288cc |
| ap-southeast-2 | ami-02c0c98773a3d38c4 | ami-0e53244c3f7175736 | ami-0a7e9d825f390f8b3 |
| ca-central-1 | ami-00010b3c610fdc74c | ami-03fb29d5a587c24a2 | ami-05043677ae10a30ab |
| eu-central-1 | ami-0e55a91e5487a806f | ami-0339c46df71700bff | ami-09ce564f2223e5b24 |
| eu-west-1 | ami-05a55584cadd93118 | ami-0a25629f5d9e81ab3 | ami-0fbd40d6872660636 |
| eu-west-2 | ami-0c49f0b7ec2a06618 | ami-0182abea14dcb17db | ami-093e9cffb17b90afe |
| sa-east-1 | ami-04ad176cc60bbec67 | ami-06fd8849cc6e8b95b | ami-0ba32e1c71ab80ca8 |
| us-east-1 | ami-01f02c32f6fbef924 | ami-035056b82caa571b1 | ami-0c276eaef88001cba |
| us-east-2 | ami-0a422ae30b9f30f09 | ami-0815b55e611696187 | ami-04e7b756fffe4913e |
| us-west-1 | ami-04d3b0b1c5272ec24 | ami-005d793707346561a | ami-09283a5276047cd66 |
| us-west-2 | ami-00756ee7243aa3c06 | ami-0008e130d35779d45 | ami-01540d26b2317bd51 |

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
