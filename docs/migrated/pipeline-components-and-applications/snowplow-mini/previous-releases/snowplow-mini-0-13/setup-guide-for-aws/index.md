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

[v0.13.0](#tab-v0130)[v0.13.1](#tab-v0131-1)[v0.13.2](#tab-v0132)[v0.13.3](#tab-v0133)[v0.13.4](#tab-v0134)[v0.13.5 (Recommended)](#tab-v0135-recommended)

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-008f6f7bbaf4c75ce | ami-045aa3ad8d53f1a76 | ami-0bff6a570beeffb83 |
| ap-northeast-2 | ami-082d3ff523054e988 | ami-0300391cbc9aac355 | ami-0e575db311e92a6d6 |
| ap-south-1 | ami-0b74da2acefc3828d | ami-01373a562edf0e251 | ami-0387583fc03fab9f1 |
| ap-southeast-1 | ami-099d9a318b7756eec | ami-06b221902490588ee | ami-0a14e68174464e0d4 |
| ap-southeast-2 | ami-0d47966eae657b471 | ami-0e0273c077d85c0e1 | ami-0ab84a0f46054f63d |
| ca-central-1 | ami-0ff1aff337a0ad272 | ami-014cfbcbcb1934c51 | ami-0645f4f019a528ef2 |
| eu-central-1 | ami-013f06183bbf5e023 | ami-0a0f7966316b5bbcf | ami-05c2775822aabfde4 |
| eu-west-1 | ami-0a5eb14f4f41a94c0 | ami-065fb6409d43aca94 | ami-0fe77c96da9faf56f |
| eu-west-2 | ami-0e825ed9ce5b452ac | ami-0150779ecf73e4447 | ami-0e0791f830022eab4 |
| sa-east-1 | ami-0b70f29194f72878c | ami-04294d43a4d5d458e | ami-08023da7dec90f3a5 |
| us-east-1 | ami-0a7cd47f0ed86a4c6 | ami-067d036c1d4f55190 | ami-037ec63ee35023a84 |
| us-east-2 | ami-03c41938f9e2e0315 | ami-040f95419619a9818 | ami-03198918330f18ee7 |
| us-west-1 | ami-0c74a354bde697ce7 | ami-0c12408eb51e3749e | ami-0db2f44a5cbf1e772 |
| us-west-2 | ami-0cadb60df22495933 | ami-0da848e21842ae26d | ami-046cbf88aac094168 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.1
- Snowplow Stream Enrich NSQ 2.0.3
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-09f7d6dc839c95c04 | ami-018b72c60b91706d6 | ami-0198ad76d7706aeb3 |
| ap-northeast-2 | ami-051be0df6a701fcfd | ami-0a157b180b3b4ae82 | ami-0a29e41eb32962857 |
| ap-south-1 | ami-0c637538971f2088f | ami-08256e1fac122ee13 | ami-0f043e99fb91d2d68 |
| ap-southeast-1 | ami-0be5caa04c94673f5 | ami-0b822d5323083b599 | ami-0cb37349d407df868 |
| ap-southeast-2 | ami-0f4ec567a09f5c824 | ami-09398cf9a386cfa08 | ami-0e1f36485f6ad4d8b |
| ca-central-1 | ami-0cec72a1a53f81a52 | ami-09a4b01bd5aec1a83 | ami-0ceca0ce142eddde3 |
| eu-central-1 | ami-06b428e91761e1f6e | ami-0d27e2dc733168b1e | ami-0e559bd019e136c15 |
| eu-west-1 | ami-09cc6db5fd1f40b5b | ami-0846d941889b9339f | ami-07b9ec595a812b886 |
| eu-west-2 | ami-0b2feb0ae42851881 | ami-0ed32ab6fc470988d | ami-0e8bd103f062ba2c0 |
| sa-east-1 | ami-0b104e8ae59fa0445 | ami-041fd88903e308a1c | ami-0be7695d8beeb75bb |
| us-east-1 | ami-08ef74f4c7025c9e3 | ami-0b8a491875199a8e8 | ami-045e5f360861dd816 |
| us-east-2 | ami-0532f55c3e65dc319 | ami-05ef8ca710c9c9b56 | ami-0c16c55d9ac4b3fb9 |
| us-west-1 | ami-0b20a20c8ea8b7823 | ami-068ac8e26e7ec1e79 | ami-0bed7d12db6ba3e45 |
| us-west-2 | ami-038cf3b61f3aab2c5 | ami-0372044a9671d9341 | ami-0bc51fce86d3b2bf9 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.2
- Snowplow Stream Enrich NSQ 2.0.3
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-04aae819475ac92d9 | ami-0204d96a140c0c690 | ami-0b6990ac29b7f5e39 |
| ap-northeast-2 | ami-0aa411e46ab722a82 | ami-0fb8cb07166a4cd47 | ami-060f381e38fb08e95 |
| ap-south-1 | ami-0955fbf4b55195286 | ami-03c1d03f47062e6f0 | ami-0dfccbc4d69b1ea0b |
| ap-southeast-1 | ami-02fdd07692a1debbe | ami-0d443cdc5e0a11166 | ami-04f2a79e55b37dd7d |
| ap-southeast-2 | ami-08a1d9323702f69d3 | ami-07a1c7a6f98186f54 | ami-0150a2e1d9700f890 |
| ca-central-1 | ami-01f75cb7caefbc39c | ami-04c10cc481146f861 | ami-0242f815b13a8f631 |
| eu-central-1 | ami-0aa71e16c5d00f0c7 | ami-07abaf7655ef00596 | ami-066c3dbcc2faa8755 |
| eu-west-1 | ami-0ae8bb84e0812086d | ami-0134874636018527a | ami-07cee7e3a2271b80c |
| eu-west-2 | ami-0323eed5115aaa007 | ami-0a684333afcb234f9 | ami-0e2df1e1f1c25cb16 |
| sa-east-1 | ami-028ae8cc87e9ee2ae | ami-0bdd364d7475a9cb3 | ami-0e89d9b67b4502279 |
| us-east-1 | ami-0ab9c82784cb0edfe | ami-052dcd6357a856901 | ami-08301c003d7aa1347 |
| us-east-2 | ami-07946f20df1b670b1 | ami-07870013f4268b8e0 | ami-0ae0b95ece749c987 |
| us-west-1 | ami-03270c0b7fc68280f | ami-014838122b7eced10 | ami-02fd8437249d9b92d |
| us-west-2 | ami-0fcd21179e9eab2e1 | ami-086691359ffcbc3a0 | ami-0876f2c6ff3e938b8 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.2
- Snowplow Stream Enrich NSQ 2.0.3
- Snowplow Elasticsearch Loader 1.0.0
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-04b63fa6f72662a7d | ami-0ef382f33e6bab99a | ami-00320590522defbc6 |
| ap-northeast-2 | ami-0870ea80a644ecd29 | ami-0fe87cc7932646dae | ami-062b8ebd0fc26fecd |
| ap-south-1 | ami-0400bf805e0cfde8d | ami-06aab82c77ba121f1 | ami-063bd52a6826cf6fc |
| ap-southeast-1 | ami-018c2a656467e1e74 | ami-0b9f92cd2eff16b45 | ami-03a4ecb18089696c4 |
| ap-southeast-2 | ami-000e3f2be3ca7a4f7 | ami-0ce28111d0a5bd5ac | ami-093979d7092044d20 |
| ca-central-1 | ami-07d8e9e56fa8367b8 | ami-022739aebf9044af8 | ami-0295f21eb80e7d111 |
| eu-central-1 | ami-029d62dc2ba22662f | ami-024f2bee553cb6663 | ami-038fc8237f88020e5 |
| eu-west-1 | ami-06980fc3a774a8c77 | ami-0b510df9d82f395e8 | ami-0feb832240a5b1f50 |
| eu-west-2 | ami-02db88ca5fb7e860d | ami-0deb16d8c50577547 | ami-03d7cb33b34166eaf |
| sa-east-1 | ami-0e66b8f91771ac86b | ami-09690a93bf4b52a31 | ami-019c9a7c739bad2e2 |
| us-east-1 | ami-06ea1b5d60e775385 | ami-0016b9eebb0768f2d | ami-05cffe29d5f397b4f |
| us-east-2 | ami-0bc69f0c369d74b36 | ami-0c0eab5ab9f24a64c | ami-05e5e73950c446f85 |
| us-west-1 | ami-02717dbdbabb50612 | ami-09f392959ca5dfe60 | ami-03804d155bd630d89 |
| us-west-2 | ami-031d4a4662f850356 | ami-05ef1387ee8ec4091 | ami-09a8c5870f8f9af57 |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.3
- Snowplow Stream Enrich NSQ 2.0.4
- Snowplow Elasticsearch Loader 1.0.3
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-01c446462332bf976 | ami-06a9a39f684fe66e8 | ami-0eb3c1d15b94dec7d |
| ap-northeast-2 | ami-0267c3321a7006ea8 | ami-0ea892031d6de19c4 | ami-0329a9aaa52a494d3 |
| ap-south-1 | ami-01a385e63b3e12d12 | ami-06233a2ef0ca9c26c | ami-04d3c15cb69f93663 |
| ap-southeast-1 | ami-0b862aacb5c2fc9f8 | ami-00da90697848835a0 | ami-09e196130e7e3efef |
| ap-southeast-2 | ami-0dc6bfa6e93974024 | ami-0440d3832bf88e544 | ami-0af5f6f2cde387df0 |
| ca-central-1 | ami-0566fb233a3288c4b | ami-0462516a3b9292122 | ami-0dd068b5e5e5d9f35 |
| eu-central-1 | ami-05b427354af1b50c0 | ami-06e9924e3d2b5527c | ami-0a5cdcb30839827b2 |
| eu-west-1 | ami-0e2a8ff2f71b83ac0 | ami-0acb104bf89dd3161 | ami-030d3bd3439649fba |
| eu-west-2 | ami-063ce79d4550b6ef9 | ami-0371eeb3c44079890 | ami-064140d40048b389c |
| sa-east-1 | ami-0d19251a5b15bcb34 | ami-0afbe8bdae52b94f6 | ami-0d00faefdd2227c10 |
| us-east-1 | ami-05d824b9de52a8c33 | ami-085ccd0d597f05785 | ami-000a8736ffb6b33db |
| us-east-2 | ami-0eb91f325b19aec15 | ami-03430506a31184419 | ami-0e919e53d6ad96603 |
| us-west-1 | ami-0e2d28b9eb8c65926 | ami-03580b19005175603 | ami-03704783ee2bd7c4c |
| us-west-2 | ami-01343b18ecf669703 | ami-0d76a90e3b1c81706 | ami-059befe47c9c3110a |

The software stack installed:

- Snowplow Stream Collector NSQ 2.4.4
- Snowplow Stream Enrich NSQ 2.0.5
- Snowplow Elasticsearch Loader 1.0.4
- Snowplow Iglu Server 0.6.1
- Elasticsearch-OSS 6.8.20
- Kibana-OSS 6.8.20
- Postgresql 9.5
- NSQ v1.2.1

|  | large / t2.large | xlarge / t2.xlarge | xxlarge / t2.xxlarge |
| --- | --- | --- | --- |
| ap-northeast-1 | ami-0b998030bcb246d2a | ami-0e00375205b1312af | ami-07b9b4aad780ab926 |
| ap-northeast-2 | ami-0ee6fb654958b68bc | ami-05a0e4fabf0c6a58d | ami-01ff52fadaaa80c59 |
| ap-south-1 | ami-08eec435e7aae1309 | ami-03a68cdc5f4ec1b3c | ami-0eff78e40bc1c6746 |
| ap-southeast-1 | ami-0c67f13daab0c00a4 | ami-0bfce74fd1926be01 | ami-090df3c82c7076269 |
| ap-southeast-2 | ami-0e7a3363bfb29a301 | ami-0e739b890a08d1aaf | ami-03b0a762d7cae8513 |
| ca-central-1 | ami-050ce4447089edb1b | ami-048e203115f264a08 | ami-0956541c5fb585e2b |
| eu-central-1 | ami-0fcbb911c8df4c913 | ami-0ffe36b2ad05ed9ca | ami-09fa209fa03c3bd14 |
| eu-west-1 | ami-056a3df8d97c3aa1e | ami-083735ad33fb59d1d | ami-07ec8739cec3109c0 |
| eu-west-2 | ami-09db0d9a9a97f9feb | ami-05cc1549857edf2d7 | ami-03adf56e7562bcfed |
| sa-east-1 | ami-0e7212fc5f84dd1bb | ami-07159002b2c284384 | ami-01e4f39375c78340e |
| us-east-1 | ami-067a9ebc93850bc58 | ami-0f5b572b63b07af90 | ami-02138989e754cb7ff |
| us-east-2 | ami-0ebe570b24306d5a2 | ami-014952c0f594f0ed0 | ami-06e67b80bc00dcb78 |
| us-west-1 | ami-092cb4be1975d8fc1 | ami-01a161a94fe8255a6 | ami-06fb662db882996b4 |
| us-west-2 | ami-02d86bfe49056128e | ami-00f70b4c5b84c8590 | ami-0a7fd3a9abcefdae5 |

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
