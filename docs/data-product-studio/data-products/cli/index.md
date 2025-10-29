---
title: "Managing data products via the CLI"
description: "Use the 'snowplow-cli data-products' command to manage your data products."
sidebar_label: "Using the CLI"
sidebar_position: 999
---
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```
The `data-products` subcommand of [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md) provides a collection of functionality to ease the integration of custom development and publishing workflows.
## Snowplow CLI Prerequisites
Installed and configured [Snowplow CLI](/docs/data-product-studio/snowplow-cli/index.md)
## Available commands
### Creating data product
```bash
./snowplow-cli dp generate --data-product my-data-product
```
This command creates a minimal data product template in a new file `./data-products/my-data-product.yaml`.
### Creating source application
```bash
./snowplow-cli dp generate --source-app my-source-app
```
This command creates a minimal source application template in a new file `./data-products/source-apps/my-source-app.yaml`.
### Creating event specification
To create an event specification, you need to modify the existing data-product file and add an event specification object. Here's a minimal example:
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications: []
    eventSpecifications:
        - resourceName: 11d881cd-316e-4286-b5d4-fe7aebf56fca
          name: test
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
```
:::caution Warning
The `source` fields of events and entities must refer to a deployed data structure. Referring to a locally created data structure is not yet supported.
:::
### Linking data product to a source application
To link a data product to a source application, provide a list of references to the source application files in the `data.sourceApplications` field. Here's an example:
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications:
        - $ref: ./source-apps/my-source-app.yaml
```
### Modifying the event specifications source applications
By default event specifications inherit all the source applications of the data product. If you want to customise it, you can use the `excludedSourceApplications` in the event specification description to remove a given source application from an event specification.
```yaml title="./data-products/test-cli.yaml"
apiVersion: v1
resourceType: data-product
resourceName: 3d3059c4-d29b-4979-a973-43f7070e1dd0
data:
    name: test-cli
    sourceApplications:
        - $ref: ./source-apps/generic.yaml
        - $ref: ./source-apps/specific.yaml
    eventSpecifications:
        - resourceName: 11d881cd-316e-4286-b5d4-fe7aebf56fca
          name: All source apps
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
        - resourceName: b9c994a0-03b2-479c-b1cf-7d25c3adc572
          name: Not quite everything
          excludedSourceApplications:
            - $ref: ./source-apps/specific.yaml
          event:
            source: iglu:com.snowplowanalytics.snowplow/button_click/jsonschema/1-0-0
```
In this example event specification `All source apps` is related to both `generic` and `specific` source apps, but event specification `Not quite everything` is related only to the `generic` source application.
### Downloading data products, event specifications and source apps
```bash
./snowplow-cli dp download
```
This command retrieves all organization data products, event specifications, and source applications. By default, it creates a folder named `data-products` in your current working directory. You can specify a different folder name as an argument if needed.
The command creates the following structure:
- A main `data-products` folder containing your data product files
- A `source-apps` subfolder containing source application definitions
- Event specifications embedded within their related data product files.
### Validating data products, event specifications and source applications
```bash
./snowplow-cli dp validate
```
This command scans all files under `./data-products` and validates them using Snowplow Console. It checks:
1. Whether each file is in a valid format (YAML/JSON) with correctly formatted fields
2. Whether all source application references in the data product files are valid
3. Whether event specification rules are compatible with their schemas
If validation fails, the command displays the errors in the console and exits with status code 1.
### Publishing data products, event specifications and source applications
```bash
./snowplow-cli dp publish
```
This command locates all files under `./data-products`, validates them, and publishes them to Console.
