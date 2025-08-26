---
title: "BDP Enterprise on AWS"
date: "2020-01-30"
sidebar_position: 10
coverImage: "aws_logo_0.png"
---

To set up Snowplow, simply follow the ['Getting Started' steps in the Snowplow BDP Console](https://console.snowplowanalytics.com/getting-started). You will receive an account as part of your onboarding.

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
- to know whether or not you want VPC peering, and for which /21 or /22 CIDR range (note: [VPC peering and using a custom VPC is an additional bolt-on](https://snowplow.io/snowplow-behavioral-data-platform-product-description/#h-vpc-peering-aws-gcp))

We often find our point of contact requires support from their DevOps or Networking colleagues to complete the cloud setup step; in Snowplow BDP Console you can [easily create accounts for colleagues](/docs/account-management/managing-users/index.md) who can complete this step for you.

## Preparing your AWS sub-account

These instructions are also provided as part of the setup flow in Snowplow BDP Console.

### Create sub-account

1. From your main AWS account, set up an Organisation if you haven't done so already.
2. Create a member account (the sub-account) in that organization
3. Sign out and sign into the new sub-account. Everything Snowplow-related will take place within this account from here in.
4. Follow [these instructions](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create-console.html#access_policies_create-start) to create a policy using the JSON policy document below.

### Set up Role and IAM permissions

1. Access the IAM control panel within the sub-account
2. Go to Access management > Roles and select Create role
3. Select "Another AWS account" (Account ID: 793733611312 Require MFA: false). We use Okta to assume roles, which uses delegated MFA and not direct MFA authentication to AWS 
4. Select the policy you created earlier
5. Call the role "SnowplowAdmin" (please use this specific name)

You will need to share this role with us as part of filling out the setup form in Snowplow BDP Console.

### JSON Policy Document

```json
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Effect":"Allow",
      "Action":[
        "acm:*",
        "application-autoscaling:*",
        "autoscaling:*",
        "cloudformation:*",
        "cloudfront:*",
        "cloudwatch:*",
        "dynamodb:*",
        "ec2:*",
        "ecs:*",
        "eks:*",
        "elasticache:*",
        "elasticloadbalancing:*",
        "elasticmapreduce:*",
        "es:*",
        "execute-api:*",
        "events:*",
        "globalaccelerator:*",
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
        "servicequotas:GetAWSDefaultServiceQuota",
        "servicequotas:GetServiceQuota",
        "servicequotas:ListAWSDefaultServiceQuotas",
        "servicequotas:ListRequestedServiceQuotaChangeHistory",
        "servicequotas:ListServiceQuotas",
        "servicequotas:ListServices",
        "servicequotas:RequestServiceQuotaIncrease",
        "sns:*",
        "sqs:*",
        "ssm:*",
        "support:*",
        "wafv2:Describe*",
        "wafv2:Get*",
        "wafv2:List*",
      ],
      "Resource":"*"
    }
  ]
}

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

### Setup the Snowplow deployment role

The last step is to set up the Snowplow deployment role. This is a role assumed by the machine user to make changes with Terraform.

1. Navigate to https://console.aws.amazon.com/iam/home#/roles$new?step=type&roleType=crossAccount
2. Select Create role and for trusted entity type select AWS account.
- Account ID: 793733611312
- Do not select Require MFA as Snowplow needs to be able to assume the role via headless jobs
- If setting this up via IAM, do not add `"aws:MultiFactorAuthPresent": "false"` condition, as this will prevent the role being assumed by Snowplow SRE staff. We use Okta to assume roles, which uses delegated MFA and not direct MFA authentication to AWS
3. Attach the `IAMFullAccess` policy. If a Permission Boundary was set on the admin role, then add this boundary to the bottom section of permissions page.
- Role name: SnowplowDeployment (please use this specific name)
- Role description: Allows the Snowplow Team to programmatically deploy to this account.
4. Copy the Snowplow deployment role ARN. You will need to share this role with us as part of filling out the setup form in Snowplow BDP console.

### Determine if Snowplow requires a specific VPC CIDR range (optional)

If you require Snowplow to be deployed into a specific VPC CIDR range, this should be provided at the same time. We need a /18 provided for the VPC so that we can create /20 and /23 subnets (note: [VPC peering and using a custom VPC is an additional bolt-on](https://snowplow.io/snowplow-behavioral-data-platform-product-description/#h-vpc-peering-aws-gcp)).

### Determine if Snowplow requires a specific IAM Permission Boundary (optional)

If you require Snowplow to be deployed using a specific IAM Permission Boundary, this should be provided at the same time.

### Final checklist

If you are sending a request to our team to set up your account for you. Please ensure you provide the following information:
1. SnowplowAdmin role ARN
2. SnowplowDeployment role ARN
3. AWS region to deploy into
4. VPC CIDR requirements for VPC peering (optional)
5. The IAM Permission Boundary ARN (optional)
