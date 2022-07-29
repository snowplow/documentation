---
title: "Quick Start Installation Guide on GCP"
date: "2021-09-21"
sidebar_position: 100
---

This guide will take you through how to spin up an open source pipeline using the [Snowplow terraform modules](https://registry.terraform.io/namespaces/snowplow-devops). _Learn more about [Infrastructure as code with Terraform](https://learn.hashicorp.com/tutorials/terraform/infrastructure-as-code?in=terraform/aws-get-started) here._

### Before you begin

Sign up on [discourse](https://discourse.snowplowanalytics.com/)! If you run into any problems or have any questions, we are here to help.

If you are interested in receiving the latest updates from Product & Engineering, such as critical bug fixes, security updates, new features and the rest, then [join our mailing list](https://go.snowplowanalytics.com/get-snowplow-technology-updates).

You can find more details on the infrastructure and applications that [will be deployed in your cloud here](/docs/migrated/open-source-quick-start/quick-start-installation-guide-on-gcp/summary-of-what-you-have-deployed-gcp/).

### Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
- A Google cloud service account
    - See [details on using the service account with the Cloud SDK](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable)
    - You will need to:
        - Navigate to your service account on Google Cloud Console
        - Create a new JSON Key and store locally
        - Create the environment variable by running `export GOOGLE_APPLICATION_CREDENTIALS="KEY PATH"` in terminal
- [Terraform 1.0.0](https://www.terraform.io/downloads.html) or higher installed
    - Follow the instructions to make sure the terraform binary is available on your PATH. You can also use [tfenv](https://github.com/tfutils/tfenv) to help manage Terraform installation
- Download [the latest igluctl](/docs/migrated/pipeline-components-and-applications/iglu/igluctl/) which allows you to publish schemas for your [custom events](/docs/migrated/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/#custom-events) and [entities](/docs/migrated/understanding-tracking-design/predefined-vs-custom-entities/#custom-contexts) to [Iglu (your schema registry)](/docs/migrated/pipeline-components-and-applications/iglu/)
- Clone the repository at [https://github.com/snowplow/quickstart-examples](https://github.com/snowplow/quickstart-examples) to your localhost
    - `git clone https://github.com/snowplow/quickstart-examples.git`

### Select which example you want to use

The Quickstart Examples repository contains two different deployment strategies:

- `default`
- `secure` (Recommended for production use cases)

The main difference is around the [VPC](https://cloud.google.com/vpc/docs/overview) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default network (auto mode VPC](https://cloud.google.com/vpc/docs/vpc#default-network)). However, to increase the security of your components, it is recommended and best practise to deploy components into private subnets. This ensures they are not available publicly. To use the `` `secure` `` configuration you will need your [own custom VPC network](https://cloud.google.com/vpc/docs/vpc#auto-mode-considerations) with public and private subnets. You can follow [this guide](https://cloud.google.com/vpc/docs/using-vpc#creating_networks) for steps on how to create networks and subnetworks on GCP.

### **Setting up your Iglu Server**

The first step is to set up your [Iglu](/docs/migrated/pipeline-components-and-applications/iglu/) Server stack.  This will mean that you can create and evolve your own [custom event & entities](/docs/migrated/understanding-tracking-design/out-of-the-box-vs-custom-events-and-entities/#custom-events). Iglu enables you to store the schemas for your events & entities and fetch them as your events are getting processed by your pipeline. 

We will go into more details on why this is very valuable and how to create your custom events & entities later, but for now you will need to set this up first so that your pipeline (specifically the Enrich application and your Postgres loader) can communicate with Iglu. 

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `/gcp/iglu_server` directory to update the input variables in `terraform.tfvars`.

```
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

**Step 2 (optional): Update telemetry settings**

We want to make this experience as easy & as valuable as possible for open source users new to Snowplow, and so we have added (optional) telemetry. You can find further details on [what we track here](https://github.com/snowplow-devops/terraform-snowplow-telemetry), along with our [telemetry principles](/docs/migrated/open-source-quick-start/what-is-the-quick-start-for-open-source/telemetry-principles/).

- If you wish to subscribe to our mailing list for updates to these modules or security advisories please set the `user_provided_id` variable to include a valid email address which we can reach you at.
    - _Providing a consistent `user_provided_id` across your modules allows us to tie events together across applications so we can get a better understanding of unique users, and the topology of open source pipelines. This helps us to know how we can improve the experience going forward, so we really appreciate it being set!_
- To disable telemetry simply set variable `telemetry_enabled = false`.

**Step 3: Run the terraform script to set up your Iglu stack**

You can now use terraform to create your Iglu Server stack.

```
terraform init
terraform plan
terraform apply
```

This will output your `iglu_server_dns_name`. Make a note of this, you'll need it when setting up your pipeline. If you have attached a custom ssl certificate and set up your own DNS records then you don't need this value.

**Step 4: Seed your Iglu Server from Iglu Central**

For your pipeline to work, you'll need to seed your Iglu Server with the standard Snowplow Schemas that are hosted in Iglu Central. To do this you will need `igluctl`, your Iglu Servers DNS and your Iglu API key that you created for your `terraform.tfvars`. You should update the `igluctl` command below with the correct values for your Iglu Server.

```
git clone https://github.com/snowplow/iglu-central
cd iglu-central
igluctl static push --public schemas/ http://CHANGE-TO-MY-IGLU-URL.elb.amazonaws.com 00000000-0000-0000-0000-000000000000
```

### **Setting up your pipeline**

In this section you will update the input variables for the terraform module, and then run the terraform script to set up your pipeline.  At the end you will have a working Snowplow pipeline.

**Step 1: Update your input variables**

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `pipeline` directory to update the input variables in `terraform.tfvars`.

```
git clone https://github.com/snowplow/quickstart-examples.git
cd quickstart-examples/terraform/gcp/pipeline/default #or secure
nano terraform.tfvars #or other text editor of your choosing
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

**Step 2 (optional): Update telemetry settings**

We want to make this experience as easy & as valuable as possible for open source users new to Snowplow, and so we have added (optional) telemetry. You can find further details on [what we track here](https://github.com/snowplow-devops/terraform-snowplow-telemetry), along with our [telemetry principles](/docs/migrated/open-source-quick-start/what-is-the-quick-start-for-open-source/telemetry-principles/).

- If you wish to subscribe to our mailing list for updates to these modules or security advisories please set the `user_provided_id` variable to include a valid email address which we can reach you at.
    - _Providing a consistent `user_provided_id` across your modules allows us to tie events together across applications so we can get a better understanding of unique users, and the topology of open source pipelines. This helps us to know where to invest our efforts going forward._
- To disable telemetry simply set variable `telemetry_enabled = false`.

**Step 3: Run the terraform script to set up your Pipeline stack**

You can now use terraform to create your Pipeline stack.

```
terraform init
terraform plan
terraform apply
```

This will output your `collector_dns_name`, `db_address`, `db_port` and `db_id`. Make a note of these, you’ll need it when sending events and connecting to your database. If you have attached a custom ssl certificate and set up your own DNS records then you don’t need your `collector_dns_name` as you will use your own DNS record to send events from the Snowplow trackers.

#### **Now let's [send some events](/docs/migrated/open-source-quick-start/quick-start-installation-guide-on-gcp/sending-test-events/) to your pipeline**! >>

* * *

Do you have any feedback for us?

We are really interested in understanding how you are finding the Quick Start and what we can do to better support you in getting started with our open source. If you have a moment, [let us know via this short survey](https://forms.gle/rKEqpFxwTfLjhQzR6).
