---
title: "Set up"
description: "Set up Snowplow Stream Collector to receive and process behavioral events from trackers and webhooks."
schema: "TechArticle"
keywords: ["Collector Setup", "Stream Collector", "Collection Setup", "Event Ingestion", "Data Collection", "Collector Installation"]
date: "2021-08-04"
sidebar_position: 1
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/collector-kinesis-ec2/aws/latest)

A Terraform module is available which deploys the collector on a AWS EC2 without the need for this manual setup.

## Run the collector

The collector is on docker hub with several different flavours. Pull the image that matches the sink you are using:

<CodeBlock language="bash">{
`docker pull snowplow/scala-stream-collector-kinesis:${versions.collector}
docker pull snowplow/scala-stream-collector-pubsub:${versions.collector}
docker pull snowplow/scala-stream-collector-kafka:${versions.collector}
docker pull snowplow/scala-stream-collector-rabbitmq-experimental:${versions.collector}
docker pull snowplow/scala-stream-collector-nsq:${versions.collector}
docker pull snowplow/scala-stream-collector-sqs:${versions.collector}
docker pull snowplow/scala-stream-collector-stdout:${versions.collector}
`}</CodeBlock>

The application is configured by passing a hocon file on the command line:

<CodeBlock language="bash">{
`docker run --rm \\
  -v $PWD/config.hocon:/snowplow/config.hocon \\
  -p 8080:8080 \\
  snowplow/scala-stream-collector-\${flavour}:${versions.collector} --config /snowplow/config.hocon
`}</CodeBlock>

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/stream-collector/releases).

<CodeBlock language="bash">{
`java -jar scala-stream-collector-kinesis-${versions.collector}.jar --config /path/to/config.hocon
`}</CodeBlock>

```mdx-code-block
import Telemetry from "@site/docs/reusable/telemetry/_index.md"

<Telemetry name="Collector" since="2.4.0" idSetting="collector.telemetry.userProvidedId" disableSetting="collector.telemetry.disable" />
```

## Health check

Pinging the collector on the /health path should return a 200 OK response:

```bash
curl http://localhost:8080/health
```
