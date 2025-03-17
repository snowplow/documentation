---
title: Command reference
date: 2024-11-26
sidebar_label: Command reference
sidebar_position: 1
---

This page contains the complete reference for the Snowplow CLI commands.

## Data-Products


Work with Snowplow data products

### Examples

```
  $ snowplow-cli data-products validate
```

### Options

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
  -h, --help                  help for data-products
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
```

### Options inherited from parent commands

```
      --config string   Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                        Then on:
                          Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                          Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                          Windows %AppData%\snowplow\snowplow.yml
      --debug           Log output level to Debug
      --json-output     Log output as json
  -q, --quiet           Log output level to Warn
  -s, --silent          Disable output
```



## Data-Products Download


Download all data products, event specs and source apps from BDP Console

### Synopsis

Downloads the latest versions of all data products, event specs and source apps from BDP Console.

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
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Publish


Publish all data products, event specs and source apps to BDP Console

### Synopsis

Publish the local version versions of all data products, event specs and source apps from BDP Console.

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
  -h, --help   help for publish
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Products Validate


Validate data structures with BDP Console

### Synopsis

Sends all data products and source applications from \<path\> for validation by BDP Console.

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
      --gh-annotate   Output suitable for github workflow annotation (ignores -s)
  -h, --help          help for validate
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
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
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
  -h, --help                  help for data-structures
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
```

### Options inherited from parent commands

```
      --config string   Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                        Then on:
                          Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                          Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                          Windows %AppData%\snowplow\snowplow.yml
      --debug           Log output level to Debug
      --json-output     Log output as json
  -q, --quiet           Log output level to Warn
  -s, --silent          Disable output
```



## Data-Structures Download


Download all data structures from BDP Console

### Synopsis

Downloads the latest versions of all data structures from BDP Console.

Will retrieve schema contents from your development environment.
If no directory is provided then defaults to 'data-structures' in the current directory.

```
snowplow-cli data-structures download {directory ./data-structures} [flags]
```

### Examples

```
  $ snowplow-cli ds download
  $ snowplow-cli ds download --output-format json ./my-data-structures
```

### Options

```
  -h, --help                   help for download
  -f, --output-format string   Format of the files to read/write. json or yaml are supported (default "yaml")
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
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
      --vendor string          A vendor for the data structure.
                               Must conform to the regex pattern [a-zA-Z0-9-_.]+
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
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

Publish local data structures to BDP console.


### Options

```
  -h, --help   help for publish
```

### Options inherited from parent commands

```
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Publish Dev


Publish data structures to your development environment

### Synopsis

Publish modified data structures to BDP Console and your development environment

The 'meta' section of a data structure is not versioned within BDP Console.
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
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
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
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```



## Data-Structures Validate


Validate data structures with BDP Console

### Synopsis

Sends all data structures from \<path\> for validation by BDP Console.

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
  -S, --api-key string        BDP console api key
  -a, --api-key-id string     BDP console api key id
      --config string         Config file. Defaults to $HOME/.config/snowplow/snowplow.yml
                              Then on:
                                Unix $XDG_CONFIG_HOME/snowplow/snowplow.yml
                                Darwin $HOME/Library/Application Support/snowplow/snowplow.yml
                                Windows %AppData%\snowplow\snowplow.yml
      --debug                 Log output level to Debug
  -H, --host string           BDP console host (default "https://console.snowplowanalytics.com")
      --json-output           Log output as json
  -m, --managed-from string   Link to a github repo where the data structure is managed
  -o, --org-id string         Your organization id
  -q, --quiet                 Log output level to Warn
  -s, --silent                Disable output
```
