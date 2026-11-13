---
title: "Manage data structures via Snowplow CLI"
sidebar_label: "Data structures"
sidebar_position: 20
description: "Use the Snowplow CLI data-structures command to generate, download, validate, and publish data structures with git-ops workflows and JSON Schema validation."
keywords: ["data structures CLI", "Snowplow CLI schemas", "schema validation CLI", "CLI publish schemas"]
content_type: how-to
---


<Availability
  available={['cloud', 'pmc']}
  note="Managing data structures and tracking plans requires a Snowplow CDI (Console) account."
/>

The `data-structures` subcommand of [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md) provides a collection of functionality to ease the integration of custom development and publishing workflows.

## Snowplow CLI Prerequisites

Installed and configured [Snowplow CLI](/docs/api-reference/snowplow-cli/index.md)


## Available commands

### Creating data structures

```bash
snowplow-cli ds generate login_click ./folder-name

```

Will create a minimal data structure template in a new file `./folder-name/login_click.yaml`. Note that you will need to add a vendor name to the template before it will pass validation. Alternatively supply a vendor at creation time with the `--vendor com.acme` flag.


### Downloading data structures

```bash
snowplow-cli ds download
```

This command will retrieve all organization data structures. By default it will create a folder named `data-structures` in the current working directory to put them in. It uses a combination of vendor and name to further break things down.

Given a data structure with `vendor: com.acme` and `name: link_click` and assuming the default format of yaml the resulting folder structure will be `./data-structures/com.acme/link_click.yaml`.

:::note[Drafts not included]

The CLI download command only retrieves data structures that have been deployed to at least the development environment. **Draft data structures** that haven't been deployed yet will not be included in the download.

:::


### Validating data structures

```bash
snowplow-cli ds validate ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to validate them using Snowplow Console. It will assert the following

1. Is each file a valid format (yaml/json) with expected fields
2. Does the schema in the file conform to [snowplow expectations](/docs/fundamentals/schemas/index.md#self-describing-json-schema-anatomy)
3. Given the organization's [loading configuration](/docs/destinations/warehouses-lakes/index.md) will any schema version number choices have a potentially negative effect on data loading

If any validations fail the command will report the problems to stdout and exit with status code 1.

The command also fails when a file skips a version of a data structure that's deployed in Console. For example, a file that moves from `1-0-0` to `1-2-0` while Console holds `1-0-0` fails with `Version 1-1-? not deployed. Cannot skip versions`, and `ds publish` fails with the same error. The error line doesn't name the file, but the `will update` line before it does, with the local and remote versions. To fix it, set the version in the file to the next version after the deployed one, here `1-1-0`.

```text
12:25PM INFO will update file=data-structures/com.example.docs-capture/docs_capture_plan.yaml local=1-2-0 remote=1-0-0
12:25PM ERRO validation failed: Version 1-1-? not deployed. Cannot skip versions
```


### Publishing data structures

```bash
snowplow-cli ds publish dev ./folder-name
```

This command will find all files under `./folder-name` (if omitted then `./data-structures`) and attempt to publish them to Snowplow Console in the environment provided (`dev` or `prod`).

Publishing to `dev` will also cause data structures to be validated with the `validate` command before upload. Publishing to `prod` will not validate but requires all data structures referenced to be present on `dev`.
