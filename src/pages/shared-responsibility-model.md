# Snowplow CDI: shared responsibility model

## Introduction

This document describes how responsibilities are divided between Snowplow and its customers for the two Snowplow-managed deployments of Snowplow CDI:

* **Snowplow CDI Cloud**: Snowplow runs the pipeline in cloud accounts that Snowplow owns.
* **Snowplow CDI Private Managed Cloud**: Snowplow deploys and runs the pipeline in an AWS sub-account, Azure subscription, or GCP project that you own.

In both deployments, Snowplow operates the pipeline and Console. You own your tracking, your destinations, and the data in them. In Private Managed Cloud, you also own the cloud account that hosts the pipeline, which adds the responsibilities listed in [Additional responsibilities for Private Managed Cloud](#additional-responsibilities-for-private-managed-cloud).

Understanding this division is critical for keeping your data secure and your pipeline running without interruption.

## Summary

The table below summarizes who is responsible for each area.

| Area | Snowplow CDI Cloud | Private Managed Cloud |
| --- | --- | --- |
| Pipeline infrastructure: deployment, scaling, monitoring, and upgrades | Snowplow | Snowplow |
| Console | Snowplow | Snowplow |
| Cloud account hosting the pipeline, including billing, access, and audit controls | Snowplow | You |
| Tracking implementation, schemas, and data quality | You | You |
| Console users and API keys | You | You |
| Custom domains, DNS records, and any CDN or WAF in front of the Collector | You | You |
| Warehouses, lakes, and event forwarding destinations: setup, access, and credentials | You | You |
| Data in your destinations | You | You |
| Git repositories connected to Snowplow | You | You |
| Storage buckets and streams in the pipeline cloud account | Snowplow | Shared: you manage access and lifecycle policies, Snowplow manages its own policies |

## Your responsibilities in all deployments

These responsibilities apply to both Snowplow CDI Cloud and Private Managed Cloud.

### Implementing and maintaining tracking

You are responsible for implementing trackers in your applications, keeping tracker versions up to date, and designing the events, entities, schemas, and tracking plans that describe your data. Snowplow validates events against your schemas, but you are responsible for reviewing failed events and fixing the tracking or schemas that cause them.

### Deciding what data to collect

You decide which data your trackers send and which enrichments to enable. You are responsible for making sure that collection and processing comply with the privacy and consent requirements that apply to your users, for example by not sending personal data you don't need, or by enabling the PII pseudonymization enrichment.

### Managing Console access

You are responsible for managing who can access your organization in Console, including inviting and removing users, assigning permissions, and creating, rotating, and revoking API keys.

### Configuring custom domains, CDN, and WAF layers

If you use a custom domain for your Collector, you must create the DNS records that Snowplow generates and keep them in place. Removing or changing these records interrupts data collection.

If you use a Content Delivery Network (CDN) or a Web Application Firewall (WAF) in front of Snowplow-managed endpoints, you must ensure these are correctly configured and remain accessible. This involves regularly testing and updating configurations as necessary to avoid disruptions in data collection.

### Preparing destinations to accept connections from Snowplow

You are responsible for provisioning the warehouses, lakes, and event forwarding destinations that Snowplow loads or sends data to, and for keeping them able to accept connections from Snowplow. This includes:

* Creating the databases, schemas, storage locations, users, and roles that Snowplow needs, with the required permissions
* Allowing connections from Snowplow IP addresses through network policies and firewalls
* Keeping credentials, keys, and API tokens valid, and updating them in Console when you rotate them
* Keeping the destination account active, with valid billing and enough capacity to accept the data

If a destination stops accepting connections, Snowplow can't load or forward data to it until you resolve the issue.

### Managing the data in your destinations

Once Snowplow has loaded or forwarded data to a destination, you are responsible for that data. This includes access control, retention, backups, deletion requests from your users, and the cost of storage and compute in the destination, including the compute used by data models that Snowplow runs in your warehouse.

### Maintaining connected Git repositories

If you connect Git repositories to Snowplow, for example to run dbt data models from Console or to manage your tracking design as code, you are responsible for those repositories. This includes keeping Snowplow's read access in place, maintaining the code and configuration they contain, and reviewing changes before they are merged. Snowplow runs the code or applies the configuration as it appears in the repository.

## Snowplow responsibilities

Snowplow provides and operates the platform. The responsibilities below differ only in where the infrastructure runs.

### Deploying and maintaining the pipeline infrastructure and components

The Snowplow team sets up, manages, scales, and upgrades your Snowplow pipeline:

* **Snowplow CDI Cloud**: in cloud accounts that Snowplow owns. Snowplow is responsible for the cloud accounts themselves, including their security, access controls, and cloud provider costs.
* **Private Managed Cloud**: in your own AWS, Azure, or GCP account. Snowplow also works with you to optimize your AWS, Azure, or GCP costs once you have a good understanding of your traffic volume and patterns.

### Keeping pipelines and infrastructure up to date

Snowplow updates your pipeline components to the latest available versions as soon as possible. Snowplow also regularly upgrades the managed infrastructure, including libraries, operating systems, and cloud managed service versions.

### Operating Console

Snowplow hosts and operates Console, which you use to configure your pipeline, destinations, data structures, and other Snowplow features in both deployments.

## Additional responsibilities for Private Managed Cloud

In Private Managed Cloud, the pipeline runs in a cloud account that you own, so you take on these additional responsibilities. They don't apply to Snowplow CDI Cloud.

### Ensuring Snowplow's cloud access remains in place

You must provide and maintain the necessary cloud access permissions for Snowplow to deploy and manage the infrastructure in your cloud account. This involves setting up and regularly verifying the integrity of cloud access roles and permissions to ensure uninterrupted service. Due to the nature of the deployment model, a loss of access can immediately impact the availability of your infrastructure.

### Monitoring cloud account alerts

While Snowplow looks after all deployed infrastructure, Snowplow doesn't receive all alerts sent to the AWS sub-account, Azure subscription, or GCP project. These are generally routed to the owner of the cloud account. Forward anything relating to Snowplow to Snowplow Support so that it can be triaged.

### Maintaining valid billing with the cloud provider

You must ensure that your billing information is up to date and valid with your cloud provider. This includes monitoring your billing status and resolving any issues promptly to avoid service interruptions. Snowplow doesn't have insight into cloud billing and can't resolve issues related to it.

### Coordinating cloud provider support

At times, you may need to use your AWS, GCP, or Azure support package to escalate issues and investigations with cloud-provided managed services. When possible, name Snowplow as a support contact for the specific sub-account, project, or subscription to allow direct access to your cloud support tier.

### Maintaining audit controls within the cloud account

You are responsible for implementing and managing audit controls to monitor activities and changes within your cloud account, including setting up logging and monitoring services such as AWS CloudTrail, Azure Audit Logs, or GCP Cloud Audit Logs.

### Creating IAM permissions boundaries

For AWS customers who intend to implement IAM permissions boundaries, you are responsible for creating and maintaining these boundaries. Snowplow deploys infrastructure with the ARN you provide.

### Setting up GCP service account impersonation

For GCP customers who intend to use service account impersonation, you are responsible for creating the service account. Once you have done so and assigned the necessary roles, add the group `techops-cloud-admin@snowplowanalytics.com` to the service account with the `iam.serviceAccountTokenCreator` role.

### Managing access to cloud storage

You manage access to data within S3 (AWS), AFS (Azure), and GCS (GCP). You can do this by creating roles within the shared AWS sub-account, Azure subscription, or GCP project, or by applying custom access policies to the buckets directly. Don't alter or remove any policies that Snowplow sets on the buckets. You are also responsible for creating any lifecycle policies you need.

### Coordinating with Snowplow on custom consumers

For AWS customers, if you choose to implement your own consumers on Snowplow-managed Kinesis streams, coordinate with Snowplow first to ensure the streams are scaled properly to prevent service disruptions.

## Questions

If you have any questions about this document, contact Snowplow Support.
