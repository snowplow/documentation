---
title: "Quick Start FAQs"
date: "2021-07-08"
sidebar_position: 200
---

#### **Why is there a limit on throughput?** 

Each Snowplow application is deployed as a docker image on a single EC2/ CE instance. This, along with the streams themselves (AWS only), are the limiting factor when it comes to throughput. We made this decision for the following reasons:

- We wanted to keep the costs of this experience low, and using ECS fargate or kubernetes would be more expensive 
- A single instance per application is more than enough resource for a proof of concept or first production use case and to get you started with our OSS

#### **How do I shut down the pipeline?**

If you would like to shut down your pipeline then you can easily do so by running `terraform destroy`.

Note that if you want to delete your S3 bucket and Postgres databases you would need to do that from within the AWS or Google cloud console. If you want to maintain these then you can - just be aware that next time you spin up your pipeline you might see errors when the script to create the S3 bucket and Postgres DBs is running.

#### **How do I make the pipeline production ready?**

If you are at the point where you would like to deliver higher volume production use cases, then here are some general guidelines on delivering a highly available, auto scaling pipeline:

On AWS:

- Ensure you are using the `secure` variant of the Quick Start
- Setting up CloudWatch alarms and Auto-scaling for each pipeline component
    - You can find extensive documentation on AWS CloudWatch which will guide you on what needs to be done to deliver a highly available, autoscaling pipeline
- Set your Collector min\_size to 2 at a minimum to ensure availability in case of availability zone outages: [https://github.com/snowplow-devops/terraform-aws-collector-kinesis-ec2/blob/main/variables.tf#L60-L70](https://github.com/snowplow-devops/terraform-aws-collector-kinesis-ec2/blob/main/variables.tf#L60-L70)
- Set up your max\_size for all the EC2 groups to a number bigger than 2 to ensure they can scale horizontally
- Ensure your RDS instances are setup with multi availability zones configured: [https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L92-L96](https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L92-L96)
- Set the max\_kcl\_capacity for read & write to something substantially higher than the default (it will auto-scale up to that limit) - its the same variables for all Kinesis consumers ([https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2/blob/main/variables.tf#L63-L85](https://github.com/snowplow-devops/terraform-aws-enrich-kinesis-ec2/blob/main/variables.tf#L63-L85))
- Ensure your RDS for the Postgres Loaders can auto-scale its capacity - this will mean you won't run out of disk when you start tracking events in: [https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L62-L66](https://github.com/snowplow-devops/terraform-aws-rds/blob/main/variables.tf#L62-L66)

#### **How do I upgrade the version of the application that I am using?** 

We release new versions of our pipeline components very frequently; however the versions used within the terraform modules are updated [in line with our platform releases](https://snowplowanalytics.com/blog/2021/04/29/introducing-snowplow-21-04-pennine-alps/) since these are the most stable and recommended versions of our components. [Sign-up to get the latest updates](https://go.snowplowanalytics.com/get-snowplow-technology-updates) on platform releases and new features.  

When a new version of a module is released, follow these instructions to upgrade: 

- Update the module version in your terraform
- Run `terraform plan` to check for what changes will be made

With the standard deployment, you will only have a single collector instance. This means you will experience brief downtime, typically less than a minute. To prevent this you will need to move to multiple collector set up, so there are multiple collector instances behind the load balancer.

#### Which enrichments are enabled by default?

The following enrichments are enabled by default within the Enrich module:

- [UA parser](/docs/migrated/enriching-your-data/available-enrichments/ua-parser-enrichment/)
- [YAUAA](/docs/migrated/enriching-your-data/available-enrichments/yauaa-enrichment/) 
- [Campaign Attribution](/docs/migrated/enriching-your-data/available-enrichments/campaign-attribution-enrichment/)
- [Event fingerprint](/docs/migrated/enriching-your-data/available-enrichments/event-fingerprint-enrichment/) 
- [Referer parser](/docs/migrated/enriching-your-data/available-enrichments/referrer-parser-enrichment/)

Other available enrichments enrichments and the configurations can be found [here.](/docs/migrated/enriching-your-data/available-enrichments/)

To enable a different enrichment would need to add the [appropriate terraform inputs](https://registry.terraform.io/modules/snowplow-devops/enrich-kinesis-ec2/aws/latest?tab=inputs) to the [`snowplow-devops/enrich-kinesis-ec2/aws` module.](https://github.com/snowplow/quickstart-examples/blob/main/terraform/aws/pipeline/default/main.tf#L111-L139)

#### Troubleshooting Terraform Errors

The following are some common errors that you might encounter when running `terraform plan` or `terraform apply`.

AWS:

**Error: Invalid provider configuration**

`Provider "registry.terraform.io/hashicorp/aws" requires explicit configuration. Add a provider block to the root module and configure the provider's required arguments as described in the provider documentation.`

**Solution:** Double check that your AWS Access Key ID and AWS Secret Access Key are set up correctly (with no typos) using the `aws configured` command.

**Error:** **"x.x.x.x" is not a valid CIDR block**

`"x.x.x.x" is not a valid CIDR block: invalid CIDR address: x.x.x.x with module.iglu_server.aws_security_group_rule.ingress_tcp_22, on .terraform/modules/iglu_server/main.tf line 143, in resource "aws_security_group_rule" "ingress_tcp_22": 143:   cidr_blocks       = var.ssh_ip_allowlist`

**Solution**: Add a mask to the IP in your terraform.tvars file, e.g. x.x.x.x/32

**Error creating application Load Balancer**

`ValidationError: At least two subnets in two different Availability Zones must be specified status code: 400`

**Solution**: Add subnets to cover at least 2 availability zones. See this [AWS guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-public-private-vpc.html) on how to set this up.

After this step, add the two freshly created subnets to your `terraform.tfvars` file like this: public\_subnet\_ids = \["subnet-00000000", "subnet-00000001"\] and run `terraform apply` again.

**Error creating DB Subnet Group**

`DBSubnetGroupDoesNotCoverEnoughAZs: DB Subnet Group doesn't meet availability zone coverage requirement. Please add subnets to cover at least 2 availability zones. Current coverage: 1 status code: 400`

**Solution**: Add subnets to cover at least 2 availability zones. See this [AWS guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-public-private-vpc.html) on how to set this up.

After this step, add the two freshly created subnets to your `terraform.tfvars` file like this: public\_subnet\_ids = \["subnet-00000000", "subnet-00000001"\] and run `terraform apply` again. 

**Error creating DB Instance: InvalidParameterValue**

`The parameter MasterUserPassword is not a valid password. Only printable ASCII characters besides '/', '@', '"', ' ' may be used.`

**Solution**: Modify the iglu\_db\_password in your terraform.tfvars file so that it does not contain any forbidden characters like '\_', '\*'. Make sure the password is not longer than 13 characters.
