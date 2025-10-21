---
title: Training Data
position: 4
---

In order for the AWS Personalize model to serve usable results, we need to give it some initial training on our actual store.
Out of the box Personalize will have no idea about our customers or products, let alone the relationships between them and what makes a good recommendation.

To solve this "cold start" problem, we need to export our catalog information for AWS Personalize to read, and give it an initial training dataset of interactions for it to build a model off of.

## Creating The Cloud Infrastructures

From here, you have two options:

1. Following the linked Snowflake/Databricks and AWS documentation and creating the necessary resources manually
or
2. Using Terraform to create the resources. This is the recommended option as it is significantly faster (assuming you're familiar with Terraform)

### Option 1: Manual instructions

#### On AWS

I. Create an S3 bucket for the data from Snowflake - https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html

II. Create a policy and role for AWS Personalize - follow instructions here https://docs.aws.amazon.com/personalize/latest/dg/set-up-required-permissions.html

- Also follow the instructions here https://docs.aws.amazon.com/personalize/latest/dg/cross-service-confused-deputy-prevention.html to prevent the confused deputy problem, by modifying the trust policy for the role you created in the previous step.

III. We then need to create two more policies - one that is attached to the Personalize role, and another that is attached to the bucket. These allow the personalize service to access your S3 bucket: https://docs.aws.amazon.com/personalize/latest/dg/granting-personalize-s3-access.html
There are a few headings in this document that aren't relevant; the ones to follow are:
- Beneath the heading `Attaching an Amazon S3 policy to your Amazon Personalize service role` follow instructions for `Service role policy for batch workflows` (the only difference between the two policies in this section is the addition of the `"s3:PutObject"` action for the batch workflows).
- Beneath the heading `Attaching an Amazon Personalize access policy to your Amazon S3 bucket` follow instructions for `Amazon S3 bucket policy for batch workflows` (once again the only difference is the addition of the `"s3:PutObject"` action).

#### For Snowflake

Follow the instructions in the following link to configure a Storage Integration between Snowflake and S3 - https://docs.snowflake.com/en/user-guide/data-load-s3-config-storage-integration.html. You will need either global `CREATE STORAGE INTEGRATION` permissions or to be an `ACCOUNTADMIN` in Snowflake for this step, as well as permissions in AWS to create and manage IAM policies and roles.

#### For Databricks

Follow the instructions in the following link to create a Storage Credential and External Location (on S3) to serve as the location to create external tables on - https://docs.databricks.com/en/data-governance/unity-catalog/manage-external-locations-and-credentials.html#requirements. You will need to be an Account Admin to create Storage Credentials, however once created the account admin can delegate ownership to other users for management. To create External Locations the user must have the `CREATE EXTERNAL LOCATION` privilege on both the metastore and Storage Credential referenced in the external location (Metastore Admin have this permission by default). Finally the name of the S3 bucket that you want the external location to reference cannot use dot notation.

Once you have created the external location you will also need to create a new catalog with a managed location (i.e. the S3 bucket path referenced in the external location), for example:

```sql
CREATE CATALOG <name>
  MANAGED LOCATION <s3://...>
```

### Option 2: Use supplied Terraform script

At the [corresponding GitHub repository for this tutorial](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize), we provide [a series of resources](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/tree/main/terraform_utilities) that can be used to set up your AWS Personalize instance. With them, follow the steps below:

I. Set up AWS and Terraform if not already done: https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build

II. You may wish to supply the Terraform variables needed to create the resources and connect to your AWS and Snowflake/Databricks account via a Terraform 'tfvars' file or input the variables during the `apply` phase. This set of variables for this Terraform module, used in setting up the AWS Personalize service, are all optionsl as they have default values for the TF script. If you wish to create the variable file then do so in the subdirectory of `terraform_utilities/aws_personalize_module/`, the variable file (`terraform.tfvars`) should look like this:

```
# Below variables are optional, they all have default values as listed here:
aws_region = "ap-southeast-2"
personalize_policy_name = "PersonalizeIAMPolicy"
personalize_role_name = "PersonalizeIAMRole"
personalize_s3_access_policy_name = "PersonalizeS3AccessPolicy"

```

III. Go into the folder of the data warehouse your dbt package will be operating in:
  - Snowflake (`terraform_utilities/snowflake/`)
    1. You may wish to again input the Terraform variables during the `apply` phase or provide them ahead of time by creating a `terraform.tfvars` file; the file should look like the below:
    ```
    aws_region = "<aws region name>"
    aws_account_id = "<AWS account ID>"
    bucket_name = "<s3 bucket name>"
    snowflake_account_id = "<Snowflake account ID>"
    snowflake_database = "<Database name>"
    snowflake_schema = "<Schema name>"

    # Below variables are optional, they all have default values as listed here:
    snowflake_policy_name = "SnowflakePersonalizeIAMPolicy"
    snowflake_role_name = "SnowflakePersonalizeIAMRole"
    snowflake_storage_integration_name = "PersonalizeS3StorageIntegration"
    snowflake_personalize_stage_name = "PersonalizeS3Stage"
    create_schema = false # the `snowflake_schema` schema is presumed to exist; this enables creating it if not
    deploy_app = false # if enabled, the flask app will be deployed to an EC2 instance and made public
    app_subnet_id = "<subnet id>" # if using `deploy_app`, the VPC subnet ID to deploy the app instance to
    app_subnet_tags = [] # tags to use for selecting public subnets for deploying the app load balancer to
    aws_iam_role_boundary = null # role boundary to use when creating IAM roles, if required
    use_storage_integration = true # disable if you can't create storage integrations; the credentials will be embedded directly into the stage (this is deprecated by Snowflake)
    name_prefix = null # used for generating base names for AWS Personalize resources -- will populate `config.yaml` described below; if not provided, derived from `bucket_name`
    enable_domains = [] # AWS Personalize domains to enable. Currently supported are "ECOMMERCE" and "VIDEO_ON_DEMAND"; will control datasets that are created and populate `config.yaml`
    ```
    2. Set up the authentication for Terraform with your Snowflake account by providing your username and password as environment variables (you may also need `SNOWFLAKE_ROLE` and `SNOWFLAKE_WAREHOUSE` depending on your defaults):
       - `export SNOWFLAKE_USER='<username>'`
       - `export SNOWFLAKE_PASSWORD='<password>'`

    3. Run `terraform init` in this folder (i.e. `terraform_utilities/snowflake/`). This will initialise Terraform and download the necessary providers.

    4. Run `terraform apply` in this directory. This will create the necessary resources in AWS and Snowflake. You will need to enter `yes` when prompted to confirm the creation of the resources.

  - Databricks (`terraform_utilities/databricks/`)
    1. You may wish to again input the Terraform variables during the `apply` phase or provide them ahead of time by creating a `terraform.tfvars` file; the file should look like the below:
    ```yaml
    aws_account_id = "<AWS account ID>"
    bucket_name = "<s3 bucket name>"
    databricks_host = "<Databricks host url>"
    databricks_account_id = "Databricks account ID>"

    # Below variables are optional, they all have default values as listed here:
    storage_credential_name = "storage_credential_personalize_s3"
    storage_credential_role_name = "DatabricksStorageCredentialRole"
    storage_credential_s3_access_policy_name = "DatabricksStorageCredentialPolicy"
    databricks_external_catalog_name = "aws_personalize"
    ```
    2. Set up the authentication for Terraform with your Databricks account by exporting the environment variable with your Personal Access Token (https://docs.databricks.com/en/dev-tools/auth.html#databricks-personal-access-token-authentication):
    - `export DATABRICKS_TOKEN='<PAT>'`

    3. Run `terraform init` in this folder (i.e. `terraform_utilities/databricks/`). This will initialise Terraform and download the necessary providers.

    4. Due to the nature of the required role on AWS for the Databricks Storage Credentials be self referential and the current limiting factor of Terraform to create a trust policy on a new role in the same `apply` phase, the TF file for Databricks will need to be applied twice. So please run `terraform apply` and you'll see the error regarding the failure in creating the external location because the AWS IAM role does not have the READ permission on the S3 bucket TF would have just created. Upon running `terraform apply` a second time this will be amended and the external location as well as the new external catalog (with a managed location) will both be successfully created.

