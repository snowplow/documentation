---
title: "Setup Guide for AWS"
date: "2021-05-10"
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
| ap-northeast-1 | ami-0efb4b91f17a975e5 | ami-0a72334d446208337 | ami-0374583e942a30381 |
| ap-northeast-2 | ami-0d140c7be61a2b16f | ami-0bc1a30098e346461 | ami-0b603839817b1f84e |
| ap-south-1 | ami-042e1903a96659797 | ami-0557f4289942fc46e | ami-0eafae2b64b8f2ff3 |
| ap-southeast-1 | ami-07052792e3ec5ae52 | ami-05d41467cd96306ca | ami-03c1c5fd1aa4f6db3 |
| ap-southeast-2 | ami-09334b64f4f1b74ba | ami-0d5219392cade1368 | ami-0222cf39d6fd6e0c1 |
| ca-central-1 | ami-0a331e1fd5900e9b5 | ami-0f0925a54d204069b | ami-0e73fa75ee75ea611 |
| eu-central-1 | ami-0a746e05a8e032723 | ami-04a53718c20a236cd | ami-0e1f17e94c37deee8 |
| eu-west-1 | ami-08c08dacfd9c73c34 | ami-0447076d8afbdf5f8 | ami-0f07c96b2ad07374d |
| eu-west-2 | ami-076639fd26339ecfc | ami-02ebb46b5a5c927a7 | ami-0b54e43fece94fae6 |
| sa-east-1 | ami-02971347dcb9f3bfc | ami-0d1dc23828b356399 | ami-0daab7c46439aa168 |
| us-east-1 | ami-0c31249179852b771 | ami-02bd01af09541fd9f | ami-05fbb97ddaef510f9 |
| us-east-2 | ami-017691f16a822e568 | ami-00999ee3965c1ce0e | ami-08929bb256653dfd1 |
| us-west-1 | ami-08efe25a52fabf639 | ami-092754e47317766a7 | ami-06dc0482b75628da3 |
| us-west-2 | ami-0490e1d8df12ee963 | ami-0e25ccfadead64c6f | ami-0f299f61aea3c1e52 |

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
