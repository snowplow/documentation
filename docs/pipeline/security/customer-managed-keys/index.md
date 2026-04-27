---
title: "Configure AWS KMS customer managed keys"
sidebar_position: 1
sidebar_label: "Customer managed keys"
description: "Set up AWS KMS custom encryption keys for enhanced pipeline security with full control over data encryption."
keywords: ["AWS KMS", "customer managed keys", "encryption keys", "pipeline encryption", "pipeline security"]
---

This guide provides step-by-step instructions for setting up AWS KMS (Key Management Service) custom keys for your Snowplow pipeline. Custom KMS keys provide enhanced security by allowing you to maintain full control over encryption keys used by your data infrastructure.

:::note

This is a bolt-on security feature available for enterprise customers using CDI Private Managed Cloud or CDI Cloud deployments.

:::

AWS Custom KMS Keys ensure that all data stored at-rest in AWS services (Kinesis, SQS, and S3) are encrypted with a key that you own and control. This provides:

- Enhanced security: full control over encryption keys
- Compliance: meet regulatory requirements for data encryption
- Audit control: ability to revoke access to encrypted data
- Key management: centralized control over data encryption

## Prerequisites

To use custom KMS keys, you will need:
- AWS account with appropriate permissions to create and manage KMS keys
- Access to your AWS Console in the same region as your Snowplow pipeline
- Snowplow pipeline account ID (provided by your Customer Success Manager)
- Your security team approval for cross-account key sharing

This feature has some limitations:
- EMR cluster: if you're using the RDB Transformer component (only required for batch loading to Redshift and Databricks), it will need additional permissions adding (`kms:Decrypt`, `kms:GenerateDataKey*`) to enable access to customer S3 buckets with customer-managed KMS keys.
- Single key recommendation: while it's technically possible to use different keys for different services, we recommend using a single key for all pipeline resources for simplicity.
- Regional restrictions: keys must be created in the same region as your pipeline infrastructure.
- KMS API quota: BYOK operations consume additional KMS API calls beyond your baseline usage. Verify you have sufficient quota before enabling this feature.

## Step 1: Create your custom KMS key

Go to the AWS Console in the same region as your Snowplow pipeline and navigate to **KMS** → **Customer managed keys**. The URL will look similar to `https://us-east-1.console.aws.amazon.com/kms/home?region=us-east-1#/kms/keys`.

Click **Create key** and configure with the following settings:

|       Setting       |                      Value                       |
| :-----------------: | :----------------------------------------------: |
|      Key type       |                    Symmetric                     |
|      Key usage      |               Encrypt and decrypt                |
| Key material origin |                       KMS                        |
|     Regionality     |                  Single region                   |
|        Alias        | `snowplow-pipeline-key` (or your preferred name) |

When setting key administrators:

- Key administrators: select the roles/users from your security team that need administrative access to the key
- Other AWS Accounts: add your Snowplow pipeline account ID here

:::note
The "Other AWS Accounts" step is essential. Without adding the Snowplow pipeline account ID, the encryption will not work.
:::

## Step 2: Key policy configuration

The key creation process will generate a policy similar to the one below. We strongly recommend allowing root access for the Snowplow pipeline account:

<details>

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

Replace the placeholder values in this policy:

|          Placeholder           |          Replace With          |       Example        |
| :----------------------------: | :----------------------------: | :------------------: |
|       `YOUR_ACCOUNT_ID`        |      Your AWS account ID       |    `123456789012`    |
|       `YourSecurityRole`       | Your security team's role name |  `SecurityTeamRole`  |
|        `YourAdminRole`         | Your administrative role name  |     `AdminRole`      |
| `SNOWPLOW_PIPELINE_ACCOUNT_ID` |  Snowplow pipeline account ID  | Provided by Snowplow |

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

</details>

Using non-root policies requires coordination with Snowplow Support to ensure all necessary roles are included. We strongly recommend the root access approach for simplicity.

## Step 3: Share key information with Snowplow

After creating your key, collect the following information:

- Key ARN: found in the key details page
  - Format: `arn:aws:kms:REGION:YOUR_ACCOUNT_ID:key/KEY_ID`
- Key ID: the unique identifier for your key
- Region: the AWS region where the key was created
- Environment name: e.g. `prod`, `qa1`

Share this information with your Snowplow Customer Success Manager or through a support ticket:

- Key ARN
- Environment name
- Confirmation that cross-account access is configured
- Which pipeline components you want encrypted (or confirm you want full pipeline encryption)
- Any specific requirements or restrictions

## Step 4: Snowplow configuration

Once you've shared the key information, Snowplow will configure the following pipeline components to use your custom KMS key.

All **pipeline S3 buckets** will be configured with your custom KMS key:
- Batch archive bucket
- Batch output bucket (used in RDB Transformer/Loader process for Redshift and Databricks)
- Batch processing bucket (used in RDB Transformer/Loader process for Redshift and Databricks)
- S3 bad events bucket
- S3 enriched events bucket

Pipeline **Kinesis streams** will be encrypted with your key:
- Good events stream
- Bad events stream
- Enriched events stream
- Incomplete events stream

If surge protection is enabled, **SQS queues** will use your custom key:
- Good events queue
- Bad events queue

**Other pipeline components** like Snowbridge will be granted access to decrypt/encrypt data using your key.

## Step 5: Post-configuration

After Snowplow applies your custom KMS key:
- Immediate effect: encryption settings change immediately on resources
- Temporary disruption: services may briefly fail until proper access is configured
- Drift application: Snowplow will apply necessary IAM policy updates to resolve access issues

You can verify the configuration by:
- Sending test events to your collector endpoint and confirming events appear in the enriched stream without errors
- Checking S3 bucket encryption settings in your AWS Console — objects should show your KMS key ARN under encryption properties
- Verifying Kinesis stream encryption status
- Confirming SQS queue encryption (if applicable)
- Reviewing **AWS CloudTrail logs** for `Decrypt` and `GenerateDataKey` operations against your key ID — the presence of these calls confirms your key is actively in use by the pipeline
- Monitoring pipeline health through Snowplow dashboards

## Rotating or changing your KMS key

If you need to switch to a different KMS key — for example, as part of a scheduled key rotation policy — follow these steps:

1. Create the new KMS key and configure its key policy as described in Steps 1 and 2 above.
2. Contact Snowplow Support with your environment name, the new Key ARN, and the current Key ARN being replaced.
3. Keep the old key active and accessible until Snowplow Support confirms the rotation is complete and all data encrypted with the old key has been processed and archived.

:::danger[Keep the old key active until rotation is confirmed]
Do not disable or delete the old KMS key until you receive explicit confirmation from Snowplow Support. Disabling the key prematurely while it is still referenced by your pipeline will cause data processing to stop immediately.
:::

## Disabling customer-managed key encryption

:::danger[Disable the key in AWS only after Snowplow confirms it is safe to do so]
Disabling your KMS key while it is still referenced in the pipeline configuration will cause an immediate pipeline outage. Data processing will stop and stream latency will increase as events back up in queues.
:::

If you need to disable customer-managed key encryption, you must follow this sequence — do not disable the key in AWS first:

1. Contact Snowplow Support and request that the KMS key references be removed from your pipeline configuration.
2. Wait for Snowplow to redeploy the updated configuration and confirm the key is no longer referenced.
3. Only after receiving confirmation from Snowplow Support, disable or delete the key in AWS.

## Security best practices

For recommended settings:
- Enable key rotation: turn on automatic key rotation for enhanced security
- Monitor usage: use AWS CloudTrail to track key usage
- Regular audits: periodically review key policies and access patterns
- Documentation: maintain internal documentation of key management procedures

For key management:
- Backup procedures: ensure key policies are backed up and version controlled
- Access reviews: regular review of who has administrative access to keys
- Incident response: plan for key compromise or rotation scenarios

## Troubleshooting

The following table covers the most common issues after enabling customer-managed key encryption.

|                    Issue                     |                                 Likely Cause                                 |                                                      Resolution                                                       |
| :------------------------------------------: | :--------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|     Data stops flowing after BYOK setup      |                      KMS key is unreachable or disabled                      |            Verify the key is enabled in the AWS KMS console and check CloudTrail for access denied errors             |
| Some streams appear encrypted but not others |       Snowplow did not apply the configuration to all pipeline stacks        |                            Contact Snowplow Support to verify all stacks have been updated                            |
|             Access denied errors             | Incorrect pipeline account ID in key policy, or key is in a different region | Verify the key policy includes the correct Snowplow pipeline account ID and that the key region matches your pipeline |

Pipeline failures after KMS implementation are expected temporarily while Snowplow applies the necessary IAM policy updates. Contact Support if issues persist beyond the expected configuration window.

To validate your key policy:

```bash
# Check current key policy
aws kms get-key-policy \
  --key-id YOUR_KEY_ID \
  --policy-name default
```
