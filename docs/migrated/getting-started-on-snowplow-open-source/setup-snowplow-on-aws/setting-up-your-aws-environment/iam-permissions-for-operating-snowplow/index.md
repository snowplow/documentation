---
title: "IAM permissions for operating Snowplow"
date: "2020-11-24"
sidebar_position: 80
---

These are instructions for setting up the IAM permissions for the "user(s)" that "operates" Snowplow; in practice this is the user associated with the credentials that should be used in the EmrEtlRunner and storage config files.

The permissions represent the minimum required to keep the Snowplow data pipeline running: this is best practice, so that if a hacker manages to compromise the server with EmrEtlRunner and storage configs on it (so gain access to these credentials), they will have only limited access to your AWS resources.

**Disclaimer: Snowplow Analytics Ltd will not be liable for any problems caused by the full or partial implementation of these instructions on your Amazon Web Services account. If in doubt, please consult an independent AWS security expert.**

## Setup the IAM group

### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-operating-Snowplow#initial-group-configuration)Initial group configuration

- First click on the IAM icon on the AWS dashboard:
- Click on the _Create a New Group of Users_ button
- Enter a _Group Name_ of `snowplow-data-pipeline` and click _Continue_

## Set the permissions for the group

- Choose the _Custom Policy_ option and click _Select_
- Give it a _Policy Name_ of `snowplow-policy-operate-datapipeline`

We now need to create the Amazon policy document to define _just_ the user permissions required to run the Snowplow pipeline. An example permissions policy is given below:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "ec2:*",
                "elasticbeanstalk:*",
                "elasticmapreduce:*",
                "s3:*",
                "sns:*",
                "iam:passrole",
                "cloudformation:ListStackResources",
                "cloudformation:DescribeStacks",
                "autoscaling:DescribeAutoScalingGroups",
                "redshift:DescribeClusters"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

Note that there should be opportunities to lock these permissions down further e.g.:

1. Place them on specific resources rather than `*`
2. Remove e.g. `sns` permissions if you are not using SNS to monitor your Snowplow infrastructure

- Copy and paste the JSON into the policy document field and click _Continue_
- **Do not add an existing user**. We want to create a new user with these permissions, who **only** has these permissions.
- Review the final settings before pressing _Continue_ to complete the process. Your new group is now setup.

### Running Kinesis Applications

Our Kinesis Applications are designed so that you can launch them all with IAM Roles so you will never have to store your AWS Access/Secret Keys on the instance itself. Lock down your permissions as far as possible, and remember that assigning permissions to specific instances of autoscaling groups is better than assigning them to users.

## Create a new user

Now that our group has been created, we need to add a new user to it.

- In the IAM console, click on the _Users_ section on the left hand menu
- Click on the _Create New Users_ button:
- Give your new user a suitable name e.g. `snowplow-operator`.
- Click _Create_

AWS gives you the chance to either show or download the credentials. Whichever you do, make sure you **store these credentials safely**. You will need them in later in this guide.

Now close the window: your new user is setup.

## Add the new user to your new group

The user we have created has no permissions so we need to add them to the new group we created to give her those permissions.

- Click on the _Groups_ section on the AWS console, and select the new group you created
- Click on the _Add Users to Group_ button
- The user now has the required permissions.

## Update the EmrEtlRunner config files with the new credentials

Now that you have setup your new user and given her the relevant permissions to run the Snowplow data pipeline, you need to take those credentials and use them instead of the existing credentials in your EmrEtlRunner config files.

Those files should be accessible on the server setup to run EmrEtlRunner. (Examples of those files can be found on the Snowplow repo [here](https://github.com/snowplow/snowplow/tree/master/3-enrich/emr-etl-runner/config) and [here](https://github.com/snowplow/snowplow/tree/master/4-storage/config).) Update the `:access_key_id:` and `:secret_access_key:` fields with those from the new user in **both** files.

## Delete the user created to setup Snowplow

Now that we have created a new user with just the permissions required to run the Snowplow data pipeline, and used her credentials in in the EmrEtlRunner config files, we can delete the user that we created to setup/install Snowplow originally.

- In the IAM console, go into the `snowplow-setup` group you created when you created user credentials for the individual who setup Snowplow.
- Select the user in that group e.g. `snowplow-setup` and click the _Remove User from Group_ link:
- Click _Remove from Group_ when AWS asks you to confirm.

In the event that you need to update your Snowplow setup in the future, you can simply create a new user, fetch their credentials, then add them to the `setup-snowplow` group to give them the relevant permissions.
