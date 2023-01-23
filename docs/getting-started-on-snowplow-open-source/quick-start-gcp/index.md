---
title: "Quick Start on GCP"
date: "2021-09-21"
sidebar_position: 3
---

This guide will take you through how to spin up an open source pipeline using the [Snowplow terraform modules](https://registry.terraform.io/namespaces/snowplow-devops). _Learn more about [Infrastructure as code with Terraform](https://learn.hashicorp.com/tutorials/terraform/infrastructure-as-code?in=terraform/aws-get-started) here._

### Before you begin

Sign up on [discourse](https://discourse.snowplow.io/)! If you run into any problems or have any questions, we are here to help.

If you are interested in receiving the latest updates from Product & Engineering, such as critical bug fixes, security updates, new features and the rest, then [join our mailing list](https://go.snowplowanalytics.com/get-snowplow-technology-updates).

You can find more details on the infrastructure and applications that [will be deployed in your cloud here](/docs/getting-started-on-snowplow-open-source/quick-start-gcp/summary-of-what-you-have-deployed/index.md).

```mdx-code-block
import PocketEdition from "@site/docs/reusable/pocket-edition-pitch/_index.md"

<PocketEdition/>
```

### Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
- The following APIs active in your GCP account (*note*: this list might not be exhaustive and is subject to change as GCP APIs evolve):
    - [Compute Engine API](https://console.cloud.google.com/apis/api/compute.googleapis.com)
    - [Cloud Resource Manager API](https://console.cloud.google.com/apis/api/cloudresourcemanager.googleapis.com)
    - [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/api/iam.googleapis.com)
    - [Cloud Pub/Sub API](https://console.cloud.google.com/apis/api/pubsub.googleapis.com)
    - [Cloud SQL Admin API](https://console.cloud.google.com/apis/api/sqladmin.googleapis.com)
- A Google cloud service account
    - See [details on using the service account with the Cloud SDK](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable)
    - You will need to:
        - Navigate to your service account on Google Cloud Console
        - Create a new JSON Key and store locally
        - Create the environment variable by running `export GOOGLE_APPLICATION_CREDENTIALS="KEY PATH"` in terminal
- [Terraform 1.0.0](https://www.terraform.io/downloads.html) or higher installed
    - Follow the instructions to make sure the terraform binary is available on your PATH. You can also use [tfenv](https://github.com/tfutils/tfenv) to help manage Terraform installation
- Download [the latest igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md) which allows you to publish schemas for your [custom events](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md#custom-events) and [entities](/docs/understanding-tracking-design/predefined-vs-custom-entities/index.md#custom-contexts) to [Iglu (your schema registry)](/docs/pipeline-components-and-applications/iglu/index.md)
- Clone the repository at [https://github.com/snowplow/quickstart-examples](https://github.com/snowplow/quickstart-examples) to your localhost
    - `git clone https://github.com/snowplow/quickstart-examples.git`

### Select which example you want to use

The Quickstart Examples repository contains two different deployment strategies:

- `default`
- `secure` (Recommended for production use cases)

The main difference is around the [VPC](https://cloud.google.com/vpc/docs/overview) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default network (auto mode VPC](https://cloud.google.com/vpc/docs/vpc#default-network)). However, to increase the security of your components, it is recommended and best practise to deploy components into private subnets. This ensures they are not available publicly. To use the `` `secure` `` configuration you will need your [own custom VPC network](https://cloud.google.com/vpc/docs/vpc#auto-mode-considerations) with public and private subnets. You can follow [this guide](https://cloud.google.com/vpc/docs/using-vpc#creating_networks) for steps on how to create networks and subnetworks on GCP.

### Setting up your Iglu Server

The first step is to set up your [Iglu](/docs/pipeline-components-and-applications/iglu/index.md) Server stack.  This will mean that you can create and evolve your own [custom event & entities](/docs/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/index.md#custom-events). Iglu enables you to store the schemas for your events & entities and fetch them as your events are getting processed by your pipeline. 

We will go into more details on why this is very valuable and how to create your custom events & entities later, but for now you will need to set this up first so that your pipeline (specifically the Enrich application and your loader) can communicate with Iglu. 

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `/gcp/iglu_server` directory to update the input variables in `terraform.tfvars`.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/gcp/iglu_server/default #or secure
nano terraform.tfvars #or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- A UUID for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- If you have opted for `secure`, the network and subnetworks you will deploy your Iglu Server into.
    - If you are deploying to your default network then set `network = default` and leave subnetworks empty
- How to generate a SSH Key.
    - On most systems you can generate a SSH Key with: `ssh-keygen -t rsa -b 4096`
    - This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`
    - You can get the value with `cat ~/.ssh/id_rsa.pub`

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="each of the Quick Start Terraform modules" idSetting="user_provided_id" enableSetting="telemetry_enabled" settingWord="variable" />
```

**Step 2: Run the terraform script to set up your Iglu stack**

You can now use terraform to create your Iglu Server stack.

```bash
terraform init
terraform plan
terraform apply
```

This will output your `iglu_server_dns_name`. Make a note of this, you'll need it when setting up your pipeline. If you have attached a custom ssl certificate and set up your own DNS records then you don't need this value.

**Step 3: Seed your Iglu Server from Iglu Central**

For your pipeline to work, you'll need to seed your Iglu Server with the standard Snowplow Schemas that are hosted in Iglu Central. To do this you will need `igluctl`, your Iglu Servers DNS and your Iglu API key that you created for your `terraform.tfvars`. You should update the `igluctl` command below with the correct values for your Iglu Server.

```bash
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://CHANGE-TO-MY-IGLU-IP 00000000-0000-0000-0000-000000000000
```

### Setting up your pipeline

In this section you will update the input variables for the terraform module, and then run the terraform script to set up your pipeline. At the end you will have a working Snowplow pipeline that you can send your web, mobile or server side data to.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `pipeline` directory to update the input variables in either `postgres.terraform.tfvars` or `bigquery.terraform.tfvars` according to the chosen destination. How to choose the destination and configure it will be explained in detail in the next section.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/gcp/pipeline/default #or secure
nano <destination>.terraform.tfvars #or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- Your Iglu Servers DNS from [Setting up your Iglu Server.](#iglu-setup)
- Your UUID for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- If you have opted for `secure`, the network and subnetworks you will deploy your Iglu Server into.
    - If you are deploying to your default network then set `network = default` and leave subnetworks empty.
- How to generate a SSH Key.
    - On most systems you can generate a SSH Key with: `ssh-keygen -t rsa -b 4096`
    - This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`
    - You can get the value with `cat ~/.ssh/id_rsa.pub`

As mentioned above, there are two options for pipeline's destination database. These are Postgres and BigQuery. Your chosen database needs to be specified with the `postgres_db_enabled` or `bigquery_db_enabled` variables. Respective `<destination>.terraform.tfvars` file should be filled in according to the chosen database. Only database specific variables are different in those two tfvars files.

##### Postgres

If you choose Postgres as destination, there is no additional step. Respective variables need to be filled according to the desired setup. Necessary resources like Postgres instance, database, table, user will be created by Pipeline Terraform module.

##### BigQuery

If you choose BigQuery as destination, there is no additional step nor additional variables that need to be setup.

**Step 2: Run the terraform script to set up your Pipeline stack**

You can now use terraform to create your Pipeline stack.

```bash
terraform init
terraform plan -var-file=<destination>.terraform.tfvars
terraform apply -var-file=<destination>.terraform.tfvars
```

This will output your `collector_dns_name`, `db_address`, `db_port`, `bigquery_db_dataset_id`, `bq_loader_dead_letter_bucket_name` and `bq_loader_bad_rows_topic_name`. Depending on your destination some of these outputs will be empty. Make a note of these, you’ll need it when sending events and connecting to your database. If you have attached a custom ssl certificate and set up your own DNS records then you don’t need your `collector_dns_name` as you will use your own DNS record to send events from the Snowplow trackers.

Now let's [send some events](/docs/getting-started-on-snowplow-open-source/quick-start-gcp/sending-test-events/index.md) to your pipeline!
