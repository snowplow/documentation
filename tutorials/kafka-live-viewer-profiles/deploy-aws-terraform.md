---
position: 3
title: Deploy to AWS with Terraform
---

# Deploy on AWS with Terraform

## Introduction

The following [Steps](#steps) will allow you to create an infrastructure on AWS and access it. There is no need to manually install [Terraform](https://www.terraform.io/). It is executed via [Docker](https://www.docker.com/) using the `terraform.sh` script.

To follow these [Steps](#steps), ensure you have correctly configured the `../.env` file in the root of this project.

> **Note**: There is a file `../.env.sample`. Copy it to `../.env` and edit the variables accordingly with your environment.

## Prerequisites

To follow this accelerator, you will need:

- **Development Environment**
  - A system with Docker installed
  - Basic knowledge of Java programming and Docker usage
  - Familiarity with terminal/command-line tools

- **Technical Skills**
  - Understanding of event-driven architectures
  - Experience with **Apache Kafka**
  - Basic knowledge of AWS services, especially **DynamoDB**

- **Cloud Setup**
  - An AWS account

## Steps

### Step 1 → Initialize the project

```bash
$ ./terraform.sh init
```

### Step 2 → Create the infrastructure

```bash
$ ./terraform.sh apply
```

### Step 3 → Access the EC2 instance that runs the apps in AWS

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

---

## Other Commands

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
