---
title: "Setting up Snowplow Local"
date: "2025-04-14"
sidebar_position: 4
sidebar_label: "Snowplow Local"
---

## What is Snowplow Local?

Snowplow Local is a local-first limited version of the Snowplow data pipeline that's developer focused by allowing you to run the core Snowplow components locally.

This includes the Collector and Enricher as well as any of the streaming loaders for loading into BigQuery, Snowflake, Databricks or a data lake.

Snowplow Local represents a quick way to get up and running with minimal effort. It uses Docker Compose to spin up and includes a basic UI to track events so you can see them undergoing enrichment throughout your pipeline in real time.

Although Snowplow Local provides the core software for collecting, enriching, and storing events it only contains a minimal user interface for the control plane. For a more comprehensive UI consider [Snowplow BDP](https://docs.snowplow.io/docs/get-started/snowplow-bdp/) instead.

## Who is Snowplow Local for?

Snowplow Local is designed for developers, data engineers and data scientists who want to develop, test and debug Snowplow pipelines locally without needing to deploy to a cloud environment. It's  also useful for those who want to test or experiment with new features or changes to the pipeline without affecting a production environment.

Snowplow Local requires some familiarity with Docker and as a result is best suited for more technical users that are comfortable with the basics of the command line and editing configuration files.

## What can you do with Snowplow Local?
[*] Develop and test new schemas and enrichments
[*] Test out new loaders (e.g., Snowflake, BigQuery, Lake Loader)
[*] View bad, incomplete and good events in an easy-to-use user interface
[*] Test changes to the pipeline configuration (Collector, Enrich, etc)
[*] Stream data to your data warehouse or lake of choice
[*] Monitor pipeline performance and metrics using Grafana
[*] Test new or existing versions of the Snowplow pipeline
[*] Write enriched data to remote destinations (including S3, GCS etc)
[*] Test and validate Snowbridge configurations
[*] Send events remotely from another machine to your local pipeline (via --profile tunnel)
[*] Query data locally using DuckDB (when using the Lake Loader and Iceberg or Delta format)

## What you will need

You will need docker and docker compose installed, as well as access to the [GitHub repository](https://github.com/snowplow-incubator/snowplow-local).

You don't need access to any cloud environments or specific credentials.

Snowplow Local is available on GitHub [here](https://github.com/snowplow-incubator/snowplow-local). It's straightforward to spin up - for instructions see the [README.md](https://github.com/snowplow-incubator/snowplow-local/blob/main/README.md)

