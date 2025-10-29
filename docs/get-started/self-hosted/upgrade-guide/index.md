---
title: "Upgrade guide"
date: "2021-09-01"
sidebar_position: 4
---

Now that you have successfully spun up a Snowplow pipeline, you might want to upgrade your components when there are updates available.

The Community Edition Quick Start is updated in line with the Snowplow Community Edition Distributions and here we describe the steps you need to take to upgrade between versions.

:::note

You may have deviated from the original Quick Start example Terraform files. If this is the case then the concepts described here still apply. However, you will want to compare the differences between Quick Start releases to see what you need to update.

:::

## Updating your repository

To upgrade to a new Quick Start version, you first need to update the git repository to the next release. We recommend upgrading one release at a time to ease the transition rather than trying to leap from an older version to the latest, although this should also be possible with some caution.

You'll first need to commit or stash any changes you haven't commited. If you've updated your `.tfvars` then you should stash these first (use `git stash`) and once you've updated your repository, you can retrieve your changes from the stash (use `git stash pop`).

To jump to the latest release, you should update your local `main` branch to latest:

```bash
git checkout main
git pull
```

If you only want to move to a specific version then you should checkout that tag into a new branch.

```bash
git checkout -b 21.08 21.08 // To checkout 21.08
```

## Migrations

:::info AWS

This information is currently specific to AWS.

:::

Before updating your stack, you should run any required manual migrations. These are listed below.

If the specific upgrade path isn't mentioned below, then you should be able to upgrade without any manual interventation.

Clicking the links below will show all the Terraform differences between each version.

### 22.01 to 22.01-Patch.1

#### Changing the name of the `pipeline_db*` variables

Since we have two destination database options (`postgres` and `snowflake`) starting with this release, we've replaced 'pipeline_db' part in the variable names with 'postgres_db'. You need to change your variable names accordingly.

Also, new 'pipeline_db' variable is introduced. This variable specifies the database that will be used as destination in the pipeline. It can be either 'postgres' or 'snowflake'. Since all existing pipelines are using Postgres if they aren't modified, this variable should be set to 'postgres' in those pipelines.

### 21.04 to 21.08

#### Changing some of the column types

The database schemas created with a 21.04 Quick Start do not work well with events enriched with pii pseudoanonymization. Therefore, a Postgres migration is required to change types of some of the columns. You need to apply [this migration script](https://github.com/snowplow-incubator/snowplow-postgres-loader/blob/master/migrations/0-3-0.sql) to your database (You may need to change the `public` schema to `atomic` for this to run successfully with the standard Quick Start installation).

#### Cloudwatch logs are on by default

21.08 Quick Start has enabled Cloud Watch logs by default. We recommend you leave this enabled as the cloud watch logs can be beneficial when diagnosing any issues with your pipeline components.

## Updating Snowplow components

If you are using a standard Quick Start deployment, you can follow the steps below to upgrade your Iglu Server and Pipeline. If you have deviated from the example, then you should compare the differences between the Snowplow Community Edition Distributions in the examples and update your usage of the Terraform modules accordingly.

:::note

You will experience some brief downtime when running these upgrades, as there is no redudency in the Community Edition.

:::

#### Iglu Server

Now you are ready to update your Iglu Server. The example below is for the `default` configuration on `aws`. You should change to the correct folder for your preferred installation.

```bash
cd terraform/aws/iglu_server/default
terraform init
terraform plan
```

At this stage, you should see the changes that will be made to your infrastructure. If everything looks ok and there are no errors you can apply the update.

```bash
terraform apply
```

#### Pipeline

Now you are ready to update your pipeline components. The example below is for the `default` configuration on `aws`. You should change to the correct folder for your preferred installation.

```bash
cd terraform/aws/pipeline/default
terraform init
terraform plan
```

At this stage, you should see the changes that will be made to your infrastructure. If everything looks ok and there are no errors you can apply the update.

```bash
terraform apply
```
