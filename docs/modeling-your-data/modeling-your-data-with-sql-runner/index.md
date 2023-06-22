---
title: "Modeling your data with SQL Runner"
description: "Guides for setting up SQL Runner and running our web and mobile models."
sidebar_position: 99999
---

```mdx-code-block
import {versions} from '@site/src/componentVersions';
import CodeBlock from '@theme/CodeBlock';
```

:::tip

For any new developments we highly recommend using our [dbt packages](/docs/modeling-your-data/modeling-your-data-with-dbt/index.md) instead. SQL Runner is no longer under active development and will only receive bug fixes in the future.

:::

[SQL Runner](https://github.com/snowplow/sql-runner) enables you to execute SQL scripts against the Snowplow data in your data warehouse. Specifically, it allows you to organize your SQL scripts in templatable playbooks, and execute them in series or in parallel on Snowflake, Amazon Redshift, GCP BigQuery and PostgreSQL.

To set up SQL Runner, Snowplow open source users can start from the [User guide](/docs/modeling-your-data/modeling-your-data-with-sql-runner/index.md#user-guide) .

For Snowplow BDP customers, SQL Runner is already setup as part of your pipeline, so you can [get started](/docs/modeling-your-data/running-data-models-via-snowplow-bdp/sql-runner/using-sql-runner/index.md) with configuring and deploying your SQL data models immediately.

A SQL Runner data model consists of:

- SQL files (containing one or more SQL statements)
- Playbooks (YAML files organizing the SQL into steps)

### Available models

```mdx-code-block
import ModelVersions from './_model-versions.md'

<ModelVersions/>
```

### Playbooks

A playbook consists of one of more _steps_, each of which consists of one or more _queries_. Steps are run in series, queries are run in parallel within the step.

Each query contains the path to a _query file_. 

All steps are applied against all _targets_. All targets are processed in parallel.

In the following example, a.sql, b.sql and c.sql are run in parallel.

```yaml
:steps:
  - :name: "Run a,b and c in parallel"
    :queries:
      - :name: a
        :file: a.sql
      - :name: b
        :file: b.sql
      - :name: c
        :file: c.sql
```

By contrast, in the example below, the three SQL files are executed in sequence.

```yaml
:steps:
  - :name: "Run a..."
    :queries:
      - :name: a
        :file: a.sql
  - :name: "...then run b..."
    :queries:
      - :name: b
        :file: b.sql
  - :name: "...then run c..."
    :queries:
      - :name: c
        :file: c.sql
```

Playbooks can be templated, and corresponding variables can be passed in with the var flag like this:

```bash
sql-runner -var host=value,username=value2,password=value3
```

Here is the corresponding playbook template:

```yaml
:targets:
- :name: "My Postgres database 1"
  :type: postgres
  :host: {{.host}}
  :database: sql_runner_tests_1
  :port: 5432
  :username: {{.username}}
  :password: {{.password}}
  :ssl: false # SSL disabled by default
:variables:
  :test_schema: sql_runner_tests
  :timeFormat: "2006_01_02"
:steps:
- :name: Create schema and table
  :queries:
    - :name: Create schema and table
      :file: postgres-sql/good/1.sql
      :template: true
```

### SQL files

A query file contains one or more SQL statements. These are executed "raw" (i.e. not in a transaction) in series by SQL Runner. If the query file is flagged as a _template_ in the playbook, then the file is pre-processed as a template before being executed.

**Note**: If your query is a template that requires pre-processing, you must add `template: true` to the query definition in the playbook yml file, for example:

```yaml
:name: "Run a.."
    :queries:
      - :name: a
        :file: a.sql
        :template: true
```

### Templates

Templates are run through Golang's [text template processor](https://pkg.go.dev/text/template). The template processor can access all _variables_ defined in the playbook.

The following custom functions are also supported:

- `nowWithFormat [timeFormat]`: where `timeFormat` is a valid Golang [time format](http://golang.org/pkg/time/#Time.Format)
- `systemEnv "ENV_VAR"`: where `ENV_VAR` is a key for a valid environment variable
- `awsEnvCredentials`: supports passing credentials through environment variables, such as `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- `awsProfileCredentials`: supports getting credentials from a credentials file, also used by boto/awscli
- `awsEC2RoleCredentials`: supports getting role-based credentials, i.e. getting the automatically generated credentials in EC2 instances
- `awsChainCredentials`: tries to get credentials from each of the three methods above in order, using the first one returned
- `randomInt`: will return a random integer

**Note**: All AWS functions output strings in the Redshift credentials format (`CREDENTIALS 'aws_access_key_id=%s;aws_secret_access_key=%s'`).

For an example query file using templating see: [integration/resources/postgres-sql/good/3.sql](https://github.com/snowplow/sql-runner/blob/master/integration/resources/postgres-sql/good/3.sql)

### Failure modes

If a statement fails in a query file, the query will terminate and report failure.

If a query fails, its sibling queries will continue running, but no further steps will run.

Failures in one target do not affect other targets in any way.

### Return codes

```text
- 0 for no errors
- 5 for target initialization errors
- 6 for query errors
- 7 for both types of error
- 8 for no queries run
```

### Target configuration

#### Redshift

If your storage target is Amazon Redshift, then the target configuration in the playbook is:

```yaml
targets:
  - name: "My Redshift database"
    type: redshift
    host: ADD HERE # The endpoint as shown in the Redshift console
    database: ADD HERE # Name of database
    port: 5439 # Default Redshift port
    username: ADD HERE
    password: ADD HERE
    ssl: false # SSL disabled by default
variables:
  ...
```

#### BigQuery

To access a BigQuery project, sql-runner will need some Google credentials. These can be set up by creating a new service account in the GCP console, then providing its private key to the application via a GOOGLE_APPLICATION_CREDENTIALS environment variable - a detailed walkthrough of this process is available on the [GCP documentation website](https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually).

After the credentials are set up, simply create a playbook with the following BigQuery-specific target configuration:

```yaml
targets:
  - name: "My BigQuery database"
    type: bigquery
    project: ADD HERE # Project ID as shown in the GCP console's front page
variables:
    ...
```

#### Snowflake

If your data warehouse is Snowflake, then the SQL Runner playbooks will have a target configuration as:

```yaml
targets:
  - name: "My Snowflake database"
    type: snowflake
    account: ADD HERE # Your Snowflake account name
    database: ADD HERE # Name of database
    warehouse: ADD HERE # Name of warehouse to run the queries
    username: ADD HERE
    password: ADD HERE
    host: # Leave blank
    port: # Leave blank
    ssl: true # Snowflake connection is always secured by TLS
    query_tag: ADD HERE # optional, available since v0.10.0
variables:
    ...
```

The `query_tag` parameter sets the `QUERY_TAG` [session parameter](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) in Snowflake. When set, it will be applied to all queries included in the playbook.

#### PostgreSQL

Finally, if your storage target is PostgreSQL, then can be configured as:

```yaml
targets:
  - name: "My Postgres database"
    type: postgres
    host: ADD HERE
    database: ADD HERE # Name of database
    port: 5432 # Default Postgres port
    username: ADD HERE
    password: ADD HERE
    ssl: false # SSL disabled by default
variables:
```

That's it - you're now ready to start running SQL against your data warehouse!

## User guide

SQL Runner is a zero-dependency binary and can be found as a [release asset](https://github.com/snowplow/sql-runner/releases/latest) for:

- <a href={`https://github.com/snowplow/sql-runner/releases/download/${versions.sqlRunner}/sql_runner_${versions.sqlRunner}_darwin_amd64.zip`}>macOS</a>
- <a href={`https://github.com/snowplow/sql-runner/releases/download/${versions.sqlRunner}/sql_runner_${versions.sqlRunner}_linux_amd64.zip`}>Linux</a>
- <a href={`https://github.com/snowplow/sql-runner/releases/download/${versions.sqlRunner}/sql_runner_${versions.sqlRunner}_windows_amd64.zip`}>Windows</a>

### CLI Arguments

<CodeBlock language="text">{
`./sql-runner --help
sql-runner version: ${versions.sqlRunner}
Run playbooks of SQL scripts in series and parallel on Redshift, Postgres, BigQuery and Snowflake
Usage:
  -checkLock string
    	Checks whether the lockfile already exists
  -consul string
    	The address of a consul server with playbooks and SQL files stored in KV pairs
  -consulOnlyForLock
    	Will read playbooks locally, but use Consul for locking.
  -deleteLock string
    	Will attempt to delete a lockfile if it exists
  -dryRun
    	Runs through a playbook without executing any of the SQL
  -fillTemplates
    	Will print all queries after templates are filled
  -fromStep string
    	Starts from a given step defined in your playbook
  -help
    	Shows this message
  -lock string
    	Optional argument which checks and sets a lockfile to ensure this run is a singleton. Deletes lock on run completing successfully
  -playbook string
    	Playbook of SQL scripts to execute
  -runQuery string
    	Will run a single query in the playbook
  -showQueryOutput
    	Will print all output from queries
  -softLock string
    	Optional argument, like '-lock' but the lockfile will be deleted even if the run fails
  -sqlroot string
    	Absolute path to SQL scripts. Use PLAYBOOK, BINARY and PLAYBOOK_CHILD for those respective paths (default "PLAYBOOK")
  -var value
    	Variables to be passed to the playbook, in the key=value format
  -version
    	Shows the program version`
}</CodeBlock>

#### More on Consul

Using the `-consul` argument results in the following changes:

- The `-playbook` argument becomes the key that is used to look for the playbook in Consul.
- The `-sqlroot` argument also becomes a key argument for Consul.
- The `-lock` argument creates a lock as a Consul key value pair
- The `-softLock` argument creates a lock as a Consul key value pair
- The `-checkLock` argument searches in Consul for a lock
- The `-deleteLock` argument searches in Consul for a lock

If you pass in the default:

- `./sql-runner -consul "localhost:8500" -playbook "sql-runner/playbook/1"`

This results in:

- Looking for your playbook file at this key `sql-runner/playbook/1`
- Expecting all your SQL file keys to begin with `sql-runner/playbook/<SQL path from playbook>`

However as the key here can be used as a both a data and folder node we have added a new sqlroot option:

- `./sql-runner -consul "localhost:8500" -playbook "sql-runner/playbook/1" -sqlroot PLAYBOOK_CHILD`

This results in:

- Looking for your playbook file at this key `sql-runner/playbook/1`
- Expecting all your SQL file keys to begin with `sql-runner/playbook/1/<SQL path from playbook>`
    - The data node is used as a folder node as well.
