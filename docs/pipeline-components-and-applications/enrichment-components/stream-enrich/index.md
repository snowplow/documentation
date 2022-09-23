---
title: "stream-enrich"
date: "2020-11-09"
sidebar_position: 800
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::note

`stream-enrich-kinesis` will soon be deprecated in favor of [enrich-kinesis](/docs/pipeline-components-and-applications/enrichment-components/enrich-kinesis/index.md). We recommend switching when you have the opportunity.

:::

## Available on Terraform Registry

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest)

A Terraform module is available which deploys Stream Enrich on a AWS EC2 without the need for this manual setup.

## Run Stream Enrich

Stream Enrich is on docker hub with several different flavours. Pull the image that matches the source/sink you are using:

<CodeBlock language="bash">{
`docker pull snowplow/stream-enrich-kinesis:${versions.enrich}
docker pull snowplow/stream-enrich-kafka:${versions.enrich}
docker pull snowplow/stream-enrich-nsq:${versions.enrich}
`}</CodeBlock>

The application is configured by passing a hocon file on the command line:

<CodeBlock language="bash">{
`docker run --rm \\
      --log-driver awslogs \\
      --log-opt awslogs-group=\${log_group_name} \\
      --log-opt awslogs-stream=\$(ec2metadata --instance-id) \\
      -v \${path_to_config_dir}:/snowplow/config \\
      snowplow/stream-enrich-\${message_queue}:${versions.enrich} \\
      --config /snowplow/config/config.hocon \\
      --resolver file:/snowplow/config/iglu_resolver.json \\
      --enrichments file:/snowplow/config/enrichments/
`}</CodeBlock>


Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

<CodeBlock language="bash">{
`java -jar snowplow-stream-enrich-kinesis-${versions.enrich}.jar \\
  --config /path/to/config.hocon \\
  --enrichments file:/path/to/enrichments/ \\
  --resolver file:/path/to/iglu_resolver.json \\
  --force-cached-files-download
`}</CodeBlock>

The [configuration guide](/docs/pipeline-components-and-applications/enrichment-components/stream-enrich/configure-stream-enrich/index.md) describes how to construct the config, enrichments, and resolver input files.[](https://github.com/snowplow/snowplow/wiki/_Footer/_edit)
