---
title: "Setup Snowplow Open Source on GCP"
date: "2020-02-25"
sidebar_position: 20
---

Quick Start

We have built a set of [terraform](https://registry.terraform.io/namespaces/snowplow-devops) modules, which automates the setting up & deployment of the required infrastructure & applications for an operational Snowplow open source pipeline, with just a handful of input variables required on your side. 

[Quick Start Installation Guide on GCP](/docs/migrated/open-source-quick-start/quick-start-installation-guide-on-gcp/)

Setup Snowplow on GCP as per the following steps:

1. Follow the setup guide below
2. Setup the Snowplow collector
3. Setup one or more sources (trackers or webhooks)
4. Setup validation and enrich
5. Setup the BigQuery Loader, to stream your data into BigQuery

### Creating a new project

To get started with Google Cloud, first go to [https://console.cloud.google.com/cloud-resource-manager](https://console.cloud.google.com/cloud-resource-manager) and create a new project.

### Enabling Billing and appropriate APIs and services

- Once you've created your project, you have to enable all the services your project requires.
- For instance, if you need a Google Compute instance (equivalent to an AWS EC2 instance), you'd want to make sure Google Compute Engine API is enabled.
- To enable/disable APIs, and check your API usage, go to [https://console.cloud.google.com/apis/dashboard](https://console.cloud.google.com/apis/dashboard)

| Service/API needed | Who needs it |
| --- | --- |
| Google Compute Engine | Scala Stream Collector / Stream Enrich |
| Google Cloud Pub/Sub | Scala Stream Collector / Stream Enrich |

- Some services require Billing to be enabled. To enable and manage your billing accounts, go to [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing). A pop-up will show, asking you to select the billing account with which to associate your project. If it doesn't, Billing was enabled by default when you created your project, probably because you have only one active billing account.

### Installing Google Cloud SDK locally

Google provides a second way for you to interact with its services: the Google Cloud SDK. It allows you to issue a large number of commands to, for example, create Compute instances, publish and subscribe to PubSub topics, create BigQuery tables, authenticate, among others.

- Google Compute instances come with the Cloud SDK pre-installed.
- If you intend to run some part of your project locally, you'll need to download and install the appropriate [Cloud SDK package](https://cloud.google.com/sdk/) for your platform.

### Setting up Authentication and Credentials

- Go to [the credentials section of the API manager](https://console.cloud.google.com/apis/credentials).
- Make sure your project is selected (in the dropdown menu to the left of the search bar).
- Here you can manage the credentials for the different roles/accounts associated with your project. For instance, you wouldn't want to authenticate with your personal account on a Compute Instance to which multilple people have access. In that case, it is recommended to use a service account.
- Compute Instances come with a default service account, but you can create more, with different privileges and different purposes.

On this page, you can create credentials for your existing accounts. If you don't have a service account:

- Click on Create Credentials > Service account key, then on the service account dropdown selector, pick "New service account".
- Fill in the Service account name and ID, and pick its role.
- Finally, click Create. This will download a JSON file with the credentials. This is the only occasion in which this file can be downloaded, so save it carefully. You'll need to place this file wherever you need this service account to be able to authenticate.

You can also use the SDK to authenticate (if you want to authenticate with your personal account), doing:

```
$ gcloud auth login
```

If you have multiple projects, this will default to the most recent one you worked on. If you need to change the current project, do:

```
$ gcloud config set project YOUR_PROJECT_ID
```

Every gcloud command can be appended with '--help' for more info. For more detailed information on Service Accounts:

[https://developers.google.com/identity/protocols/OAuth2ServiceAccount](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)
