---
title: "Quick start guide"
sidebar_position: 2
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

This guide will take you through how to spin up an open source pipeline using the [Snowplow Terraform modules](https://registry.terraform.io/namespaces/snowplow-devops).

:::tip

Learn more about [Infrastructure as code with Terraform](https://learn.hashicorp.com/tutorials/terraform/infrastructure-as-code?in=terraform/aws-get-started).

:::

## Prerequisites

Install [Terraform 1.0.0](https://www.terraform.io/downloads.html) or higher. Follow the instructions to make sure the `terraform` binary is available on your `PATH`. You can also use [tfenv](https://github.com/tfutils/tfenv) to manage your Terraform installation.

Clone the repository at [https://github.com/snowplow/quickstart-examples](https://github.com/snowplow/quickstart-examples) to your machine:

```bash
git clone https://github.com/snowplow/quickstart-examples.git
```

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) version 2.

[Configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) the CLI against a role that has the `AdminstratorAccess` policy attached.

:::caution

`AdminstratorAccess` allows all actions on all AWS services and shouldn't be used in production

:::

Details on how to configure the AWS Terraform Provider can be found [on the registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#environment-variables).

  </TabItem>
  <TabItem value="gcp" label="GCP">

Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

Make sure the following APIs are active in your GCP account (this list might not be exhaustive and is subject to change as GCP APIs evolve):
- [Compute Engine API](https://console.cloud.google.com/apis/api/compute.googleapis.com)
- [Cloud Resource Manager API](https://console.cloud.google.com/apis/api/cloudresourcemanager.googleapis.com)
- [Identity and Access Management (IAM) API](https://console.cloud.google.com/apis/api/iam.googleapis.com)
- [Cloud Pub/Sub API](https://console.cloud.google.com/apis/api/pubsub.googleapis.com)
- [Cloud SQL Admin API](https://console.cloud.google.com/apis/api/sqladmin.googleapis.com)

Configure a Google Cloud service account. See [details on using the service account with the Cloud SDK](https://cloud.google.com/docs/authentication/getting-started#setting_the_environment_variable). You will need to:
- Navigate to your service account on Google Cloud Console
- Create a new JSON Key and store it locally
- Create the environment variable by running `export GOOGLE_APPLICATION_CREDENTIALS="KEY PATH"` in your terminal


  </TabItem>
</Tabs>

## Storage options

The sections below will guide you through setting up your destination to receive Snowplow data, but for now here is an overview.

| Warehouse | AWS | GCP |
|:----------|:---:|:---:|
| Postgres | :white_check_mark: | :white_check_mark: |
| Redshift | :white_check_mark: | :x: |
| BigQuery | :x: | :white_check_mark: |
| Snowflake | :white_check_mark: | :x: |
| Databricks | :white_check_mark: | :x: |

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

There are four main storage options for you to select: Postgres, Redshift, Snowflake and Databricks. Additionally, there is an S3 option, which is primarily used to archive enriched (and/or raw) events and to store [failed events](/docs/understanding-your-pipeline/failed-events/index.md).

We recommend to only load data into a single destination, but nothing prevents you from loading into multiple destinations with the same pipeline (e.g. for testing purposes).

  </TabItem>
  <TabItem value="gcp" label="GCP">

There are two alternative storage options for you to select: Postgres and BigQuery (currently, you can’t choose both). Additionally, [failed events](/docs/understanding-your-pipeline/failed-events/index.md) are stored in GCS.

  </TabItem>
</Tabs>

## Choose `default` or `secure`

The Quickstart Examples repository contains two different deployment strategies:

- `default`
- `secure` (Recommended for production use cases)

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

The main difference is around the [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default VPC](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc). However, to increase the security of your components, it is recommended and best practice to deploy components into private subnets. This ensures they are not available publicly.

To use the `secure` configuration, you will need [your own VPC with public and private subnets](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Scenario2.html). You can follow [this guide](https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html) for steps on how to create VPCs and subnets on AWS.

  </TabItem>
  <TabItem value="gcp" label="GCP">

The main difference is around the [VPC](https://cloud.google.com/vpc/docs/overview) that the components are deployed within. In `default` you will deploy everything into a public subnet, this is the easiest route if you want to try out Snowplow as you can use [your default network (auto mode VPC)](https://cloud.google.com/vpc/docs/vpc#default-network). However, to increase the security of your components, it is recommended and best practise to deploy components into private subnets. This ensures they are not available publicly.

To use the `secure` configuration, you will need your [own custom VPC network](https://cloud.google.com/vpc/docs/vpc#auto-mode-considerations) with public and private subnets. You can follow [this guide](https://cloud.google.com/vpc/docs/using-vpc#creating_networks) for steps on how to create networks and subnetworks on GCP.

  </TabItem>
</Tabs>

:::caution

If opting for the `secure` deployment, you must ensure your private subnet layer has full access to the internet. Without internet access the deployment will fail.

:::

## Set up Iglu Server

The first step is to set up the [Iglu Server](/docs/pipeline-components-and-applications/iglu/index.md) stack required by the rest of your pipeline.

This will allow you to create and evolve your own [custom events](/docs/understanding-your-pipeline/events/index.md#self-describing-events) and [entities](/docs/understanding-your-pipeline/entities/index.md#custom-entities). Iglu Server stores the [schemas](/docs/understanding-your-pipeline/schemas/index.md) for your events and entities and fetches them as your events are processed by the pipeline.

### Step 1: Update the `iglu_sever` input variables

Once you have cloned the `quickstart-examples` repository, you will need to navigate to the `iglu_server` directory to update the input variables in `terraform.tfvars`.

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```bash
cd quickstart-examples/terraform/aws/iglu_server/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```bash
cd quickstart-examples/terraform/gcp/iglu_server/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

  </TabItem>
</Tabs>

To update your input variables, you’ll need to know a few things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- A UUIDv4 to be used as the Iglu Server’s API Key. [Help](https://duckduckgo.com/?t=ffab&q=uuid&ia=answer).
- How to generate an SSH Key.

:::tip

On most systems, you can generate an SSH Key with: `ssh-keygen -t rsa -b 4096`. This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`. You can get the value with `cat ~/.ssh/id_rsa.pub`.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

You will also need to specify the default VPC you will deploy your Iglu Server into. [Help](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc).

  </TabItem>
  <TabItem value="gcp" label="GCP">

If you have opted for `secure`, you will need to specify the network and subnetworks you will deploy your Iglu Server into. If you are deploying to your default network, then set `network = default` and leave subnetworks empty.

  </TabItem>
</Tabs>

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="each of the Quick Start Terraform modules" idSetting="user_provided_id" enableSetting="telemetry_enabled" settingWord="variable" />
```

### Step 2: Run the `iglu_server` Terraform script

You can now use Terraform to create your Iglu Server stack.

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

You will be asked to select a region, you can find more information about [available AWS regions here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).

```bash
terraform init
terraform plan
terraform apply
```

The deployment will take roughly 15 minutes.

  </TabItem>
  <TabItem value="gcp" label="GCP">

```bash
terraform init
terraform plan
terraform apply
```

  </TabItem>
</Tabs>

Once the deployment is done, it will output `iglu_server_dns_name`. Make a note of this, you’ll need it when setting up your pipeline. If you have attached a custom SSL certificate and set up your own DNS records, then you don’t need this value.

## Prepare the destination

Depending on the destination(s) you’ve choosen, you might need to perform a few extra steps to prepare for loading data there.

:::tip

Feel free to go ahead with these while your Iglu Server stack is deploying.

:::

<Tabs groupId="warehouse" queryString>
  <TabItem value="postgres" label="Postgres" default>

No extra steps needed — the necessary resources like a PostgreSQL instance, database, table and user will be created by the Terraform modules.

  </TabItem>
  <TabItem value="redshift" label="Redshift">

Assuming you already have an active Redshift cluster, execute the following SQL (replace the `${...}` variables with your desired values). You will need the permissions to create databases, users and schemas in the cluster.

```sql
-- 1. (Optional) Create a new database - you can also use an existing one if you prefer
CREATE DATABASE ${redshift_database};
-- Log back into Redshift with the new database:
-- psql --host <host> --port <port> --username <admin> --dbname ${redshift_database}

-- 2. Create a schema within the database
CREATE SCHEMA IF NOT EXISTS ${redshift_schema};

-- 3. Create the loader user
CREATE USER ${redshift_loader_user} WITH PASSWORD '${redshift_password}';

-- 4. Ensure the schema is owned by the loader user
ALTER SCHEMA ${redshift_schema} OWNER TO ${redshift_loader_user};
```

:::note

You will need to ensure that the loader can access the Redshift cluster over whatever port is configured for the cluster (usually, `5439`).

:::

  </TabItem>
  <TabItem value="bigquery" label="BigQuery">

No extra steps needed.

  </TabItem>
  <TabItem value="snowflake" label="Snowflake">

Execute the following SQL (replace the `${...}` variables with your desired values). You will need access to both `SYSADMIN` and `SECURITYADMIN` level roles to action this:

```sql
-- 1. (Optional) Create a new database - you can also use an existing one if you prefer
CREATE DATABASE IF NOT EXISTS ${snowflake_database};

-- 2. Create a schema within the database
CREATE SCHEMA IF NOT EXISTS ${snowflake_database}.${snowflake_schema};

-- 3. Create a warehouse which will be used to load data
CREATE WAREHOUSE IF NOT EXISTS ${snowflake_warehouse} WITH WAREHOUSE_SIZE = 'XSMALL' WAREHOUSE_TYPE = 'STANDARD' AUTO_SUSPEND = 60 AUTO_RESUME = TRUE;

-- 4. Create a role that will be used for loading data
CREATE ROLE IF NOT EXISTS ${snowflake_loader_role};
GRANT USAGE, OPERATE ON WAREHOUSE ${snowflake_warehouse} TO ROLE ${snowflake_loader_role};
GRANT USAGE ON DATABASE ${snowflake_database} TO ROLE ${snowflake_loader_role};
GRANT ALL ON SCHEMA ${snowflake_database}.${snowflake_schema} TO ROLE ${snowflake_loader_role};

-- 5. Create a user that can be used for loading data
CREATE USER IF NOT EXISTS ${snowflake_loader_user} PASSWORD='${snowflake_password}'
  MUST_CHANGE_PASSWORD = FALSE
  DEFAULT_ROLE = ${snowflake_loader_role}
  EMAIL = 'loader@acme.com';
GRANT ROLE ${snowflake_loader_role} TO USER ${snowflake_loader_user};

-- 6. (Optional) Grant this role to SYSADMIN to make debugging easier from admin users
GRANT ROLE ${snowflake_loader_role} TO ROLE SYSADMIN;
```

  </TabItem>
  <TabItem value="databricks" label="Databricks">

#### Step 1: Create a cluster

:::note

The cluster spec described below should be sufficient for a monthly event volume of up to 10 million events. If your event volume is greater, then you may need to increase the size of the cluster.

:::

Create a new cluster, following the [Databricks documentation](https://docs.databricks.com/clusters/create.html), with the following settings:

* the runtime version must be 13.0 or greater
* single node cluster
* "smallest" size node type
* auto-terminate after 30 minutes.

<details>
<summary>Advanced cluster configuration (optional)</summary>

You might want to configure cluster-level permissions, by following [the Databricks instructions on cluster access control](https://docs.databricks.com/security/access-control/cluster-acl.html).  Snowplow's RDB Loader must be able to restart the cluster if it is terminated.

If you use AWS Glue Data Catalog as your metastore, [follow these Databricks instructions](https://docs.databricks.com/data/metastores/aws-glue-metastore.html) for the relevant spark configurations.  You will need to set `spark.databricks.hive.metastore.glueCatalog.enabled true` and `spark.hadoop.hive.metastore.glue.catalogid <aws-account-id-for-glue-catalog>` in the spark configuration.

You can configure your cluster with [an instance profile](https://docs.databricks.com/administration-guide/cloud-configurations/aws/instance-profiles.html) if it needs extra permissions to access resources.  For example, if the S3 bucket holding the delta lake is in a different AWS account.

</details>

#### Step 2: Note the JDBC connection details

1. In the Databricks UI, click on "Compute" in the sidebar
2. Click on the *RDB Loader cluster* and navigate to "Advanced options"
3. Click on the "JDBC/ODBC" tab
4. Note down the JDBC connection URL, specifically the `host`, the `port` and the `http_path`

#### Step 3: Create an access token for the loader

:::caution

The access token must not have a specified lifetime. Otherwise, the loader will stop working when the token expires.

:::

1. Navigate to the user settings in your Databricks workspace
    * For Databricks hosted on AWS, the "Settings" link is in the lower left corner in the side panel
    * For Databricks hosted on Azure, "User Settings" is an option in the drop-down menu in the top right corner.
2. Go to the "Access Tokens" tab
3. Click the "Generate New Token" button
4. Optionally enter a description (comment). Leave the expiration period empty
5. Click the "Generate" button
6. Copy the generated token and store it in a secure location

#### Step 4: Create the catalog and the schema

Execute the following SQL (replace the `${...}` variables with your desired values). The default catalog is called `hive_metastore` and is what you should use in the loader unless you specify your own.

```sql
-- USE CATALOG ${catalog_name}; -- Uncomment if your want to use a custom Unity catalog and replace with your own value.

CREATE SCHEMA IF NOT EXISTS ${schema_name}
-- LOCATION s3://<custom_location>/ -- Uncomment if you want tables created by Snowplow to be located in a non-default bucket or directory.
;
```

<details>
<summary>Advanced security configuration (optional)</summary>

The security principal used by the loader needs a `Databricks SQL access` permission, which can be enabled in the _Admin Console_.

Databricks does not have table access enabled by default. Enable it with an 
initialization script:

```scala
dbutils.fs.put("dbfs:/databricks/init/set_spark_params.sh","""
|#!/bin/bash
|
|cat << 'EOF' > /databricks/driver/conf/00-custom-table-access.conf
|[driver] {
|  "spark.databricks.acl.sqlOnly" = "true"
|}
|EOF
""".stripMargin, true)
```

After adding the script, you need to restart the cluster. Verify that changes took effect by evaluating `spark.conf.get("spark.databricks.acl.sqlOnly")`, which should return `true`.

Follow the rest of the quick start guide so that the loader creates the required tables. Afterwards, reconfigure the permissions:

```sql
-- Clean initial permissions from tables
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.events FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.manifest FROM `<principal>`;
REVOKE ALL PRIVILEGES ON TABLE <catalog>.<schema>.rdb_folder_monitoring FROM `<principal>`;

-- Clean initial permissions from schema
REVOKE ALL PRIVILEGES ON SCHEMA <catalog>.<schema> FROM `<principal>`;

-- Loader will run CREATE TABLE IF NOT EXISTS statements, so USAGE and CREATE and both required.
GRANT USAGE, CREATE ON SCHEMA <catalog>.<schema> TO `<principal>`;

-- COPY TO statement requires ANY FILE and MODIFY for the receiving table
GRANT SELECT ON ANY FILE TO `<principal>`;
GRANT MODIFY  ON TABLE  <catalog>.<schema>.events TO `<principal>`;

-- These tables are used to store internal loader state
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.manifest TO `<principal>`;
GRANT MODIFY, SELECT ON TABLE  <catalog>.<schema>.rdb_folder_monitoring TO `<principal>`;
```

</details>

  </TabItem>
</Tabs>

## Set up the pipeline

In this section, you will update the input variables for the Terraform module, and then run the Terraform script to set up your pipeline. At the end you will have a working Snowplow pipeline ready to receive web, mobile or server-side data.

### Step 1: Update the `pipeline` input variables

Navigate to the `pipeline` directory in the `quickstart-examples` repository and update the input variables in `terraform.tfvars`.

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

```bash
cd quickstart-examples/terraform/aws/pipeline/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

  </TabItem>
  <TabItem value="gcp" label="GCP">

```bash
cd quickstart-examples/terraform/gcp/pipeline/default # or secure
nano terraform.tfvars # or other text editor of your choosing
```

  </TabItem>
</Tabs>

To update your input variables, you’ll need to know a few things:

- Your IP Address. [Help](https://duckduckgo.com/?q=ip+address&t=ffab&ia=answer).
- Your Iglu Server’s domain name from the [previous step](#step-2-run-the-iglu_server-terraform-script)
- Your Iglu Server’s API Key from the [previous step](#step-1-update-the-iglu_sever-input-variables)
- How to generate an SSH Key.

:::tip

On most systems, you can generate an SSH Key with: `ssh-keygen -t rsa -b 4096`. This will output where you public key is stored, for example: `~/.ssh/id_rsa.pub`. You can get the value with `cat ~/.ssh/id_rsa.pub`.

:::

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

You will also need to specify the default VPC you will deploy your pipeline into. [Help](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html#view-default-vpc).

Optionally, you will need an SSL certificate so that your collector can receive HTTPS traffic on a domain you own. You can create one using [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/). Once you have done that, add the certificate in the `ssl_certificate_arn` variable.

  </TabItem>
  <TabItem value="gcp" label="GCP">

If you have opted for `secure`, you will need to specify the network and subnetworks you will deploy your pipeline into. If you are deploying to your default network, then set `network = default` and leave subnetworks empty.

  </TabItem>
</Tabs>

#### Destination-specific variables

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

As mentioned [above](#storage-options), there are several options for the pipeline’s destination database. For each destination you’d like to configure, set the `<destination>_enabled` variable (e.g. `redshift_enabled`) to `true` and fill all the relevant configuration options (starting with `<destination>_`).

When in doubt, refer back to the [destination setup](#prepare-the-destination) section where you have picked values for many of the variables.

:::caution

For all active destinations, change any `_password` setting to a value that _only you_ know.

If you are using Postgres, set the `postgres_db_ip_allowlist` to a list of CIDR addresses that will need to access the database — this can be systems like BI Tools, or your local IP address, so that you can query the database from your laptop.

:::

  </TabItem>
  <TabItem value="gcp" label="GCP">

As mentioned [above](#storage-options), there are two options for pipeline’s destination database. Pick your destination, set the `<destination>_db_enabled` variable (e.g. `postgres_db_enabled`) to `true` and fill the respective `<destination>.terraform.tfvars` file. Only database-specific variables are different in the two `.tfvars` files.

:::caution Postgres only

Change the `postgres_db_password` setting to a value that _only you_ know.

Set the `postgres_db_authorized_networks` to a list of CIDR addresses that will need to access the database — this can be systems like BI Tools, or your local IP address, so that you can query the database from your laptop.

:::

  </TabItem>
</Tabs>

### Step 2: Run the `pipeline` Terraform script

<Tabs groupId="cloud" queryString>
  <TabItem value="aws" label="AWS" default>

You will be asked to select a region, you can find more information about [available AWS regions here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html).

```bash
terraform init
terraform plan
terraform apply
```

This will output your `collector_dns_name`, `postgres_db_address`, `postgres_db_port` and `postgres_db_id`.

  </TabItem>
  <TabItem value="gcp" label="GCP">

```bash
terraform init
terraform plan -var-file=<destination>.terraform.tfvars
terraform apply -var-file=<destination>.terraform.tfvars
```

This will output your `collector_dns_name`, `db_address`, `db_port`, `bigquery_db_dataset_id`, `bq_loader_dead_letter_bucket_name` and `bq_loader_bad_rows_topic_name`.

  </TabItem>
</Tabs>

Make a note of the outputs: you'll need them when sending events and connecting to your database.

:::tip Empty outputs

Depending on your chosen destination, some of these outputs will be empty — you can ignore those.

:::

If you have attached a custom ssl certificate and set up your own DNS records, then you don't need `collector_dns_name`, as you will use your own DNS record to send events from the Snowplow trackers.

:::tip Terraform errors

For solutions to some common Terraform errors that you might encounter when running `terraform plan` or `terraform apply`, see the [FAQs section](/docs/getting-started-on-snowplow-open-source/faq/index.md#troubleshooting-terraform-errors).

:::

If you are curious, here’s [what has been deployed](/docs/getting-started-on-snowplow-open-source/what-is-deployed/index.md). Now it’s time to [send your first events to your pipeline](/docs/first-steps/tracking/index.md)!
