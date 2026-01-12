---
title: "Private Managed Cloud on GCP"
sidebar_label: "GCP setup guide"
date: "2020-01-30"
sidebar_position: 30
coverImage: "gcp_logo.png"
description: "Set up Snowplow CDI Private Managed Cloud on GCP with project configuration, IAM roles, and service account permissions."
keywords: ["GCP setup", "Private Managed Cloud", "Google Cloud", "IAM roles", "GCP project"]
---

To set up Snowplow, log in to Snowplow [Console](https://console.snowplowanalytics.com) where you'll be able to follow a step-by-step guide to getting started, including the steps below.

## Setting up your Google project

The following steps explain how to set up your cloud environment ready for your Snowplow pipeline to be installed.

### Create a new project

Please create a new project segregated from anything else you have running in GCP. For the latest documentation on setting up a new project please refer to Google Cloud's documentation [here](https://cloud.google.com/resource-manager/docs/creating-managing-projects).

### Set up required permissions

Please add **techops-cloud-admin@snowplowanalytics.com** to your project. This account will be used to install and maintain your pipeline in GCP. The following roles are required:

- [`editor`](https://cloud.google.com/iam/docs/roles-overview#basic-definitions)
- [`Roles/resourcemanager.projectIamAdmin`](https://cloud.google.com/iam/docs/understanding-roles#resourcemanager.projectIamAdmin)
- [`Roles/errorreporting.admin`](https://cloud.google.com/iam/docs/understanding-roles#errorreporting.admin)
- [`Roles/logging.admin`](https://cloud.google.com/iam/docs/understanding-roles#logging.admin)
- [`Roles/monitoring.admin`](https://cloud.google.com/iam/docs/understanding-roles#monitoring.admin)
- [`Roles/iam.roleAdmin`](https://cloud.google.com/iam/docs/understanding-roles#iam.roleAdmin)
- [`Roles/iam.serviceAccountAdmin`](https://cloud.google.com/iam/docs/understanding-roles#iam.serviceAccountAdmin)
- [`Roles/container.admin`](https://cloud.google.com/iam/docs/roles-permissions/container#container.admin)
- [`Roles/run.admin`](https://cloud.google.com/run/docs/reference/iam/roles#run.admin)
- [`Roles/datastore.owner`](https://docs.cloud.google.com/iam/docs/roles-permissions/firestore#datastore.owner)

The following roles are also required if using [RDB Loader](/docs/api-reference/loaders-storage-targets/snowplow-rdb-loader/index.md) within GCP:

- [`Roles/secretmanager.secretAccessor`](https://cloud.google.com/iam/docs/understanding-roles#secretmanager.secretAccessor)
- [`Roles/secretmanager.secretVersionAdder`](https://cloud.google.com/iam/docs/understanding-roles#secretmanager.secretVersionAdder)

### Enable billing for the project

Please enable billing on the project as failing to do so will prevent the pipeline from being installed. For details on enabling billing for your project, please refer to the GCP documentation for [APIs and billing](https://support.google.com/googleapi/answer/6158867).

### Ensure that the following constraints are turned off

The following is a list of Organizational Policy constraints that we require to be turned off, otherwise we are unable to deploy the pipeline.  For some, more specific configuration would enable the constraint to stay and the pipeline to deploy. This list will be updated as we discover more constraints that are not compatible with the pipeline deployment.

- `constraints/compute.requireShieldedVm`
- `constraints/gcp.resourceLocations`
- `constraints/iam.disableServiceAccountCreation`
- `constraints/iam.disableServiceAccountKeyCreation`
- `constraints/sql.restrictPublicIp`
