---
title: "Setup Snowplow BDP on GCP"
date: "2020-01-30"
sidebar_position: 20
coverImage: "gcp_logo.png"
---

## Request your pipeline through Snowplow BDP Console

Login to Snowplow BDP Console where you'll be able to follow a step-by-step guide to getting started (including the steps below).

## Setting up your Google project

To set up your cloud environment ready for your Snowplow pipeline to be installed:

### Create a new project

Please create a new project segregated from anything else you have running in GCP. For the latest documentation on setting up a new project please refer to Google Cloud's documentation [here](https://cloud.google.com/resource-manager/docs/creating-managing-projects).

### Set up required permissions

Please add **techops-cloud-admin@snowplowanalytics.com** to your project with the following roles:

- `editor`
- `Roles/resourcemanager.projectIamAdmin`
- `Roles/errorreporting.admin`
- `Roles/logging.admin`
- `Roles/monitoring.admin`
- `Roles/iam.roleAdmin`
- `Roles/iam.serviceAccountAdmin`

### Enable billing for the project

Please enable billing on the project as failing to do so will prevent the pipeline from being installed.
