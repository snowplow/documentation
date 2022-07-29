---
title: "(to be deprecated) Stream Enrich"
date: "2020-11-09"
sidebar_position: 10
---

## Available on Terraform Registry[](/docs/migrated/pipeline-components-and-applications/stream-collector/setup/#available-on-terraform-registry)

[![](https://img.shields.io/static/v1?label=Terraform&message=Registry&color=7B42BC&logo=terraform)](https://registry.terraform.io/modules/snowplow-devops/iglu-server-ec2/aws/latest)

A Terraform module is available which deploys Stream Enrich on a AWS EC2 without the need for this manual setup.

## Run Stream Enrich[](/docs/migrated/pipeline-components-and-applications/stream-collector/setup/#run-the-collector)

Stream Enrich is on docker hub with several different flavours. Pull the image that matches the source/sink you are using:

```
docker pull snowplow/stream-enrich-kinesis:3.2.2
docker pull snowplow/stream-enrich-kafka:3.2.2
docker pull snowplow/stream-enrich-nsq:3.2.2
```

The application is configured by passing a hocon file on the command line:

```
docker run --rm \
      --log-driver awslogs \
      --log-opt awslogs-group=${log_group_name} \
      --log-opt awslogs-stream=`ec2metadata --instance-id` \
      -v ${path_to_config_dir}:/snowplow/config \
      snowplow/stream-enrich-${message_queue}:${version} \
      --config /snowplow/config/config.hocon \
      --resolver file:/snowplow/config/iglu_resolver.json \
      --enrichments file:/snowplow/config/enrichments/
```

Alternatively, you can download and run [a jar file from the github release](https://github.com/snowplow/enrich/releases).

```
java -jar snowplow-stream-enrich-kinesis-3.2.2.jar \
  --config /path/to/config.hocon \
  --enrichments file:/path/to/enrichments/ \
  --resolver file:/path/to/iglu_resolver.json \
  --force-cached-files-download
```

The [configuration guide](/docs/migrated/pipeline-components-and-applications/enrichment-components/stream-enrich/configure-stream-enrich/) describes how to construct the config, enrichments, and resolver input files.[](https://github.com/snowplow/snowplow/wiki/_Footer/_edit)
