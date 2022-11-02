---
title: "Setup Snowplow BDP on AWS"
date: "2020-01-30"
sidebar_position: 10
coverImage: "aws_logo_0.png"
---

To setup Snowplow, simply follow the ['Getting Started' steps in the Snowplow BDP Console](https://console.snowplowanalytics.com/getting-started). You will receive an account as part of your onboarding.

## What are the steps

The first setup steps are designed to get your infrastructure in place and have you sending data as quickly as possible. The initial steps include:

- providing the right cloud environment for Snowplow to be installed
- setting up your first sandbox environment
- selecting which warehouse, if any, you want to load your data into

Completing the forms for these initial steps should take you around 30 minutes.

## What will I need

To setup your cloud environment as required you will need

- to be able to set up a sub-account and appropriate permissions on AWS
- to know which AWS region you’d like us to install your Snowplow pipeline into
- to know whether or not you want VPC peering, and for which /21 or /22 CIDR range (note: [VPC peering is an additional bolt-on for basecamp and ascent tiers](https://snowplow.io/snowplow-bdp-product-description/#bolt-ons))

We often find our point of contact requires support from their DevOps or Networking colleagues to complete the cloud setup step; in Snowplow BDP Console you can [easily create accounts for colleagues](/docs/using-the-snowplow-console/managing-users/index.md) who can complete this step for you.

## Preparing your AWS sub-account

These instructions are also provided as part of the setup flow in Snowplow BDP Console.

### Create sub-account

1. From your main AWS account, set up an Organisation if you haven't done so already.
2. Create a member account (the sub-account) in that organization
3. Sign out and sign into the new sub-account. Everything Snowplow-related will take place within this account from here in.
4. Follow [these instructions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html#access_policies_create-start) to create a policy using the policy list below.

### Set up Role and IAM permissions

1. Access the IAM control panel within the sub-account
2. Go to Access management > Roles and select Create role
3. Select "Another AWS account"  
    (Account ID: 793733611312 Require MFA: true)
4. Select the policy you created earlier
5. Call the role "SnowplowAdmin" or similar

You will need to share this role with us as part of filling out the setup form in Snowplow BDP console.

### Policy List

```text
 "acm:*",
 "apigateway:*",
 "application-autoscaling:*",
 "autoscaling:*",
 "aws-marketplace:Subscribe",
 "aws-marketplace:Unsubscribe",
 "aws-marketplace:ViewSubscriptions",
 "cloudformation:*",
 "cloudfront:*",
 "cloudwatch:*",
 "dynamodb:*",
 "ec2:*",
 "ecs:*",
 "eks:*",
 "elasticbeanstalk:*",
 "elasticloadbalancing:*",
 "elasticmapreduce:*",
 "es:*",
 "execute-api:*",
 "events:*",
 "iam:*",
 "kinesis:*",
 "kinesisanalytics:*",
 "kms:DescribeKey",
 "kms:List*",
 "lambda:*",
 "logs:*",
 "rds:*",
 "redshift:*",
 "route53:*",
 "route53resolver:*",
 "s3:*",
 "secretsmanager:CreateSecret",
 "secretsmanager:DeleteSecret",
 "secretsmanager:DescribeSecret",
 "secretsmanager:GetResourcePolicy",
 "secretsmanager:GetSecretValue",
 "secretsmanager:PutSecretValue",
 "secretsmanager:TagResource",
 "sns:*",
 "sqs:*"
 "ssm:*",
 "support:*"
```

For complete documentation from Amazon go [here](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_accounts.html).

### Set up Role and IAM Permissions with **CloudFormation**

We also provide a CloudFormation template that will create a role named SnowplowAdmin with the full permission set [here](https://snowplow-hosted-assets.s3-eu-west-1.amazonaws.com/common/iam/SnowplowAdminRole_CF.yml).

1. Access the CloudFormation service within the sub-account
2. Go to Stacks select Create stack > With new resources (standard)
3. Select Template is ready within the Prepare template block
4. Specify an Amazon S3 URL with the full path to the SnowplowAdmin CloudFormation template and proceed
5. Provide the stack with a meaningful name such as SnowplowAdmin stack
6. Now proceed through the remainder of the prompts and choose Create stack

For complete documentation from Amazon go [here](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html).
