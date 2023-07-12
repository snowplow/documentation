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
    - Follow the instructions to make sure the terraform binary is available on your PATH. You can also use [tfenv](https://github.com/tfutils/tfenv) to help manage Terraform installation
- Download [the latest igluctl](/docs/pipeline-components-and-applications/iglu/igluctl-2/index.md) which allows you to publish schemas for your [custom events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities) to [Iglu (your schema registry)](/docs/pipeline-components-and-applications/iglu/index.md)
- Clone the repository at [https://github.com/snowplow/quickstart-examples](https://github.com/snowplow/quickstart-examples) to your localhost
    - `git clone https://github.com/snowplow/quickstart-examples.git`

### Select which example you want to use

The Quickstart Examples repository contains two different deployment strategies:

- `default`
- `secure` (Recommended for production use cases)

The main difference is around the [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default VPC](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc). However, to increase the security of your components, it is recommended and best practice to deploy components into private subnets. This ensures they are not available publicly. To use the `` `secure` `` configuration you will need [your own VPC with public and private subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). You can follow [this guide](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html) for steps on how to create VPCs and subnets on AWS.

#### Storage Options

There are also two different storage options for you to select. The steps below will guide you through how to set each up, however you will need to know if you wish to use `postgres` or if you have an external `snowflake` instance you wish to use.

### Setting up your Iglu Server

The first step is to set up your [Iglu](/docs/pipeline-components-and-applications/iglu/index.md) Server stack.  This will mean that you can create and evolve your own [custom events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities). Iglu enables you to store the schemas for your events & entities and fetch them as your events are getting processed by your pipeline.

We will go into more details on why this is very valuable and how to create your custom events & entities later, but for now you will need to set this up first so that your pipeline (specifically the Enrich application and your loader) can communicate with Iglu.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `iglu_server` directory to update the input variables in `terraform.tfvars`.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/aws/iglu_server/default #or secure
nano terraform.tfvars #or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- A UUID for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
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

This will output your `iglu_server_dns_name`. Make a note of this, you'll need it when setting up your pipeline. If you have attached a custom ssl certificate and set up your own DNS records then you don't need this value.

**Step 3 (optional): Add your schemas to Iglu Server**

You can skip this step for now, however if you want to track custom events using Snowplow, you'll need to add the schemas for your events to your Iglu Server.

To do this you will need `igluctl`, your Iglu Servers DNS and your Iglu API key that you created for your `terraform.tfvars`. You should update the `igluctl` command below with the correct values for your Iglu Server (assuming your schemas are in a `schemas/` folder local to where you're running `icluctl`)

```bash
igluctl static push --public schemas/ http://CHANGE-TO-MY-IGLU-URL.elb.amazonaws.com 00000000-0000-0000-0000-000000000000
```

### Setting up your pipeline

In this section you will update the input variables for the terraform module, and then run the terraform script to set up your pipeline. At the end you will have a working Snowplow pipeline that you can send your web, mobile or server side data to.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `pipeline` directory to update the input variables in either `postgres.terraform.tfvars` or `snowflake.terraform.tfvars` according to the chosen destination. How to choose the destination and configure it will be explained in detail in the next section.

```bash
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/aws/pipeline/default #or secure
nano <destination>.terraform.tfvars #or other text editor of your choosing
```

To update your input variables, you'll need to know a couple of things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- Your Iglu Servers DNS from [Setting up your Iglu Server.](#iglu-setup)
- Your UUID for your Iglu Servers API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- The default VPC you will deploy your Pipeline into. [Help](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc).
- An SSL certificate so that your collector can receive HTTPS traffic on a domain you own. You can create one using [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/). Once you have done that, add the certificate in the `ssl_certificate_arn` variable.
- How to generate a SSH Key.
    - On most systems you can generate a SSH Key with: `ssh-keygen -t rsa -b 4096`
    - This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`
    - You can get the value with `cat ~/.ssh/id_rsa.pub`

As mentioned above, there are two options for pipeline's destination database. These are Postgres and Snowflake. Your chosen database needs to be specified with `pipeline_db` variable. Allowed values for that variable are `postgres` and `snowflake`. Respective `<destination>.terraform.tfvars` file should be filled in according to the chosen database. Only database specific variables are different in those two tfvars files.

##### Postgres

If you choose Postgres as destination, there is no additional step. Respective variables need to be filled according to the desired setup. Necessary resources like Postgres instance, database, table, user will be created by Pipeline Terraform module.

##### Snowflake

If you choose Snowflake as destination, there is one more additional step. Pipeline Terraform module doesn't create necessary Snowflake resources, unlike Postgres resources. It only deploys the Snowflake Loader. Therefore Snowflake resources need to be created before deploying the pipeline. We've created [another Terraform module](https://github.com/snowplow/quickstart-examples/tree/snowflake-loader/terraform/aws/snowflake) for this purpose. You can follow the Optional Step 2 below to learn how to use Snowflake Terraform module. Snowflake Terraform module will give outputs after it is applied. These outputs need to be passed to `snowflake.terraform.tfvars`.

**Step 2 (Snowflake only): Run Snowflake terraform module**

It is possible to use Snowflake as the destination in AWS pipelines. However necessary resources need to be created in Snowflake before starting the pipeline.

For this purpose, the [Snowflake Terraform module](https://github.com/snowplow/quickstart-examples/tree/main/terraform/aws/snowflake) has been created. This module creates resources including, but not limited to, Snowflake database, table, user, and role. These resources are needed by the Snowflake Loader to operate correctly.

#### Prerequisites

Authentication for the service user is required for the Snowflake Terraform provider - [follow this tutorial](https://quickstarts.snowflake.com/guide/terraforming_snowflake/index.html) to obtain Snowflake connection details:

| Parameter          | Description                                    |
|--------------------|------------------------------------------------|
| account            | The account name.                              |
| username           | A snowflake user to perform resource creation. |
| region             | Region for the snowflake deployment.           |
| role               | Needs to be ACCOUNTADMIN or similar.           |
| private_key_path | Path the private key.                          |

#### Usage

1. Fill variables in [terraform.tfvars](https://github.com/snowplow/quickstart-examples/blob/main/terraform/aws/snowflake/terraform.tfvars) within the `aws/snowflake` folder. Snowflake connection details found in the [Prerequisites](#Prerequisites) section need to be assigned to respective variables in `terraform.tfvars`.
2. Run `terraform init`
3. Run `terraform apply`

#### Output

Snowflake Terraform module will output the name of the created resources. Full list can be found [here](https://github.com/snowplow/quickstart-examples/blob/snowflake-loader/terraform/aws/snowflake/outputs.tf).

These output values need to be passed to `aws/pipeline` modules as a variable when Snowflake is selected as pipeline's destination.

**Step 3: Run the terraform script to set up your Pipeline stack**

You can now use terraform to create your Pipeline stack. You will be asked to select a region, you can find more information about [available regions here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).

```bash
terraform init
terraform plan -var-file=<destination>.terraform.tfvars
terraform apply -var-file=<destination>.terraform.tfvars
```

This will output your `collector_dns_name`, `db_address`, `db_port` and `db_id`. Make a note of these, you'll need it when sending events and connecting to your database. If you have attached a custom ssl certificate and set up your own DNS records then you don't need your `collector_dns_name` as you will use your own DNS record to send events from the Snowplow trackers.

:::note Terraform errors

For solutions to some common Terraform errors that you might encounter when running `terraform plan` or `terraform apply`, see the [FAQs section](/docs/getting-started-on-snowplow-open-source/faq/index.md#troubleshooting-terraform-errors).

:::

Now it’s time to [send your first events to your pipeline](/docs/getting-started-on-snowplow-open-source/quick-start-aws/send-test-events-to-your-pipeline/index.md)!
