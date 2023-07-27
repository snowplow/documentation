---
title: "Open Source quick start: frequently asked questions"
sidebar_label: "Frequently asked questions"
sidebar_position: 5
---

## How do I shut down the pipeline?

If you would like to shut down your pipeline then you can easily do so by running `terraform destroy`.

Note that if you want to delete your S3 bucket or Postgres database, you would need to do that from within the AWS, GCP or Azure console. If you want to maintain these then you can - just be aware that next time you spin up your pipeline you might see some errors.

## How do I make the pipeline production ready?

Each Snowplow application is deployed as a docker image on a single EC2 / CE / VMSS instance. This, along with the streams themselves (AWS and Azure only), are the limiting factors when it comes to throughput.

If you are at the point where you would like to deliver higher volume production use cases, then here are some general guidelines on delivering a highly available, auto scaling pipeline:

On AWS:

- Setting up CloudWatch alarms and Auto-scaling for each pipeline component
    - You can find extensive documentation on AWS CloudWatch which will guide you on what needs to be done to deliver a highly available, autoscaling pipeline
- Set your Collector `min_size` to 2 at a minimum to ensure availability in case of availability zone outages: [https://github.com/snowplow-devops/terraform-aws-collector-kinesis-ec2/blob/main/variables.tf#L60-L70](https://github.com/snowplow-devops/terraform-aws-collector-kinesis-ec2/blob/main/variables.tf#L60-L70)
- Set up your `max_size` for all the EC2 groups to a number bigger than 2 to ensure they can scale horizontally
- Ensure your RDS instances are setup with multi availability zones configured: [https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L92-L96](https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L92-L96)
- Set the `max_kcl_capacity` for read & write to something substantially higher than the default (it will auto-scale up to that limit) - it’s the same variables for all Kinesis consumers ([https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2/blob/main/variables.tf#L63-L85](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2/blob/main/variables.tf#L63-L85))
- Ensure your RDS for the Postgres Loaders can auto-scale its capacity - this will mean you won't run out of disk when you start tracking events in: [https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L62-L66](https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L62-L66)

:::note

For advice on how to scale an AWS Pipeline for Production scale workloads, you can check out our webinar on ["Battle hardening Snowplow Open Source"](https://snowplow.io/events/battle-hardening-snowplow-os-emea/).

:::

## How do I upgrade the version of the application that I am using?

We release new versions of our pipeline components very frequently; however the versions used within the terraform modules are updated a few times a year to the most stable and recommended versions of our components. [Sign up to get the latest updates](https://go.snowplowanalytics.com/get-snowplow-technology-updates) on platform releases and new features.  

When a new version of a module is released, follow these instructions to upgrade: 

- Update the module version in your terraform
- Run `terraform plan` to check for what changes will be made

:::caution

With the standard deployment, you will only have a single collector instance. This means you will experience brief downtime, typically less than a minute. To prevent this, you will need to move to a multi-collector setup, so there are multiple collector instances behind the load balancer.

:::

## Which enrichments are enabled by default?

The following enrichments are enabled by default within the Enrich module:

- [UA parser](/docs/enriching-your-data/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/enriching-your-data/available-enrichments/yauaa-enrichment/index.md) 
- [Campaign Attribution](/docs/enriching-your-data/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/enriching-your-data/available-enrichments/event-fingerprint-enrichment/index.md) 
- [Referer parser](/docs/enriching-your-data/available-enrichments/referrer-parser-enrichment/index.md)

Other available enrichments enrichments and the configurations can be found [here](/docs/enriching-your-data/available-enrichments/index.md).

Follow the [documentation](/docs/enriching-your-data/managing-enrichments/terraform/index.md) if you want to enable or disable certain enrichments.

## Troubleshooting Terraform Errors

The following are some common errors that you might encounter when running `terraform plan` or `terraform apply`.

AWS:

**Error: Invalid provider configuration**

`Provider "registry.terraform.io/hashicorp/aws" requires explicit configuration. Add a provider block to the root module and configure the provider's required arguments as described in the provider documentation.`

**Solution:** Double check that your AWS Access Key ID and AWS Secret Access Key are set up correctly (with no typos) using the `aws configure` command.

**Error:** **"x.x.x.x" is not a valid CIDR block**

`"x.x.x.x" is not a valid CIDR block: invalid CIDR address: x.x.x.x with module.iglu_server.aws_security_group_rule.ingress_tcp_22, on .terraform/modules/iglu_server/main.tf line 143, in resource "aws_security_group_rule" "ingress_tcp_22": 143:   cidr_blocks       = var.ssh_ip_allowlist`

**Solution**: Add a mask to the IP in your terraform.tvars file, e.g. `x.x.x.x/32`.

**Error creating Application Load Balancer**

`ValidationError: At least two subnets in two different Availability Zones must be specified status code: 400`

**Solution**: Add subnets to cover at least 2 availability zones. See this [AWS guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-public-private-vpc.html) on how to set this up.

After this step, add the two freshly created subnets to your `terraform.tfvars` file like this: `public_subnet_ids = ["subnet-00000000", "subnet-00000001"]` and run `terraform apply` again.

**Error creating DB Subnet Group**

`DBSubnetGroupDoesNotCoverEnoughAZs: DB Subnet Group doesn't meet availability zone coverage requirement. Please add subnets to cover at least 2 availability zones. Current coverage: 1 status code: 400`

**Solution**: Add subnets to cover at least 2 availability zones. See this [AWS guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-public-private-vpc.html) on how to set this up.

After this step, add the two freshly created subnets to your `terraform.tfvars` file like this: `public_subnet_ids = ["subnet-00000000", "subnet-00000001"]` and run `terraform apply` again. 

**Error creating DB Instance: InvalidParameterValue**

`The parameter MasterUserPassword is not a valid password. Only printable ASCII characters besides '/', '@', '"', ' ' may be used.`

**Solution**: Modify the `iglu_db_password` in your `terraform.tfvars` file so that it does not contain any forbidden characters like '_', '\*'. Make sure the password is not longer than 13 characters.
