---
position: 2
title: Installation and setup
---

This tutorial can be executed with a AWS account and [our corresponding Colab notebook](https://colab.research.google.com/drive/19T6EICwF5nF4yrA7ftS3pE-zp9huxaYk), which utilizes our demo stores as a source of events. The rest of this tutorial guides you setting AWS Personalize with your own sources.

The current supported warehouses for this tutorial are:

- Snowflake
- Databricks

The dbt packages running on either of the above data warehouses will write/unload the models as csv files on to an AWS S3 bucket that AWS Personalize can access and import from for training datasets to create the recommendations.

Currently the media tracking from Snowplow does not provide a `click` event, which prevents Personalize from generating the Video On Demand's recommendation of `More Like X` and it is also why the `click` event types won't be available in our VOD's 'interactions' datasets.

Different stages of this tutorial use Python for code examples, although any programming language with support for AWS SDK can be used.

Supporting files can be found at [the corresponding GitHub repository](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize). In there you should find:

- [An example on how to implement your own Lambda function (in Python)](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/aws_personalize_utilities/lambda_app.py);
    - There's [an alternative implementation using Flask](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/blob/main/aws_personalize_utilities/flask_app.py).
- [Different Terraform modules to help you to setup AWS Personalize, and/or Snowflake and Databricks instances](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/tree/main/terraform_utilities);
- [A specific data model, to help you to extract relevant data to prepare a training dataset for AWS Personalize](https://github.com/snowplow-industry-solutions/ecommerce-recsys-with-amazon-personalize/tree/main/dbt-snowplow-recommendations).

AWS Personalize generally requires custom infrastructure to run. Some of that infrastructure can take time to deploy (20+ minutes) so you may need to make sure it's spun up before starting to work with it.

## Requirements
### Permissions and Access
- AWS: IAM permissions to create and manage IAM policies and roles.

### Snowplow dbt packages
- Snowplow: An implementation of the 'dbt-snowplow-ecommerce' and or 'dbt-snowplow-media-player' packages. These dbt packages will create the interactions tables, which is used by this dbt package to create the datasets for AWS Personalize to train its recommendations. If you don't have the interactions table, you can create it by following the instructions on the docs for ecommerce [here](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/ecommerce/) and media player [here](https://docs.snowplow.io/docs/modeling-your-data/modeling-your-data-with-dbt/dbt-quickstart/media-player/)

## Third Party Applications
### Boto3

Install the AWS SDK for Python (Boto3) if you don't already have it - https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

In your AWS account, create an access key for your user - https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey. Copy the access key id and secret access key to a file called credentials in the `.aws` folder in your home directory. The file should look like this:

```ini
    [default]
    aws_access_key_id = YOUR_ACCESS_KEY
    aws_secret_access_key = YOUR_SECRET_KEY
    You can also ensure that if you have a config file in the .aws folder that it has the correct region in it. The file should look like this:

    [default]
    region=YOUR_REGION
```

To use a non-default profile, you will have to specify a `AWS_PROFILE` environment variable for the later commands in this guide.

### Terraform (optional)

[Terraform](https://developer.hashicorp.com/terraform) is used to automate infrastructure deployment. More information [can be found here](https://developer.hashicorp.com/terraform/tutorials). Terraform should be used if you have no infrastructure deployed at all. Further aspects of usage will be covered in the following sections of this tutorial.
