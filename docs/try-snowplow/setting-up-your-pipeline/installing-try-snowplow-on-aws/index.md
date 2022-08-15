---
title: "Installing Try Snowplow on AWS (old version)"
date: "2020-11-23"
sidebar_position: 10
---

## Installation process

The installation process for Try Snowplow takes around 15 minutes and comprises the following steps:

1. Sign up to Try Snowplow
2. Install the infrastructure into your cloud account
3. Connect to your pipeline

Security note

Snowplow will never ask you to disclose your Amazon, Google or database credentials.

## Pre-requisites

### Required IAM permissions

Setting up Try Snowplow in your AWS account requires following IAM roles:

```
cloudformation:CreateStack
cloudformation:DescribeStackEvents
cloudformation:DescribeStacks
cloudformation:ListStacks
cloudformation:GetTemplateSummary
ec2:AssociateRouteTable
ec2:AttachInternetGateway
ec2:AuthorizeSecurityGroupIngress
ec2:CreateInternetGateway
ec2:CreateRoute
ec2:CreateRouteTable
ec2:CreateSecurityGroup
ec2:CreateSubnet
ec2:CreateTags
ec2:CreateVpc
ec2:ModifySubnetAttribute
ec2:ModifyVpcAttribute
ecs:CreateCluster
ecs:CreateService
ecs:DescribeClusters
ecs:DescribeServices
ecs:RegisterTaskDefinition
ec2:DescribeVpcs
ec2:DescribeAvailabilityZones
ec2:DescribeSecurityGroups
ec2:DescribeAccountAttributes
ec2:DescribeSubnets
ec2:DescribeRouteTables
elasticloadbalancing:AddTags
elasticloadbalancing:CreateLoadBalancerListeners
elasticloadbalancing:CreateLoadBalancer
elasticloadbalancing:CreateTargetGroup
elasticloadbalancing:DescribeListeners
elasticloadbalancing:DescribeLoadBalancers
elasticloadbalancing:DescribeTargetGroups
health:DescribeEventAggregates
iam:CreateRole
iam:GetRole
iam:GetRole
iam:GetRole
iam:GetRolePolicy
iam:PutRolePolicy
iam:PassRole
rds:AddTagsToResource
rds:CreateDBInstance
rds:CreateDBParameterGroup
rds:CreateDBSubnetGroup
rds:DescribeDBInstances
rds:DescribeDBSubnetGroups
rds:DescribeEngineDefaultParameters
rds:ModifyDBParameterGroup
```

## Installation steps

### Install the infrastructure

- In the Try Snowplow console, click on _"Install your Try Snowplow infrastructure"_.
- Read the notes and then select either the _"Basic Installer"_ or the _"Advanced Installer"_ and launch the installer.

What is the difference between the Basic and Advanced installers?

The Basic Installer is the quickest and simplest installer and should be sufficient for most use cases. The Advanced Installer provides a couple of extra configuration options; allowing you to secure your database with an IP AllowList and to set an AWS Permissions Boundary for your install.

- You will be taken to AWS console to deploy the components in your AWS account; at this point you may need to sign into AWS if you are not already signed in.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2021/01/Screenshot-2021-01-12-at-08.37.35.jpg?w=1024)

You'll be taken to AWS Console to start install

- Most fields on the installation script are pre-filled, but you can
    - optionally edit the stack name, should you wish to
    - set a login username for the database that will be created
    - set a login password for the database that will be created
    - set an IP allow list for database access _(advanced template only)_
    - set an AWS permission boundary _(advanced template only)_
- Check the boxes under _"Capabilities"_ to allow the creation of an IAM security role for pushing CloudWatch logs
- Click _"Create stack"_ to start the deployment of your Try Snowplow application

You have just started deployment of Try Snowplow into your own Virtual Private Cloud environment.

### During installation

This installation takes around 10 minutes to run. At this point you can close AWS console and you will receive an email from Try Snowplow once the deployment is complete.

Once the infrastructure is installed, the system will assign you a dedicated, secure `.try-snowplow.com` URL that you will use to track events. This can take a minute or two, in the meantime you can get started with tracking events.

## Further security considerations

Try Snowplow is designed to be secure by default, however if you wish to further tighten security you can take the following measures using

#### Limited deployment privileges

Some organizations impose limited access policies by using AWS Permissions Boundary. If your organization has this setup you can specify the Permissions Boundary ARN during setup in the `PermissionsBoundaryArn` field.

_Requires you to select the Advanced Install _option_._

#### Restricting access to the database

You can physically restrict access to your database to IPs matching a filter by editing the Security Groups definitions.

##### As part of install

You can specify an IP address range to limit access to your database during install in the `DatabaseAccessIPs` field.

##### Post-install

If you use the basic installer and later decide you wish to add this security layer you can do so by following these steps:

- Navigate to [EC2 Service in your AWS console account](https://console.aws.amazon.com/ec2/v2/home), making sure you are in the same region where you installed your Try Snowplow stack.
- Go to Security Groups.

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2020/10/Screen-Shot-2020-10-20-at-09.45.43.png?w=1024)

- Find and select the security group named `$snowplow-sg-db` with the description _"Frontend Access to Database"_ (`snowplow` may also be your custom stack name if you provided one).
- In the panel that opens select the `Inbound rules` tab and click _"Edit inbound rules"_.
- Remove the existing rule if it is no longer needed (ie. `0.0.0.0/0` filter will allow for anyone with database credentials to initiate connection).

![](https://docs.snowplowanalytics.com/wp-content/uploads/sites/2/2020/10/Screen-Shot-2020-10-20-at-09.45.56.png?w=1024)

- In editor change the `Source` value. There can be many rules applied to the same security group, so you can even set individual IP addresses in separate rules. Set a description for future reference.
- Accept by clicking the _"Save rules"_ button.

Traffic to your Try Snowplow pipeline will be dropped for a very brief period of time while the new rule is created.
