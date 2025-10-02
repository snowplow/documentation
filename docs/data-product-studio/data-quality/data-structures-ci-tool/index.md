---
title: "Using the Data Structures CI tool"
date: "2020-06-01"
sidebar_position: 4
sidebar_custom_props:
  offerings:
    - cdi
sidebar_label: "Data Structures CI tool"
---

The Data Structures CI is a command-line tool which integrates Data Structures API into your CI/CD pipelines and currently has one task which verifies that all schema dependencies for a project are already deployed into a specified environment (e.g. "DEV", "PROD").

This is available as a [Github Action](#setting-up-as-a-github-action) and as a [universal install for other deployment pipelines](#setting-up-for-other-deployment-pipelines) e.g. Travis CI, CircleCI, Gitlab, Azure Pipelines, Jenkins…

## Authorization

In order to be able to perform tasks with the tool, you will need to supply both your Organization ID and an API key.

You can find your Organization ID [on the _Manage organization_ page](https://console.snowplowanalytics.com/settings) in Console.

An API Key can be created [here](https://console.snowplowanalytics.com/credentials).

## Create your manifest file

This command allows you to verify that all schema dependencies for a project (declared in a specific "manifest") are already deployed into an environment (e.g. "DEV", "PROD").

In your application project, create a JSON file for your manifest that will store references to the schema dependencies you have for your project. During a CI build this file will be parsed, validated and used by Data Structures CI to check that each schema is correctly deployed to the appropriate environment before the code for the application gets deployed, effectively guarding against the 'Schema not found' type of [failed events](/docs/fundamentals/failed-events/index.md).

Here is an example manifest file where our application has dependencies on three schemas:

- `checkout_process` version `1-0-7`
- `user` version `1-0-1`
- `product` version `2-0-0`

```json
{
  "schema": "iglu:com.snowplowanalytics.insights/data_structures_dependencies/jsonschema/1-0-0",
  "data": {
    "schemas": [
      {
        "vendor": "com.acme.marketing",
        "name": "checkout_process",
        "format": "jsonschema",
        "version": "1-0-7"
      },
      {
        "vendor": "com.acme",
        "name": "user",
        "format": "jsonschema",
        "version": "1-0-1"
      },
      {
        "vendor": "com.acme",
        "name": "product",
        "format": "jsonschema",
        "version": "2-0-0"
      }
    ]
  }
}
```

The manifest must adhere to this [self-describing JSON Schema](http://iglucentral.com/schemas/com.snowplowanalytics.insights/data_structures_dependencies/jsonschema/1-0-0).

## Setting up as a Github Action

To use the Github Action simply add this snippet as a step on your existing GitHub Actions pipeline, replacing the relevant variables:

```yaml
name: Example workflow using Snowplow's Data Structures CI
on: push
jobs:
  data-structures-check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Run Snowplow's Data Structures CI
      uses: snowplow-product/msc-schema-ci-action/check@v1
      with:
        organization-id: ${{ secrets.SNOWPLOW_ORG_ID }}
        api-key: ${{ secrets.SNOWPLOW_API_KEY }}
        manifest-path: 'snowplow-schemas.json'
        environment: ${{ env.ENVIRONMENT }}
```

View the [Github Action repository](https://github.com/snowplow-product/msc-schema-ci-action).

## Setting up for other deployment pipelines

### Prerequisites

- JRE 8 or above

### Download the CI tool

You can download Data Structures CI from our Bintray repository, using the following command:

```bash
$ curl -L https://github.com/snowplow-product/msc-schema-ci-tool/releases/download/1.0.0/data_structures_ci_1.0.0.zip | jar xv && chmod +x ./data-structures-ci
```

### Run the task

You can run the task using the following syntax:

```bash
$ export ORGANIZATION_ID=<organization-id>
$ export API_KEY=<api-key>
$ ./data-structures-ci check \
    --manifestPath /path/to/snowplow-schemas.json \
    --environment DEV
```

View the repository for [integration examples](https://github.com/snowplow-product/msc-schema-api-examples/).
