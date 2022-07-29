---
title: "Setting up Piinguin"
date: "2021-03-26"
sidebar_position: 0
---

Both the Piinguin Server and the Piinguin Relay are currently only targeting AWS and they should be deployed in the same VPC.

## Deploying piinguin

The simplest way to deploy Piinguin Server is to obtain the docker image by running the following on your docker host: `docker run snowplow/piinguin-server:0.1.1` This will run the server on the default port `8080` and will use the default DynamoDB table `piinguin`. Both are configurable to other values using `PIINGUIN_PORT` and `PIINGUIN_DYNAMODB_TABLE`, if needed. See the relevant [readme](https://github.com/snowplow/snowplow-docker/tree/develop/piinguin-server) for more information.

### Piinguin deployment environment

As stated before, both the Relay and the Server need to reside in the same VPC. in addition the docker host needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html).

As the server writes its data to DynamoDB its will need to have access to it with a policy document such as:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": "arn:aws:dynamodb:<region>:<account-id>:table/<table-name>"
        }
    ]
}
```

## Deploying relay

You can obtain the relay artifact from [our S3 public assets buckets](https://github.com/snowplow/snowplow/wiki/Hosted-assets) appropriate for your region. In order for you to create an AWS Lambda function, please follow the detailed [developer guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html). When you are creating the Lambda, you will need to specify as trigger the AWS Kinesis stream that contains your PII data. In addition you will need to have the VPC id where you are running the Piinguin Server and provide that in the form too. Finally in the `Environment variables` section you will need to add the PIINGUIN\_HOST, PIINGUIN\_PORT and PIINGUIN\_TIMEOUT\_SEC. The PIINGUIN\_TIMEOUT\_SEC value should be lower than the AWS Lambda timeout in order to get a meaningful error message if the client times out while communicating with the server. Here is an example of that configuration:

```
PIINGUIN_HOST        = ec2-1-2-3-4.eu-west-1.compute.amazonaws.com
PIINGUIN_PORT        = 8080
PIINGUIN_TIMEOUT_SEC = 10
```

### Relay deployment environment

As stated before, both the Relay and the Server need to reside in the same VPC. in addition the lambda needs to have sufficient access from IAM to run. You should create a service role and attach policies that will permit it to run following [this guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-service.html). As all Lambda functions it needs to have permission to send its output to CloudWatch Logs so and example IAM policy that permits that is:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "logs:CreateLogGroup",
            "Resource": "arn:aws:logs:<region>:<account-id>:*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:<region>:<account-id>:log-group:/aws/lambda/piinguin-relay:*"
            ]
        }
    ]
}
```

As the Lambda will be reading its data form Kinesis it will also need to have permissions to do that with a policy document such as:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "kinesis:*",
            "Resource": [
                "arn:aws:kinesis:<region>:<account-id>:stream/<pii-events-stream-name>"
            ]
        }
    ]
}
```
