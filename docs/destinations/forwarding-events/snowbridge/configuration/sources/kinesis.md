# Kinesis Source

:::note

To use this source, you need the AWS-specific version of Snowbridge that can only be run on AWS. See [the page on Snowbridge distributions](/docs/destinations/forwarding-events/snowbridge/getting-started/distribution-and-deployment.md) for more information.

:::

## Authentication

Authentication is done via the [AWS authentication environment variables](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html). Optionally, you can use the `role_arn` option to specify an ARN to use on the stream.

## Setup

The AWS kinesis source requires the additional setup of a set of dynamoDB tables for checkpointing purposes. To set up a kinesis source, you will need to:

1. Configure the above required variables in the HCL file.
2. Create three DynamoDB tables which will be used for checkpointing the progress of the replicator on the stream (*Note*: details below)

Under the hood we are using a fork of the [Kinsumer](https://github.com/snowplow-devops/kinsumer) library which has defined this DynamoDB table structure - these tables need to be created by hand before the application can launch.

| TableName                                | DistKey        |
|------------------------------------------|----------------|
| `${SOURCE_KINESIS_APP_NAME}_clients`     | ID (String)    |
| `${SOURCE_KINESIS_APP_NAME}_checkpoints` | Shard (String) |
| `${SOURCE_KINESIS_APP_NAME}_metadata`    | Key (String)   |

Assuming your AWS credentials have sufficient permission for Kinesis and DynamoDB, your consumer should now be able to run when you launch the executable.

## Configuration options

Here is an example of the minimum required configuration:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/sources/kinesis-minimal-example.hcl
```

Here is an example of every configuration option:

```hcl reference
https://github.com/snowplow/snowbridge/blob/master/assets/docs/configuration/sources/kinesis-full-example.hcl
```
