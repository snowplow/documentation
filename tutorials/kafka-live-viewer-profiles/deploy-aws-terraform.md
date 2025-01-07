---
position: 3
title: Deploy on AWS with Terraform
---

# Deploy on AWS with Terraform

## Introduction

The following [Steps](#steps) will allow you to create an infrastructure on AWS and access it. There is no need to manually install [Terraform](https://www.terraform.io/). It is executed via [Docker](https://www.docker.com/) using the `terraform.sh` script.

## Steps to deploy the application

### Step 0: Prerequisites

1. Open a terminal.
2. Install **Docker** and **Docker Compose**.
3. [Clone the project](https://github.com/snowplow-incubator/live-viewer-profiles) and navigate to its directory.
4. Create a `.env` file based on `.env.example` and configure AWS variables.


### Step 1: Initialize the project

```bash
$ ./terraform.sh init
```

### Step 2: Create the infrastructure

```bash
$ ./terraform.sh apply
```

### Step 3: Access the EC2 instance that runs the apps in AWS

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

### Step 4: Open access to the applications

Review the [Localstack guide](/tutorials/kafka-live-viewer-profiles/quickstart-localstack) for the default configuration for each component. Open public access to the two frontend applications and the Snowplow Collector so that anyone can watch the video, submit events to the pipeline, and see information on concurrent users. 

---

## Other commands

### Check versions

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

### Check the Terraform plan

```bash
$ ./terraform.sh plan
```

### Generate a PNG image for the Terraform modules in this project

```bash
$ ./terraform.sh png
```

Current PNG image of the available modules:

![Terraform Modules](images/terraform.png)

### Destroy the infrastructure

```bash
$ ./terraform.sh destroy
```
