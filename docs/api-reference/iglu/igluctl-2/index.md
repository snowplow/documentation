---
title: "Igluctl CLI for schema management"
sidebar_label: "Iglu CLI"
sidebar_position: 10
description: "Command-line tool for validating, publishing, and managing JSON schemas in Iglu registries with DDL generation and verification."
keywords: ["igluctl", "schema validation", "iglu cli", "schema migration"]
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

Iglu is a schema repository for JSON Schema. A schema repository (sometimes called a registry) is like npm or Maven or git but holds data schemas instead of software or code. Iglu is used extensively in Snowplow.

<p> This document is for version {versions.igluctl}. </p>

## Igluctl

Iglu provides a CLI application, called igluctl which allows you to perform most common tasks on Iglu registry. So far, the overall structure of igluctl commands looks like the following:

- `lint` - validate set of JSON Schemas for syntax and consistency of their properties
- `static` - work with static Iglu registry
    - `generate` - verify that schema is evolved correctly within the same major version (e.g. from `1-a-b` to `1-c-d`) for Redshift and Postgres warehouses. Generate DDLs and migrations from set of JSON Schemas. If the schema is not evolved correctly and backward incompatible data is sent within transformer's aggregation window, loading would fail for all events.
    - `push` - push set of JSON Schemas from static registry to full-featured (Scala Registry for example) one
    - `pull` - pull set of JSON Schemas from registry to local folder
    - `deploy` - run entire schema workflow using a config file. This could be used to chain multiple commands, i.e. `lint` followed by `push` and `s3cp`.
    - `s3cp` - copy JSONPaths or schemas to S3 bucket
- `server` - work with an Iglu server
    - `keygen` - generate read and write API keys on Iglu Server
- `table-check` - will check a given Redshift or Postgres tables against iglu server.
- `verify` (since 0.13.0) - work with schemas to check their evolution
    - `redshift` - verify that schema is evolved correctly within the same major version (e.g. from `1-a-b` to `1-c-d`) for loading into Redshift. It reports the major schema versions within which schema evolution rules were broken.
    - `parquet` - verify that schema is evolved correctly within the same major version (e.g. from `1-a-b` to `1-c-d`) for parquet transformation (for loading into Databricks). It reports the breaking schema versions.

## Downloading and running Igluctl

Download the latest Igluctl from GitHub releases and unzip the file:

<CodeBlock language="bash">{
`$ wget https://github.com/snowplow/igluctl/releases/download/${versions.igluctl}/igluctl_${versions.igluctl}.zip
$ unzip igluctl_${versions.igluctl}.zip
`}</CodeBlock>

To run Igluctl you can, for example, can pass the `--help` option to see information on the different commands and flags like this:
```bash
$ ./igluctl --help
```
:::note
If you are on Windows, then you'll need to run Igluctl like this:
```bash
$ java -jar igluctl --help
```
Below and everywhere in documentation you'll find example commands without this `java -jar` prefix, so please remember to add it when running Igluctl.
:::

Note that Igluctl expects [JRE 8](http://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html) or later, and [Iglu Server](/docs/api-reference/iglu/iglu-repositories/iglu-server/index.md) 0.6.0 or later to run.

## lint

`igluctl lint` validates JSON Schemas.

It is designed to be run against file-based schema registries with the standard Iglu folder structure:

```
schemas
└── com.example
    └── my-schema
        └── jsonschema
            ├── 1-0-0
            └── 1-0-1
```

You can validate _all_ the schemas in the registry:

```bash
$ /path/to/igluctl lint /path/to/schema/registry/schemas
```

Alternatively you can validate an individual schema e.g.:

```bash
$ /path/to/igluctl lint /path/to/schema/registry/schemas/com.example_company/example_event/jsonschema/1-0-0
```

Examples of errors that are identified:

- JSON Schema has inconsistent self-describing information and path on filesystem
- JSON Schema has invalid `$schema` keyword. It should be always set to [iglu-specific](http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#), while users tend to set it to Draft v4 or even to self-referencing Iglu URI
- JSON Schema is invalid against its standard (empty `required`, string `maximum` and similar)
- JSON Schema contains properties which contradict each other, like `{"type": "integer", "maxLength": 0}` or `{"maximum": 0, "minimum": 10'}`. These schemas are inherently useless as for some valiators there is no JSON instance they can validate

The above cases can very hard to spot without a specialized tool as they are still valid JSONs and in last case it is even valid JSON Schemas - so will validate against a standard JSON schema validator.

`lint` has two options:

- `--skip-checks` which will lint without specified linters, given comma separated. To see available linters and their explanations, `$ /path/to/igluctl --help`
- `--skip-schemas` which will lint all the schemas except the schemas passed to this option as a comma separated list. For example running:
    `/path/to/igluctl lint /path/to/schema/registry/schemas --skip-schemas iglu:com.acme/click/jsonschema/1-0-1,iglu:com.acme/scroll/jsonschema/1-0-1`
    will lint all schemas in `/path/to/schema/registry/schemas` except the two schemas passed via `--skip-schemas`.

Note: `--severityLevel` option is deprecated and removed as of version 0.4.0.

Below are two groups of linters; allowed to be skipped and not allowed to be skipped. By default, all of them are enabled but igluctl users can skip any combination of `rootObject`, `unknownFormats`, `numericMinMax`, `stringLength`, `optionalNull`, `description` through `--skip-checks`.

Igluctl let you skip below checks:

| NAME             | DEFINITION                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `rootObject`     | Check that root of schema has object type and contains properties                                  |
| `unknownFormats` | Check that schema doesn’t contain unknown formats                                                  |
| `numericMinMax`  | Check that schema with numeric type contains both minimum and maximum properties                   |
| `stringLength`   | Check that schema with string type contains maxLength property or other ways to extract max length |
| `optionalNull`   | Check that non-required fields have null type                                                      |
| `description`    | Check that property contains description                                                           |

A sample usage could be as following:

```bash
$ ./igluctl lint --skip-checks description,rootObject /path/to/schema/registry/schemas
```

Note that linter names are case sensitive

Igluctl also includes many checks proving that schemas doesn’t have conflicting expectations (such as `minimum` value bigger than `maximum`). Schemas with such expectations are valid according to specification, but do not make any sense in real-world use cases. These checks are mandatory and cannot be disabled.

`igluctl lint` will exit with status code 1 if encounter at least one error.

## static generate

`igluctl static generate` generates corresponding [Redshift](http://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html) DDL files (`CREATE TABLE` statements) and migration scripts (`ALTER TABLE` statements).

As of version 0.11.0 this command will also validate the compatibility of schema family and display warnings if there is an incompatible evolution.

```bash
$ ./igluctl static generate $INPUT
```

You also can specify directory for output (current dir is used as default):

```bash
$ ./igluctl static generate --output $DDL_DIR $INPUT
```

### Generating migration Redshift table scripts to accommodate updated schema versions

If an input directory is specified with several self-describing JSON schemas with a single REVISION, Igluctl will generate migration scripts to update (`ALTER`) Redshift tables for older schema versions to support the latest schema version.

For example, having the following Self-describing JSON Schemas as an input:

- schemas/com.acme/click_event/1-0-0
- schemas/com.acme/click_event/1-0-1
- schemas/com.acme/click_event/1-0-2

Igluctl will generate the following migration scripts:

- sql/com.acme/click_event/1-0-0/1-0-1 to alter table from 1-0-0 to 1-0-1
- sql/com.acme/click_event/1-0-0/1-0-2 to alter table from 1-0-0 to 1-0-2
- sql/com.acme/click_event/1-0-1/1-0-2 to alter table from 1-0-1 to 1-0-2

This migrations (and all subsequent table definitions) are aware of column order and will ensure that new columns are added at the end of the table definition. This means that the tables can be updated in-place with single `ALTER TABLE` statements.

### Handling union types

One of the more problematic scenarios to handle when generating Redshift table definitions is handling `UNION` field types e.g. `["integer", "string"]`. Union types will be transformed as most general. In the above example (union of an integer and string type) the corresponding Redshift column will be a `VARCHAR(4096)`.

### Missing schema versions

`static generate` command will check versions of schemas inside `input` as following:

- If user specified folder and one of schemas has no 1-0-0 or misses any other schemas in between (like it has 1-0-0 and 1-0-2) - refuse to do anything (but proceed with –force option)
- If user specified full path to file with schema and this file is not 1-0-0 - just print a warning
- If user specified full path to file with schema and it is 1-0-0 - all good


## static push

`igluctl static push` publishes schemas stored locally to a remote [Iglu Server](https://github.com/snowplow/iglu-server).

It accepts three required arguments:

- `host` - Iglu Server host name or IP address with optional port and endpoint. It should conform to the pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys
- `path` - path to your static registry (local folder containing schemas)

Also it accepts optional `--public` argument which makes schemas available without `apikey` header.

```bash
$ ./igluctl static push /path/to/static/registry iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## static pull

`igluctl static pull` downloads schemas stored on a remote [](https://github.com/snowplow/iglu/tree/master/2-repositories/iglu-server)[Iglu Server](https://github.com/snowplow/iglu-server) to a local folder.

It accepts three required arguments:

- `host` - Scala Iglu Registry host name or IP address with optional port and endpoint. It should conform to the pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys
- `path` - path to your static registry (local folder to download to)

```bash
$ ./igluctl static pull /path/to/static/registry iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## static s3cp

`igluctl static s3cp` enables you to upload JSON Schemas to chosen S3 bucket. This is helpful for generating a remote iglu registry which can be served from S3 over http(s).

`igluctl static s3cp` accepts two required arguments and several options:

- `input` - path to your files. Required.
- `bucket` - S3 bucket name. Required.
- `s3path` - optional S3 path to prepend your input root. Usually you don’t need it.
- `accessKeyId` - your AWS Access Key Id. This may or or may not be required, depending on your preferred authentication option.
- `secretAccessKey` - your AWS Secret Access Key. This may or or may not be required, depending on your preferred authentication option.
- `profile` - your AWS profile name. This may or or may not be required, depending on your preferred authentication option.
- `region` - AWS S3 region. Default: `us-west-2`
- `skip-schema-lists` - Do not generate and upload schema list objects. If using a static registry for all Snowplow applications, don’t enable this setting as some components still require lists to function correctly.

`igluctl static s3cp` tries to closely follow AWS CLI authentication process. First it checks if profile name or `accessKeyId`/`secretAccessKey` pair provided and uses it. If neither of above provided - it looks into `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` environment variables. If above aren’t available as well - it `~/.aws/config` file. If all above failed - it exits with error.

## static deploy

`igluctl static deploy` performs whole schema workflow at once.

It accepts one required arguments:

- `config` - Path to configuration file

```bash
$ ./igluctl static deploy /path/to/config/file
```

Your configuration file should be a hocon file, following the [reference example](https://github.com/snowplow/igluctl/blob/0.8.0/config/deploy.reference.hocon). For backwards compatibility with previous versions, you could also provide a [self-describing json](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.iglu/igluctl_config/jsonschema/1-0-0).

Example:

```json
  {
    "lint": {
      "skipWarnings": true
      "includedChecks": [
        "rootObject"
        "unknownFormats"
        "numericMinMax"
        "stringLength"
        "optionalNull"
        "description"
        "stringMaxLengthRange"
      ]
    }

    "generate": {
      "dbschema": "atomic"
      "force": false
    }


    "actions": [
      {
        "action": "push"
        "isPublic": true
        "apikey": "bd96b5ff-7eb7-4085-83e0-97ac4954b891"
        "apikey": ${APIKEY_1}
      }
      {
        "action": "s3cp"
        "uploadFormat": "jsonschema"
        "profile": "profile-1"
        "region": "eu-east-2"
      }
    ]

}
```

## server keygen

`igluctl server keygen` generates read and write API keys on Iglu Server.

It accepts two required arguments:

- `host` - Scala Iglu Registry host name or IP address with optional port and endpoint. It should conform pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys

Also it accepts `--vendor-prefix` argument which will be associated with generated key.

```bash
$ ./igluctl server keygen --vendor-prefix com.acme iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## table-check

`igluctl table-check` will check given RedShift or Postgres schema against iglu repository. As of version 0.11.0
it would cross verify the column types as well as names.

It supports two interfaces:

- `igluctl table-check --server <uri>` to check all tables
- `igluctl table-check --resolver <path> --schema <schemaKey>` to check particular table

It also accepts a number of arguments:

```bash
--resolver <path>
    Iglu resolver config path
--schema <schemaKey>
    Schema to check against. It should have iglu:<URI> format
--server <uri>
    Iglu Server URL
--apikey <uuid>
    Iglu Server Read ApiKey (non master)
--dbschema <string>
    Database schema
--host <string>
    Database host address
--port <integer>
    Database port
--dbname <string>
    Database name
--username <string>
    Database username
--password <string>
    Database password
```

```bash
$ ./igluctl table-check --resolver <path> --schema <schemaKey> ...connection parameters
```

or

```bash
$ ./igluctl table-check --server <uri> ...connection params
```

## verify parquet

`igluctl verify parquet` verifies that schema is evolved correctly within the same major version (e.g. from `1-a-b` to `1-c-d`) for parquet transformation (for loading into Databricks). It reports the breaking schema versions.

It accepts one required arguments:

- `input` - path to your schema files.

Example command:

```bash
$ ./igluctl verify parquet /path/to/static/registry
```

Example output:

```
Breaking change introduced by 'com.acme/product/jsonschema/1-0-2'. Changes: Incompatible type change Long to Double at /item/price
Breaking change introduced by 'com.acme/user/jsonschema/1-0-1'. Changes: Incompatible type change Long to Integer at /id
Breaking change introduced by 'com.acme/item/jsonschema/1-1-0'. Changes: Incompatible type change String to Json at /metadata
```


## verify redshift

`igluctl verify redshift` verifies that schema is evolved correctly within the same major version (e.g. from `1-a-b` to `1-c-d`) for loading into Redshift. It reports the major schema versions within which schema evolution rules were broken.

It accepts two required and one optional arguments:

- `server` - Iglu Server URL.
- `apikey` - Iglu Server Read ApiKey
- `--verbose/-v` - emit detailed report or not (disabled by default)

Example command:

```bash
$ ./igluctl verify redshift --server iglu.acme.com --apikey f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

Example output:

```
iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-*-*
iglu:com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-*-*
iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-*-*
```

Example command with verbose output:

```bash
$ ./igluctl verify redshift --server iglu.acme.com --apikey f81d4fae-7dec-11d0-a765-00a0c91e6bf6 --verbose
```

Example output:

```
iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-*-*:
  iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-2: [Incompatible types in column cache_size old RedshiftBigInt new RedshiftDouble]
  iglu:com.snowplowanalytics.iglu/resolver-config/jsonschema/1-0-3: [Incompatible types in column cache_size old RedshiftBigInt new RedshiftDouble]
iglu:com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-*-*:
  iglu:com.snowplowanalytics.snowplow/event_fingerprint_config/jsonschema/1-0-1: [Incompatible types in column parameters.hash_algorithm old RedshiftChar(3) new RedshiftVarchar(6)]
iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-*-*:
  iglu:com.snowplowanalytics.snowplow.badrows/loader_runtime_error/jsonschema/1-0-1: [Making required column nullable error]
```
