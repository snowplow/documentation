---
title: "IAM permissions for installing Snowplow"
date: "2020-11-24"
sidebar_position: 70
---

Setting up permissions in IAM for the user(s) installing Snowplow is an 3 step process:

**Disclaimer: Snowplow Analytics Ltd will not be liable for any problems caused by the full or partial implementation of these instructions on your Amazon Web Services account. If in doubt, please consult an independent AWS security expert.**

## Setup the IAM group

### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-users-installing-Snowplow#initial-group-configuration)Initial group configuration

- Find and click on the IAM icon on the AWS dashboard
- Click on the *Create a New Group of Users* button
- Enter a *Group Name* of `snowplow-setup`
- For Permissions select the _Custom policy_ option
- Give it a policy name such as `snowplow-policy-setup-infrastructure`

### Permissions configuration

Depending on what Pipeline needs to be setup you will need slightly varying permissions.

#### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-users-installing-Snowplow#batch-permissions)Batch Permissions

The following permissions are needed for all batch proccessing operations:

- Amazon S3
- Amazon EMR
- Amazon EC2 (required for EmrEtlRunner)
- Amazon Marketplaces (required for EmrEtlRunner)
- Amazon CloudFront (required for Cloudfront collector)
- Amazon Elastic Beanstalk (required for Clojure collector)
- Amazon Elasticsearch service (for loading bad rows)
- Amazon Redshift (required for Redshift)
- Amazon Cloudformation (required if the Snowplow team setup your Snowplow data pipeline, as we use Cloudformation)
- Amazon IAM (required as part of the Clojure collector setup, as a role is created for the Clojure collector application)
- Amazon RDS (PostgreSQL server required by Iglu Server)

**If you are not using the Clojure Collector, you can remove the Elastic Beanstalk section.**

Paste the following JSON into the *Policy Document* text area:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "acm:*",
        "autoscaling:*",
        "aws-marketplace:ViewSubscriptions",
        "aws-marketplace:Subscribe",
        "aws-marketplace:Unsubscribe",
        "cloudformation:*",
        "cloudfront:*",
        "cloudwatch:*",
        "ec2:*",
        "elasticbeanstalk:*",
        "elasticloadbalancing:*",
        "elasticmapreduce:*",
        "es:*",
        "iam:*",
        "rds:*",
        "redshift:*",
        "s3:*",
        "sns:*"
      ],
      "Resource": "*"
    }
  ]
}
```

#### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-users-installing-Snowplow#kinesis-permissions)Kinesis Permissions

For the Kinesis Pipeline ending in an Elasticsearch Cluster you will need these permissions:

- Amazon EC2
- Amazon Cloudformation (required if the Snowplow team setup your Snowplow data pipeline, as we use Cloudformation)
- Amazon IAM (required as each Application for the Kinesis Pipeline has its own IAM Policy)
- Amazon Kinesis (required for Kinesis Streams to be created)
- Amazon DynamoDB (required for Kinesis Applications to work with Kinesis Streams)
- Amazon CloudWatch/Logs
- Amazon AutoScaling (required for all Kinesis Applications to work effectively)
- Amazon ElasticLoadBalancing (required for the Kinesis Collector)

Paste the following JSON into the *Policy Document* text area:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "acm:DescribeCertificate",
        "acm:ListCertificate",
        "autoscaling:*",
        "elasticloadbalancing:*",
        "kinesis:*",
        "iam:*",
        "cloudwatch:*",
        "ec2:*",
        "cloudformation:*",
        "cloudfront:*",
        "logs:*",
        "dynamodb:*",
        "sns:*"
      ],
      "Resource": ["*"]
    }
  ]
}
```

#### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-users-installing-Snowplow#kinesis--batch-permissions)Kinesis & Batch Permissions

For the Kinesis Pipeline ending in the LZO S3 Sink with events from this sink then being processed in batches you will need these permissions:

- Amazon S3
- Amazon EMR
- Amazon EC2
- Amazon Marketplaces (required for EmrEtlRunner)
- Amazon Redshift (required for Redshift)
- Amazon Cloudformation (required if the Snowplow team setup your Snowplow data pipeline, as we use Cloudformation)
- Amazon IAM (required as each Application for the Kinesis Pipeline has its own IAM Policy)
- Amazon RDS (PostgreSQL server required by Iglu Server)
- Amazon Kinesis (required for Kinesis Streams to be created)
- Amazon DynamoDB (required for Kinesis Applications to work with Kinesis Streams)
- Amazon CloudWatch/Logs
- Amazon AutoScaling (required for all Kinesis Applications to work effectively)
- Amazon ElasticLoadBalancing (required for the Kinesis Collector)

Paste the following JSON into the *Policy Document* text area:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "acm:*",
        "autoscaling:*",
        "aws-marketplace:Subscribe",
        "aws-marketplace:Unsubscribe",
        "aws-marketplace:ViewSubscriptions",
        "cloudformation:*",
        "cloudfront:*",
        "cloudwatch:*",
        "dynamodb:*",
        "ec2:*",
        "es:*",
        "elasticbeanstalk:*",
        "elasticloadbalancing:*",
        "elasticmapreduce:*",
        "iam:*",
        "kinesis:*",
        "logs:*",
        "rds:*",
        "redshift:*",
        "s3:*",
        "sns:*"
      ],
      "Resource": ["*"]
    }
  ]
}
```

### After Policy Selection

- Once you have selected the correct *Policy Document* click *Continue*
- From the *Add Existing Users* tab, switch to the *Create New Users* tab:
- Now enter a *User Name* - for example `snowplow-setup`
- Keep the option *Generate an access key for each User* checked, and then click *Continue*.

### [](https://github.com/snowplow/snowplow/wiki/Setup-IAM-permissions-for-users-installing-Snowplow#review)Review

Check that the configuration for your new IAM group looks something like this:

![](images/new-iam-group-review.png)

- Click *Continue* and you should see confirmation that the User has been created.
- Click *Download Credentials* to save these credentials locally.
- Click *Close Window*.

Provide these credentials in a secure way to whoever is setting up Snowplow for you, so that they can add them into the configuration of your EmrEtlRunner applications.

## Allow the IAM user to login

For much of the Snowplow setup process, the IAM user you have setup above will need access to the Amazon Web Services control panel.

- From within the *Users* tab inside the IAM dashboard, click on your `snowplow` user
- Switch to the *Security Credentials* tab in the bottom pane, and click *Manage Password* on the right
- Select *Assign an auto-generated password*:
- Click *Apply*
- Click *Download Credentials* to save these credentials locally.
- Click *Close Window*.

Now, provide the following details in a secure way to whoever is setting up Snowplow for you:

- Login URL: [https://snplow.signin.aws.amazon.com/console](https://snplow.signin.aws.amazon.com/console)
- Username: `snowplow`
- Password: _\[as downloaded\]_
