---
position: 3
title: Deploy on AWS with Terraform
---

# Deploy on AWS with Terraform

## Introduction

The following [Steps](#steps) will deploy the solution accelerator to AWS using Terraform. There is no need to manually install [Terraform](https://www.terraform.io/). It is executed via [Docker](https://www.docker.com/) using the `terraform.sh` script.

## Steps to Deploy the Application

### Step 0: Prerequisites

1. Open a terminal.
2. Install **Docker** and **Docker Compose**.
3. [Clone the project](https://github.com/snowplow-incubator/live-viewer-profiles) and navigate to its directory.
```bash
git clone https://github.com/snowplow-incubator/live-viewer-profiles.git
```
4. Create a `.env` file based on `.env.example` and configure AWS variables.
```bash
ACCEPT_LICENSE="true"
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxx
```


### Step 1: Initialize the Project

```bash
$ ./terraform.sh init
```

### Step 2: Create the Infrastructure

```bash
$ ./terraform.sh apply
```

### Step 3: Access the EC2 Instance that Runs the Apps in AWS

```bash
$ ./apps/ssh.sh
```

Inside the EC2 instance, you can control the Docker images in a similar way to how you do locally:

```bash
$ cd snowplow-demo

$ ./stats.sh # <- show the statistics for the Docker containers
$ ./down.sh  # <- stop the Docker containers
$ ./up.sh    # <- start the Docker containers
```

### Step 4: Open Access to the Applications

Review the [LocalStack guide](/tutorials/kafka-live-viewer-profiles/quickstart-localstack) for the default configuration for each component. Open public access to the two frontend applications and the Snowplow Collector using a HTTP load balancer so that anyone can watch the video, submit events to the pipeline, and see information on concurrent users. 

The applications listen for HTTP traffic on the following ports
- Web tracker front end - 3000
- Live viewer front end - 8280
- Snowplow collector - 9090

---

## Other Commands

### Check Versions

```bash
$ ./terraform.sh --version
```
Example response
```bash
Terraform v1.10.0
on linux_amd64
+ provider registry.terraform.io/hashicorp/aws v5.79.0
+ provider registry.terraform.io/hashicorp/local v2.5.2
+ provider registry.terraform.io/hashicorp/tls v4.0.6
```

### Check the Terraform Plan

```bash
$ ./terraform.sh plan
```

### Generate a PNG Image for the Terraform Modules in This Project

```bash
$ ./terraform.sh png
```

Current PNG image of the available modules:

![Terraform Modules](images/terraform.png)

### Destroy the Infrastructure

```bash
$ ./terraform.sh destroy
```
