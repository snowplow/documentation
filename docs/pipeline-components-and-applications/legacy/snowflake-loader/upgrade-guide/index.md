---
title: "Upgrade guide"
date: "2020-04-25"
sidebar_position: 40
---

## Upgrading from 0.1.0

- To update Snowflake infrastructure another `setup` must be launched - it'll create a new file format `snowplow_enriched_json`
- Both `setup` and `load` subcommands now accept required `--snowflake-region` option

## Upgrading from 0.2.0

- Biggest change is that both transformer and loader now accept common configuration file (`--configuration`) and Iglu Resolver config (`--resolver`) instead of specific CLI options
- Static credentials are considered deprecated now, use AWS Role (or Snowflake stage)
- If you don't want to store credentials in config and already have existing stage - you'll need to [add credentials](https://github.com/snowplow-incubator/snowplow-snowflake-loader/wiki/Setup-Guide#creds) to stage object.
- Snowflake transformer now depends on Spark 2.2.0 and therefore requires `amiVersion` in `cluster.json` to be set to `5.9.0`

## Upgrading from 0.3.0

- Due to several columns in atomic.events being widened to support pseudonymization and MaxMind changes, the table schema on Snowflake will need to be migrated - in order to automatically update the relevant column definitions, run `java -jar snowplow-snowflake-loader-0.4.0.jar migrate --loader-version 0.4.0`

## Upgrading from 0.4.0

- Due to bad row support, URL of S3 bucket which bad rows will be written need to specified in the config with `badOutputUrl` config field. Also, Snowflake config version need to be bumped to `1-0-2` in the self describing json.

## Upgrading from 0.6.x to 0.7.x

Nothing required unless we want to authenticate loader via storage integration.

To upgrade Loader from 0.6.x to 0.7.x,

- Drop existing stage at Snowflake
    - Re-creating stage is required to use storage integration
- Follow [the setup page](/docs/pipeline-components-and-applications/legacy/snowflake-loader/setup/index.md) and create storage integration
- Create an external stage per [Snowflake docs](https://docs.snowflake.com/en/user-guide/data-load-s3-config.html#step-6-create-an-external-stage) step 6.
- Follow [the configuration page](/docs/pipeline-components-and-applications/legacy/snowflake-loader/configuration/index.md) and update loader configuration

The setup page explicitly excludes step 6 for users running the loader for the first time, since loader's `setup` subcommand creates the stage compatible with the storage integration mechanism, along with other required entities. However, we assume that upgrading users have setup their loader previously where stage was created using IAM credentials, hence the need to re-create it.
