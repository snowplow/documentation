---
title: "Igluctl (0.8.0)"
date: "2022-01-10"
sidebar_position: -20
---

Iglu is a schema repository for JSON Schema. A schema repository (sometimes called a registry) is like npm or Maven or git but holds data schemas instead of software or code. Iglu is used extensively in Snowplow.

## Igluctl

Iglu provides a CLI application, called igluctl which allows you to perform most common tasks on Iglu registry. So far, it consists of two subcommands: `static` and `lint`, whereas former itself contains three subcommands `generate`,`push` and `s3cp`, so overall structure of commands looks like following:

- `lint` - validate set of JSON Schemas for syntax and consistency of their properties
- `static` - work with static Iglu registry
    - `generate` - generate DDLs and migrations (only for Redshift now) from set of JSON Schemas
    - `push` - push set of JSON Schemas from static registry to full-featured (Scala Registry for example) one
    - `pull` - pull set of JSON Schemas from registry to local folder
    - `s3cp` - copy JSONPaths or schemas to S3 bucket
- `server` - work with an Iglu server
    - `keygen` - generate read and write API keys on Iglu Server
- `rdbms` - work with relation databases
    - `table-check` - will check a given schema's table structure against schema
    - `table-migrate` is optional and allows removal of incompatible tables by migrating them as opposed to just "blacklisting".

Download the latest Igluctl from GitHub releases:

```
$ wget https://github.com/snowplow-incubator/igluctl/releases/download/0.8.0/igluctl_0.8.0.zip
$ unzip igluctl.zip
```

Note that Igluctl expects JRE 11 to run.

## lint

`igluctl lint` validates JSON Schemas.

It is designed to be run against schema registries with a folder structure that follows the [iglu-example-schema-registry](https://github.com/snowplow/iglu-example-schema-registry).

You can validate _all_ the schemas in the registry:

```
$ /path/to/igluctl lint /path/to/schema/registry/schemas
```

Alternatively you can validate an individual schema e.g.:

```
$ /path/to/igluctl lint /path/to/schema/registry/schemas/com.example_company/example_event/jsonschema/1-0-0
```

Examples of errors that are identified:

- JSON Schema has inconsistent self-describing information and path on filesystem
- JSON Schema has invalid `$schema` keyword. It should be always set to [iglu-specific](http://iglucentral.com/schemas/com.snowplowanalytics.self-desc/schema/jsonschema/1-0-0#), while users tend to set it to Draft v4 or even to self-referencing Iglu URI
- JSON Schema is invalid against its standard (empty `required`, string `maximum` and similar)
- JSON Schema contains properties which contradict each other, like `{"type": "integer", "maxLength": 0}` or `{"maximum": 0, "minimum": 10'}`. These schemas are inherently useless as for some valiators there is no JSON instance they can validate

The above cases can very hard to spot without a specialized tool as they are still valid JSONs and in last case it is even valid JSON Schemas - so will validate against a standard JSON schema validator.

`lint` has two options:

- `--skip-warnings` which will omit warnings like unknown properties. However we strongly advise to not use this option.
- `--skip-checks` which will lint without specified linters, given comma separated. To see available linters and their explanations, `$ /path/to/igluctl --help`

Note: `--severityLevel` option is deprecated and removed as of version 0.4.0.

Below are two groups of linters; allowed to be skipped and not allowed to be skipped. By default, all of them are enabled but igluctl users can skip any combination of `rootObject`, `unknownFormats`, `numericMinMax`, `stringLength`, `optionalNull`, `description` through `--skip-checks`.

Igluctl let you skip below checks:

| NAME | DEFINITION |
| --- | --- |
| `rootObject` | Check that root of schema has object type and contains properties |
| `unknownFormats` | Check that schema doesn’t contain unknown formats |
| `numericMinMax` | Check that schema with numeric type contains both minimum and maximum properties |
| `stringLength` | Check that schema with string type contains maxLength property or other ways to extract max length |
| `optionalNull` | Check that non-required fields have null type |
| `description` | Check that property contains description |

A sample usage could be as following:

```
$ ./igluctl lint --skip-checks description,rootObject /path/to/schema/registry/schemas
```

Note that linter names are case sensitive

Igluctl also includes many checks proving that schemas doesn’t have conflicting expectations (such as `minimum` value bigger than `maximum`). Schemas with such expectations are valid according to specification, but do not make any sense in real-world use cases. These checks are mandatory and cannot be disabled.

`igluctl lint` will exit with status code 1 if encounter at least one error.

## static generate

`igluctl static generate` generates corresponding [Redshift](http://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html) DDL files (`CREATE TABLE` statements) and migration scripts (`ALTER TABLE` statements).

This command previously was a part of [Schema Guru](http://github.com/snowplow/schema-guru) and was known as `schema-guru ddl`, but has been moved into iglu in r5 release.

```
$ ./igluctl static generate $INPUT
```

You also can specify directory for output (current dir is used as default):

```
$ ./igluctl static generate --output $DDL_DIR $INPUT
```

### Generating migration Redshift table scripts to accommodate updated schema versions

If an input directory is specified with several self-describing JSON schemas with a single REVISION, Igluctl will generate migration scripts to update (`ALTER`) Redshift tables for older schema versions to support the latest schema version.

For example, having the following Self-describing JSON Schemas as an input:

- schemas/com.acme/click\_event/1-0-0
- schemas/com.acme/click\_event/1-0-1
- schemas/com.acme/click\_event/1-0-2

Igluctl will generate the following migration scripts:

- sql/com.acme/click\_event/1-0-0/1-0-1 to alter table from 1-0-0 to 1-0-1
- sql/com.acme/click\_event/1-0-0/1-0-2 to alter table from 1-0-0 to 1-0-2
- sql/com.acme/click\_event/1-0-1/1-0-2 to alter table from 1-0-1 to 1-0-2

This migrations (and all subsequent table definitions) are aware of column order and will ensure that new columns are added at the end of the table definition. This means that the tables can be updated in-place with single `ALTER TABLE` statements.

**NOTE**: migrations support is in early beta. Only single alter-table case is supported, particularly “add optional field”.

### Handling union types

One of the more problematic scenarios to handle when generating Redshift table definitions is handling `UNION` field types e.g. `["integer", "string"]`.

How should these be represented in SQL DDL? It’s a tough question and we believe there is no perfect solution.

Igluctl provides two options:

1. Union types will be transformed as most general. In the above example (union of an integer and string type) the corresponding Redshift column will be a `VARCHAR(4096)`. This is the default behaviour.
2. Alternative approach: split the column with product types into separate ones with it’s types as postfix. In the case of a field with type `["string", "integer"]` two corresponding columns will be generated in Redshift: `model_string` and `model_integer`. To get Igluctl to split columns add the following flag: `--split-product-types`.

### Missing schema versions

`static generate` command will check versions of schemas inside `input` as following:

- If user specified folder and one of schemas has no 1-0-0 or misses any other schemas in between (like it has 1-0-0 and 1-0-2) - refuse to do anything (but proceed with –force option)
- If user specified full path to file with schema and this file is not 1-0-0 - just print a warning
- If user specified full path to file with schema and it is 1-0-0 - all good

### Other options

If you’re not a Snowplow Platform user, don’t use [Self-describing Schema](/docs/migrated/pipeline-components-and-applications/iglu/common-architecture/self-describing-json-schemas/) or just don’t want anything Iglu-specific, you can produce raw DDL:

```
$ ./igluctl static generate --raw $INPUT
```

But bear in mind that Self-describing Schemas bring many benefits. For example, raw Schemas will not preserve an order for your columns (it’s just impossible as it doesn’t know about previous revisions) and also you will not have a migrations.

You may also want to get JSONPaths file for Redshift’s [COPY](http://docs.aws.amazon.com/redshift/latest/dg/r_COPY.html) command. It will place `jsonpaths` dir alongside with `sql`:

```
$ ./igluctl static generate --with-json-paths $INPUT
```

If there’s no clues about string length (e.g. `maxLength` specifications in the schema), Igluctl will set the length of `VARCHAR` columns to 4096 by default . You can also specify this your own VARCHAR size used by default:

```
$ ./igluctl static generate --varchar-size 32 $INPUT
```

You can also specify Redshift Schema for your table (don’t confuse database [schema](http://docs.aws.amazon.com/redshift/latest/dg/r_Schemas_and_tables.html) and schemas like JSON). For non-raw mode `atomic` used as default.

```
$ ./igluctl static generate --raw --dbschema business $INPUT
```

Some users do not full rely on Igluctl for DDL generation and edit their DDLs manually. By default, Igluctl will not override your files (either DDLs and migrations) if user made any significant changes (comments and whitespaces are not significant). Instead Igluctl will print warning that file has been changed manually. To change this behavior you may specify `--force` flag.

```
$ ./igluctl static generate --force $INPUT
```

It is possible to forget about ownership once table is created. It could be achieved within igluctl as following.

```
$ ./igluctl static generate $INPUT --set-owner <owner>
```

igluctl also has an option `--no-header` which will not place header comments into output DDL.

```
$ ./igluctl static generate $INPUT --no-header
```

## static push

`igluctl static push` publishes schemas stored locally to a remote [Scala Iglu Registry](https://github.com/snowplow/iglu/tree/master/2-repositories/iglu-server).

It accepts three required arguments:

- `host` - Scala Iglu Registry host name or IP address with optional port and endpoint. It should conform pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys
- `path` - path to your static registry (local folder containing schemas)

Also it accepts optional `--public` argument which makes schemas available without `apikey` header.

```
$ ./igluctl static push /path/to/static/registry iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## static pull

`igluctl static pull` downloads schemas stored on a remote [Scala Iglu Registry](https://github.com/snowplow/iglu/tree/master/2-repositories/iglu-server) to a local folder.

It accepts three required arguments:

- `host` - Scala Iglu Registry host name or IP address with optional port and endpoint. It should conform pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys
- `path` - path to your static registry (local folder to download to)

```
$ ./igluctl static pull /path/to/static/registry iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## static s3cp

`igluctl static s3cp` enables you to upload JSON Schemas to chosen S3 bucket. This is helpful for generating a remote iglu registry which can be served from S3 over http(s).

`igluctl static s3cp` accepts two required arguments and several options:

- `input` - path to your files. Required.
- `bucket` - S3 bucket name. Required.
- `s3path` - optional S3 path to prepend your input root. Usually you don’t need it.
- `accessKeyId` - your AWS Access Key Id. This may or or may not be required, depending on your preferred authentication option.
- `secretAccessKey` - your AWS Secret Access Key. This may or or may not be required, depending on your preferred authentication option.
- `profile` - your AWS profile name. This may or or may not be required, depending on your preferred authentication option.
- `region` - AWS S3 region. Default: `us-west-2`
- `skip-schema-lists` - Do not generate and upload schema list objects.

`igluctl static s3cp` tries to closely follow AWS CLI authentication process. First it checks if profile name or `accessKeyId`/`secretAccessKey` pair provided and uses it. If neither of above provided - it looks into `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` environment variables. If above aren’t available as well - it `~/.aws/config` file. If all above failed - it exits with error.

## static deploy

`igluctl static deploy` performs whole schema workflow at once.

It accepts one required arguments:

- `config` - Path to configuration file

```
$ ./igluctl static deploy /path/to/config/file
```

Your configuration file should be a hocon file, following the [reference example](https://github.com/snowplow-incubator/igluctl/blob/0.8.0/config/deploy.reference.hocon). For backwards compatibility with previous versions, you could also provide a [self-describing json](https://github.com/snowplow/iglu-central/blob/master/schemas/com.snowplowanalytics.iglu/igluctl_config/jsonschema/1-0-0).

Example:

```
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
      "owner": "a_new_owner"
      "varcharSize": 4096
      "withJsonPaths": true
      "noHeader": false
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

- `host` - Scala Iglu Registry host name or IP address with optional port and endpoint. It should conform pattern `host:port/path` (or just `host`) **without** http:// prefix.
- `apikey` - master API key, used to create temporary write and read keys

Also it accepts `--vendor-prefix` argument which will be associated with generated key.

```
$ ./igluctl server keygen --vendor-prefix com.acme iglu.acme.com:80/iglu-server f81d4fae-7dec-11d0-a765-00a0c91e6bf6
```

## rdbms table-check

`igluctl rdbms table-check` will check given schema's table structure against schema.

It supports two interfaces:

- `igluctl rdbms table-check --server <uri>` to check all tables
- `igluctl rdbms table-check --resolver <path> --schema <schemaKey>` to check particular table

It also accepts a number of arguments:

```
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

```
$ ./igluctl rdbms table-check --resolver <path> --schema <schemaKey>
```

or

```
$ ./igluctl rdbms table-check --server <uri>
```

## rdbms table-migrate

`igluctl rdbms table-migrate` is optional and allows removal of incompatible tables by migrating them as opposed to just "blacklisting".

`rdbms table-migrate` will provide you with DML/DDL statements steps to migrate legacy tables into a new format.

It also accepts a number of arguments:

```
--help
    Display this help text.
--resolver <path>
    Iglu resolver config path
--schema <schemaKey>
    Schema to check against. It should have iglu:<URI> format
--dbschema <string>
    Database schema
--output <string>
    S3 Path for output
--role <string>
    AWS Role
--region <name>
    AWS Region
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

```
$ ./igluctl rdbms table-migrate --resolver <path> --schema <schemaKey>
```
