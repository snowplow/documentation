---
title: "Community Edition quick start: frequently asked questions"
description: "Frequently asked questions about Snowplow Community Edition open-source behavioral data platform."
schema: "TechArticle"
keywords: ["Community FAQ", "Community Edition", "Open Source", "FAQ Guide", "Common Questions", "Community Help"]
sidebar_label: "Frequently asked questions"
sidebar_position: 5
---

## How do I shut down the pipeline?

If you would like to shut down your pipeline then you can easily do so by running `terraform destroy`.

Note that if you want to delete your S3 bucket or Postgres database, you would need to do that from within the AWS, GCP or Azure console. If you want to maintain these then you can - just be aware that next time you spin up your pipeline you might see some errors.

## How do I upgrade the version of the application that I am using?

We release new versions of our pipeline components very frequently; however the versions used within the terraform modules are updated a few times a year to the most stable and recommended versions of our components. [Sign up to get the latest updates](https://go.snowplowanalytics.com/get-snowplow-technology-updates) on platform releases and new features.

When a new version of a module is released, follow these instructions to upgrade:

- Update the module version in your terraform
- Run `terraform plan` to check for what changes will be made

## Which enrichments are enabled by default?

The following enrichments are enabled by default within the Enrich module:

- [UA parser](/docs/pipeline/enrichments/available-enrichments/ua-parser-enrichment/index.md)
- [YAUAA](/docs/pipeline/enrichments/available-enrichments/yauaa-enrichment/index.md)
- [Campaign Attribution](/docs/pipeline/enrichments/available-enrichments/campaign-attribution-enrichment/index.md)
- [Event fingerprint](/docs/pipeline/enrichments/available-enrichments/event-fingerprint-enrichment/index.md)
- [Referer parser](/docs/pipeline/enrichments/available-enrichments/referrer-parser-enrichment/index.md)

Other available enrichments enrichments and the configurations can be found [here](/docs/pipeline/enrichments/available-enrichments/index.md).

Follow the [documentation](/docs/pipeline/enrichments/managing-enrichments/terraform/index.md) if you want to enable or disable certain enrichments.

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
