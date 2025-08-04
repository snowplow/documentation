---
position: 1.5
title: Install the CLI
---

Choose where to generate your Signals dbt models. We recommend creating a new repository.

Navigate into your repo, and check you're in the intended Python environment.

The batch engine is part of the Signals Python SDK. It's not installed by default, as not all use cases will need it. To install it, run the following command:

```bash
pip install 'snowplow-signals[batch-engine]'
```

This will install the CLI tool as `snowplow-batch-autogen`, along with the necessary dependencies.

## Available commands

The available options are:

```bash
  init              # Initialize dbt project structure and base configuration
  generate          # Generate dbt project assets
  materialize       # Registers the attribute table as a data source with Signals
  test_connection   # Test the connection to the authentication and API services
```

A `--verbose` flag is available for every command.

## Set up environment variables

To make your workflow smoother, set up your Signals credentials as environment variables. This way, you won't need to type them in every command:

```bash
export SNOWPLOW_API_URL="YOUR_API_URL"
export SNOWPLOW_API_KEY="YOUR_API_KEY"
export SNOWPLOW_API_KEY_ID="YOUR_API_KEY_ID"
export SNOWPLOW_ORG_ID="YOUR_ORG_ID"
export SNOWPLOW_REPO_PATH="./my_snowplow_repo" # Path to the repo where you want to generate projects
```
TODO these should have the same name as in the other tutorials
