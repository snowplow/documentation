---
title: "Security overview"
sidebar_position: 3
sidebar_label: "Security overview"
description: "Find the security controls for your Snowplow pipeline: deployment roles and permissions, network setup, encryption keys, PII handling, single sign-on, and API keys."
keywords: ["pipeline security", "data encryption", "security best practices", "iam role", "vpc", "sso", "pii"]
---

Use this page to find where each security control for your Snowplow pipeline is documented. Some controls apply only when Snowplow runs in your own cloud account, with [Private Managed Cloud](/docs/get-started/private-managed-cloud/index.md).

## Cloud account access and network

When you set up Private Managed Cloud, you grant Snowplow access to your cloud account and choose how the pipeline connects to your network:

* Deployment role and permissions: [AWS](/docs/get-started/private-managed-cloud/setup-guide-aws/index.md#set-up-the-snowplow-deployment-role), [Azure](/docs/get-started/private-managed-cloud/setup-guide-azure/index.md#set-up-access-and-required-permissions), and [GCP](/docs/get-started/private-managed-cloud/setup-guide-gcp/index.md#set-up-required-permissions)
* IAM Permission Boundary on AWS: [Determine if Snowplow requires a specific IAM Permission Boundary](/docs/get-started/private-managed-cloud/setup-guide-aws/index.md#determine-if-snowplow-requires-a-specific-iam-permission-boundary-optional)
* VPC peering or a custom VPC: [AWS CIDR ranges](/docs/get-started/private-managed-cloud/setup-guide-aws/index.md#provide-a-cidr-range-for-vpc-peering-or-using-a-custom-vpc-optional) and [Azure VPC](/docs/get-started/private-managed-cloud/setup-guide-azure/index.md#determine-if-snowplow-requires-a-specific-vpc-optional)
* Encryption keys: [Configure AWS KMS customer managed keys](/docs/pipeline/security/customer-managed-keys/index.md)

## Data in events

These enrichments change personal data in events before they're loaded:

* [PII pseudonymization enrichment](/docs/pipeline/enrichments/available-enrichments/pii-pseudonymization-enrichment/index.md) hashes personally identifiable fields
* [IP anonymization enrichment](/docs/pipeline/enrichments/available-enrichments/ip-anonymization-enrichment/index.md) masks part of the user's IP address

## Console access

Control who can use Console and the Console APIs:

* [Single Sign-On](/docs/account-management/managing-users/index.md#how-to-enable-sso-for-your-account) with your identity provider
* [User permissions and roles](/docs/account-management/managing-permissions/index.md)
* [API keys](/docs/account-management/index.md#create-an-api-key) with only the permissions you select
