---
title: "Set up the stream collector"
date: "2021-08-04"
sidebar_position: -10
---

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/collector-kinesis-ec2/aws/latest)

A Terraform module is available which deploys the stream collector on a AWS EC2 without the need for this manual setup.

## Run the collector

The stream collector is on docker hub with several different flavours. Pull the image that matches the sink you are using:

```bash
docker pull snowplow/scala-stream-collector-kinesis:2.7.0
docker pull snowplow/scala-stream-collector-pubsub:2.7.0
docker pull snowplow/scala-stream-collector-kafka:2.7.0
docker pull snowplow/scala-stream-collector-nsq:2.7.0
docker pull snowplow/scala-stream-collector-stdout:2.7.0
```

The application is configured by passing a hocon file on the command line:

```bash
docker run --rm \
  -v $PWD/config.hocon:/snowplow/config.hocon \
  -p 8080:8080 \
  snowplow/scala-stream-collector-${flavour}:2.7.0 --config /snowplow/config.hocon
```

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/stream-collector/releases).

```bash
java -jar scala-stream-collector-kinesis-2.7.0.jar --config /path/to/config.hocon
```

## Health check

Pinging the collector on the /health path should return a 200 OK response:

```bash
curl http://localhost:8080/health
```
