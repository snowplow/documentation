---
title: "Snowplow CLI command reference"
sidebar_label: "Command reference"
date: 2025-10-02
sidebar_position: 1
description: "Complete reference for Snowplow CLI commands including data-products and data-structures subcommands with options and usage examples."
keywords: ["Snowplow CLI reference", "CLI commands", "command options", "CLI documentation"]
---

import TrackingPlansNomenclature from '@site/docs/reusable/tracking-plans-nomenclature/_index.md';

<TrackingPlansNomenclature />

This page contains the complete reference for the Snowplow CLI commands.

## Data-Products


Work with Snowplow tracking plans

### Examples

```
  $ snowplow-cli data-products validate
```

### Options

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
  -h, --help                  help for data-products
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
```

### Options inherited from parent commands

```
      --config string     Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                          Then on:
                            Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                            Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                            Windows %AppData%\snowplow\snowplow.yml
      --debug             Log output level to Debug
      --env-file string   Environment file (.env). Defaults to .env in current directory
                          Then on:
                            Unix $HOME/.config/snowplow/.env
                            Darwin $HOME/Library/Application Support/snowplow/.env
                            Windows %AppData%\snowplow\.env
      --json-output       Log output as json
  -q, --quiet             Log output level to Warn
  -s, --silent            Disable output
```



## Data-Products Add-Event-Spec


Add new event spec to an existing tracking plan

### Synopsis

Adds one or more event specifications to an existing tracking plan file, or print them to the stdout.
The command takes the path to a tracking plan file and adds the specified event specifications to it. When run without the argument - it will print generated event specs to the stdout.
The command will attempt to keep the formatting and comments of the original file intact, but it's a best effort approach. Some comments might be deleted, some formatting changes might occur.

```
snowplow-cli data-products add-event-spec {path} [flags]
```

### Examples

```
  $ snowplow-cli dp add-event-spec --event-spec user_login --event-spec page_view ./my-data-product.yaml
  $ snowplow-cli dp add-es ./data-products/analytics.yaml -e "checkout_completed" -e "item_purchased"
```

### Options

```
  -e, --event-spec stringArray   Name of event spec to add
  -h, --help                     help for add-event-spec
  -f, --output-format string     Format of stdout output. Only applicable when the file in not specified. Json or yaml are supported (default "yaml")
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Download


Download all tracking plans, event specs and source apps from Snowplow Console

### Synopsis

Downloads the latest versions of all tracking plans, event specs and source apps from Snowplow Console.

If no directory is provided then defaults to 'data-products' in the current directory. Source apps are stored in the nested 'source-apps' directory

```
snowplow-cli data-products download {directory ./data-products} [flags]
```

### Examples

```
  $ snowplow-cli dp download
  $ snowplow-cli dp download ./my-data-products
```

### Options

```
  -h, --help                   help for download
  -f, --output-format string   Format of the files to read/write. json or yaml are supported (default "yaml")
      --plain                  Don't include any comments in yaml files
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Generate


Generate new tracking plans and source applications locally

### Synopsis

Will write new tracking plans and/or source application to file based on the arguments provided.

Example:
  $ snowplow-cli dp gen --source-app "Mobile app"
  Will result in a new source application getting written to './data-products/source-applications/mobile-app.yaml'

  $ snowplow-cli dp gen --data-product "Ad tracking" --output-format json --data-products-directory dir1
  Will result in a new tracking plan getting written to './dir1/ad-tracking.json'


```
snowplow-cli data-products generate [paths...] [flags]
```

### Examples

```
  $ snowplow-cli dp generate --source-app "Mobile app" --source-app "Web app" --data-product "Signup flow"
```

### Options

```
      --data-product stringArray         Name of tracking plan to generate
      --data-products-directory string   Directory to write tracking plans to (default "data-products")
  -h, --help                             help for generate
      --output-format string             File format (yaml|json) (default "yaml")
      --plain                            Don't include any comments in yaml files
      --source-app stringArray           Name of source app to generate
      --source-apps-directory string     Directory to write source apps to (default "data-products/source-apps")
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Publish


Publish all tracking plans, event specs and source apps to Snowplow Console

### Synopsis

Publish the local version versions of all tracking plans, event specs and source apps from Snowplow Console.

If no directory is provided then defaults to 'data-products' in the current directory. Source apps are stored in the nested 'source-apps' directory

```
snowplow-cli data-products publish {directory ./data-products} [flags]
```

### Examples

```
  $ snowplow-cli dp publish
  $ snowplow-cli dp download ./my-data-products
```

### Options

```
  -c, --concurrency int   The number of validation requests to perform at once (maximum 10) (default 3)
  -d, --dry-run           Only print planned changes without performing them
      --gh-annotate       Output suitable for github workflow annotation (ignores -s)
  -h, --help              help for publish
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Purge


Purges (permanently removes) all remote tracking plans and source apps that do not exist locally

### Synopsis

Purges (permanently removes) all remote tracking plans and source apps that do not exist locally.

If no directory is provided then defaults to 'data-products' in the current directory. Source apps are stored in the nested 'source-apps' directory

```
snowplow-cli data-products purge {directory ./data-products} [flags]
```

### Examples

```
  $ snowplow-cli dp purge
  $ snowplow-cli dp purge ./my-data-products
```

### Options

```
  -h, --help   help for purge
  -y, --yes    commit to purge
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Validate


Validate tracking plans and source applications with Snowplow Console

### Synopsis

Sends all tracking plans and source applications from \<path\> for validation by Snowplow Console.

```
snowplow-cli data-products validate [paths...] [flags]
```

### Examples

```
  $ snowplow-cli dp validate ./data-products ./source-applications
  $ snowplow-cli dp validate ./src
```

### Options

```
  -c, --concurrency int   The number of validation requests to perform at once (maximum 10) (default 3)
      --full              Perform compatibility check on all files, not only the ones that were changed
      --gh-annotate       Output suitable for github workflow annotation (ignores -s)
  -h, --help              help for validate
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures


Work with Snowplow data structures

### Examples

```
  $ snowplow-cli data-structures generate my_new_data_structure
  $ snowplow-cli ds validate
  $ snowplow-cli ds publish dev
```

### Options

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
  -h, --help                  help for data-structures
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
```

### Options inherited from parent commands

```
      --config string     Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                          Then on:
                            Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                            Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                            Windows %AppData%\snowplow\snowplow.yml
      --debug             Log output level to Debug
      --env-file string   Environment file (.env). Defaults to .env in current directory
                          Then on:
                            Unix $HOME/.config/snowplow/.env
                            Darwin $HOME/Library/Application Support/snowplow/.env
                            Windows %AppData%\snowplow\.env
      --json-output       Log output as json
  -q, --quiet             Log output level to Warn
  -s, --silent            Disable output
```



## Data-Structures Download


Download all data structures from Snowplow Console

### Synopsis

Downloads the latest versions of all data structures from Snowplow Console.

Will retrieve schema contents from your development environment.
If no directory is provided then defaults to 'data-structures' in the current directory.

By default, data structures with empty schemaType (legacy format) are skipped.
Use --include-legacy to include them (they will be set to 'entity' schemaType).

```
snowplow-cli data-structures download {directory ./data-structures} [flags]
```

### Examples

```
  $ snowplow-cli ds download

  Download data structures matching com.example/event_name* or com.example.subdomain*
  $ snowplow-cli ds download --match com.example/event_name --match com.example.subdomain

  Download with custom output format and directory
  $ snowplow-cli ds download --output-format json ./my-data-structures

  Include legacy data structures with empty schemaType
  $ snowplow-cli ds download --include-legacy
```

### Options

```
  -h, --help                   help for download
      --include-drafts         Include drafts data structures
      --include-legacy         Include legacy data structures with empty schemaType (will be set to 'entity')
      --match stringArray      Match for specific data structure to download (eg. --match com.example/event_name or --match com.example)
  -f, --output-format string   Format of the files to read/write. json or yaml are supported (default "yaml")
      --plain                  Don't include any comments in yaml files
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Generate


Generate a new data structure locally

### Synopsis

Will write a new data structure to file based on the arguments provided.

Example:
  $ snowplow-cli ds gen login_click --vendor com.example
  Will result in a new data structure getting written to './data-structures/com.example/login_click.yaml'
  The directory 'com.example' will be created automatically.

  $ snowplow-cli ds gen login_click
  Will result in a new data structure getting written to './data-structures/login_click.yaml' with
  an empty vendor field. Note that vendor is a required field and will cause a validation error if not completed.

```
snowplow-cli data-structures generate login_click {directory ./data-structures} [flags]
```

### Examples

```
  $ snowplow-cli ds generate my-ds
  $ snowplow-cli ds generate my-ds ./my-data-structures
```

### Options

```
      --entity                 Generate data structure as an entity
      --event                  Generate data structure as an event (default true)
  -h, --help                   help for generate
      --output-format string   Format for the file (yaml|json) (default "yaml")
      --plain                  Don't include any comments in yaml files
      --vendor string          A vendor for the data structure.
                               Must conform to the regex pattern [a-zA-Z0-9-_.]+
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Publish


Publishing commands for data structures

### Synopsis

Publishing commands for data structures

Publish local data structures to Snowplow Console.


### Options

```
  -h, --help   help for publish
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Publish Dev


Publish data structures to your development environment

### Synopsis

Publish modified data structures to Snowplow Console and your development environment

The 'meta' section of a data structure is not versioned within Snowplow Console.
Changes to it will be published by this command.


```
snowplow-cli data-structures publish dev [paths...] default: [./data-structures] [flags]
```

### Examples

```
  $ snowplow-cli ds publish dev
  $ snowplow-cli ds publish dev --dry-run
  $ snowplow-cli ds publish dev --dry-run ./my-data-structures ./my-other-data-structures
```

### Options

```
  -d, --dry-run       Only print planned changes without performing them
      --gh-annotate   Output suitable for github workflow annotation (ignores -s)
  -h, --help          help for dev
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Publish Prod


Publish data structures to your production environment

### Synopsis

Publish data structures from your development to your production environment

Data structures found on \<path...\> which are deployed to your development
environment will be published to your production environment.


```
snowplow-cli data-structures publish prod [paths...] default: [./data-structures] [flags]
```

### Examples

```

	$ snowplow-cli ds publish prod
	$ snowplow-cli ds publish prod --dry-run
	$ snowplow-cli ds publish prod --dry-run ./my-data-structures ./my-other-data-structures

```

### Options

```
  -d, --dry-run   Only print planned changes without performing them
  -h, --help      help for prod
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Validate


Validate data structures with Snowplow Console

### Synopsis

Sends all data structures from \<path\> for validation by Snowplow Console.

```
snowplow-cli data-structures validate [paths...] default: [./data-structures] [flags]
```

### Examples

```
  $ snowplow-cli ds validate
  $ snowplow-cli ds validate ./my-data-structures ./my-other-data-structures
```

### Options

```
      --gh-annotate   Output suitable for github workflow annotation (ignores -s)
  -h, --help          help for validate
```

### Options inherited from parent commands

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
      --env-file string       Environment file (.env). Defaults to .env in current directory
                              Then on:
                                Unix $HOME/.config/snowplow/.env
                                Darwin $HOME/Library/Application Support/snowplow/.env
                                Windows %AppData%\snowplow\.env
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Mcp


Start an MCP (Model Context Protocol) stdio server for Snowplow validation and context

### Synopsis

Start an MCP (Model Context Protocol) stdio server that provides tools for:
  - Validating Snowplow files (data-structures, data-products, source-applications)
  - Retrieving the built-in schema and rules that define how Snowplow data structures, tracking plans, and source applications should be structured

```
snowplow-cli mcp [flags]
```

### Examples

```

  Claude Desktop config:
  {
    "mcpServers": {
      ...
      "snowplow-cli": {
        "command": "snowplow-cli", "args": ["mcp"]
      }
    }
  }

  VS Code '\<workspace\>/.vscode/mcp.json':
  {
    "servers": {
      ...
      "snowplow-cli": {
        "type": "stdio",
        "command": "snowplow-cli", "args": ["mcp"]
      }
    }
  }

  Cursor '\<workspace\>/.cursor/mcp.json':
  {
    "mcpServers": {
      ...
      "snowplow-cli": {
        "command": "snowplow-cli", "args": ["mcp", "--base-directory", "."]
      }
    }
  }

Note:
  This server's validation tools require filesystem paths to validate assets. For full
  functionality, your MCP client needs filesystem write access so created assets can be
  saved as files and then validated.

Setup options:
  - Enable filesystem access in your MCP client, or
  - Run alongside an MCP filesystem server (e.g., @modelcontextprotocol/server-filesystem)

```

### Options

```
  -S, --api-key string          Snowplow Console api key
  -a, --api-key-id string       Snowplow Console api key id
      --base-directory string   The base path to use for relative file lookups. Useful for clients that pass in relative file paths.
      --dump-context            Dumps the result of the get_context tool to stdout and exits.
  -h, --help                    help for mcp
  -H, --host string             Snowplow Console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string     Link to a github repo where the data structure is managed
  -o, --org-id string           Your organization id
```

### Options inherited from parent commands

```
      --config string     Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                          Then on:
                            Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                            Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                            Windows %AppData%\snowplow\snowplow.yml
      --debug             Log output level to Debug
      --env-file string   Environment file (.env). Defaults to .env in current directory
                          Then on:
                            Unix $HOME/.config/snowplow/.env
                            Darwin $HOME/Library/Application Support/snowplow/.env
                            Windows %AppData%\snowplow\.env
      --json-output       Log output as json
  -q, --quiet             Log output level to Warn
  -s, --silent            Disable output
```



## Setup


Set up Snowplow CLI with device authentication

### Synopsis

Authenticate with Snowplow Console using device authentication flow and create an API key

```
snowplow-cli setup [flags]
```

### Examples

```
  $ snowplow-cli setup
  $ snowplow-cli setup --read-only
```

### Options

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
      --auth0-domain string   Auth0 domain (default "id.snowplowanalytics.com")
      --client-id string      Auth0 Client ID for device auth (default "EXQ3csSDr6D7wTIiebNPhXpgkSsOzCzi")
      --dotenv                Store as .env file in current working directory
  -h, --help                  help for setup
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
      --read-only             Create a read-only API key
```

### Options inherited from parent commands

```
      --config string     Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                          Then on:
                            Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                            Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                            Windows %AppData%\snowplow\snowplow.yml
      --debug             Log output level to Debug
      --env-file string   Environment file (.env). Defaults to .env in current directory
                          Then on:
                            Unix $HOME/.config/snowplow/.env
                            Darwin $HOME/Library/Application Support/snowplow/.env
                            Windows %AppData%\snowplow\.env
      --json-output       Log output as json
  -q, --quiet             Log output level to Warn
  -s, --silent            Disable output
```



## Status


Check Snowplow CLI configuration and connectivity

### Synopsis

Verify that the CLI is properly configured and can connect to Snowplow Console

```
snowplow-cli status [flags]
```

### Examples

```
  $ snowplow-cli status
```

### Options

```
  -S, --api-key string        Snowplow Console api key
  -a, --api-key-id string     Snowplow Console api key id
  -h, --help                  help for status
  -H, --host string           Snowplow Console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
```

### Options inherited from parent commands

```
      --config string     Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                          Then on:
                            Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                            Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                            Windows %AppData%\snowplow\snowplow.yml
      --debug             Log output level to Debug
      --env-file string   Environment file (.env). Defaults to .env in current directory
                          Then on:
                            Unix $HOME/.config/snowplow/.env
                            Darwin $HOME/Library/Application Support/snowplow/.env
                            Windows %AppData%\snowplow\.env
      --json-output       Log output as json
  -q, --quiet             Log output level to Warn
  -s, --silent            Disable output
```