---
title: "Quick start on AWS"
date: "2021-07-08"
sidebar_position: 2
---

This guide will take you through how to spin up an open source pipeline using the [Snowplow terraform modules](https://registry.terraform.io/namespaces/snowplow-devops).

_Learn more about [Infrastructure as code with Terraform](https://learn.hashicorp.com/tutorials/terraform/infrastructure-as-code?in=terraform/aws-get-started) here._

### Prerequisites

- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) version 2 installed
    - [Configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) against a role that has the AdminstratorAccess policy attached
        - AdminstratorAccess allows all actions on all AWS services and shouldn't be used in production
- [Terraform 1.0.0](https://www.terraform.io/downloads.html) or higher installed
    - Follow the instructions to make sure the `terraform` binary is available on your `PATH`. You can also use [tfenv](https://github.com/tfutils/tfenv) to help manage your Terraform installation
- Download [the latest igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md) which allows you to publish schemas for your [custom events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities) to [Iglu (your schema registry)](/docs/pipeline-components-and-applications/iglu/index.md)
- Clone the repository at [https://github.com/snowplow/quickstart-examples](https://github.com/snowplow/quickstart-examples) to your localhost
    - `git clone https://github.com/snowplow/quickstart-examples.git`

Details on how to configure the AWS Terraform Provider can be [found on the registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables).

### Select which example you want to use

The Quickstart Examples repository contains two different deployment strategies:

- `default`
- `secure` (Recommended for production use cases)

The main difference is around the [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default VPC](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc). However, to increase the security of your components, it is recommended and best practice to deploy components into private subnets. This ensures they are not available publicly. To use the `` `secure` `` configuration you will need [your own VPC with public and private subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). You can follow [this guide](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html) for steps on how to create VPCs and subnets on AWS.

:::note

If opting for the `secure` deployment, you must ensure your private subnet layer has full access to the internet via one of NAT Gateways, NAT Instances or a Transit Gateway.  Without internet access the deployment will fail.

:::

#### Storage Options

There are four different storage options for you to select: Postgres, Redshift, Snowflake, Databricks. The steps below will guide you through how to set each option up. We recommend to only load data into a single destination, but nothing prevents you from loading into multiple destinations with the same pipeline (e.g. for testing purposes).

### Setting up your Iglu Server

The first step is to set up your [Iglu](/docs/pipeline-components-and-applications/iglu/index.md) Server stack.  This will mean that you can create and evolve your own [custom events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities). Iglu enables you to store the schemas for your events & entities and fetch them as your events are processed by your pipeline.

We will go into more details on why this is very valuable and how to create your custom events & entities later, but for now you will need to set this up first so that your pipeline (specifically the Enrich application and your loader) can communicate with Iglu.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `iglu_server` directory to update the input variables in `terraform.tfvars`.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/aws/iglu_server/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- A UUIDv4 for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- The default VPC you will deploy your Iglu Server into. [Help](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc).
- How to generate a SSH Key.
    - On most systems you can generate a SSH Key with: `ssh-keygen -t rsa -b 4096`
    - This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`
    - You can get the value with `cat ~/.ssh/id_rsa.pub`

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="each of the Quick Start Terraform modules" idSetting="user_provided_id" enableSetting="telemetry_enabled" settingWord="variable" />
```

**Step 2: Run the terraform script to set up your Iglu stack**

You can now use terraform to create your Iglu Server stack. You will be asked to select a region, you can find more information about [available regions here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).

```bash
terraform init
terraform plan
terraform apply
```

The deployment will **take roughly 15 minutes** and once done will output your `iglu_server_dns_name`. Make a note of this, you'll need it when setting up your pipeline. If you have attached a custom SSL certificate and set up your own DNS records, then you don't need this value.

**Step 3 (optional): Add your schemas to Iglu Server**

You can skip this step for now, however if you want to track custom events using Snowplow, you'll need to add the schemas for your events to your Iglu Server.

To do this you will need `igluctl`, your Iglu Servers DNS and your Iglu API key that you created for your `terraform.tfvars`. You should update the `igluctl` command below with the correct values for your Iglu Server (assuming your schemas are in a `schemas/` folder local to where you're running `igluctl`)

```bash
igluctl static push --public schemas/ http://${iglu_server_dns_name} 00000000-0000-0000-0000-000000000000
```

### Setting up your Pipeline

In this section you will update the input variables for the terraform module, and then run the terraform script to set up your pipeline. At the end you will have a working Snowplow pipeline that you can send your web, mobile or server side data to.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `pipeline` directory to update the input variables in `terraform.tfvars`.  There are a lot of options which we will explain in greater detail in the following sections.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/aws/pipeline/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- Your Iglu Servers DNS from [Setting up your Iglu Server.](#iglu-setup)
- Your UUIDv4 for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- The default VPC you will deploy your Pipeline into. [Help](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc).
- (optional) An SSL certificate so that your collector can receive HTTPS traffic on a domain you own. You can create one using [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/). Once you have done that, add the certificate in the `ssl_certificate_arn` variable.
- How to generate an SSH Key.
    - On most systems you can generate a SSH Key with: `ssh-keygen -t rsa -b 4096`
    - This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`
    - You can get the value with `cat ~/.ssh/id_rsa.pub`

As mentioned above, there are several options for the pipeline's destination database. These are Postgres, Snowflake, Redshift and Databricks. For each destination there is a dedicated block of variables that will need to be filled and the `<destination>_enabled` variable set to `true`.

##### Postgres

If you choose Postgres as destination, there are no additional steps. Respective variables (starting with `postgres_`) need to be filled according to the desired setup. Necessary resources like a PostgreSQL RDS instance, database, table, user will be created by the Terraform modules.

:::caution

We strongly recommend to:
1. Update the `postgres_db_password` to a new value that _only you_ know
2. Set the `postgres_db_ip_allowlist` to a list of CIDR addresses that will need to access the database - this can be systems like BI Tools, or your local IP address so you can query the database from your laptop

:::

##### Snowflake, Redshift & Databricks

If you choose Snowflake, Redshift or Databricks as a destination, there is one more step. Pipeline Terraform module doesn't create the necessary resources for these destinations. Unlike with Postgres, it only deploys the loader itself. Therefore destination resources need to be created *before* deploying the pipeline.

The setup instructions for each destination can be found on the loader module page:

* Snowflake: https://github.com/snowplow-devops/terraform-aws-snowflake-loader-ec2#usage
* Databricks: https://github.com/snowplow-devops/terraform-aws-databricks-loader-ec2#usage
* Redshift: https://github.com/snowplow-devops/terraform-aws-redshift-loader-ec2#usage

Take note of all of the inputs/outputs produced as you will need them to flesh out the `<destination>_*` variables in the `terraform.tfvars` file.

**Step 2: Run the terraform script to set up your Pipeline stack**

You can now use terraform to create your Pipeline stack. You will be asked to select a region, you can find more information about [available regions here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).

```bash
terraform init
terraform plan
terraform apply
```

This will output your `collector_dns_name`, `postgres_db_address`, `postgres_db_port` and `postgres_db_id`. Make a note of these, you'll need it when sending events and connecting to your database.

:::tip

You only need the `postgres_...` outputs if you picked Postgres as a destination. Otherwise, they will be empty and you can ignore them.

:::

If you have attached a custom ssl certificate and set up your own DNS records, then you don't need your `collector_dns_name` as you will use your own DNS record to send events from the Snowplow trackers.

:::note Terraform errors

For solutions to some common Terraform errors that you might encounter when running `terraform plan` or `terraform apply`, see the [FAQs section](/docs/getting-started-on-snowplow-open-source/faq/index.md#troubleshooting-terraform-errors).

:::

Now it’s time to [send your first events to your pipeline](/docs/first-steps/tracking/index.md)!
