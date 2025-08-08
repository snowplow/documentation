---
title: "Customer Managed Keys"
sidebar_position: 1
sidebar_label: Customer Managed Keys
---

## Overview

This guide provides step-by-step instructions for setting up AWS
KMS (Key Management Service) custom keys for your Snowplow pipeline.
Custom KMS keys provide enhanced security by allowing you to maintain
full control over encryption keys used by your data infrastructure.

:::note

**Important**: This is a bolt-on security feature available for enterprise
customers using BDP PMC (Private Managed Cloud) or BDP Cloud deployments.

## What This Feature Provides

AWS Custom KMS Keys ensure that all data stored at-rest in AWS services
(Kinesis, SQS, and S3) are encrypted with a key that you own and control.
This provides:

- **Enhanced Security**: Full control over encryption keys
- **Compliance**: Meet regulatory requirements for data encryption
- **Audit Control**: Ability to revoke access to encrypted data
- **Key Management**: Centralized control over data encryption

## Prerequisites

- AWS account with appropriate permissions to create and manage KMS keys
- Access to your AWS Console in the same region as your Snowplow pipeline
- Snowplow pipeline account ID (provided by your Customer Success Manager)
- Security team approval for cross-account key sharing

## Step 1: Create Your Custom KMS Key

### 1.1 Navigate to KMS Console

- Go to the AWS Console in the same region as your Snowplow pipeline
- Navigate to: KMS → Customer managed keys
- Example URL: `https://us-east-1.console.aws.amazon.com/kms/home?region=us-east-1#/kms/keys`

### 1.2 Configure Key Settings

Click **Create key** and configure with the following settings:

| Setting | Value |
|:---:|:---:|
| **Key type** | Symmetric |
| **Key usage** | Encrypt + Decrypt |
| **Key material origin** | KMS |
| **Regionality** | Single Region |
| **Alias** | `snowplow-pipeline-key` (or your preferred name) |

### 1.3 Set Key Administrators

- **Key Administrators**: Select the roles/users from your security team that
  need administrative access to the key
- **Other AWS Accounts**: **CRITICAL** - Add your Snowplow pipeline account ID here

*⚠️ Important: The "Other AWS Accounts" step is essential. Without adding the
Snowplow pipeline account ID, the encryption will not work.*

## Step 2: Key Policy Configuration

### 2.1 Recommended Key Policy (Root Access)

The key creation process will generate a policy similar to this. We strongly
recommend allowing root access for the Snowplow pipeline account as shown below:

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

### 2.2 Replace Placeholder Values

| Placeholder | Replace With | Example |
|:---:|:---:|:---:|
| `YOUR_ACCOUNT_ID` | Your AWS account ID | `123456789012` |
| `YourSecurityRole` | Your security team's role name | `SecurityTeamRole` |
| `YourAdminRole` | Your administrative role name | `AdminRole` |
| `SNOWPLOW_PIPELINE_ACCOUNT_ID` | Snowplow pipeline account ID | Provided by Snowplow |

## Step 3: Alternative - Non-Root Key Policy

If your security policies don't allow root access (`arn:aws:iam::<account_id>:root`),
you can use these specific role patterns instead:

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

*⚠️ Important: Using non-root policies requires coordination with Snowplow
support to ensure all necessary roles are included. We strongly recommend the
root access approach for simplicity.*

## Step 4: Share Key Information with Snowplow

### 4.1 Gather Key Details

After creating your key, collect the following information:

- **Key ARN**: Found in the key details page
  - Format: `arn:aws:kms:REGION:YOUR_ACCOUNT_ID:key/KEY_ID`
- **Key ID**: The unique identifier for your key
- **Region**: The AWS region where the key was created

## 4.2 Provide to Snowplow

Share this information with your Snowplow Customer Success Manager or through a
support ticket:

- Key ARN
- Confirmation that cross-account access is configured
- Any specific requirements or restrictions

## Step 5: Snowplow Configuration

Once you've shared the key information, Snowplow will configure the following
pipeline components to use your custom KMS key:

### 5.1 S3 Bucket Encryption

All pipeline S3 buckets will be configured with your custom KMS key:

- Batch archive bucket
- Batch output bucket
- Batch processing bucket
- Kinesis S3 bad events bucket
- Kinesis S3 enriched events bucket
- Kinesis S3 raw events bucket

### 5.2 Kinesis Stream Encryption

Pipeline Kinesis streams will be encrypted with your key:

- Good events stream
- Bad events stream
- Enriched events stream
- PII events stream
- Incomplete events stream

### 5.3 SQS Queue Encryption

If surge protection is enabled, SQS queues will use your custom key:

- Good events queue
- Bad events queue

### 5.4 EKS Cluster secrets Enrcyption

The EKS cluster will use your custom KMS key for encryption of Secrets. However
please keep in mind the following:

- The process of switching to a customer-managed KMS key is irreversible. An EKS
  cluster cannot return back to use an AWS-managed key. In order to do that we
  need to destroy and recreate the cluster which will result in downtime.
- A customer-managed KMS key that is being used for secrets encryption will be
  bound to the cluster, it is not possible to change the key and accidentally
  deleting it will result in a degraded EKS cluster which will require
  redeployment (which will result in downtime).
- Updating an existing cluster from AWS-managed key to customer-managed one is
  possible but there are the following issues:
  - Only new secrets will be encrypted with the customer-managed key.
  - Existing secrets remain encrypted with AWS-owned keys until rotated

### 5.5 Additional Services

Other pipeline components like Snowbridge will be granted access to
decrypt/encrypt data using your key.

## Step 6: Post-Configuration

### 6.1 What to Expect

After Snowplow applies your custom KMS key:

- **Immediate Effect**: Encryption settings change immediately on resources
- **Temporary Disruption**: Services may briefly fail until proper access is configured
- **Drift Application**: Snowplow will apply necessary IAM policy updates to
  resolve access issues

### 6.2 Validation

You can verify the configuration by:

- Checking S3 bucket encryption settings in your AWS Console
- Verifying Kinesis stream encryption status
- Confirming SQS queue encryption (if applicable)
- Monitoring pipeline health through Snowplow dashboards

## Troubleshooting

### Common Issues

#### Access Denied Errors

- Verify the key policy includes the correct Snowplow pipeline account ID
- Ensure the key is in the same region as your pipeline
- Check that "Other AWS Accounts" was properly configured during key creation

#### Pipeline Failures After KMS Implementation

- This is expected temporarily while Snowplow applies the necessary IAM policy updates
- Contact support if issues persist beyond the expected configuration window

#### Key Policy Validation

```bash
# Check current key policy
aws kms get-key-policy \
  --key-id YOUR_KEY_ID \
  --policy-name default
```

## Security Best Practices

### Recommended Settings

- **Enable Key Rotation**: Turn on automatic key rotation for enhanced security
- **Monitor Usage**: Use AWS CloudTrail to track key usage
- **Regular Audits**: Periodically review key policies and access patterns
- **Documentation**: Maintain internal documentation of key management procedures

### Key Management

- **Backup Procedures**: Ensure key policies are backed up and version controlled
- **Access Reviews**: Regular review of who has administrative access to keys
- **Incident Response**: Plan for key compromise or rotation scenarios

## Limitations

### Known Constraints

- **EMR Shredder**: The legacy EMR shredder process may not fully respect
  custom KMS keys for all output. This system is being deprecated.
- **Single Key Recommendation**: While technically possible to use different
  keys for different services, we recommend using a single key for all pipeline
  resources for simplicity.
- **Regional Restrictions**: Keys must be created in the same region as your
  pipeline infrastructure.

## Support and Next Steps

### After Setup

- **Test Configuration**: Verify data is flowing correctly through your pipeline
- **Monitor Performance**: Check for any performance impacts from encryption
- **Document Procedures**: Update your internal security documentation
- **Schedule Reviews**: Plan regular key policy and access reviews

### Getting Help

For assistance with KMS key setup or pipeline integration:

- **Primary Contact**: Your Snowplow Customer Success Manager
- **Support Portal**: Submit tickets through the Snowplow support portal
- **Documentation**: Reference this guide and include your key ARN in support requests

## Related Resources

- [AWS KMS Developer Guide](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html)
