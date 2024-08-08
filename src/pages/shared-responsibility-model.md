# Snowplow Private Managed Cloud: Shared Responsibility Model

## Introduction

This document outlines the Shared Responsibility Model for customers of Snowplow's Private Managed Cloud (PMC) SaaS offering. Snowplow provides a comprehensive analytics platform that allows customers to collect and operationalize their data. The model delineates the responsibilities of Snowplow and its customers to ensure the secure, reliable, and effective use of the Snowplow analytics platform within a cloud environment.

Understanding the division of responsibilities is critical for maintaining the security and integrity of your data, as well as ensuring the seamless operation of the Snowplow pipeline within your infrastructure.

## Customer Responsibilities

As a customer of Snowplow's Private Managed Cloud offering, you play a pivotal role in managing and securing your cloud environment. Your responsibilities include:

### Ensuring Snowplow's Cloud Access Remains in Place

You must provide and maintain the necessary cloud access permissions for Snowplow to deploy and manage the infrastructure in your respective cloud account. This involves setting up and regularly verifying the integrity of cloud access roles and permissions to ensure uninterrupted service. Due to the nature of our deployment model, a loss of access can immediately impact the availability of your infrastructure.

### Cloud Account Management

Whilst Snowplow will look after all deployed infrastructure, we are not privy to all alerts sent to the AWS sub-account, Azure subscription, or GCP project — these are generally routed to the owner of the cloud account. Anything pertaining to Snowplow should be forwarded into our Support system so that it can be triaged and looked at.

### Valid Billing with Cloud Provider

You must ensure that your billing information is up-to-date and valid with your cloud provider. This responsibility includes monitoring your billing status and resolving any issues promptly to avoid service interruptions. Snowplow does not have insight into cloud billing and cannot resolve issues related to this.

### Cloud Support Coordination

At times, you may need to leverage your Cloud (AWS, GCP, Azure) support package to escalate issues and investigations with cloud-provided managed services. When possible, naming Snowplow as a support contact for the specific sub-account, project, or subscription is recommended to allow direct access to your Cloud support tier.

### Audit Control within the Cloud Sub-account

Maintaining audit controls is crucial for monitoring activities and changes within your cloud sub-account. You are responsible for implementing and managing these controls, including setting up necessary logging and monitoring services like AWS CloudTrail, Azure Audit Logs, or GCP Cloud Audit Logs.

### IAM Permissions Boundaries

For AWS customers who intend to implement IAM permissions boundaries, you are responsible for creating and maintaining these boundaries. Snowplow will deploy infrastructure with the customer-provided ARN.

### GCP Service Account Impersonation

For GCP customers who intend to utilize Service Account Impersonation, you are responsible for creating the service account. Once you have done so and assigned the necessary roles, you need to add the group `techops-cloud-admin@snowplowanalytics.com` to the service account with the `iam.serviceAccountTokenCreator` role.

### Ensuring Customer-managed CDN/WAF Layers are Accessible

If you use a Content Delivery Network (CDN) or a Web Application Firewall (WAF) in front of Snowplow-managed endpoints, you must ensure these are correctly configured and remain accessible. This involves regularly testing and updating configurations as necessary to avoid disruptions in data collection.

### Cloud Storage Management

Access to data within S3 (AWS), AFS (Azure), and GCS (GCP) should be managed by you. This can be done by generating roles within the shared AWS sub-account, Azure subscription, or GCP project, respectively. An alternative is to apply custom access policies to the buckets directly. You should not alter or remove any policies set on the buckets by Snowplow. Additionally, you are responsible for creating any lifecycle policies if so desired.

### Coordinate with Snowplow on custom consumers

For AWS customers, if you choose to implement your own consumers on Snowplow-managed Kinesis streams, you will need to coordinate with Snowplow first to ensure the streams are scaled properly to prevent service disruptions.

## Snowplow Responsibilities

Snowplow is committed to providing a robust and secure analytics platform. Our responsibilities include:

### Deploying and Maintenance of the Pipeline Infrastructure and Components

The Snowplow team will set up, manage, scale and upgrade your Snowplow pipeline from within your own AWS, Azure, or GCP account. Snowplow will also work with you to optimize your AWS, Azure, or GCP costs once you have a good understanding of your traffic volume and patterns.

### Evergreen Pipelines and Infrastructure

Snowplow takes responsibility for ensuring that your pipeline components are at the latest available as soon as possible. Additionally, managed infrastructure is also upgraded regularly including libraries, operating systems, and cloud managed service versions.

## Conclusion

The Shared Responsibility Model is designed to clarify the roles and responsibilities of Snowplow and its customers in managing and securing the Snowplow Private SaaS Managed Service.
Should you have any questions or require further clarification on any points within this document, please do not hesitate to contact Snowplow support. We are here to assist you in leveraging the full potential of your data with Snowplow.
