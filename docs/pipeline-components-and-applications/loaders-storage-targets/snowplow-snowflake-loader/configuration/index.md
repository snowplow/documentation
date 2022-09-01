---
title: "Configuration"
date: "2020-04-25"
sidebar_position: 10
---

Self-describing configuration JSON can contain following properties:

- `name` - Required human-readable configuration name, e.g. `Snowflake config`
- `id` - Optional machine-readable configuration id, e.g. UUID
- `auth` - Object, containing information about how Snowflake should authenticate itself to load transformed data from S3. Explained below
- `awsRegion` - AWS Region used by Transformer to access S3 and DynamoDB
- `manifest` - AWS DynamoDB table name with processing manifest. Needs to be created manually (e.g. `snowflake-event-manifest`)
- `snowflakeRegion` - AWS Region used by Snowflake to access its endpoint. Recommended to use same as `$AWS_REGION` if possible
- `database` - Snowflake Database name. Database must be created manually (e.g. `acme-snowplow`)
- `input` - S3 URL to Snowplow enriched events archive (e.g. `s3://com-acme-snowplow/archive/enriched/`)
- `stage` - Arbitrary name for Snowflake Stage. Stage created automatically during setup step (e.g. `snowplow_stage`)
- `stageUrl` - URL for Transformer-processed data (e.g. `s3://com-acme-snowplow/snowflake/stage/`)
- `badOutputUrl` - URL for bad rows (e.g. `s3://com-acme-snowplow/snowflake/badrow`)
- `warehouse` - Snowflake Warehouse. Warehouse automatically created during setup step (e.g. `snowplow_wh`)
- `schema` - Snowflake DB schema. Schema automatically created during setup step (e.g. `atomic`)
- `account` - Snowflake account name. Must be obtained from Snowflake
- `username` - Snowflake username. Must be obtained from Snowflake
- `password` - Explained below
- `maxError` - Optional Snowflake setting - a table copy statement will skip an input file when the number of errors in it exceeds the specified number. This setting is used during intiail loading and thus can filter out only invalid JSONs (which is impossible situation if used with Transformer)
- `jdbcHost` - An optional host for the JDBC driver that has priority over automatically derived hosts.
- `purpose` - Always `ENRICHED_EVENTS`

Following authentication options (`auth`) are possible:

- `integrationName` - Name of storage integration. Recommended!
- `roleArn` and `sessionDuration` - Temporary credentials
- `accessKeyId` and `secretAccessKey` - Static AWS credentials. Do not use this when launching loader as EMR step

`password` can be passed in two forms:

- As `ec2ParameterStore` object. Password will be safely stored in EC2 Parameter store and not exposed. Recommended
- Plain string

Final configuration can look like following:

```
{
  "schema": "iglu:com.snowplowanalytics.snowplow.storage/snowflake_config/jsonschema/1-0-3",
  "data": {
    "name": "Strawberry",
    "awsRegion": "us-east-1",
    "auth": {
        "integrationName": "SNOWPLOW_S3_INTEGRATION"
    },
    "manifest": "snowplow-snowflake-manifest",
    "snowflakeRegion": "us-west-2",
    "database": "snowplowdb",
    "input": "s3://archive/enriched/",
    "stage": "snowplow_stage",
    "badOutputUrl": "s3://archive/snowflake/badrow",
    "stageUrl": "s3://archive/snowflake/transformed/",
    "warehouse": "wh",
    "schema": "atomic",
    "account": "acme",
    "username": "loader",
    "password": {
        "ec2ParameterStore": {
            "parameterName": "snowplow.snowflake.password"
        }
    },
    "maxError": 1,
    "jdbcHost": "acme.snowflakecomputing.com",
    "purpose": "ENRICHED_EVENTS"
  }
}
```

`stageUrl` and `integrationName` from loader config are used only for `setup` subcommand and they are not used in `COPY INTO TABLE`, however `COPY INTO TABLE` performs consistency check to make sure stage is configured with the integration name provided in loader config.

Also, both loader and transformer require Iglu Resolver configuration JSON. So far it used only to validate configuration JSON.

Both configuration and resolver can be passed as base64-encoded string with additional `--base64` flag. Loader also can be invoked from local machine with plain file-paths (`--base64` need to be omitted then).
