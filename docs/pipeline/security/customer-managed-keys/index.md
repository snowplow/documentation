---
title: "Customer managed keys"
sidebar_position: 1
---

This guide provides step-by-step instructions for setting up AWS KMS (Key Management Service) custom keys for your Snowplow pipeline. Custom KMS keys provide enhanced security by allowing you to maintain full control over encryption keys used by your data infrastructure.

:::note

This is a bolt-on security feature available for enterprise customers using BDP PMC (Private Managed Cloud) or BDP Cloud deployments.

:::

## What this feature provides

AWS Custom KMS Keys ensure that all data stored at-rest in AWS services (Kinesis, SQS, and S3) are encrypted with a key that you own and control. This provides:

- Enhanced security: full control over encryption keys
- Compliance: meet regulatory requirements for data encryption
- Audit control: ability to revoke access to encrypted data
- Key management: centralized control over data encryption

## Prerequisites

- AWS account with appropriate permissions to create and manage KMS keys
- Access to your AWS Console in the same region as your Snowplow pipeline
- Snowplow pipeline account ID (provided by your Customer Success Manager)
- Security team approval for cross-account key sharing

## Create your custom KMS key

### Navigate to KMS Console

- Go to the AWS Console in the same region as your Snowplow pipeline
- Navigate to: **KMS** → **Customer managed keys**
- Example URL: `https://us-east-1.console.aws.amazon.com/kms/home?region=us-east-1#/kms/keys`

### Configure key settings

Click **Create key** and configure with the following settings:

|       Setting       |                      Value                       |
| :-----------------: | :----------------------------------------------: |
|      Key type       |                    Symmetric                     |
|      Key usage      |               Encrypt and decrypt                |
| Key material origin |                       KMS                        |
|     Regionality     |                  Single region                   |
|        Alias        | `snowplow-pipeline-key` (or your preferred name) |

### Set key administrators

- Key administrators: select the roles/users from your security team that need administrative access to the key
- Other AWS Accounts: add your Snowplow pipeline account ID here

The "Other AWS Accounts" step is essential. Without adding the Snowplow pipeline account ID, the encryption will not work.

## Key policy configuration

### Recommended key policy (root access)

The key creation process will generate a policy similar to this. We strongly recommend allowing root access for the Snowplow pipeline account as shown below:

```json
{
  "Id": "key-consolepolicy-3",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Enable IAM User Permissions",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "Allow access for Key Administrators",
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::YOUR_ACCOUNT_ID:role/YourSecurityRole",
          "arn:aws:iam::YOUR_ACCOUNT_ID:role/YourAdminRole"
        ]
      },
      "Action": [
        "kms:Create*",
        "kms:Describe*",
        "kms:Enable*",
        "kms:List*",
        "kms:Put*",
        "kms:Update*",
        "kms:Revoke*",
        "kms:Disable*",
        "kms:Get*",
        "kms:Delete*",
        "kms:TagResource",
        "kms:UntagResource",
        "kms:ScheduleKeyDeletion",
        "kms:CancelKeyDeletion",
        "kms:RotateKeyOnDemand"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow use of the key",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::SNOWPLOW_PIPELINE_ACCOUNT_ID:root"
      },
      "Action": [
        "kms:Encrypt",
        "kms:Decrypt",
        "kms:ReEncrypt*",
        "kms:GenerateDataKey*",
        "kms:DescribeKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Allow attachment of persistent resources",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::SNOWPLOW_PIPELINE_ACCOUNT_ID:root"
      },
      "Action": [
        "kms:CreateGrant",
        "kms:ListGrants",
        "kms:RevokeGrant"
      ],
      "Resource": "*",
      "Condition": {
        "Bool": {
          "kms:GrantIsForAWSResource": "true"
        }
      }
    }
  ]
}
```

### Replace placeholder values

|          Placeholder           |          Replace With          |       Example        |
| :----------------------------: | :----------------------------: | :------------------: |
|       `YOUR_ACCOUNT_ID`        |      Your AWS account ID       |    `123456789012`    |
|       `YourSecurityRole`       | Your security team's role name |  `SecurityTeamRole`  |
|        `YourAdminRole`         | Your administrative role name  |     `AdminRole`      |
| `SNOWPLOW_PIPELINE_ACCOUNT_ID` |  Snowplow pipeline account ID  | Provided by Snowplow |

## Alternative - non-root key policy

If your security policies don't allow root access (`arn:aws:iam::<account_id>:root`), you can use these specific role patterns instead:

```json
{
  "Sid": "Allow use of the key - Specific Roles",
  "Effect": "Allow",
  "Principal": {
    "AWS": [
      "arn:aws:iam::SNOWPLOW_PIPELINE_ACCOUNT_ID:role/SnowplowOperator",
      "arn:aws:iam::SNOWPLOW_PIPELINE_ACCOUNT_ID:role/sp-*",
      "arn:aws:iam::SNOWPLOW_PIPELINE_ACCOUNT_ID:role/snowplow-*"
    ]
  },
  "Action": [
    "kms:Encrypt",
    "kms:Decrypt",
    "kms:ReEncrypt*",
    "kms:GenerateDataKey*",
    "kms:DescribeKey",
    "kms:CreateGrant",
    "kms:ListGrants",
    "kms:RevokeGrant"
  ],
  "Resource": "*"
}
```

Using non-root policies requires coordination with Snowplow support to ensure all necessary roles are included. We strongly recommend the root access approach for simplicity.

## Share key information with Snowplow

### Gather key details

After creating your key, collect the following information:

- Key ARN: found in the key details page
  - Format: `arn:aws:kms:REGION:YOUR_ACCOUNT_ID:key/KEY_ID`
- Key ID: the unique identifier for your key
- Region: the AWS region where the key was created

### Provide to Snowplow

Share this information with your Snowplow Customer Success Manager or through a support ticket:

- Key ARN
- Confirmation that cross-account access is configured
- Any specific requirements or restrictions

## Snowplow configuration

Once you've shared the key information, Snowplow will configure the following pipeline components to use your custom KMS key:

### S3 bucket encryption

All pipeline S3 buckets will be configured with your custom KMS key:

- Batch archive bucket
- Batch output bucket
- Batch processing bucket
- Kinesis S3 bad events bucket
- Kinesis S3 enriched events bucket
- Kinesis S3 raw events bucket

### Kinesis stream encryption

Pipeline Kinesis streams will be encrypted with your key:

- Good events stream
- Bad events stream
- Enriched events stream
- PII events stream
- Incomplete events stream

### SQS queue encryption

If surge protection is enabled, SQS queues will use your custom key:

- Good events queue
- Bad events queue

### EKS cluster secrets encryption

The EKS cluster will use your custom KMS key for encryption of Secrets. However please keep in mind the following:

- The process of switching to a customer-managed KMS key is irreversible. An EKS cluster cannot return back to use an AWS-managed key. In order to do that we need to destroy and recreate the cluster which will result in downtime.
- A customer-managed KMS key that is being used for secrets encryption will be bound to the cluster, it is not possible to change the key and accidentally deleting it will result in a degraded EKS cluster which will require redeployment (which will result in downtime).
- Updating an existing cluster from AWS-managed key to customer-managed one is possible but there are the following issues:
  - Only new secrets will be encrypted with the customer-managed key
  - Existing secrets remain encrypted with AWS-owned keys until rotated

### Additional services

Other pipeline components like Snowbridge will be granted access to decrypt/encrypt data using your key.

## Post-configuration

### What to expect

After Snowplow applies your custom KMS key:

- Immediate effect: encryption settings change immediately on resources
- Temporary disruption: services may briefly fail until proper access is configured
- Drift application: Snowplow will apply necessary IAM policy updates to resolve access issues

### Validation

You can verify the configuration by:

- Checking S3 bucket encryption settings in your AWS Console
- Verifying Kinesis stream encryption status
- Confirming SQS queue encryption (if applicable)
- Monitoring pipeline health through Snowplow dashboards

## Troubleshooting

### Common issues

#### Access denied errors

- Verify the key policy includes the correct Snowplow pipeline account ID
- Ensure the key is in the same region as your pipeline
- Check that **Other AWS Accounts** was properly configured during key creation

#### Pipeline failures after KMS implementation

- This is expected temporarily while Snowplow applies the necessary IAM policy updates
- Contact support if issues persist beyond the expected configuration window

#### Key policy validation

```bash
# Check current key policy
aws kms get-key-policy \
  --key-id YOUR_KEY_ID \
  --policy-name default
```

## Security best practices

### Recommended settings

- Enable key rotation: turn on automatic key rotation for enhanced security
- Monitor usage: use AWS CloudTrail to track key usage
- Regular audits: periodically review key policies and access patterns
- Documentation: maintain internal documentation of key management procedures

### Key management

- Backup procedures: ensure key policies are backed up and version controlled
- Access reviews: regular review of who has administrative access to keys
- Incident response: plan for key compromise or rotation scenarios

## Limitations

### Known constraints

- EMR Shredder: the legacy EMR shredder process may not fully respect custom KMS keys for all output. This system is being deprecated.
- Single key recommendation: while technically possible to use different keys for different services, we recommend using a single key for all pipeline resources for simplicity.
- Regional restrictions: keys must be created in the same region as your pipeline infrastructure.
